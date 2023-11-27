import type { ReactScopeInstance } from "@zenflux/react-shared/src/react-types";

import type { DOMEventName } from "../events/DOMEventNames";

export type ReactDOMEventHandle = ( target: EventTarget | ReactScopeInstance, callback: ( arg0: React.SyntheticEvent<EventTarget> ) => void ) => () => void;
export type ReactDOMEventHandleListener = {
    callback: ( arg0: React.SyntheticEvent<EventTarget> ) => void;
    capture: boolean;
    type: DOMEventName;
};
