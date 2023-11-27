"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventPriority = exports.findInstanceBlockingTarget = exports.return_targetInst = exports.findInstanceBlockingEvent = exports.dispatchEvent = exports.createEventListenerWrapperWithPriority = exports.createEventListenerWrapper = exports.isEnabled = exports.setEnabled = void 0;
/* eslint-disable import/no-cycle */
var react_event_priorities_1 = require("@zenflux/react-reconciler/src/react-event-priorities");
var react_fiber_reconciler_1 = require("@zenflux/react-reconciler/src/react-fiber-reconciler");
var react_fiber_tree_reflection_1 = require("@zenflux/react-reconciler/src/react-fiber-tree-reflection");
var react_work_tags_1 = require("@zenflux/react-reconciler/src/react-work-tags");
var react_scheduler_1 = require("@zenflux/react-scheduler");
var react_fiber_shell_hydration_1 = require("@zenflux/react-reconciler/src/react-fiber-shell-hydration");
var react_shared_internals_1 = require("@zenflux/react-shared/src/react-shared-internals");
var getEventTarget_1 = require("@zenflux/react-dom-bindings/src/events/getEventTarget");
var EventSystemFlags_1 = require("@zenflux/react-dom-bindings/src/events/EventSystemFlags");
var ReactDOMEventReplaying_1 = require("@zenflux/react-dom-bindings/src/events/ReactDOMEventReplaying");
var ReactDOMComponentTree_1 = require("@zenflux/react-dom-bindings/src/client/ReactDOMComponentTree");
var DOMPluginEventSystem_1 = require("@zenflux/react-dom-bindings/src/events/DOMPluginEventSystem");
var ReactCurrentBatchConfig = react_shared_internals_1.default.ReactCurrentBatchConfig;
// TODO: can we stop exporting these?
var _enabled = true;
// This is exported in FB builds for use by legacy FB layer infra.
// We'd like to remove this but it's not clear if this is safe.
function setEnabled(enabled) {
    _enabled = !!enabled;
}
exports.setEnabled = setEnabled;
function isEnabled() {
    return _enabled;
}
exports.isEnabled = isEnabled;
function createEventListenerWrapper(targetContainer, domEventName, eventSystemFlags) {
    return dispatchEvent.bind(null, domEventName, eventSystemFlags, targetContainer);
}
exports.createEventListenerWrapper = createEventListenerWrapper;
function createEventListenerWrapperWithPriority(targetContainer, domEventName, eventSystemFlags) {
    var eventPriority = getEventPriority(domEventName);
    var listenerWrapper;
    switch (eventPriority) {
        case react_event_priorities_1.DiscreteEventPriority:
            listenerWrapper = dispatchDiscreteEvent;
            break;
        case react_event_priorities_1.ContinuousEventPriority:
            listenerWrapper = dispatchContinuousEvent;
            break;
        case react_event_priorities_1.DefaultEventPriority:
        default:
            listenerWrapper = dispatchEvent;
            break;
    }
    return listenerWrapper.bind(null, domEventName, eventSystemFlags, targetContainer);
}
exports.createEventListenerWrapperWithPriority = createEventListenerWrapperWithPriority;
function dispatchDiscreteEvent(domEventName, eventSystemFlags, container, nativeEvent) {
    var previousPriority = (0, react_event_priorities_1.getCurrentUpdatePriority)();
    var prevTransition = ReactCurrentBatchConfig.transition;
    ReactCurrentBatchConfig.transition = null;
    try {
        (0, react_event_priorities_1.setCurrentUpdatePriority)(react_event_priorities_1.DiscreteEventPriority);
        dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
    }
    finally {
        (0, react_event_priorities_1.setCurrentUpdatePriority)(previousPriority);
        ReactCurrentBatchConfig.transition = prevTransition;
    }
}
function dispatchContinuousEvent(domEventName, eventSystemFlags, container, nativeEvent) {
    var previousPriority = (0, react_event_priorities_1.getCurrentUpdatePriority)();
    var prevTransition = ReactCurrentBatchConfig.transition;
    ReactCurrentBatchConfig.transition = null;
    try {
        (0, react_event_priorities_1.setCurrentUpdatePriority)(react_event_priorities_1.ContinuousEventPriority);
        dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
    }
    finally {
        (0, react_event_priorities_1.setCurrentUpdatePriority)(previousPriority);
        ReactCurrentBatchConfig.transition = prevTransition;
    }
}
function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
    if (!_enabled) {
        return;
    }
    var blockedOn = findInstanceBlockingEvent(nativeEvent);
    if (blockedOn === null) {
        (0, DOMPluginEventSystem_1.dispatchEventForPluginEventSystem)(domEventName, eventSystemFlags, nativeEvent, exports.return_targetInst, targetContainer);
        (0, ReactDOMEventReplaying_1.clearIfContinuousEvent)(domEventName, nativeEvent);
        return;
    }
    if ((0, ReactDOMEventReplaying_1.queueIfContinuousEvent)(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent)) {
        nativeEvent.stopPropagation();
        return;
    }
    // We need to clear only if we didn't queue because
    // queueing is accumulative.
    (0, ReactDOMEventReplaying_1.clearIfContinuousEvent)(domEventName, nativeEvent);
    if (eventSystemFlags & EventSystemFlags_1.IS_CAPTURE_PHASE && (0, ReactDOMEventReplaying_1.isDiscreteEventThatRequiresHydration)(domEventName)) {
        while (blockedOn !== null) {
            var fiber = (0, ReactDOMComponentTree_1.getInstanceFromNode)(blockedOn);
            if (fiber !== null) {
                (0, react_fiber_reconciler_1.attemptSynchronousHydration)(fiber);
            }
            var nextBlockedOn = findInstanceBlockingEvent(nativeEvent);
            if (nextBlockedOn === null) {
                (0, DOMPluginEventSystem_1.dispatchEventForPluginEventSystem)(domEventName, eventSystemFlags, nativeEvent, exports.return_targetInst, targetContainer);
            }
            if (nextBlockedOn === blockedOn) {
                break;
            }
            blockedOn = nextBlockedOn;
        }
        if (blockedOn !== null) {
            nativeEvent.stopPropagation();
        }
        return;
    }
    // This is not replayable so we'll invoke it but without a target,
    // in case the event system needs to trace it.
    (0, DOMPluginEventSystem_1.dispatchEventForPluginEventSystem)(domEventName, eventSystemFlags, nativeEvent, null, targetContainer);
}
exports.dispatchEvent = dispatchEvent;
function findInstanceBlockingEvent(nativeEvent) {
    var nativeEventTarget = (0, getEventTarget_1.default)(nativeEvent);
    return findInstanceBlockingTarget(nativeEventTarget);
}
exports.findInstanceBlockingEvent = findInstanceBlockingEvent;
exports.return_targetInst = null;
// Returns a SuspenseInstance or Container if it's blocked.
// The return_targetInst field above is conceptually part of the return value.
function findInstanceBlockingTarget(targetNode) {
    // TODO: Warn if _enabled is false.
    exports.return_targetInst = null;
    var targetInst = (0, ReactDOMComponentTree_1.getClosestInstanceFromNode)(targetNode);
    if (targetInst !== null) {
        var nearestMounted = (0, react_fiber_tree_reflection_1.getNearestMountedFiber)(targetInst);
        if (nearestMounted === null) {
            // This tree has been unmounted already. Dispatch without a target.
            targetInst = null;
        }
        else {
            var tag = nearestMounted.tag;
            if (tag === react_work_tags_1.SuspenseComponent) {
                var instance = (0, react_fiber_tree_reflection_1.getSuspenseInstanceFromFiber)(nearestMounted);
                if (instance !== null) {
                    // Queue the event to be replayed later. Abort dispatching since we
                    // don't want this event dispatched twice through the event system.
                    // TODO: If this is the first discrete event in the queue. Schedule an increased
                    // priority for this boundary.
                    return instance;
                }
                // This shouldn't happen, something went wrong but to avoid blocking
                // the whole system, dispatch the event without a target.
                // TODO: Warn.
                targetInst = null;
            }
            else if (tag === react_work_tags_1.HostRoot) {
                var root = nearestMounted.stateNode;
                if ((0, react_fiber_shell_hydration_1.isRootDehydrated)(root)) {
                    // If this happens during a replay something went wrong and it might block
                    // the whole system.
                    return (0, react_fiber_tree_reflection_1.getContainerFromFiber)(nearestMounted);
                }
                targetInst = null;
            }
            else if (nearestMounted !== targetInst) {
                // If we get an event (ex: img onload) before committing that
                // component's mount, ignore it for now (that is, treat it as if it was an
                // event on a non-React tree). We might also consider queueing events and
                // dispatching them after the mount.
                targetInst = null;
            }
        }
    }
    exports.return_targetInst = targetInst;
    // We're not blocked on anything.
    return null;
}
exports.findInstanceBlockingTarget = findInstanceBlockingTarget;
function getEventPriority(domEventName) {
    switch (domEventName) {
        // Used by SimpleEventPlugin:
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        // Used by polyfills: (fall through)
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        // Only enableCreateEventHandleAPI: (fall through)
        case "beforeblur":
        case "afterblur":
        // Not used by React but could be by user code: (fall through)
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
            return react_event_priorities_1.DiscreteEventPriority;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "toggle":
        case "touchmove":
        case "wheel":
        // Not used by React but could be by user code: (fall through)
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
            return react_event_priorities_1.ContinuousEventPriority;
        case "message": {
            // We might be in the Scheduler callback.
            // Eventually this mechanism will be replaced by a check
            // of the current priority on the native scheduler.
            var schedulerPriority = (0, react_scheduler_1.unstable_getCurrentPriorityLevel)();
            switch (schedulerPriority) {
                case react_scheduler_1.unstable_ImmediatePriority:
                    return react_event_priorities_1.DiscreteEventPriority;
                case react_scheduler_1.unstable_UserBlockingPriority:
                    return react_event_priorities_1.ContinuousEventPriority;
                case react_scheduler_1.unstable_NormalPriority:
                case react_scheduler_1.unstable_LowPriority:
                    // TODO: Handle LowSchedulerPriority, somehow. Maybe the same lane as hydration.
                    return react_event_priorities_1.DefaultEventPriority;
                case react_scheduler_1.unstable_IdlePriority:
                    return react_event_priorities_1.IdleEventPriority;
                default:
                    return react_event_priorities_1.DefaultEventPriority;
            }
        }
        default:
            return react_event_priorities_1.DefaultEventPriority;
    }
}
exports.getEventPriority = getEventPriority;
