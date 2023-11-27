import {
    abort,
    createRequest,
    resumeRequest,
    startFlowing,
    startWork,
    stopFlowing
} from "react-server/src/ReactFizzServer";

import {
    createRenderState,
    createResumableState,
    createRootFormatContext,
    resumeRenderState
} from "@zenflux/react-dom-bindings/src/server/ReactFizzConfigDOM";

import ReactVersion from "@zenflux/react-shared/src/react-version";

import type { BootstrapScriptDescriptor } from "@zenflux/react-dom-bindings/src/server/ReactFizzConfigDOM";

import type { PostponedState } from "react-server/src/ReactFizzServer";

import type { ReactFormState, ReactNodeList } from "@zenflux/react-shared/src/react-types";

import type { ImportMap } from "../shared/ReactDOMTypes";

type Options = {
    identifierPrefix?: string;
    namespaceURI?: string;
    nonce?: string;
    bootstrapScriptContent?: string;
    bootstrapScripts?: Array<string | BootstrapScriptDescriptor>;
    bootstrapModules?: Array<string | BootstrapScriptDescriptor>;
    progressiveChunkSize?: number;
    signal?: AbortSignal;
    onError?: ( error: unknown ) => string | null | undefined;
    onPostpone?: ( reason: string ) => void;
    unstable_externalRuntimeSrc?: string | BootstrapScriptDescriptor;
    importMap?: ImportMap;
    formState?: ReactFormState<any, any> | null;
};
type ResumeOptions = {
    nonce?: string;
    signal?: AbortSignal;
    onError?: ( error: unknown ) => string | null | undefined;
    onPostpone?: ( reason: string ) => void;
    unstable_externalRuntimeSrc?: string | BootstrapScriptDescriptor;
};
// TODO: Move to sub-classing ReadableStream.
type ReactDOMServerReadableStream = ReadableStream & {
    allReady: Promise<void>;
};

function renderToReadableStream( children: ReactNodeList, options?: Options ): Promise<ReactDOMServerReadableStream> {
    return new Promise( ( resolve, reject ) => {
        let onFatalError;
        let onAllReady;
        const allReady = new Promise<void>( ( res, rej ) => {
            onAllReady = res;
            onFatalError = rej;
        } );

        function onShellReady() {
            const stream: ReactDOMServerReadableStream = ( new ReadableStream( {
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
                } ) as any );
            // TODO: Move to sub-classing ReadableStream.
            stream.allReady = allReady;
            resolve( stream );
        }

        function onShellError( error: unknown ) {
            // If the shell errors the caller of `renderToReadableStream` won't have access to `allReady`.
            // However, `allReady` will be rejected by `onFatalError` as well.
            // So we need to catch the duplicate, uncatchable fatal error in `allReady` to prevent a `UnhandledPromiseRejection`.
            allReady.catch( () => {
            } );
            reject( error );
        }

        const resumableState = createResumableState( options ? options.identifierPrefix : undefined, options ? options.unstable_externalRuntimeSrc : undefined );
        const request = createRequest( children, resumableState, createRenderState( resumableState, options ? options.nonce : undefined, options ? options.bootstrapScriptContent : undefined, options ? options.bootstrapScripts : undefined, options ? options.bootstrapModules : undefined, options ? options.unstable_externalRuntimeSrc : undefined, options ? options.importMap : undefined ), createRootFormatContext( options ? options.namespaceURI : undefined ), options ? options.progressiveChunkSize : undefined, options ? options.onError : undefined, onAllReady, onShellReady, onShellError, onFatalError, options ? options.onPostpone : undefined, options ? options.formState : undefined );

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

function resume( children: ReactNodeList, postponedState: PostponedState, options?: ResumeOptions ): Promise<ReactDOMServerReadableStream> {
    return new Promise( ( resolve, reject ) => {
        let onFatalError;
        let onAllReady;
        const allReady = new Promise<void>( ( res, rej ) => {
            onAllReady = res;
            onFatalError = rej;
        } );

        function onShellReady() {
            const stream: ReactDOMServerReadableStream = ( new ReadableStream( {
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
                } ) as any );
            // TODO: Move to sub-classing ReadableStream.
            stream.allReady = allReady;
            resolve( stream );
        }

        function onShellError( error: unknown ) {
            // If the shell errors the caller of `renderToReadableStream` won't have access to `allReady`.
            // However, `allReady` will be rejected by `onFatalError` as well.
            // So we need to catch the duplicate, uncatchable fatal error in `allReady` to prevent a `UnhandledPromiseRejection`.
            allReady.catch( () => {
            } );
            reject( error );
        }

        const request = resumeRequest( children, postponedState, resumeRenderState( postponedState.resumableState, options ? options.nonce : undefined ), options ? options.onError : undefined, onAllReady, onShellReady, onShellError, onFatalError, options ? options.onPostpone : undefined );

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

export { renderToReadableStream, resume, ReactVersion as version };
