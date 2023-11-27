"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidContainerLegacy = exports.isValidContainer = exports.hydrateRoot = exports.createRoot = void 0;
var ReactFiberConfigDOM_1 = require("@zenflux/react-dom-bindings/src/client/ReactFiberConfigDOM");
var ReactDOMEventReplaying_1 = require("@zenflux/react-dom-bindings/src/events/ReactDOMEventReplaying");
var ReactDOMComponentTree_1 = require("@zenflux/react-dom-bindings/src/client/ReactDOMComponentTree");
var DOMPluginEventSystem_1 = require("@zenflux/react-dom-bindings/src/events/DOMPluginEventSystem");
var HTMLNodeType_1 = require("@zenflux/react-dom-bindings/src/client/HTMLNodeType");
var react_fiber_reconciler_1 = require("@zenflux/react-reconciler/src/react-fiber-reconciler");
var react_root_tags_1 = require("@zenflux/react-reconciler/src/react-root-tags");
var react_feature_flags_1 = require("@zenflux/react-shared/src/react-feature-flags");
var react_symbols_1 = require("@zenflux/react-shared/src/react-symbols");
var ReactDOMSharedInternals_1 = require("../ReactDOMSharedInternals");
var Dispatcher = ReactDOMSharedInternals_1.default.Dispatcher;
if (react_feature_flags_1.enableFloat && typeof document !== "undefined") {
    // Set the default dispatcher to the client dispatcher
    Dispatcher.current = ReactFiberConfigDOM_1.ReactDOMClientDispatcher;
}
/* global reportError */
var defaultOnRecoverableError = typeof reportError === "function" ? // In modern browsers, reportError will dispatch an error event,
    // emulating an uncaught JavaScript error.
    reportError : function (error) {
    // In older browsers and test environments, fallback to console.error.
    // eslint-disable-next-line react-internal/no-production-logging
    console["error"](error);
};
// @ts-expect-error[missing-this-annot]
function ReactDOMRoot(internalRoot) {
    this._internalRoot = internalRoot;
}
// @ts-expect-error[prop-missing] found when upgrading Flow
ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render = // $FlowFixMe[missing-this-annot]
    function (children) {
        var root = this._internalRoot;
        if (root === null) {
            throw new Error("Cannot update an unmounted root.");
        }
        if (__DEV__) {
            if (typeof arguments[1] === "function") {
                console.error("render(...): does not support the second callback argument. " + "To execute a side effect after rendering, declare it in a component body with useEffect().");
            }
            else if (isValidContainer(arguments[1])) {
                console.error("You passed a container to the second argument of root.render(...). " + "You don't need to pass it again since you already passed it to create the root.");
            }
            else if (typeof arguments[1] !== "undefined") {
                console.error("You passed a second argument to root.render(...) but it only accepts " + "one argument.");
            }
            var container = root.containerInfo;
            if (!react_feature_flags_1.enableFloat && !react_feature_flags_1.enableHostSingletons && container.nodeType !== HTMLNodeType_1.COMMENT_NODE) {
                var hostInstance = (0, react_fiber_reconciler_1.findHostInstanceWithNoPortals)(root.current);
                if (hostInstance) {
                    if (hostInstance.parentNode !== container) {
                        console.error("render(...): It looks like the React-rendered content of the " + "root container was removed without using React. This is not " + "supported and will cause errors. Instead, call " + "root.unmount() to empty a root's container.");
                    }
                }
            }
        }
        (0, react_fiber_reconciler_1.updateContainer)(children, root, null, null);
    };
// @ts-expect-error[prop-missing] found when upgrading Flow
ReactDOMHydrationRoot.prototype.unmount = ReactDOMRoot.prototype.unmount = // $FlowFixMe[missing-this-annot]
    function () {
        if (__DEV__) {
            if (typeof arguments[0] === "function") {
                console.error("unmount(...): does not support a callback argument. " + "To execute a side effect after rendering, declare it in a component body with useEffect().");
            }
        }
        var root = this._internalRoot;
        if (root !== null) {
            this._internalRoot = null;
            var container = root.containerInfo;
            if (__DEV__) {
                if ((0, react_fiber_reconciler_1.isAlreadyRendering)()) {
                    console.error("Attempted to synchronously unmount a root while React was already " + "rendering. React cannot finish unmounting the root until the " + "current render has completed, which may lead to a race condition.");
                }
            }
            (0, react_fiber_reconciler_1.flushSync)(function () {
                (0, react_fiber_reconciler_1.updateContainer)(null, root, null, null);
            });
            (0, ReactDOMComponentTree_1.unmarkContainerAsRoot)(container);
        }
    };
function createRoot(container, options) {
    if (!isValidContainer(container)) {
        throw new Error("createRoot(...): Target container is not a DOM element.");
    }
    warnIfReactDOMContainerInDEV(container);
    var isStrictMode = false;
    var concurrentUpdatesByDefaultOverride = false;
    var identifierPrefix = "";
    var onRecoverableError = defaultOnRecoverableError;
    var transitionCallbacks = null;
    if (options !== null && options !== undefined) {
        if (__DEV__) {
            if (options.hydrate) {
                console.warn("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.");
            }
            else {
                if (typeof options === "object" && options !== null && options.$$typeof === react_symbols_1.REACT_ELEMENT_TYPE) {
                    console.error("You passed a JSX element to createRoot. You probably meant to " + "call root.render instead. " + "Example usage:\n\n" + "  let root = createRoot(domContainer);\n" + "  root.render(<App />);");
                }
            }
        }
        if (options.unstable_strictMode === true) {
            isStrictMode = true;
        }
        if (react_feature_flags_1.allowConcurrentByDefault && options.unstable_concurrentUpdatesByDefault === true) {
            concurrentUpdatesByDefaultOverride = true;
        }
        if (options.identifierPrefix !== undefined) {
            identifierPrefix = options.identifierPrefix;
        }
        if (options.onRecoverableError !== undefined) {
            onRecoverableError = options.onRecoverableError;
        }
        if (options.unstable_transitionCallbacks !== undefined) {
            transitionCallbacks = options.unstable_transitionCallbacks;
        }
    }
    var root = (0, react_fiber_reconciler_1.createContainer)(container, react_root_tags_1.ConcurrentRoot, null, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError, transitionCallbacks);
    (0, ReactDOMComponentTree_1.markContainerAsRoot)(root.current, container);
    Dispatcher.current = ReactFiberConfigDOM_1.ReactDOMClientDispatcher;
    var rootContainerElement = container.nodeType === HTMLNodeType_1.COMMENT_NODE ? container.parentNode : container;
    (0, DOMPluginEventSystem_1.listenToAllSupportedEvents)(rootContainerElement);
    // $FlowFixMe[invalid-constructor] Flow no longer supports calling new on functions
    return new ReactDOMRoot(root);
}
exports.createRoot = createRoot;
// @ts-expect-error[missing-this-annot]
function ReactDOMHydrationRoot(internalRoot) {
    this._internalRoot = internalRoot;
}
function scheduleHydration(target) {
    if (target) {
        (0, ReactDOMEventReplaying_1.queueExplicitHydrationTarget)(target);
    }
}
// @ts-expect-error[prop-missing] found when upgrading Flow
ReactDOMHydrationRoot.prototype.unstable_scheduleHydration = scheduleHydration;
function hydrateRoot(container, initialChildren, options) {
    if (!isValidContainer(container)) {
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
    }
    warnIfReactDOMContainerInDEV(container);
    if (__DEV__) {
        if (initialChildren === undefined) {
            console.error("Must provide initial children as second argument to hydrateRoot. " + "Example usage: hydrateRoot(domContainer, <App />)");
        }
    }
    // For now we reuse the whole bag of options since they contain
    // the hydration callbacks.
    var hydrationCallbacks = options != null ? options : null;
    var isStrictMode = false;
    var concurrentUpdatesByDefaultOverride = false;
    var identifierPrefix = "";
    var onRecoverableError = defaultOnRecoverableError;
    var transitionCallbacks = null;
    var formState = null;
    if (options !== null && options !== undefined) {
        if (options.unstable_strictMode === true) {
            isStrictMode = true;
        }
        if (react_feature_flags_1.allowConcurrentByDefault && options.unstable_concurrentUpdatesByDefault === true) {
            concurrentUpdatesByDefaultOverride = true;
        }
        if (options.identifierPrefix !== undefined) {
            identifierPrefix = options.identifierPrefix;
        }
        if (options.onRecoverableError !== undefined) {
            onRecoverableError = options.onRecoverableError;
        }
        if (options.unstable_transitionCallbacks !== undefined) {
            transitionCallbacks = options.unstable_transitionCallbacks;
        }
        if (react_feature_flags_1.enableAsyncActions && react_feature_flags_1.enableFormActions) {
            if (options.formState !== undefined) {
                formState = options.formState;
            }
        }
    }
    var root = (0, react_fiber_reconciler_1.createHydrationContainer)(initialChildren, null, container, react_root_tags_1.ConcurrentRoot, hydrationCallbacks, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError, transitionCallbacks, formState);
    (0, ReactDOMComponentTree_1.markContainerAsRoot)(root.current, container);
    Dispatcher.current = ReactFiberConfigDOM_1.ReactDOMClientDispatcher;
    // This can't be a comment node since hydration doesn't work on comment nodes anyway.
    (0, DOMPluginEventSystem_1.listenToAllSupportedEvents)(container);
    // $FlowFixMe[invalid-constructor] Flow no longer supports calling new on functions
    return new ReactDOMHydrationRoot(root);
}
exports.hydrateRoot = hydrateRoot;
function isValidContainer(node) {
    return !!(node && (node.nodeType === HTMLNodeType_1.ELEMENT_NODE || node.nodeType === HTMLNodeType_1.DOCUMENT_NODE || node.nodeType === HTMLNodeType_1.DOCUMENT_FRAGMENT_NODE || !react_feature_flags_1.disableCommentsAsDOMContainers && node.nodeType === HTMLNodeType_1.COMMENT_NODE && node.nodeValue === " react-mount-point-unstable "));
}
exports.isValidContainer = isValidContainer;
// TODO: Remove this function which also includes comment nodes.
// We only use it in places that are currently more relaxed.
function isValidContainerLegacy(node) {
    return !!(node && (node.nodeType === HTMLNodeType_1.ELEMENT_NODE || node.nodeType === HTMLNodeType_1.DOCUMENT_NODE || node.nodeType === HTMLNodeType_1.DOCUMENT_FRAGMENT_NODE || node.nodeType === HTMLNodeType_1.COMMENT_NODE && node.nodeValue === " react-mount-point-unstable "));
}
exports.isValidContainerLegacy = isValidContainerLegacy;
function warnIfReactDOMContainerInDEV(container) {
    if (__DEV__) {
        if (!react_feature_flags_1.enableHostSingletons && container.nodeType === HTMLNodeType_1.ELEMENT_NODE && container.tagName && container.tagName.toUpperCase() === "BODY") {
            console.error("createRoot(): Creating roots directly with document.body is " + "discouraged, since its children are often manipulated by third-party " + "scripts and browser extensions. This may lead to subtle " + "reconciliation issues. Try using a container element created " + "for your app.");
        }
        if ((0, ReactDOMComponentTree_1.isContainerMarkedAsRoot)(container)) {
            if (container._reactRootContainer) {
                console.error("You are calling ReactDOMClient.createRoot() on a container that was previously " + "passed to ReactDOM.render(). This is not supported.");
            }
            else {
                console.error("You are calling ReactDOMClient.createRoot() on a container that " + "has already been passed to createRoot() before. Instead, call " + "root.render() on the existing root instead if you want to update it.");
            }
        }
    }
}
