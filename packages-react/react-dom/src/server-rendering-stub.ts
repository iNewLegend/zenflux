// Export all exports so that they're available in tests.
// We can't use export * from in Flow for some reason.
import ReactVersion from "../../zenflux-react-shared/src/react-version";

import type { FormStatus } from "@zenflux/react-dom-bindings/src/shared/ReactDOMFormActions";

import { useFormState, useFormStatus } from "@z-react-dom/server/ReactDOMServerRenderingStub";

import type { Awaited } from "../../zenflux-react-shared/src/react-types";

export { ReactVersion as version };
export { default as __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from "@z-react-dom/ReactDOMSharedInternals";
export {
    createPortal,
    flushSync,
    prefetchDNS,
    preconnect,
    preload,
    preloadModule,
    preinit,
    preinitModule,
    useFormStatus,
    useFormState,
    unstable_batchedUpdates
} from "@z-react-dom/server/ReactDOMServerRenderingStub";

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
