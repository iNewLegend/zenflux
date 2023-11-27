import { Readable } from "stream";

import { abort, createRequest, startFlowing, startWork } from "react-server/src/ReactFizzServer";

import {
    createRenderState,
    createResumableState,
    createRootFormatContext
} from "@zenflux/react-dom-bindings/src/server/ReactFizzConfigDOMLegacy";

import type { Request } from "react-server/src/ReactFizzServer";

import type { ReactNodeList } from "@zenflux/react-shared/src/react-types";

type ServerOptions = {
    identifierPrefix?: string;
};

class ReactMarkupReadableStream extends Readable {
    request: Request;
    startedFlowing: boolean;

    constructor() {
        // Calls the stream.Readable(options) constructor. Consider exposing built-in
        // features like highWaterMark in the future.
        super( {} );
        this.request = ( null as any );
        this.startedFlowing = false;
    }

    // $FlowFixMe[missing-local-annot]
    _destroy( err, callback ) {
        abort( this.request );
        callback( err );
    }

    // $FlowFixMe[missing-local-annot]
    _read( size ) {
        if ( this.startedFlowing ) {
            startFlowing( this.request, this );
        }
    }

}

function onError() {// Non-fatal errors are ignored.
}

function renderToNodeStreamImpl( children: ReactNodeList, options: void | ServerOptions, generateStaticMarkup: boolean ): Readable {
    function onAllReady() {
        // We wait until everything has loaded before starting to write.
        // That way we only end up with fully resolved HTML even if we suspend.
        destination.startedFlowing = true;
        startFlowing( request, destination );
    }

    const destination = new ReactMarkupReadableStream();
    const resumableState = createResumableState( options ? options.identifierPrefix : undefined, undefined );
    const request = createRequest( children, resumableState, createRenderState( resumableState, false ), createRootFormatContext(), Infinity, onError, onAllReady, undefined, undefined, undefined );
    destination.request = request;
    startWork( request );
    return destination;
}

function renderToNodeStream( children: ReactNodeList, options?: ServerOptions ): Readable {
    if ( __DEV__ ) {
        console.error( "renderToNodeStream is deprecated. Use renderToPipeableStream instead." );
    }

    return renderToNodeStreamImpl( children, options, false );
}

function renderToStaticNodeStream( children: ReactNodeList, options?: ServerOptions ): Readable {
    return renderToNodeStreamImpl( children, options, true );
}

export { renderToNodeStream, renderToStaticNodeStream };
