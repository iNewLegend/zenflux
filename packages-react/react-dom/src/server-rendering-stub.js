"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.experimental_useFormState = exports.experimental_useFormStatus = exports.unstable_batchedUpdates = exports.useFormState = exports.useFormStatus = exports.preinitModule = exports.preinit = exports.preloadModule = exports.preload = exports.preconnect = exports.prefetchDNS = exports.flushSync = exports.createPortal = exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = exports.version = void 0;
// Export all exports so that they're available in tests.
// We can't use export * from in Flow for some reason.
var react_version_1 = require("../../zenflux-react-shared/src/react-version");
exports.version = react_version_1.default;
var ReactDOMServerRenderingStub_1 = require("@z-react-dom/server/ReactDOMServerRenderingStub");
var ReactDOMSharedInternals_1 = require("@z-react-dom/ReactDOMSharedInternals");
Object.defineProperty(exports, "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED", { enumerable: true, get: function () { return ReactDOMSharedInternals_1.default; } });
var ReactDOMServerRenderingStub_2 = require("@z-react-dom/server/ReactDOMServerRenderingStub");
Object.defineProperty(exports, "createPortal", { enumerable: true, get: function () { return ReactDOMServerRenderingStub_2.createPortal; } });
Object.defineProperty(exports, "flushSync", { enumerable: true, get: function () { return ReactDOMServerRenderingStub_2.flushSync; } });
Object.defineProperty(exports, "prefetchDNS", { enumerable: true, get: function () { return ReactDOMServerRenderingStub_2.prefetchDNS; } });
Object.defineProperty(exports, "preconnect", { enumerable: true, get: function () { return ReactDOMServerRenderingStub_2.preconnect; } });
Object.defineProperty(exports, "preload", { enumerable: true, get: function () { return ReactDOMServerRenderingStub_2.preload; } });
Object.defineProperty(exports, "preloadModule", { enumerable: true, get: function () { return ReactDOMServerRenderingStub_2.preloadModule; } });
Object.defineProperty(exports, "preinit", { enumerable: true, get: function () { return ReactDOMServerRenderingStub_2.preinit; } });
Object.defineProperty(exports, "preinitModule", { enumerable: true, get: function () { return ReactDOMServerRenderingStub_2.preinitModule; } });
Object.defineProperty(exports, "useFormStatus", { enumerable: true, get: function () { return ReactDOMServerRenderingStub_2.useFormStatus; } });
Object.defineProperty(exports, "useFormState", { enumerable: true, get: function () { return ReactDOMServerRenderingStub_2.useFormState; } });
Object.defineProperty(exports, "unstable_batchedUpdates", { enumerable: true, get: function () { return ReactDOMServerRenderingStub_2.unstable_batchedUpdates; } });
function experimental_useFormStatus() {
    if (__DEV__) {
        console.error("useFormStatus is now in canary. Remove the experimental_ prefix. " + "The prefixed alias will be removed in an upcoming release.");
    }
    return (0, ReactDOMServerRenderingStub_1.useFormStatus)();
}
exports.experimental_useFormStatus = experimental_useFormStatus;
function experimental_useFormState(action, initialState, permalink) {
    if (__DEV__) {
        console.error("useFormState is now in canary. Remove the experimental_ prefix. " + "The prefixed alias will be removed in an upcoming release.");
    }
    return (0, ReactDOMServerRenderingStub_1.useFormState)(action, initialState, permalink);
}
exports.experimental_useFormState = experimental_useFormState;
