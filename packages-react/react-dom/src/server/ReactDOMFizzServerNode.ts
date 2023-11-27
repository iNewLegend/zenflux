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

import type { PostponedState, Request } from "react-server/src/ReactFizzServer";

import type { ReactFormState, ReactNodeList } from "@zenflux/react-shared/src/react-types";
import type { Writable } from "stream";

import type { Destination } from "react-server/src/ReactServerStreamConfigNode";
import type { ImportMap } from "../shared/ReactDOMTypes";

function createDrainHandler( destination: Destination, request: Request ) {
    return () => startFlowing( request, destination );
}

function createCancelHandler( request: Request, reason: string ) {
    return () => {
        stopFlowing( request );
        // not-used: eslint-disable-next-line react-internal/prod-error-codes
        abort( request, new Error( reason ) );
    };
}

type Options = {
    identifierPrefix?: string;
    namespaceURI?: string;
    nonce?: string;
    bootstrapScriptContent?: string;
    bootstrapScripts?: Array<string | BootstrapScriptDescriptor>;
    bootstrapModules?: Array<string | BootstrapScriptDescriptor>;
    progressiveChunkSize?: number;
    onShellReady?: () => void;
    onShellError?: ( error: unknown ) => void;
    onAllReady?: () => void;
    onError?: ( error: unknown ) => string | null | undefined;
    onPostpone?: ( reason: string ) => void;
    unstable_externalRuntimeSrc?: string | BootstrapScriptDescriptor;
    importMap?: ImportMap;
    formState?: ReactFormState<any, any> | null;
};
type ResumeOptions = {
    nonce?: string;
    onShellReady?: () => void;
    onShellError?: ( error: unknown ) => void;
    onAllReady?: () => void;
    onError?: ( error: unknown ) => string | null | undefined;
    onPostpone?: ( reason: string ) => void;
};
type PipeableStream = {
    // Cancel any pending I/O and put anything remaining into
    // client rendered mode.
    abort( reason: unknown ): void;
    pipe<T extends Writable>( destination: T ): T;
};

function createRequestImpl( children: ReactNodeList, options: void | Options ) {
    const resumableState = createResumableState( options ? options.identifierPrefix : undefined, options ? options.unstable_externalRuntimeSrc : undefined );
    return createRequest( children, resumableState, createRenderState( resumableState, options ? options.nonce : undefined, options ? options.bootstrapScriptContent : undefined, options ? options.bootstrapScripts : undefined, options ? options.bootstrapModules : undefined, options ? options.unstable_externalRuntimeSrc : undefined, options ? options.importMap : undefined ), createRootFormatContext( options ? options.namespaceURI : undefined ), options ? options.progressiveChunkSize : undefined, options ? options.onError : undefined, options ? options.onAllReady : undefined, options ? options.onShellReady : undefined, options ? options.onShellError : undefined, undefined, options ? options.onPostpone : undefined, options ? options.formState : undefined );
}

function renderToPipeableStream( children: ReactNodeList, options?: Options ): PipeableStream {
    const request = createRequestImpl( children, options );
    let hasStartedFlowing = false;
    startWork( request );
    return {
        pipe<T extends Writable>( destination: T ): T {
            if ( hasStartedFlowing ) {
                throw new Error( "React currently only supports piping to one writable stream." );
            }

            hasStartedFlowing = true;
            startFlowing( request, destination );
            destination.on( "drain", createDrainHandler( destination, request ) );
            destination.on( "error", createCancelHandler( request, "The destination stream errored while writing data." ) );
            destination.on( "close", createCancelHandler( request, "The destination stream closed early." ) );
            return destination;
        },

        abort( reason: unknown ) {
            abort( request, reason );
        }

    };
}

function resumeRequestImpl( children: ReactNodeList, postponedState: PostponedState, options: void | ResumeOptions ) {
    return resumeRequest( children, postponedState, resumeRenderState( postponedState.resumableState, options ? options.nonce : undefined ), options ? options.onError : undefined, options ? options.onAllReady : undefined, options ? options.onShellReady : undefined, options ? options.onShellError : undefined, undefined, options ? options.onPostpone : undefined );
}

function resumeToPipeableStream( children: ReactNodeList, postponedState: PostponedState, options?: ResumeOptions ): PipeableStream {
    const request = resumeRequestImpl( children, postponedState, options );
    let hasStartedFlowing = false;
    startWork( request );
    return {
        pipe<T extends Writable>( destination: T ): T {
            if ( hasStartedFlowing ) {
                throw new Error( "React currently only supports piping to one writable stream." );
            }

            hasStartedFlowing = true;
            startFlowing( request, destination );
            destination.on( "drain", createDrainHandler( destination, request ) );
            destination.on( "error", createCancelHandler( request, "The destination stream errored while writing data." ) );
            destination.on( "close", createCancelHandler( request, "The destination stream closed early." ) );
            return destination;
        },

        abort( reason: unknown ) {
            abort( request, reason );
        }

    };
}

export { renderToPipeableStream, resumeToPipeableStream, ReactVersion as version };
