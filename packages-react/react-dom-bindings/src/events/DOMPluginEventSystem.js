"use strict";
/* eslint-disable import/no-cycle */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListenerSetKey = exports.accumulateEventHandleNonManagedNodeListeners = exports.accumulateEnterLeaveTwoPhaseListeners = exports.accumulateTwoPhaseListeners = exports.accumulateSinglePhaseListeners = exports.dispatchEventForPluginEventSystem = exports.listenToAllSupportedEvents = exports.listenToNativeEventForNonManagedEventTarget = exports.listenToNativeEvent = exports.listenToNonDelegatedEvent = exports.processDispatchQueue = exports.nonDelegatedEvents = exports.mediaEventTypes = void 0;
var react_work_tags_1 = require("@zenflux/react-reconciler/src/react-work-tags");
var react_feature_flags_1 = require("@zenflux/react-shared/src/react-feature-flags");
var react_error_utils_1 = require("@zenflux/react-shared/src/react-error-utils");
var EventRegistry_1 = require("@zenflux/react-dom-bindings/src/events/EventRegistry");
var CurrentReplayingEvent_1 = require("@zenflux/react-dom-bindings/src/events/CurrentReplayingEvent");
var getEventTarget_1 = require("@zenflux/react-dom-bindings/src/events/getEventTarget");
var ReactDOMComponentTree_1 = require("@zenflux/react-dom-bindings/src/client/ReactDOMComponentTree");
var HTMLNodeType_1 = require("@zenflux/react-dom-bindings/src/client/HTMLNodeType");
var ReactDOMUpdateBatching_1 = require("@zenflux/react-dom-bindings/src/events/ReactDOMUpdateBatching");
var getListener_1 = require("@zenflux/react-dom-bindings/src/events/getListener");
var checkPassiveEvents_1 = require("@zenflux/react-dom-bindings/src/events/checkPassiveEvents");
var EventSystemFlags_1 = require("@zenflux/react-dom-bindings/src/events/EventSystemFlags");
var ReactDOMEventListener_1 = require("@zenflux/react-dom-bindings/src/events/ReactDOMEventListener");
var EventListener_1 = require("@zenflux/react-dom-bindings/src/events/EventListener");
var BeforeInputEventPlugin = require("@zenflux/react-dom-bindings/src/events/plugins/BeforeInputEventPlugin");
var ChangeEventPlugin = require("@zenflux/react-dom-bindings/src/events/plugins/ChangeEventPlugin");
var EnterLeaveEventPlugin = require("@zenflux/react-dom-bindings/src/events/plugins/EnterLeaveEventPlugin");
var SelectEventPlugin = require("@zenflux/react-dom-bindings/src/events/plugins/SelectEventPlugin");
var SimpleEventPlugin = require("@zenflux/react-dom-bindings/src/events/plugins/SimpleEventPlugin");
var FormActionEventPlugin = require("@zenflux/react-dom-bindings/src/events/plugins/FormActionEventPlugin");
// TODO: remove top-level side effect.
SimpleEventPlugin.registerEvents();
EnterLeaveEventPlugin.registerEvents();
ChangeEventPlugin.registerEvents();
SelectEventPlugin.registerEvents();
BeforeInputEventPlugin.registerEvents();
function extractEvents(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
    // TODO: we should remove the concept of a "SimpleEventPlugin".
    // This is the basic functionality of the event system. All
    // the other plugins are essentially polyfills. So the plugin
    // should probably be inlined somewhere and have its logic
    // be core the to event system. This would potentially allow
    // us to ship builds of React without the polyfilled plugins below.
    SimpleEventPlugin.extractEvents(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer);
    var shouldProcessPolyfillPlugins = (eventSystemFlags & EventSystemFlags_1.SHOULD_NOT_PROCESS_POLYFILL_EVENT_PLUGINS) === 0;
    // We don't process these events unless we are in the
    // event's native "bubble" phase, which means that we're
    // not in the capture phase. That's because we emulate
    // the capture phase here still. This is a trade-off,
    // because in an ideal world we would not emulate and use
    // the phases properly, like we do with the SimpleEvent
    // plugin. However, the plugins below either expect
    // emulation (EnterLeave) or use state localized to that
    // plugin (BeforeInput, Change, Select). The state in
    // these modules complicates things, as you'll essentially
    // get the case where the capture phase event might change
    // state, only for the following bubble event to come in
    // later and not trigger anything as the state now
    // invalidates the heuristics of the event plugin. We
    // could alter all these plugins to work in such ways, but
    // that might cause other unknown side-effects that we
    // can't foresee right now.
    if (shouldProcessPolyfillPlugins) {
        EnterLeaveEventPlugin.extractEvents(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer);
        ChangeEventPlugin.extractEvents(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer);
        SelectEventPlugin.extractEvents(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer);
        BeforeInputEventPlugin.extractEvents(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer);
        if (react_feature_flags_1.enableFormActions) {
            FormActionEventPlugin.extractEvents(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer);
        }
    }
}
// List of events that need to be individually attached to media elements.
exports.mediaEventTypes = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"];
// We should not delegate these events to the container, but rather
// set them on the actual target element itself. This is primarily
// because these events do not consistently bubble in the DOM.
exports.nonDelegatedEvents = new Set(__spreadArray(["cancel", "close", "invalid", "load", "scroll", "scrollend", "toggle"], exports.mediaEventTypes, true));
function executeDispatch(event, listener, currentTarget) {
    var type = event.type || "unknown-event";
    event.currentTarget = currentTarget;
    (0, react_error_utils_1.invokeGuardedCallbackAndCatchFirstError)(type, listener, undefined, event);
    event.currentTarget = null;
}
function processDispatchQueueItemsInOrder(event, dispatchListeners, inCapturePhase) {
    var previousInstance;
    if (inCapturePhase) {
        for (var i_1 = dispatchListeners.length - 1; i_1 >= 0; i_1--) {
            var _a = dispatchListeners[i_1], instance = _a.instance, currentTarget = _a.currentTarget, listener = _a.listener;
            if (instance !== previousInstance && event.isPropagationStopped()) {
                return;
            }
            executeDispatch(event, listener, currentTarget);
            previousInstance = instance;
        }
    }
    else {
        for (var i_2 = 0; i_2 < dispatchListeners.length; i_2++) {
            var _b = dispatchListeners[i_2], instance = _b.instance, currentTarget = _b.currentTarget, listener = _b.listener;
            if (instance !== previousInstance && event.isPropagationStopped()) {
                return;
            }
            executeDispatch(event, listener, currentTarget);
            previousInstance = instance;
        }
    }
}
function processDispatchQueue(dispatchQueue, eventSystemFlags) {
    var inCapturePhase = (eventSystemFlags & EventSystemFlags_1.IS_CAPTURE_PHASE) !== 0;
    for (var i_3 = 0; i_3 < dispatchQueue.length; i_3++) {
        var _a = dispatchQueue[i_3], event_1 = _a.event, listeners = _a.listeners;
        processDispatchQueueItemsInOrder(event_1, listeners, inCapturePhase); //  event system doesn't use pooling.
    }
    // This would be a good time to rethrow if any of the event handlers threw.
    (0, react_error_utils_1.rethrowCaughtError)();
}
exports.processDispatchQueue = processDispatchQueue;
function dispatchEventsForPlugins(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer) {
    var nativeEventTarget = (0, getEventTarget_1.default)(nativeEvent);
    var dispatchQueue = [];
    extractEvents(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer);
    processDispatchQueue(dispatchQueue, eventSystemFlags);
}
function listenToNonDelegatedEvent(domEventName, targetElement) {
    if (__DEV__) {
        if (!exports.nonDelegatedEvents.has(domEventName)) {
            console.error("Did not expect a listenToNonDelegatedEvent() call for \"%s\". " + "This is a bug in React. Please file an issue.", domEventName);
        }
    }
    var isCapturePhaseListener = false;
    var listenerSet = (0, ReactDOMComponentTree_1.getEventListenerSet)(targetElement);
    var listenerSetKey = getListenerSetKey(domEventName, isCapturePhaseListener);
    if (!listenerSet.has(listenerSetKey)) {
        addTrappedEventListener(targetElement, domEventName, EventSystemFlags_1.IS_NON_DELEGATED, isCapturePhaseListener);
        listenerSet.add(listenerSetKey);
    }
}
exports.listenToNonDelegatedEvent = listenToNonDelegatedEvent;
function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
    if (__DEV__) {
        if (exports.nonDelegatedEvents.has(domEventName) && !isCapturePhaseListener) {
            console.error("Did not expect a listenToNativeEvent() call for \"%s\" in the bubble phase. " + "This is a bug in React. Please file an issue.", domEventName);
        }
    }
    var eventSystemFlags = 0;
    if (isCapturePhaseListener) {
        eventSystemFlags |= EventSystemFlags_1.IS_CAPTURE_PHASE;
    }
    addTrappedEventListener(target, domEventName, eventSystemFlags, isCapturePhaseListener);
}
exports.listenToNativeEvent = listenToNativeEvent;
// This is only used by createEventHandle when the
// target is not a DOM element. E.g. window.
function listenToNativeEventForNonManagedEventTarget(domEventName, isCapturePhaseListener, target) {
    var eventSystemFlags = EventSystemFlags_1.IS_EVENT_HANDLE_NON_MANAGED_NODE;
    var listenerSet = (0, ReactDOMComponentTree_1.getEventListenerSet)(target);
    var listenerSetKey = getListenerSetKey(domEventName, isCapturePhaseListener);
    if (!listenerSet.has(listenerSetKey)) {
        if (isCapturePhaseListener) {
            eventSystemFlags |= EventSystemFlags_1.IS_CAPTURE_PHASE;
        }
        addTrappedEventListener(target, domEventName, eventSystemFlags, isCapturePhaseListener);
        listenerSet.add(listenerSetKey);
    }
}
exports.listenToNativeEventForNonManagedEventTarget = listenToNativeEventForNonManagedEventTarget;
var listeningMarker = "_reactListening" + Math.random().toString(36).slice(2);
function listenToAllSupportedEvents(rootContainerElement) {
    if (!rootContainerElement[listeningMarker]) {
        rootContainerElement[listeningMarker] = true;
        EventRegistry_1.allNativeEvents.forEach(function (domEventName) {
            // We handle selectionchange separately because it
            // doesn't bubble and needs to be on the document.
            if (domEventName !== "selectionchange") {
                if (!exports.nonDelegatedEvents.has(domEventName)) {
                    listenToNativeEvent(domEventName, false, rootContainerElement);
                }
                listenToNativeEvent(domEventName, true, rootContainerElement);
            }
        });
        var ownerDocument = rootContainerElement.nodeType === HTMLNodeType_1.DOCUMENT_NODE ? rootContainerElement : rootContainerElement.ownerDocument;
        if (ownerDocument !== null) {
            // The selectionchange event also needs deduplication
            // but it is attached to the document.
            if (!ownerDocument[listeningMarker]) {
                ownerDocument[listeningMarker] = true;
                listenToNativeEvent("selectionchange", false, ownerDocument);
            }
        }
    }
}
exports.listenToAllSupportedEvents = listenToAllSupportedEvents;
function addTrappedEventListener(targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener, isDeferredListenerForLegacyFBSupport) {
    var listener = (0, ReactDOMEventListener_1.createEventListenerWrapperWithPriority)(targetContainer, domEventName, eventSystemFlags);
    // If passive option is not supported, then the event will be
    // active and not passive.
    var isPassiveListener = undefined;
    if (checkPassiveEvents_1.passiveBrowserEventsSupported) {
        // Browsers introduced an intervention, making these events
        // passive by default on document. React doesn't bind them
        // to document anymore, but changing this now would undo
        // the performance wins from the change. So we emulate
        // the existing behavior manually on the roots now.
        // https://github.com/facebook/react/issues/19651
        if (domEventName === "touchstart" || domEventName === "touchmove" || domEventName === "wheel") {
            isPassiveListener = true;
        }
    }
    targetContainer = react_feature_flags_1.enableLegacyFBSupport && isDeferredListenerForLegacyFBSupport ? targetContainer.ownerDocument : targetContainer;
    var unsubscribeListener;
    // When legacyFBSupport is enabled, it's for when we
    // want to add a one time event listener to a container.
    // This should only be used with enableLegacyFBSupport
    // due to requirement to provide compatibility with
    // internal FB www event tooling. This works by removing
    // the event listener as soon as it is invoked. We could
    // also attempt to use the {once: true} param on
    // addEventListener, but that requires support and some
    // browsers do not support this today, and given this is
    // to support legacy code patterns, it's likely they'll
    // need support for such browsers.
    if (react_feature_flags_1.enableLegacyFBSupport && isDeferredListenerForLegacyFBSupport) {
        var originalListener_1 = listener;
        // $FlowFixMe[missing-this-annot]
        listener = function () {
            var p = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                p[_i] = arguments[_i];
            }
            (0, EventListener_1.removeEventListener)(targetContainer, domEventName, unsubscribeListener, isCapturePhaseListener);
            // @ts-ignore
            return originalListener_1.apply(this, p);
        };
    }
    // TODO: There are too many combinations here. Consolidate them.
    if (isCapturePhaseListener) {
        if (isPassiveListener !== undefined) {
            unsubscribeListener = (0, EventListener_1.addEventCaptureListenerWithPassiveFlag)(targetContainer, domEventName, listener, isPassiveListener);
        }
        else {
            unsubscribeListener = (0, EventListener_1.addEventCaptureListener)(targetContainer, domEventName, listener);
        }
    }
    else {
        if (isPassiveListener !== undefined) {
            unsubscribeListener = (0, EventListener_1.addEventBubbleListenerWithPassiveFlag)(targetContainer, domEventName, listener, isPassiveListener);
        }
        else {
            unsubscribeListener = (0, EventListener_1.addEventBubbleListener)(targetContainer, domEventName, listener);
        }
    }
}
function deferClickToDocumentForLegacyFBSupport(domEventName, targetContainer) {
    // We defer all click events with legacy FB support mode on.
    // This means we add a one time event listener to trigger
    // after the FB delegated listeners fire.
    var isDeferredListenerForLegacyFBSupport = true;
    addTrappedEventListener(targetContainer, domEventName, EventSystemFlags_1.IS_LEGACY_FB_SUPPORT_MODE, false, isDeferredListenerForLegacyFBSupport);
}
function isMatchingRootContainer(grandContainer, targetContainer) {
    return grandContainer === targetContainer || grandContainer.nodeType === HTMLNodeType_1.COMMENT_NODE && grandContainer.parentNode === targetContainer;
}
function dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer) {
    var ancestorInst = targetInst;
    if ((eventSystemFlags & EventSystemFlags_1.IS_EVENT_HANDLE_NON_MANAGED_NODE) === 0 && (eventSystemFlags & EventSystemFlags_1.IS_NON_DELEGATED) === 0) {
        var targetContainerNode = targetContainer;
        // If we are using the legacy FB support flag, we
        // defer the event to the null with a one
        // time event listener so we can defer the event.
        if (react_feature_flags_1.enableLegacyFBSupport && // If our event flags match the required flags for entering
            // FB legacy mode and we are processing the "click" event,
            // then we can defer the event to the "document", to allow
            // for legacy FB support, where the expected behavior was to
            // match React < 16 behavior of delegated clicks to the doc.
            domEventName === "click" && (eventSystemFlags & EventSystemFlags_1.SHOULD_NOT_DEFER_CLICK_FOR_FB_SUPPORT_MODE) === 0 && !(0, CurrentReplayingEvent_1.isReplayingEvent)(nativeEvent)) {
            deferClickToDocumentForLegacyFBSupport(domEventName, targetContainer);
            return;
        }
        if (targetInst !== null) {
            // The below logic attempts to work out if we need to change
            // the target fiber to a different ancestor. We had similar logic
            // in the legacy event system, except the big difference between
            // systems is that the modern event system now has an event listener
            // attached to each React Root and React Portal Root. Together,
            // the DOM nodes representing these roots are the "rootContainer".
            // To figure out which ancestor instance we should use, we traverse
            // up the fiber tree from the target instance and attempt to find
            // root boundaries that match that of our current "rootContainer".
            // If we find that "rootContainer", we find the parent fiber
            // sub-tree for that root and make that our ancestor instance.
            var node = targetInst;
            mainLoop: while (true) {
                if (node === null) {
                    return;
                }
                var nodeTag = node.tag;
                if (nodeTag === react_work_tags_1.HostRoot || nodeTag === react_work_tags_1.HostPortal) {
                    var container = node.stateNode.containerInfo;
                    if (isMatchingRootContainer(container, targetContainerNode)) {
                        break;
                    }
                    if (nodeTag === react_work_tags_1.HostPortal) {
                        // The target is a portal, but it's not the rootContainer we're looking for.
                        // Normally portals handle their own events all the way down to the root.
                        // So we should be able to stop now. However, we don't know if this portal
                        // was part of *our* root.
                        var grandNode = node.return;
                        while (grandNode !== null) {
                            var grandTag = grandNode.tag;
                            if (grandTag === react_work_tags_1.HostRoot || grandTag === react_work_tags_1.HostPortal) {
                                var grandContainer = grandNode.stateNode.containerInfo;
                                if (isMatchingRootContainer(grandContainer, targetContainerNode)) {
                                    // This is the rootContainer we're looking for and we found it as
                                    // a parent of the Portal. That means we can ignore it because the
                                    // Portal will bubble through to us.
                                    return;
                                }
                            }
                            grandNode = grandNode.return;
                        }
                    }
                    // Now we need to find it's corresponding host fiber in the other
                    // tree. To do this we can use getClosestInstanceFromNode, but we
                    // need to validate that the fiber is a host instance, otherwise
                    // we need to traverse up through the DOM till we find the correct
                    // node that is from the other tree.
                    while (container !== null) {
                        var parentNode = (0, ReactDOMComponentTree_1.getClosestInstanceFromNode)(container);
                        if (parentNode === null) {
                            return;
                        }
                        var parentTag = parentNode.tag;
                        if (parentTag === react_work_tags_1.HostComponent || parentTag === react_work_tags_1.HostText || (react_feature_flags_1.enableFloat ? parentTag === react_work_tags_1.HostHoistable : false) || (react_feature_flags_1.enableHostSingletons ? parentTag === react_work_tags_1.HostSingleton : false)) {
                            node = ancestorInst = parentNode;
                            continue mainLoop;
                        }
                        container = container.parentNode;
                    }
                }
                node = node.return;
            }
        }
    }
    (0, ReactDOMUpdateBatching_1.batchedUpdates)(function () { return dispatchEventsForPlugins(domEventName, eventSystemFlags, nativeEvent, ancestorInst, targetContainer); });
}
exports.dispatchEventForPluginEventSystem = dispatchEventForPluginEventSystem;
function createDispatchListener(instance, listener, currentTarget) {
    return {
        instance: instance,
        listener: listener,
        currentTarget: currentTarget
    };
}
function accumulateSinglePhaseListeners(targetFiber, reactName, nativeEventType, inCapturePhase, accumulateTargetOnly, nativeEvent) {
    var captureName = reactName !== null ? reactName + "Capture" : null;
    var reactEventName = inCapturePhase ? captureName : reactName;
    var listeners = [];
    var instance = targetFiber;
    var lastHostComponent = null;
    // Accumulate all instances and listeners via the target -> root path.
    while (instance !== null) {
        var stateNode = instance.stateNode, tag = instance.tag;
        // Handle listeners that are on HostComponents (i.e. <div>)
        if ((tag === react_work_tags_1.HostComponent || (react_feature_flags_1.enableFloat ? tag === react_work_tags_1.HostHoistable : false) || (react_feature_flags_1.enableHostSingletons ? tag === react_work_tags_1.HostSingleton : false)) && stateNode !== null) {
            lastHostComponent = stateNode;
            if (!lastHostComponent) {
                throw new Error("Expected to have a lastHostComponent by now. This error is likely caused by a bug in React. Please file an issue.");
            }
            // createEventHandle listeners
            if (react_feature_flags_1.enableCreateEventHandleAPI) {
                var eventHandlerListeners = (0, ReactDOMComponentTree_1.getEventHandlerListeners)(lastHostComponent);
                if (eventHandlerListeners !== null) {
                    eventHandlerListeners.forEach(function (entry) {
                        if (entry.type === nativeEventType && entry.capture === inCapturePhase) {
                            listeners.push(createDispatchListener(instance, entry.callback, lastHostComponent));
                        }
                    });
                }
            }
            // Standard React on* listeners, i.e. onClick or onClickCapture
            if (reactEventName !== null) {
                var listener = (0, getListener_1.default)(instance, reactEventName);
                if (listener != null) {
                    listeners.push(createDispatchListener(instance, listener, lastHostComponent));
                }
            }
        }
        else if (react_feature_flags_1.enableCreateEventHandleAPI && react_feature_flags_1.enableScopeAPI && tag === react_work_tags_1.ScopeComponent && lastHostComponent !== null && stateNode !== null) {
            // Scopes
            var reactScopeInstance = stateNode;
            var eventHandlerListeners = (0, ReactDOMComponentTree_1.getEventHandlerListeners)(reactScopeInstance);
            if (eventHandlerListeners !== null) {
                eventHandlerListeners.forEach(function (entry) {
                    if (entry.type === nativeEventType && entry.capture === inCapturePhase) {
                        listeners.push(createDispatchListener(instance, entry.callback, lastHostComponent));
                    }
                });
            }
        }
        // If we are only accumulating events for the target, then we don't
        // continue to propagate through the React fiber tree to find other
        // listeners.
        if (accumulateTargetOnly) {
            break;
        }
        // If we are processing the onBeforeBlur event, then we need to take
        // into consideration that part of the React tree might have been hidden
        // or deleted (as we're invoking this event during commit). We can find
        // this out by checking if intercept fiber set on the event matches the
        // current instance fiber. In which case, we should clear all existing
        // listeners.
        if (react_feature_flags_1.enableCreateEventHandleAPI && nativeEvent.type === "beforeblur") {
            // $FlowFixMe[prop-missing] internal field
            // @ts-ignore
            var detachedInterceptFiber = nativeEvent._detachedInterceptFiber;
            if (detachedInterceptFiber !== null && (detachedInterceptFiber === instance || detachedInterceptFiber === instance.alternate)) {
                listeners = [];
            }
        }
        instance = instance.return;
    }
    return listeners;
}
exports.accumulateSinglePhaseListeners = accumulateSinglePhaseListeners;
// We should only use this function for:
// - BeforeInputEventPlugin
// - ChangeEventPlugin
// - SelectEventPlugin
// This is because we only process these plugins
// in the bubble phase, so we need to accumulate two
// phase event listeners (via emulation).
function accumulateTwoPhaseListeners(targetFiber, reactName) {
    var captureName = reactName + "Capture";
    var listeners = [];
    var instance = targetFiber;
    // Accumulate all instances and listeners via the target -> root path.
    while (instance !== null) {
        var stateNode = instance.stateNode, tag = instance.tag;
        // Handle listeners that are on HostComponents (i.e. <div>)
        if ((tag === react_work_tags_1.HostComponent || (react_feature_flags_1.enableFloat ? tag === react_work_tags_1.HostHoistable : false) || (react_feature_flags_1.enableHostSingletons ? tag === react_work_tags_1.HostSingleton : false)) && stateNode !== null) {
            var currentTarget = stateNode;
            var captureListener = (0, getListener_1.default)(instance, captureName);
            if (captureListener != null) {
                listeners.unshift(createDispatchListener(instance, captureListener, currentTarget));
            }
            var bubbleListener = (0, getListener_1.default)(instance, reactName);
            if (bubbleListener != null) {
                listeners.push(createDispatchListener(instance, bubbleListener, currentTarget));
            }
        }
        instance = instance.return;
    }
    return listeners;
}
exports.accumulateTwoPhaseListeners = accumulateTwoPhaseListeners;
function getParent(inst) {
    if (inst === null) {
        return null;
    }
    do {
        // $FlowFixMe[incompatible-use] found when upgrading Flow
        inst = inst.return; // TODO: If this is a HostRoot we might want to bail out.
        // That is depending on if we want nested subtrees (layers) to bubble
        // events to their parent. We could also go through parentNode on the
        // host node but that wouldn't work for React Native and doesn't let us
        // do the portal feature.
    } while (inst && inst.tag !== react_work_tags_1.HostComponent && (!react_feature_flags_1.enableHostSingletons ? true : inst.tag !== react_work_tags_1.HostSingleton));
    if (inst) {
        return inst;
    }
    return null;
}
/**
 * Return the lowest common ancestor of A and B, or null if they are in
 * different trees.
 */
function getLowestCommonAncestor(instA, instB) {
    var nodeA = instA;
    var nodeB = instB;
    var depthA = 0;
    for (var tempA = nodeA; tempA; tempA = getParent(tempA)) {
        depthA++;
    }
    var depthB = 0;
    for (var tempB = nodeB; tempB; tempB = getParent(tempB)) {
        depthB++;
    }
    // If A is deeper, crawl up.
    while (depthA - depthB > 0) {
        nodeA = getParent(nodeA);
        depthA--;
    }
    // If B is deeper, crawl up.
    while (depthB - depthA > 0) {
        nodeB = getParent(nodeB);
        depthB--;
    }
    // Walk in lockstep until we find a match.
    var depth = depthA;
    while (depth--) {
        if (nodeA === nodeB || nodeB !== null && nodeA === nodeB.alternate) {
            return nodeA;
        }
        nodeA = getParent(nodeA);
        nodeB = getParent(nodeB);
    }
    return null;
}
function accumulateEnterLeaveListenersForEvent(dispatchQueue, event, target, common, inCapturePhase) {
    var registrationName = event._reactName;
    var listeners = [];
    var instance = target;
    while (instance !== null) {
        if (instance === common) {
            break;
        }
        var alternate = instance.alternate, stateNode = instance.stateNode, tag = instance.tag;
        if (alternate !== null && alternate === common) {
            break;
        }
        if ((tag === react_work_tags_1.HostComponent || (react_feature_flags_1.enableFloat ? tag === react_work_tags_1.HostHoistable : false) || (react_feature_flags_1.enableHostSingletons ? tag === react_work_tags_1.HostSingleton : false)) && stateNode !== null) {
            var currentTarget = stateNode;
            if (inCapturePhase) {
                var captureListener = (0, getListener_1.default)(instance, registrationName);
                if (captureListener != null) {
                    listeners.unshift(createDispatchListener(instance, captureListener, currentTarget));
                }
            }
            else if (!inCapturePhase) {
                var bubbleListener = (0, getListener_1.default)(instance, registrationName);
                if (bubbleListener != null) {
                    listeners.push(createDispatchListener(instance, bubbleListener, currentTarget));
                }
            }
        }
        instance = instance.return;
    }
    if (listeners.length !== 0) {
        dispatchQueue.push({
            event: event,
            listeners: listeners
        });
    }
}
// We should only use this function for:
// - EnterLeaveEventPlugin
// This is because we only process this plugin
// in the bubble phase, so we need to accumulate two
// phase event listeners.
function accumulateEnterLeaveTwoPhaseListeners(dispatchQueue, leaveEvent, enterEvent, from, to) {
    var common = from && to ? getLowestCommonAncestor(from, to) : null;
    if (from !== null) {
        accumulateEnterLeaveListenersForEvent(dispatchQueue, leaveEvent, from, common, false);
    }
    if (to !== null && enterEvent !== null) {
        accumulateEnterLeaveListenersForEvent(dispatchQueue, enterEvent, to, common, true);
    }
}
exports.accumulateEnterLeaveTwoPhaseListeners = accumulateEnterLeaveTwoPhaseListeners;
function accumulateEventHandleNonManagedNodeListeners(reactEventType, currentTarget, inCapturePhase) {
    var listeners = [];
    var eventListeners = (0, ReactDOMComponentTree_1.getEventHandlerListeners)(currentTarget);
    if (eventListeners !== null) {
        eventListeners.forEach(function (entry) {
            if (entry.type === reactEventType && entry.capture === inCapturePhase) {
                listeners.push(createDispatchListener(null, entry.callback, currentTarget));
            }
        });
    }
    return listeners;
}
exports.accumulateEventHandleNonManagedNodeListeners = accumulateEventHandleNonManagedNodeListeners;
function getListenerSetKey(domEventName, capture) {
    return "".concat(domEventName, "__").concat(capture ? "capture" : "bubble");
}
exports.getListenerSetKey = getListenerSetKey;
