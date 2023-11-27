import { renderToStringImpl, version } from "./ReactDOMLegacyServerImpl";
import { renderToNodeStream, renderToStaticNodeStream } from "./ReactDOMLegacyServerNodeStream";

import type { ReactNodeList } from "@zenflux/react-shared/src/react-types";

type ServerOptions = {
    identifierPrefix?: string;
};

function renderToString( children: ReactNodeList, options?: ServerOptions ): string {
    return renderToStringImpl( children, options, false, "The server used \"renderToString\" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to \"renderToPipeableStream\" which supports Suspense on the server" );
}

function renderToStaticMarkup( children: ReactNodeList, options?: ServerOptions ): string {
    return renderToStringImpl( children, options, true, "The server used \"renderToStaticMarkup\" which does not support Suspense. If you intended to have the server wait for the suspended component please switch to \"renderToPipeableStream\" which supports Suspense on the server" );
}

export { renderToString, renderToStaticMarkup, renderToNodeStream, renderToStaticNodeStream, version };
