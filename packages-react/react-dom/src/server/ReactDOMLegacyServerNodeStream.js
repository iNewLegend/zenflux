"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderToStaticNodeStream = exports.renderToNodeStream = void 0;
var stream_1 = require("stream");
var ReactFizzServer_1 = require("react-server/src/ReactFizzServer");
var ReactFizzConfigDOMLegacy_1 = require("@zenflux/react-dom-bindings/src/server/ReactFizzConfigDOMLegacy");
var ReactMarkupReadableStream = /** @class */ (function (_super) {
    __extends(ReactMarkupReadableStream, _super);
    function ReactMarkupReadableStream() {
        // Calls the stream.Readable(options) constructor. Consider exposing built-in
        // features like highWaterMark in the future.
        var _this = _super.call(this, {}) || this;
        _this.request = null;
        _this.startedFlowing = false;
        return _this;
    }
    // $FlowFixMe[missing-local-annot]
    ReactMarkupReadableStream.prototype._destroy = function (err, callback) {
        (0, ReactFizzServer_1.abort)(this.request);
        callback(err);
    };
    // $FlowFixMe[missing-local-annot]
    ReactMarkupReadableStream.prototype._read = function (size) {
        if (this.startedFlowing) {
            (0, ReactFizzServer_1.startFlowing)(this.request, this);
        }
    };
    return ReactMarkupReadableStream;
}(stream_1.Readable));
function onError() {
}
function renderToNodeStreamImpl(children, options, generateStaticMarkup) {
    function onAllReady() {
        // We wait until everything has loaded before starting to write.
        // That way we only end up with fully resolved HTML even if we suspend.
        destination.startedFlowing = true;
        (0, ReactFizzServer_1.startFlowing)(request, destination);
    }
    var destination = new ReactMarkupReadableStream();
    var resumableState = (0, ReactFizzConfigDOMLegacy_1.createResumableState)(options ? options.identifierPrefix : undefined, undefined);
    var request = (0, ReactFizzServer_1.createRequest)(children, resumableState, (0, ReactFizzConfigDOMLegacy_1.createRenderState)(resumableState, false), (0, ReactFizzConfigDOMLegacy_1.createRootFormatContext)(), Infinity, onError, onAllReady, undefined, undefined, undefined);
    destination.request = request;
    (0, ReactFizzServer_1.startWork)(request);
    return destination;
}
function renderToNodeStream(children, options) {
    if (__DEV__) {
        console.error("renderToNodeStream is deprecated. Use renderToPipeableStream instead.");
    }
    return renderToNodeStreamImpl(children, options, false);
}
exports.renderToNodeStream = renderToNodeStream;
function renderToStaticNodeStream(children, options) {
    return renderToNodeStreamImpl(children, options, true);
}
exports.renderToStaticNodeStream = renderToStaticNodeStream;
