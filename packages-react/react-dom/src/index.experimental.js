"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.experimental_useFormState = exports.experimental_useFormStatus = exports.version = exports.preinitModule = exports.preinit = exports.preloadModule = exports.preload = exports.preconnect = exports.prefetchDNS = exports.useFormState = exports.useFormStatus = exports.unstable_runWithPriority = exports.unstable_renderSubtreeIntoContainer = exports.unstable_batchedUpdates = exports.unmountComponentAtNode = exports.render = exports.hydrate = exports.flushSync = exports.findDOMNode = exports.hydrateRoot = exports.createRoot = exports.createPortal = exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = void 0;
var ReactDOM_1 = require("@z-react-dom/client/ReactDOM");
var ReactDOMSharedInternals_1 = require("@z-react-dom/ReactDOMSharedInternals");
Object.defineProperty(exports, "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED", { enumerable: true, get: function () { return ReactDOMSharedInternals_1.default; } });
var ReactDOM_2 = require("@z-react-dom/client/ReactDOM");
Object.defineProperty(exports, "createPortal", { enumerable: true, get: function () { return ReactDOM_2.createPortal; } });
Object.defineProperty(exports, "createRoot", { enumerable: true, get: function () { return ReactDOM_2.createRoot; } });
Object.defineProperty(exports, "hydrateRoot", { enumerable: true, get: function () { return ReactDOM_2.hydrateRoot; } });
Object.defineProperty(exports, "findDOMNode", { enumerable: true, get: function () { return ReactDOM_2.findDOMNode; } });
Object.defineProperty(exports, "flushSync", { enumerable: true, get: function () { return ReactDOM_2.flushSync; } });
Object.defineProperty(exports, "hydrate", { enumerable: true, get: function () { return ReactDOM_2.hydrate; } });
Object.defineProperty(exports, "render", { enumerable: true, get: function () { return ReactDOM_2.render; } });
Object.defineProperty(exports, "unmountComponentAtNode", { enumerable: true, get: function () { return ReactDOM_2.unmountComponentAtNode; } });
Object.defineProperty(exports, "unstable_batchedUpdates", { enumerable: true, get: function () { return ReactDOM_2.unstable_batchedUpdates; } });
Object.defineProperty(exports, "unstable_renderSubtreeIntoContainer", { enumerable: true, get: function () { return ReactDOM_2.unstable_renderSubtreeIntoContainer; } });
Object.defineProperty(exports, "unstable_runWithPriority", { enumerable: true, get: function () { return ReactDOM_2.unstable_runWithPriority; } }); // DO NOT USE: Temporarily exposed to migrate off of Scheduler.runWithPriority.
Object.defineProperty(exports, "useFormStatus", { enumerable: true, get: function () { return ReactDOM_2.useFormStatus; } });
Object.defineProperty(exports, "useFormState", { enumerable: true, get: function () { return ReactDOM_2.useFormState; } });
Object.defineProperty(exports, "prefetchDNS", { enumerable: true, get: function () { return ReactDOM_2.prefetchDNS; } });
Object.defineProperty(exports, "preconnect", { enumerable: true, get: function () { return ReactDOM_2.preconnect; } });
Object.defineProperty(exports, "preload", { enumerable: true, get: function () { return ReactDOM_2.preload; } });
Object.defineProperty(exports, "preloadModule", { enumerable: true, get: function () { return ReactDOM_2.preloadModule; } });
Object.defineProperty(exports, "preinit", { enumerable: true, get: function () { return ReactDOM_2.preinit; } });
Object.defineProperty(exports, "preinitModule", { enumerable: true, get: function () { return ReactDOM_2.preinitModule; } });
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return ReactDOM_2.version; } });
function experimental_useFormStatus() {
    if (__DEV__) {
        console.error("useFormStatus is now in canary. Remove the experimental_ prefix. " + "The prefixed alias will be removed in an upcoming release.");
    }
    return (0, ReactDOM_1.useFormStatus)();
}
exports.experimental_useFormStatus = experimental_useFormStatus;
function experimental_useFormState(action, initialState, permalink) {
    if (__DEV__) {
        console.error("useFormState is now in canary. Remove the experimental_ prefix. " + "The prefixed alias will be removed in an upcoming release.");
    }
    return (0, ReactDOM_1.useFormState)(action, initialState, permalink);
}
exports.experimental_useFormState = experimental_useFormState;
