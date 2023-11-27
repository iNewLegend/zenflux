import type { FormStatus } from "@zenflux/react-dom-bindings/src/shared/ReactDOMFormActions";

import { useFormState, useFormStatus } from "@z-react-dom/client/ReactDOM";

export { default as __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from "@z-react-dom/ReactDOMSharedInternals";
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

export function experimental_useFormStatus(): FormStatus {
    if ( __DEV__ ) {
        console.error( "useFormStatus is now in canary. Remove the experimental_ prefix. " + "The prefixed alias will be removed in an upcoming release." );
    }

    return useFormStatus();
}

export function experimental_useFormState<S, P>( action: ( arg0: Awaited<S>, arg1: P ) => S, initialState: Awaited<S>, permalink?: string ): [ Awaited<S>, ( arg0: P ) => void ] {
    if ( __DEV__ ) {
        console.error( "useFormState is now in canary. Remove the experimental_ prefix. " + "The prefixed alias will be removed in an upcoming release." );
    }

    return useFormState( action, initialState, permalink );
}
