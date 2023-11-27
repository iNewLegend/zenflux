"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unstable_runWithPriority = exports.unstable_createEventHandle = exports.unstable_renderSubtreeIntoContainer = exports.hydrateRoot = exports.createRoot = exports.unmountComponentAtNode = exports.render = exports.hydrate = exports.findDOMNode = exports.version = exports.flushSync = exports.unstable_batchedUpdates = exports.createPortal = exports.useFormState = exports.useFormStatus = exports.preinitModule = exports.preinit = exports.preloadModule = exports.preload = exports.preconnect = exports.prefetchDNS = void 0;
var ReactDOMEventHandle_1 = require("@zenflux/react-dom-bindings/src/client/ReactDOMEventHandle");
Object.defineProperty(exports, "unstable_createEventHandle", { enumerable: true, get: function () { return ReactDOMEventHandle_1.createEventHandle; } });
var react_fiber_reconciler_1 = require("@zenflux/react-reconciler/src/react-fiber-reconciler");
Object.defineProperty(exports, "unstable_batchedUpdates", { enumerable: true, get: function () { return react_fiber_reconciler_1.batchedUpdates; } });
var react_event_priorities_1 = require("@zenflux/react-reconciler/src/react-event-priorities");
Object.defineProperty(exports, "unstable_runWithPriority", { enumerable: true, get: function () { return react_event_priorities_1.runWithPriority; } });
var react_portal_1 = require("@zenflux/react-reconciler/src/react-portal");
var ReactDOMComponentTree_1 = require("@zenflux/react-dom-bindings/src/client/ReactDOMComponentTree");
var ReactDOMControlledComponent_1 = require("@zenflux/react-dom-bindings/src/events/ReactDOMControlledComponent");
var ReactDOMRoot_1 = require("./ReactDOMRoot");
var ReactDOMLegacy_1 = require("./ReactDOMLegacy");
Object.defineProperty(exports, "findDOMNode", { enumerable: true, get: function () { return ReactDOMLegacy_1.findDOMNode; } });
Object.defineProperty(exports, "hydrate", { enumerable: true, get: function () { return ReactDOMLegacy_1.hydrate; } });
Object.defineProperty(exports, "render", { enumerable: true, get: function () { return ReactDOMLegacy_1.render; } });
Object.defineProperty(exports, "unmountComponentAtNode", { enumerable: true, get: function () { return ReactDOMLegacy_1.unmountComponentAtNode; } });
var react_version_1 = require("@zenflux/react-shared/src/react-version");
exports.version = react_version_1.default;
var execution_environment_1 = require("@zenflux/react-shared/src/execution-environment");
var ReactDOMSharedInternals_1 = require("../ReactDOMSharedInternals");
var ReactDOMFloat_1 = require("../shared/ReactDOMFloat");
Object.defineProperty(exports, "prefetchDNS", { enumerable: true, get: function () { return ReactDOMFloat_1.prefetchDNS; } });
Object.defineProperty(exports, "preconnect", { enumerable: true, get: function () { return ReactDOMFloat_1.preconnect; } });
Object.defineProperty(exports, "preload", { enumerable: true, get: function () { return ReactDOMFloat_1.preload; } });
Object.defineProperty(exports, "preloadModule", { enumerable: true, get: function () { return ReactDOMFloat_1.preloadModule; } });
Object.defineProperty(exports, "preinit", { enumerable: true, get: function () { return ReactDOMFloat_1.preinit; } });
Object.defineProperty(exports, "preinitModule", { enumerable: true, get: function () { return ReactDOMFloat_1.preinitModule; } });
var ReactDOMFormActions_1 = require("@zenflux/react-dom-bindings/src/shared/ReactDOMFormActions");
Object.defineProperty(exports, "useFormStatus", { enumerable: true, get: function () { return ReactDOMFormActions_1.useFormStatus; } });
Object.defineProperty(exports, "useFormState", { enumerable: true, get: function () { return ReactDOMFormActions_1.useFormState; } });
if (__DEV__) {
    if (typeof Map !== "function" || // $FlowFixMe[prop-missing] Flow incorrectly thinks Map has no prototype
        Map.prototype == null || typeof Map.prototype.forEach !== "function" || typeof Set !== "function" || // $FlowFixMe[prop-missing] Flow incorrectly thinks Set has no prototype
        Set.prototype == null || typeof Set.prototype.clear !== "function" || typeof Set.prototype.forEach !== "function") {
        console.error("React depends on Map and Set built-in types. Make sure that you load a " + "polyfill in older browsers. https://reactjs.org/link/react-polyfills");
    }
}
function createPortal(children, container, key) {
    if (key === void 0) { key = null; }
    if (!(0, ReactDOMRoot_1.isValidContainer)(container)) {
        throw new Error("Target container is not a DOM element.");
    }
    // TODO: pass ReactDOM portal implementation as third argument
    // $FlowFixMe[incompatible-return] The Flow type is opaque but there's no way to actually create it.
    return (0, react_portal_1.createPortal)(children, container, null, key);
}
exports.createPortal = createPortal;
function renderSubtreeIntoContainer(parentComponent, element, containerNode, callback) {
    return (0, ReactDOMLegacy_1.unstable_renderSubtreeIntoContainer)(parentComponent, element, containerNode, callback);
}
exports.unstable_renderSubtreeIntoContainer = renderSubtreeIntoContainer;
function createRoot(container, options) {
    if (__DEV__) {
        if (!ReactDOMSharedInternals_1.default.usingClientEntryPoint && !__UMD__) {
            console.error("You are importing createRoot from \"react-dom\" which is not supported. " + "You should instead import it from \"react-dom/client\".");
        }
    }
    return (0, ReactDOMRoot_1.createRoot)(container, options);
}
exports.createRoot = createRoot;
function hydrateRoot(container, initialChildren, options) {
    if (__DEV__) {
        if (!ReactDOMSharedInternals_1.default.usingClientEntryPoint && !__UMD__) {
            console.error("You are importing hydrateRoot from \"react-dom\" which is not supported. " + "You should instead import it from \"react-dom/client\".");
        }
    }
    return (0, ReactDOMRoot_1.hydrateRoot)(container, initialChildren, options);
}
exports.hydrateRoot = hydrateRoot;
// eslint-disable-next-line no-redeclare
function flushSync(fn) {
    if (__DEV__) {
        if ((0, react_fiber_reconciler_1.isAlreadyRendering)()) {
            console.error("flushSync was called from inside a lifecycle method. React cannot " + "flush when React is already rendering. Consider moving this call to " + "a scheduler task or micro task.");
        }
    }
    return (0, react_fiber_reconciler_1.flushSync)(fn);
}
exports.flushSync = flushSync;
// Keep in sync with ReactTestUtils.js.
// This is an array for better minification.
ReactDOMSharedInternals_1.default.Events = [ReactDOMComponentTree_1.getInstanceFromNode, ReactDOMComponentTree_1.getNodeFromInstance, ReactDOMComponentTree_1.getFiberCurrentPropsFromNode, ReactDOMControlledComponent_1.enqueueStateRestore, ReactDOMControlledComponent_1.restoreStateIfNeeded, react_fiber_reconciler_1.batchedUpdates];
var foundDevTools = (0, react_fiber_reconciler_1.injectIntoDevTools)({
    findFiberByHostInstance: ReactDOMComponentTree_1.getClosestInstanceFromNode,
    bundleType: __DEV__ ? 1 : 0,
    version: react_version_1.default,
    rendererPackageName: "react-dom"
});
if (__DEV__) {
    if (!foundDevTools && execution_environment_1.canUseDOM && window.top === window.self) {
        // If we're in Chrome or Firefox, provide a download link if not installed.
        if (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1) {
            var protocol = window.location.protocol;
            // Don't warn in exotic cases like chrome-extension://.
            if (/^(https?|file):$/.test(protocol)) {
                // eslint-disable-next-line react-internal/no-production-logging
                console.info("%cDownload the React DevTools " + "for a better development experience: " + "https://reactjs.org/link/react-devtools" + (protocol === "file:" ? "\nYou might need to use a local HTTP server (instead of file://): " + "https://reactjs.org/link/react-devtools-faq" : ""), "font-weight:bold");
            }
        }
    }
}
