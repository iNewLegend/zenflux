"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unstable_batchedUpdates = exports.flushSync = exports.createPortal = exports.useFormState = exports.useFormStatus = exports.prefetchDNS = exports.preconnect = exports.preloadModule = exports.preload = exports.preinitModule = exports.preinit = void 0;
var ReactDOMFloat_1 = require("../shared/ReactDOMFloat");
Object.defineProperty(exports, "preinit", { enumerable: true, get: function () { return ReactDOMFloat_1.preinit; } });
Object.defineProperty(exports, "preinitModule", { enumerable: true, get: function () { return ReactDOMFloat_1.preinitModule; } });
Object.defineProperty(exports, "preload", { enumerable: true, get: function () { return ReactDOMFloat_1.preload; } });
Object.defineProperty(exports, "preloadModule", { enumerable: true, get: function () { return ReactDOMFloat_1.preloadModule; } });
Object.defineProperty(exports, "preconnect", { enumerable: true, get: function () { return ReactDOMFloat_1.preconnect; } });
Object.defineProperty(exports, "prefetchDNS", { enumerable: true, get: function () { return ReactDOMFloat_1.prefetchDNS; } });
var ReactDOMFormActions_1 = require("@zenflux/react-dom-bindings/src/shared/ReactDOMFormActions");
Object.defineProperty(exports, "useFormStatus", { enumerable: true, get: function () { return ReactDOMFormActions_1.useFormStatus; } });
Object.defineProperty(exports, "useFormState", { enumerable: true, get: function () { return ReactDOMFormActions_1.useFormState; } });
function createPortal() {
    throw new Error("createPortal was called on the server. Portals are not currently" + " supported on the server. Update your program to conditionally call" + " createPortal on the client only.");
}
exports.createPortal = createPortal;
function flushSync() {
    throw new Error("flushSync was called on the server. This is likely caused by a" + " function being called during render or in module scope that was" + " intended to be called from an effect or event handler. Update your" + " to not call flushSync no the server.");
}
exports.flushSync = flushSync;
// on the server we just call the callback because there is
// not update mechanism. Really this should not be called on the
// server but since the semantics are generally clear enough we
// can provide this trivial implementation.
function batchedUpdates(fn, a) {
    return fn(a);
}
exports.unstable_batchedUpdates = batchedUpdates;
