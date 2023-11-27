"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = exports.version = exports.preinitModule = exports.preinit = exports.preloadModule = exports.preload = exports.preconnect = exports.prefetchDNS = exports.useFormState = exports.useFormStatus = exports.unstable_runWithPriority = exports.unstable_renderSubtreeIntoContainer = exports.unstable_createEventHandle = exports.unstable_batchedUpdates = exports.unmountComponentAtNode = exports.render = exports.hydrate = exports.flushSync = exports.findDOMNode = exports.hydrateRoot = exports.createRoot = exports.createPortal = void 0;
var ReactDOMEventListener_1 = require("@zenflux/react-dom-bindings/src/events/ReactDOMEventListener");
var ReactDOMSharedInternals_1 = require("@z-react-dom/ReactDOMSharedInternals");
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactDOMSharedInternals_1.default;
// For classic WWW builds, include a few internals that are already in use.
Object.assign(ReactDOMSharedInternals_1.default, {
    ReactBrowserEventEmitter: {
        isEnabled: ReactDOMEventListener_1.isEnabled
    }
});
var ReactDOM_1 = require("@z-react-dom/client/ReactDOM");
Object.defineProperty(exports, "createPortal", { enumerable: true, get: function () { return ReactDOM_1.createPortal; } });
Object.defineProperty(exports, "createRoot", { enumerable: true, get: function () { return ReactDOM_1.createRoot; } });
Object.defineProperty(exports, "hydrateRoot", { enumerable: true, get: function () { return ReactDOM_1.hydrateRoot; } });
Object.defineProperty(exports, "findDOMNode", { enumerable: true, get: function () { return ReactDOM_1.findDOMNode; } });
Object.defineProperty(exports, "flushSync", { enumerable: true, get: function () { return ReactDOM_1.flushSync; } });
Object.defineProperty(exports, "hydrate", { enumerable: true, get: function () { return ReactDOM_1.hydrate; } });
Object.defineProperty(exports, "render", { enumerable: true, get: function () { return ReactDOM_1.render; } });
Object.defineProperty(exports, "unmountComponentAtNode", { enumerable: true, get: function () { return ReactDOM_1.unmountComponentAtNode; } });
Object.defineProperty(exports, "unstable_batchedUpdates", { enumerable: true, get: function () { return ReactDOM_1.unstable_batchedUpdates; } });
Object.defineProperty(exports, "unstable_createEventHandle", { enumerable: true, get: function () { return ReactDOM_1.unstable_createEventHandle; } });
Object.defineProperty(exports, "unstable_renderSubtreeIntoContainer", { enumerable: true, get: function () { return ReactDOM_1.unstable_renderSubtreeIntoContainer; } });
Object.defineProperty(exports, "unstable_runWithPriority", { enumerable: true, get: function () { return ReactDOM_1.unstable_runWithPriority; } }); // DO NOT USE: Temporarily exposed to migrate off of Scheduler.runWithPriority.
Object.defineProperty(exports, "useFormStatus", { enumerable: true, get: function () { return ReactDOM_1.useFormStatus; } });
Object.defineProperty(exports, "useFormState", { enumerable: true, get: function () { return ReactDOM_1.useFormState; } });
Object.defineProperty(exports, "prefetchDNS", { enumerable: true, get: function () { return ReactDOM_1.prefetchDNS; } });
Object.defineProperty(exports, "preconnect", { enumerable: true, get: function () { return ReactDOM_1.preconnect; } });
Object.defineProperty(exports, "preload", { enumerable: true, get: function () { return ReactDOM_1.preload; } });
Object.defineProperty(exports, "preloadModule", { enumerable: true, get: function () { return ReactDOM_1.preloadModule; } });
Object.defineProperty(exports, "preinit", { enumerable: true, get: function () { return ReactDOM_1.preinit; } });
Object.defineProperty(exports, "preinitModule", { enumerable: true, get: function () { return ReactDOM_1.preinitModule; } });
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return ReactDOM_1.version; } });
