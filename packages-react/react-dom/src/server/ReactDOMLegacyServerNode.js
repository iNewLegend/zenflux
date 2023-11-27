"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = exports.renderToStaticNodeStream = exports.renderToNodeStream = exports.renderToStaticMarkup = exports.renderToString = void 0;
var ReactDOMLegacyServerImpl_1 = require("./ReactDOMLegacyServerImpl");
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return ReactDOMLegacyServerImpl_1.version; } });
var ReactDOMLegacyServerNodeStream_1 = require("./ReactDOMLegacyServerNodeStream");
Object.defineProperty(exports, "renderToNodeStream", { enumerable: true, get: function () { return ReactDOMLegacyServerNodeStream_1.renderToNodeStream; } });
Object.defineProperty(exports, "renderToStaticNodeStream", { enumerable: true, get: function () { return ReactDOMLegacyServerNodeStream_1.renderToStaticNodeStream; } });
function renderToString(children, options) {
    return (0, ReactDOMLegacyServerImpl_1.renderToStringImpl)(children, options, false, "The server used \"renderToString\" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to \"renderToPipeableStream\" which supports Suspense on the server");
}
exports.renderToString = renderToString;
function renderToStaticMarkup(children, options) {
    return (0, ReactDOMLegacyServerImpl_1.renderToStringImpl)(children, options, true, "The server used \"renderToStaticMarkup\" which does not support Suspense. If you intended to have the server wait for the suspended component please switch to \"renderToPipeableStream\" which supports Suspense on the server");
}
exports.renderToStaticMarkup = renderToStaticMarkup;
