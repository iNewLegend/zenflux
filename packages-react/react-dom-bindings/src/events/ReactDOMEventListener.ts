/* eslint-disable import/no-cycle */
import {
    ContinuousEventPriority,
    DefaultEventPriority,
    DiscreteEventPriority,
    getCurrentUpdatePriority,
    IdleEventPriority,
    setCurrentUpdatePriority
} from "@zenflux/react-reconciler/src/react-event-priorities";

import { attemptSynchronousHydration } from "@zenflux/react-reconciler/src/react-fiber-reconciler";
import {
    getContainerFromFiber,
    getNearestMountedFiber,
    getSuspenseInstanceFromFiber
} from "@zenflux/react-reconciler/src/react-fiber-tree-reflection";
import { HostRoot, SuspenseComponent } from "@zenflux/react-reconciler/src/react-work-tags";

import {
    unstable_getCurrentPriorityLevel as getCurrentSchedulerPriorityLevel,
    unstable_IdlePriority as IdleSchedulerPriority,
    unstable_ImmediatePriority as ImmediateSchedulerPriority,
    unstable_LowPriority as LowSchedulerPriority,
    unstable_NormalPriority as NormalSchedulerPriority,
    unstable_UserBlockingPriority as UserBlockingSchedulerPriority
} from "@zenflux/react-scheduler";

import { isRootDehydrated } from "@zenflux/react-reconciler/src/react-fiber-shell-hydration";

import ReactSharedInternals from "@zenflux/react-shared/src/react-shared-internals";
import type { EventPriority } from "@zenflux/react-reconciler/src/react-event-priorities";

import type { Fiber, FiberRoot } from "@zenflux/react-reconciler/src/react-internal-types";

import getEventTarget from "@zenflux/react-dom-bindings/src/events/getEventTarget";

import { IS_CAPTURE_PHASE } from "@zenflux/react-dom-bindings/src/events/EventSystemFlags";
import {
    clearIfContinuousEvent,
    isDiscreteEventThatRequiresHydration,
    queueIfContinuousEvent
} from "@zenflux/react-dom-bindings/src/events/ReactDOMEventReplaying";

import { getClosestInstanceFromNode, getInstanceFromNode } from "@zenflux/react-dom-bindings/src/client/ReactDOMComponentTree";

import { dispatchEventForPluginEventSystem } from "@zenflux/react-dom-bindings/src/events/DOMPluginEventSystem";

import type { EventSystemFlags } from "@zenflux/react-dom-bindings/src/events/EventSystemFlags";

import type { DOMEventName } from "@zenflux/react-dom-bindings/src/events/DOMEventNames";
import type { Container, SuspenseInstance } from "@zenflux/react-dom-bindings/src/client/ReactFiberConfigDOM";

import type { AnyNativeEvent } from "@zenflux/react-dom-bindings/src/events/PluginModuleType";

const {
    ReactCurrentBatchConfig
} = ReactSharedInternals;
// TODO: can we stop exporting these?
let _enabled: boolean = true;
// This is exported in FB builds for use by legacy FB layer infra.
// We'd like to remove this but it's not clear if this is safe.
export function setEnabled( enabled: boolean | null | undefined ): void {
    _enabled = !! enabled;
}

export function isEnabled(): boolean {
    return _enabled;
}

export function createEventListenerWrapper( targetContainer: EventTarget, domEventName: DOMEventName, eventSystemFlags: EventSystemFlags ): ( ... args: Array<any> ) => any {
    return dispatchEvent.bind( null, domEventName, eventSystemFlags, targetContainer );
}

export function createEventListenerWrapperWithPriority( targetContainer: EventTarget, domEventName: DOMEventName, eventSystemFlags: EventSystemFlags ): ( ... args: Array<any> ) => any {
    const eventPriority = getEventPriority( domEventName );
    let listenerWrapper;

    switch ( eventPriority ) {
        case DiscreteEventPriority:
            listenerWrapper = dispatchDiscreteEvent;
            break;

        case ContinuousEventPriority:
            listenerWrapper = dispatchContinuousEvent;
            break;

        case DefaultEventPriority:
        default:
            listenerWrapper = dispatchEvent;
            break;
    }

    return listenerWrapper.bind( null, domEventName, eventSystemFlags, targetContainer );
}

function dispatchDiscreteEvent( domEventName: DOMEventName, eventSystemFlags: EventSystemFlags, container: EventTarget, nativeEvent: AnyNativeEvent ) {
    const previousPriority = getCurrentUpdatePriority();
    const prevTransition = ReactCurrentBatchConfig.transition;
    ReactCurrentBatchConfig.transition = null;

    try {
        setCurrentUpdatePriority( DiscreteEventPriority );
        dispatchEvent( domEventName, eventSystemFlags, container, nativeEvent );
    } finally {
        setCurrentUpdatePriority( previousPriority );
        ReactCurrentBatchConfig.transition = prevTransition;
    }
}

function dispatchContinuousEvent( domEventName: DOMEventName, eventSystemFlags: EventSystemFlags, container: EventTarget, nativeEvent: AnyNativeEvent ) {
    const previousPriority = getCurrentUpdatePriority();
    const prevTransition = ReactCurrentBatchConfig.transition;
    ReactCurrentBatchConfig.transition = null;

    try {
        setCurrentUpdatePriority( ContinuousEventPriority );
        dispatchEvent( domEventName, eventSystemFlags, container, nativeEvent );
    } finally {
        setCurrentUpdatePriority( previousPriority );
        ReactCurrentBatchConfig.transition = prevTransition;
    }
}

export function dispatchEvent( domEventName: DOMEventName, eventSystemFlags: EventSystemFlags, targetContainer: EventTarget, nativeEvent: AnyNativeEvent ): void {
    if ( ! _enabled ) {
        return;
    }

    let blockedOn = findInstanceBlockingEvent( nativeEvent );

    if ( blockedOn === null ) {
        dispatchEventForPluginEventSystem( domEventName, eventSystemFlags, nativeEvent, return_targetInst, targetContainer );
        clearIfContinuousEvent( domEventName, nativeEvent );
        return;
    }

    if ( queueIfContinuousEvent( blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent ) ) {
        nativeEvent.stopPropagation();
        return;
    }

    // We need to clear only if we didn't queue because
    // queueing is accumulative.
    clearIfContinuousEvent( domEventName, nativeEvent );

    if ( eventSystemFlags & IS_CAPTURE_PHASE && isDiscreteEventThatRequiresHydration( domEventName ) ) {
        while ( blockedOn !== null ) {
            const fiber = getInstanceFromNode( blockedOn );

            if ( fiber !== null ) {
                attemptSynchronousHydration( fiber );
            }

            const nextBlockedOn = findInstanceBlockingEvent( nativeEvent );

            if ( nextBlockedOn === null ) {
                dispatchEventForPluginEventSystem( domEventName, eventSystemFlags, nativeEvent, return_targetInst, targetContainer );
            }

            if ( nextBlockedOn === blockedOn ) {
                break;
            }

            blockedOn = nextBlockedOn;
        }

        if ( blockedOn !== null ) {
            nativeEvent.stopPropagation();
        }

        return;
    }

    // This is not replayable so we'll invoke it but without a target,
    // in case the event system needs to trace it.
    dispatchEventForPluginEventSystem( domEventName, eventSystemFlags, nativeEvent, null, targetContainer );
}

export function findInstanceBlockingEvent( nativeEvent: AnyNativeEvent ): null | Container | SuspenseInstance {
    const nativeEventTarget = getEventTarget( nativeEvent );
    return findInstanceBlockingTarget( nativeEventTarget );
}

export let return_targetInst: null | Fiber = null;
// Returns a SuspenseInstance or Container if it's blocked.
// The return_targetInst field above is conceptually part of the return value.
export function findInstanceBlockingTarget( targetNode: Node ): null | Container | SuspenseInstance {
    // TODO: Warn if _enabled is false.
    return_targetInst = null;
    let targetInst = getClosestInstanceFromNode( targetNode );

    if ( targetInst !== null ) {
        const nearestMounted = getNearestMountedFiber( targetInst );

        if ( nearestMounted === null ) {
            // This tree has been unmounted already. Dispatch without a target.
            targetInst = null;
        } else {
            const tag = nearestMounted.tag;

            if ( tag === SuspenseComponent ) {
                const instance = getSuspenseInstanceFromFiber( nearestMounted );

                if ( instance !== null ) {
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
            } else if ( tag === HostRoot ) {
                const root: FiberRoot = nearestMounted.stateNode;

                if ( isRootDehydrated( root ) ) {
                    // If this happens during a replay something went wrong and it might block
                    // the whole system.
                    return getContainerFromFiber( nearestMounted );
                }

                targetInst = null;
            } else if ( nearestMounted !== targetInst ) {
                // If we get an event (ex: img onload) before committing that
                // component's mount, ignore it for now (that is, treat it as if it was an
                // event on a non-React tree). We might also consider queueing events and
                // dispatching them after the mount.
                targetInst = null;
            }
        }
    }

    return_targetInst = targetInst;
    // We're not blocked on anything.
    return null;
}

export function getEventPriority( domEventName: DOMEventName ): EventPriority {
    switch ( domEventName ) {
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
            return DiscreteEventPriority;

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
            return ContinuousEventPriority;

        case "message": {
            // We might be in the Scheduler callback.
            // Eventually this mechanism will be replaced by a check
            // of the current priority on the native scheduler.
            const schedulerPriority = getCurrentSchedulerPriorityLevel();

            switch ( schedulerPriority ) {
                case ImmediateSchedulerPriority:
                    return DiscreteEventPriority;

                case UserBlockingSchedulerPriority:
                    return ContinuousEventPriority;

                case NormalSchedulerPriority:
                case LowSchedulerPriority:
                    // TODO: Handle LowSchedulerPriority, somehow. Maybe the same lane as hydration.
                    return DefaultEventPriority;

                case IdleSchedulerPriority:
                    return IdleEventPriority;

                default:
                    return DefaultEventPriority;
            }
        }

        default:
            return DefaultEventPriority;
    }
}