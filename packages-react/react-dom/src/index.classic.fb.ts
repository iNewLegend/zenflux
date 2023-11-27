import { isEnabled } from "@zenflux/react-dom-bindings/src/events/ReactDOMEventListener";

import Internals from "@z-react-dom/ReactDOMSharedInternals";
// For classic WWW builds, include a few internals that are already in use.
Object.assign( ( Internals as any ), {
    ReactBrowserEventEmitter: {
        isEnabled
    }
} );
export {
    createPortal,
    createRoot,
    hydrateRoot,
    findDOMNode,
    flushSync,
    hydrate,
    render,
    unmountComponentAtNode,
    unstable_batchedUpdates,
    unstable_createEventHandle,
    unstable_renderSubtreeIntoContainer,
    unstable_runWithPriority // DO NOT USE: Temporarily exposed to migrate off of Scheduler.runWithPriority.
    ,
    useFormStatus,
    useFormState,
    prefetchDNS,
    preconnect,
    preload,
    preloadModule,
    preinit,
    preinitModule,
    version
} from "@z-react-dom/client/ReactDOM";
export { Internals as __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED };
