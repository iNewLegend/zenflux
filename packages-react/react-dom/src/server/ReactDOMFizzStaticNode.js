"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = exports.prerenderToNodeStream = void 0;
var stream_1 = require("stream");
var ReactFizzServer_1 = require("react-server/src/ReactFizzServer");
var ReactFizzConfigDOM_1 = require("@zenflux/react-dom-bindings/src/server/ReactFizzConfigDOM");
var react_version_1 = require("@zenflux/react-shared/src/react-version");
exports.version = react_version_1.default;
function createFakeWritable(readable) {
    // The current host config expects a Writable so we create
    // a fake writable for now to push into the Readable.
    return {
        write: function (chunk) {
            return readable.push(chunk);
        },
        end: function () {
            readable.push(null);
        },
        destroy: function (error) {
            readable.destroy(error);
        }
    };
}
function prerenderToNodeStream(children, options) {
    return new Promise(function (resolve, reject) {
        var onFatalError = reject;
        function onAllReady() {
            var readable = new stream_1.Readable({
                read: function () {
                    (0, ReactFizzServer_1.startFlowing)(request, writable);
                }
            });
            var writable = createFakeWritable(readable);
            var result = {
                postponed: (0, ReactFizzServer_1.getPostponedState)(request),
                prelude: readable
            };
            resolve(result);
        }
        var resumableState = (0, ReactFizzConfigDOM_1.createResumableState)(options ? options.identifierPrefix : undefined, options ? options.unstable_externalRuntimeSrc : undefined);
        var request = (0, ReactFizzServer_1.createPrerenderRequest)(children, resumableState, (0, ReactFizzConfigDOM_1.createRenderState)(resumableState, undefined, // nonce is not compatible with prerendered bootstrap scripts
        options ? options.bootstrapScriptContent : undefined, options ? options.bootstrapScripts : undefined, options ? options.bootstrapModules : undefined, options ? options.unstable_externalRuntimeSrc : undefined, options ? options.importMap : undefined), (0, ReactFizzConfigDOM_1.createRootFormatContext)(options ? options.namespaceURI : undefined), options ? options.progressiveChunkSize : undefined, options ? options.onError : undefined, onAllReady, undefined, undefined, onFatalError, options ? options.onPostpone : undefined);
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
exports.prerenderToNodeStream = prerenderToNodeStream;
