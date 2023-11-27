"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = exports.resume = exports.renderToReadableStream = void 0;
var ReactFizzServer_1 = require("react-server/src/ReactFizzServer");
var ReactFizzConfigDOM_1 = require("@zenflux/react-dom-bindings/src/server/ReactFizzConfigDOM");
var react_version_1 = require("@zenflux/react-shared/src/react-version");
exports.version = react_version_1.default;
function renderToReadableStream(children, options) {
    return new Promise(function (resolve, reject) {
        var onFatalError;
        var onAllReady;
        var allReady = new Promise(function (res, rej) {
            onAllReady = res;
            onFatalError = rej;
        });
        function onShellReady() {
            var stream = new ReadableStream({
                type: "bytes",
                pull: function (controller) {
                    (0, ReactFizzServer_1.startFlowing)(request, controller);
                },
                cancel: function (reason) {
                    (0, ReactFizzServer_1.stopFlowing)(request);
                    (0, ReactFizzServer_1.abort)(request, reason);
                }
            }, // $FlowFixMe[prop-missing] size() methods are not allowed on byte streams.
            {
                highWaterMark: 0
            });
            // TODO: Move to sub-classing ReadableStream.
            stream.allReady = allReady;
            resolve(stream);
        }
        function onShellError(error) {
            // If the shell errors the caller of `renderToReadableStream` won't have access to `allReady`.
            // However, `allReady` will be rejected by `onFatalError` as well.
            // So we need to catch the duplicate, uncatchable fatal error in `allReady` to prevent a `UnhandledPromiseRejection`.
            allReady.catch(function () {
            });
            reject(error);
        }
        var resumableState = (0, ReactFizzConfigDOM_1.createResumableState)(options ? options.identifierPrefix : undefined, options ? options.unstable_externalRuntimeSrc : undefined);
        var request = (0, ReactFizzServer_1.createRequest)(children, resumableState, (0, ReactFizzConfigDOM_1.createRenderState)(resumableState, options ? options.nonce : undefined, options ? options.bootstrapScriptContent : undefined, options ? options.bootstrapScripts : undefined, options ? options.bootstrapModules : undefined, options ? options.unstable_externalRuntimeSrc : undefined, options ? options.importMap : undefined), (0, ReactFizzConfigDOM_1.createRootFormatContext)(options ? options.namespaceURI : undefined), options ? options.progressiveChunkSize : undefined, options ? options.onError : undefined, onAllReady, onShellReady, onShellError, onFatalError, options ? options.onPostpone : undefined, options ? options.formState : undefined);
        if (options && options.signal) {
            var signal_1 = options.signal;
            if (signal_1.aborted) {
                (0, ReactFizzServer_1.abort)(request, signal_1.reason);
            }
            else {
                var listener_1 = function () {
                    (0, ReactFizzServer_1.abort)(request, signal_1.reason);
                    signal_1.removeEventListener("abort", listener_1);
                };
                signal_1.addEventListener("abort", listener_1);
            }
        }
        (0, ReactFizzServer_1.startWork)(request);
    });
}
exports.renderToReadableStream = renderToReadableStream;
function resume(children, postponedState, options) {
    return new Promise(function (resolve, reject) {
        var onFatalError;
        var onAllReady;
        var allReady = new Promise(function (res, rej) {
            onAllReady = res;
            onFatalError = rej;
        });
        function onShellReady() {
            var stream = new ReadableStream({
                type: "bytes",
                pull: function (controller) {
                    (0, ReactFizzServer_1.startFlowing)(request, controller);
                },
                cancel: function (reason) {
                    (0, ReactFizzServer_1.stopFlowing)(request);
                    (0, ReactFizzServer_1.abort)(request, reason);
                }
            }, // $FlowFixMe[prop-missing] size() methods are not allowed on byte streams.
            {
                highWaterMark: 0
            });
            // TODO: Move to sub-classing ReadableStream.
            stream.allReady = allReady;
            resolve(stream);
        }
        function onShellError(error) {
            // If the shell errors the caller of `renderToReadableStream` won't have access to `allReady`.
            // However, `allReady` will be rejected by `onFatalError` as well.
            // So we need to catch the duplicate, uncatchable fatal error in `allReady` to prevent a `UnhandledPromiseRejection`.
            allReady.catch(function () {
            });
            reject(error);
        }
        var request = (0, ReactFizzServer_1.resumeRequest)(children, postponedState, (0, ReactFizzConfigDOM_1.resumeRenderState)(postponedState.resumableState, options ? options.nonce : undefined), options ? options.onError : undefined, onAllReady, onShellReady, onShellError, onFatalError, options ? options.onPostpone : undefined);
        if (options && options.signal) {
            var signal_2 = options.signal;
            if (signal_2.aborted) {
                (0, ReactFizzServer_1.abort)(request, signal_2.reason);
            }
            else {
                var listener_2 = function () {
                    (0, ReactFizzServer_1.abort)(request, signal_2.reason);
                    signal_2.removeEventListener("abort", listener_2);
                };
                signal_2.addEventListener("abort", listener_2);
            }
        }
        (0, ReactFizzServer_1.startWork)(request);
    });
}
exports.resume = resume;
