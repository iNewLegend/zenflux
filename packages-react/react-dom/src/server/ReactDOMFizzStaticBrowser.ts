import {
    abort,
    createPrerenderRequest,
    getPostponedState,
    startFlowing,
    startWork,
    stopFlowing
} from "react-server/src/ReactFizzServer";

import {
    createRenderState,
    createResumableState,
    createRootFormatContext
} from "@zenflux/react-dom-bindings/src/server/ReactFizzConfigDOM";

import ReactVersion from "@zenflux/react-shared/src/react-version";

import type { BootstrapScriptDescriptor } from "@zenflux/react-dom-bindings/src/server/ReactFizzConfigDOM";

import type { PostponedState } from "react-server/src/ReactFizzServer";

import type { ReactNodeList } from "@zenflux/react-shared/src/react-types";
import type { ImportMap } from "../shared/ReactDOMTypes";

type Options = {
    identifierPrefix?: string;
    namespaceURI?: string;
    bootstrapScriptContent?: string;
    bootstrapScripts?: Array<string | BootstrapScriptDescriptor>;
    bootstrapModules?: Array<string | BootstrapScriptDescriptor>;
    progressiveChunkSize?: number;
    signal?: AbortSignal;
    onError?: ( error: unknown ) => string | null | undefined;
    onPostpone?: ( reason: string ) => void;
    unstable_externalRuntimeSrc?: string | BootstrapScriptDescriptor;
    importMap?: ImportMap;
};
type StaticResult = {
    postponed: null | PostponedState;
    prelude: ReadableStream;
};

function prerender( children: ReactNodeList, options?: Options ): Promise<StaticResult> {
    return new Promise( ( resolve, reject ) => {
        const onFatalError = reject;

        function onAllReady() {
            const stream = new ReadableStream( {
                    type: "bytes",
                    pull: ( controller ): Promise<void> | null | undefined => {
                        startFlowing( request, controller );
                    },
                    cancel: ( reason ): Promise<void> | null | undefined => {
                        stopFlowing( request );
                        abort( request, reason );
                    }
                }, // $FlowFixMe[prop-missing] size() methods are not allowed on byte streams.
                {
                    highWaterMark: 0
                } );
            const result = {
                postponed: getPostponedState( request ),
                prelude: stream
            };
            resolve( result );
        }

        const resources = createResumableState( options ? options.identifierPrefix : undefined, options ? options.unstable_externalRuntimeSrc : undefined );
        const request = createPrerenderRequest( children, resources, createRenderState( resources, undefined, // nonce is not compatible with prerendered bootstrap scripts
            options ? options.bootstrapScriptContent : undefined, options ? options.bootstrapScripts : undefined, options ? options.bootstrapModules : undefined, options ? options.unstable_externalRuntimeSrc : undefined, options ? options.importMap : undefined ), createRootFormatContext( options ? options.namespaceURI : undefined ), options ? options.progressiveChunkSize : undefined, options ? options.onError : undefined, onAllReady, undefined, undefined, onFatalError, options ? options.onPostpone : undefined );

        if ( options && options.signal ) {
            const signal = options.signal;

            if ( signal.aborted ) {
                abort( request, ( signal as any ).reason );
            } else {
                const listener = () => {
                    abort( request, ( signal as any ).reason );
                    signal.removeEventListener( "abort", listener );
                };

                signal.addEventListener( "abort", listener );
            }
        }

        startWork( request );
    } );
}

export { prerender, ReactVersion as version };
