import { enableCreateEventHandleAPI } from "@zenflux/react-shared/src/react-feature-flags";

import type { Fiber } from "@zenflux/react-reconciler/src/react-internal-types";

import {
    accumulateEventHandleNonManagedNodeListeners,
    accumulateSinglePhaseListeners
} from "@zenflux/react-dom-bindings/src/events/DOMPluginEventSystem";

import { IS_CAPTURE_PHASE, IS_EVENT_HANDLE_NON_MANAGED_NODE } from "@zenflux/react-dom-bindings/src/events/EventSystemFlags";
import {
    SyntheticAnimationEvent,
    SyntheticClipboardEvent,
    SyntheticDragEvent,
    SyntheticEvent,
    SyntheticFocusEvent,
    SyntheticKeyboardEvent,
    SyntheticMouseEvent,
    SyntheticPointerEvent,
    SyntheticTouchEvent,
    SyntheticTransitionEvent,
    SyntheticUIEvent,
    SyntheticWheelEvent
} from "@zenflux/react-dom-bindings/src/events/SyntheticEvent";

import {
    ANIMATION_END,
    ANIMATION_ITERATION,
    ANIMATION_START,
    TRANSITION_END
} from "@zenflux/react-dom-bindings/src/events/DOMEventNames";
import { registerSimpleEvents, topLevelEventsToReactNames } from "@zenflux/react-dom-bindings/src/events/DOMEventProperties";
import getEventCharCode from "@zenflux/react-dom-bindings/src/events/getEventCharCode";

import type { DOMEventName } from "@zenflux/react-dom-bindings/src/events/DOMEventNames";
import type { EventSystemFlags } from "@zenflux/react-dom-bindings/src/events/EventSystemFlags";
import type { DispatchQueue } from "@zenflux/react-dom-bindings/src/events/DOMPluginEventSystem";

import type { AnyNativeEvent } from "@zenflux/react-dom-bindings/src/events/PluginModuleType";

import type { ReactSyntheticEvent } from "@zenflux/react-dom-bindings/src/events/ReactSyntheticEventType";

function extractEvents( dispatchQueue: DispatchQueue, domEventName: DOMEventName, targetInst: null | Fiber, nativeEvent: AnyNativeEvent, nativeEventTarget: null | EventTarget, eventSystemFlags: EventSystemFlags, targetContainer: EventTarget ): void {
    const reactName = topLevelEventsToReactNames.get( domEventName );

    if ( reactName === undefined ) {
        return;
    }

    let SyntheticEventCtor = SyntheticEvent;
    let reactEventType: string = domEventName;

    switch ( domEventName ) {
        case "keypress":
            // Firefox creates a keypress event for function keys too. This removes
            // the unwanted keypress events. Enter is however both printable and
            // non-printable. One would expect Tab to be as well (but it isn't).
            // TODO: Fixed in https://bugzilla.mozilla.org/show_bug.cgi?id=968056. Can
            // probably remove.
            if ( getEventCharCode( ( ( nativeEvent as any ) as KeyboardEvent ) ) === 0 ) {
                return;
            }

        /* falls through */
        case "keydown":
        case "keyup":
            SyntheticEventCtor = SyntheticKeyboardEvent;
            break;

        case "focusin":
            reactEventType = "focus";
            SyntheticEventCtor = SyntheticFocusEvent;
            break;

        case "focusout":
            reactEventType = "blur";
            SyntheticEventCtor = SyntheticFocusEvent;
            break;

        case "beforeblur":
        case "afterblur":
            SyntheticEventCtor = SyntheticFocusEvent;
            break;

        case "click":
            // Firefox creates a click event on right mouse clicks. This removes the
            // unwanted click events.
            // TODO: Fixed in https://phabricator.services.mozilla.com/D26793. Can
            // probably remove.
            // @ts-ignore
            if ( nativeEvent.button === 2 ) {
                return;
            }

        /* falls through */
        case "auxclick":
        case "dblclick":
        case "mousedown":
        case "mousemove":
        case "mouseup":
        // TODO: Disabled elements should not respond to mouse events

        /* falls through */
        case "mouseout":
        case "mouseover":
        case "contextmenu":
            SyntheticEventCtor = SyntheticMouseEvent;
            break;

        case "drag":
        case "dragend":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "dragstart":
        case "drop":
            SyntheticEventCtor = SyntheticDragEvent;
            break;

        case "touchcancel":
        case "touchend":
        case "touchmove":
        case "touchstart":
            SyntheticEventCtor = SyntheticTouchEvent;
            break;

        case ANIMATION_END:
        case ANIMATION_ITERATION:
        case ANIMATION_START:
            SyntheticEventCtor = SyntheticAnimationEvent;
            break;

        case TRANSITION_END:
            SyntheticEventCtor = SyntheticTransitionEvent;
            break;

        case "scroll":
        case "scrollend":
            SyntheticEventCtor = SyntheticUIEvent;
            break;

        case "wheel":
            SyntheticEventCtor = SyntheticWheelEvent;
            break;

        case "copy":
        case "cut":
        case "paste":
            SyntheticEventCtor = SyntheticClipboardEvent;
            break;

        case "gotpointercapture":
        case "lostpointercapture":
        case "pointercancel":
        case "pointerdown":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "pointerup":
            SyntheticEventCtor = SyntheticPointerEvent;
            break;

        default:
            // Unknown event. This is used by createEventHandle.
            break;
    }

    const inCapturePhase = ( eventSystemFlags & IS_CAPTURE_PHASE ) !== 0;

    if ( enableCreateEventHandleAPI && eventSystemFlags & IS_EVENT_HANDLE_NON_MANAGED_NODE ) {
        const listeners = accumulateEventHandleNonManagedNodeListeners( ( // TODO: this cast may not make sense for events like
            // "focus" where React listens to e.g. "focusin".
            ( reactEventType as any ) as DOMEventName ), targetContainer, inCapturePhase );

        if ( listeners.length > 0 ) {
            // Intentionally create event lazily.
            const event: ReactSyntheticEvent = new SyntheticEventCtor( reactName, reactEventType, null, nativeEvent, nativeEventTarget );
            dispatchQueue.push( {
                event,
                listeners
            } );
        }
    } else {
        // Some events don't bubble in the browser.
        // In the past, React has always bubbled them, but this can be surprising.
        // We're going to try aligning closer to the browser behavior by not bubbling
        // them in React either. We'll start by not bubbling onScroll, and then expand.
        const accumulateTargetOnly = ! inCapturePhase && ( // TODO: ideally, we'd eventually add all events from
            // nonDelegatedEvents list in DOMPluginEventSystem.
            // Then we can remove this special list.
            // This is a breaking change that can wait until React 18.
            domEventName === "scroll" || domEventName === "scrollend" );
        const listeners = accumulateSinglePhaseListeners( targetInst, reactName, nativeEvent.type, inCapturePhase, accumulateTargetOnly, nativeEvent );

        if ( listeners.length > 0 ) {
            // Intentionally create event lazily.
            const event: ReactSyntheticEvent = new SyntheticEventCtor( reactName, reactEventType, null, nativeEvent, nativeEventTarget );
            dispatchQueue.push( {
                event,
                listeners
            } );
        }
    }
}

export { registerSimpleEvents as registerEvents, extractEvents };