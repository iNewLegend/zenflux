"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = exports.renderToStringImpl = void 0;
var ReactFizzServer_1 = require("react-server/src/ReactFizzServer");
var ReactFizzConfigDOMLegacy_1 = require("@zenflux/react-dom-bindings/src/server/ReactFizzConfigDOMLegacy");
var react_version_1 = require("@zenflux/react-shared/src/react-version");
exports.version = react_version_1.default;
function onError() {
}
function renderToStringImpl(children, options, generateStaticMarkup, abortReason) {
    var didFatal = false;
    var fatalError = null;
    var result = "";
    var destination = {
        // $FlowFixMe[missing-local-annot]
        push: function (chunk) {
            if (chunk !== null) {
                result += chunk;
            }
            return true;
        },
        // $FlowFixMe[missing-local-annot]
        destroy: function (error) {
            didFatal = true;
            fatalError = error;
        }
    };
    var readyToStream = false;
    function onShellReady() {
        readyToStream = true;
    }
    var resumableState = (0, ReactFizzConfigDOMLegacy_1.createResumableState)(options ? options.identifierPrefix : undefined, undefined);
    var request = (0, ReactFizzServer_1.createRequest)(children, resumableState, (0, ReactFizzConfigDOMLegacy_1.createRenderState)(resumableState, generateStaticMarkup), (0, ReactFizzConfigDOMLegacy_1.createRootFormatContext)(), Infinity, onError, undefined, onShellReady, undefined, undefined, undefined);
    (0, ReactFizzServer_1.startWork)(request);
    // If anything suspended and is still pending, we'll abort it before writing.
    // That way we write only client-rendered boundaries from the start.
    (0, ReactFizzServer_1.abort)(request, abortReason);
    (0, ReactFizzServer_1.startFlowing)(request, destination);
    if (didFatal && fatalError !== abortReason) {
        throw fatalError;
    }
    if (!readyToStream) {
        // Note: This error message is the one we use on the client. It doesn't
        // really make sense here. But this is the legacy server renderer, anyway.
        // We're going to delete it soon.
        throw new Error("A component suspended while responding to synchronous input. This " + "will cause the UI to be replaced with a loading indicator. To fix, " + "updates that suspend should be wrapped with startTransition.");
    }
    return result;
}
exports.renderToStringImpl = renderToStringImpl;
