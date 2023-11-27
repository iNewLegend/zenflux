"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = exports.resumeToPipeableStream = exports.renderToPipeableStream = void 0;
var ReactFizzServer_1 = require("react-server/src/ReactFizzServer");
var ReactFizzConfigDOM_1 = require("@zenflux/react-dom-bindings/src/server/ReactFizzConfigDOM");
var react_version_1 = require("@zenflux/react-shared/src/react-version");
exports.version = react_version_1.default;
function createDrainHandler(destination, request) {
    return function () { return (0, ReactFizzServer_1.startFlowing)(request, destination); };
}
function createCancelHandler(request, reason) {
    return function () {
        (0, ReactFizzServer_1.stopFlowing)(request);
        // not-used: eslint-disable-next-line react-internal/prod-error-codes
        (0, ReactFizzServer_1.abort)(request, new Error(reason));
    };
}
function createRequestImpl(children, options) {
    var resumableState = (0, ReactFizzConfigDOM_1.createResumableState)(options ? options.identifierPrefix : undefined, options ? options.unstable_externalRuntimeSrc : undefined);
    return (0, ReactFizzServer_1.createRequest)(children, resumableState, (0, ReactFizzConfigDOM_1.createRenderState)(resumableState, options ? options.nonce : undefined, options ? options.bootstrapScriptContent : undefined, options ? options.bootstrapScripts : undefined, options ? options.bootstrapModules : undefined, options ? options.unstable_externalRuntimeSrc : undefined, options ? options.importMap : undefined), (0, ReactFizzConfigDOM_1.createRootFormatContext)(options ? options.namespaceURI : undefined), options ? options.progressiveChunkSize : undefined, options ? options.onError : undefined, options ? options.onAllReady : undefined, options ? options.onShellReady : undefined, options ? options.onShellError : undefined, undefined, options ? options.onPostpone : undefined, options ? options.formState : undefined);
}
function renderToPipeableStream(children, options) {
    var request = createRequestImpl(children, options);
    var hasStartedFlowing = false;
    (0, ReactFizzServer_1.startWork)(request);
    return {
        pipe: function (destination) {
            if (hasStartedFlowing) {
                throw new Error("React currently only supports piping to one writable stream.");
            }
            hasStartedFlowing = true;
            (0, ReactFizzServer_1.startFlowing)(request, destination);
            destination.on("drain", createDrainHandler(destination, request));
            destination.on("error", createCancelHandler(request, "The destination stream errored while writing data."));
            destination.on("close", createCancelHandler(request, "The destination stream closed early."));
            return destination;
        },
        abort: function (reason) {
            (0, ReactFizzServer_1.abort)(request, reason);
        }
    };
}
exports.renderToPipeableStream = renderToPipeableStream;
function resumeRequestImpl(children, postponedState, options) {
    return (0, ReactFizzServer_1.resumeRequest)(children, postponedState, (0, ReactFizzConfigDOM_1.resumeRenderState)(postponedState.resumableState, options ? options.nonce : undefined), options ? options.onError : undefined, options ? options.onAllReady : undefined, options ? options.onShellReady : undefined, options ? options.onShellError : undefined, undefined, options ? options.onPostpone : undefined);
}
function resumeToPipeableStream(children, postponedState, options) {
    var request = resumeRequestImpl(children, postponedState, options);
    var hasStartedFlowing = false;
    (0, ReactFizzServer_1.startWork)(request);
    return {
        pipe: function (destination) {
            if (hasStartedFlowing) {
                throw new Error("React currently only supports piping to one writable stream.");
            }
            hasStartedFlowing = true;
            (0, ReactFizzServer_1.startFlowing)(request, destination);
            destination.on("drain", createDrainHandler(destination, request));
            destination.on("error", createCancelHandler(request, "The destination stream errored while writing data."));
            destination.on("close", createCancelHandler(request, "The destination stream closed early."));
            return destination;
        },
        abort: function (reason) {
            (0, ReactFizzServer_1.abort)(request, reason);
        }
    };
}
exports.resumeToPipeableStream = resumeToPipeableStream;
