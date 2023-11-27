"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmountComponentAtNode = exports.unstable_renderSubtreeIntoContainer = exports.render = exports.hydrate = exports.findDOMNode = void 0;
var ReactFiberConfigDOM_1 = require("@zenflux/react-dom-bindings/src/client/ReactFiberConfigDOM");
var ReactDOMComponentTree_1 = require("@zenflux/react-dom-bindings/src/client/ReactDOMComponentTree");
var DOMPluginEventSystem_1 = require("@zenflux/react-dom-bindings/src/events/DOMPluginEventSystem");
var HTMLNodeType_1 = require("@zenflux/react-dom-bindings/src/client/HTMLNodeType");
var react_fiber_reconciler_1 = require("@zenflux/react-reconciler/src/react-fiber-reconciler");
var react_root_tags_1 = require("@zenflux/react-reconciler/src/react-root-tags");
var get_component_name_from_type_1 = require("@zenflux/react-shared/src/get-component-name-from-type");
var react_shared_internals_1 = require("@zenflux/react-shared/src/react-shared-internals");
var react_instance_map_1 = require("@zenflux/react-shared/src/react-instance-map");
var react_feature_flags_1 = require("@zenflux/react-shared/src/react-feature-flags");
var ReactDOMRoot_1 = require("@z-react-dom/client/ReactDOMRoot");
var ReactCurrentOwner = react_shared_internals_1.default.ReactCurrentOwner;
var topLevelUpdateWarnings;
if (__DEV__) {
    topLevelUpdateWarnings = function (container) {
        if (container._reactRootContainer && container.nodeType !== HTMLNodeType_1.COMMENT_NODE) {
            var hostInstance = (0, react_fiber_reconciler_1.findHostInstanceWithNoPortals)(container._reactRootContainer.current);
            if (hostInstance) {
                if (hostInstance.parentNode !== container) {
                    console.error("render(...): It looks like the React-rendered content of this " + "container was removed without using React. This is not " + "supported and will cause errors. Instead, call " + "ReactDOM.unmountComponentAtNode to empty a container.");
                }
            }
        }
        var isRootRenderedBySomeReact = !!container._reactRootContainer;
        var rootEl = getReactRootElementInContainer(container);
        var hasNonRootReactChild = !!(rootEl && (0, ReactDOMComponentTree_1.getInstanceFromNode)(rootEl));
        if (hasNonRootReactChild && !isRootRenderedBySomeReact) {
            console.error("render(...): Replacing React-rendered children with a new root " + "component. If you intended to update the children of this node, " + "you should instead have the existing children update their state " + "and render the new components instead of calling ReactDOM.render.");
        }
        if (!react_feature_flags_1.enableHostSingletons && container.nodeType === HTMLNodeType_1.ELEMENT_NODE && container.tagName && container.tagName.toUpperCase() === "BODY") {
            console.error("render(): Rendering components directly into document.body is " + "discouraged, since its children are often manipulated by third-party " + "scripts and browser extensions. This may lead to subtle " + "reconciliation issues. Try rendering into a container element created " + "for your app.");
        }
    };
}
function getReactRootElementInContainer(container) {
    if (!container) {
        return null;
    }
    if (container.nodeType === HTMLNodeType_1.DOCUMENT_NODE) {
        return container.documentElement;
    }
    else {
        return container.firstChild;
    }
}
function noopOnRecoverableError() {
    // legacy API.
}
function legacyCreateRootFromDOMContainer(container, initialChildren, parentComponent, callback, isHydrationContainer) {
    if (isHydrationContainer) {
        if (typeof callback === "function") {
            var originalCallback_1 = callback;
            callback = function () {
                var instance = (0, react_fiber_reconciler_1.getPublicRootInstance)(root_1);
                originalCallback_1.call(instance);
            };
        }
        var root_1 = (0, react_fiber_reconciler_1.createHydrationContainer)(initialChildren, callback, container, react_root_tags_1.LegacyRoot, null, // hydrationCallbacks
        false, // isStrictMode
        false, // concurrentUpdatesByDefaultOverride,
        "", // identifierPrefix
        noopOnRecoverableError, // TODO(luna) Support hydration later
        null, null);
        container._reactRootContainer = root_1;
        (0, ReactDOMComponentTree_1.markContainerAsRoot)(root_1.current, container);
        var rootContainerElement = container.nodeType === HTMLNodeType_1.COMMENT_NODE ? container.parentNode : container;
        // $FlowFixMe[incompatible-call]
        (0, DOMPluginEventSystem_1.listenToAllSupportedEvents)(rootContainerElement);
        (0, react_fiber_reconciler_1.flushSync)();
        return root_1;
    }
    else {
        // First clear any existing content.
        (0, ReactFiberConfigDOM_1.clearContainer)(container);
        if (typeof callback === "function") {
            var originalCallback_2 = callback;
            callback = function () {
                var instance = (0, react_fiber_reconciler_1.getPublicRootInstance)(root_2);
                originalCallback_2.call(instance);
            };
        }
        var root_2 = (0, react_fiber_reconciler_1.createContainer)(container, react_root_tags_1.LegacyRoot, null, // hydrationCallbacks
        false, // isStrictMode
        false, // concurrentUpdatesByDefaultOverride,
        "", // identifierPrefix
        noopOnRecoverableError, // onRecoverableError
        null // transitionCallbacks
        );
        container._reactRootContainer = root_2;
        (0, ReactDOMComponentTree_1.markContainerAsRoot)(root_2.current, container);
        var rootContainerElement = container.nodeType === HTMLNodeType_1.COMMENT_NODE ? container.parentNode : container;
        // $FlowFixMe[incompatible-call]
        (0, DOMPluginEventSystem_1.listenToAllSupportedEvents)(rootContainerElement);
        // Initial mount should not be batched.
        (0, react_fiber_reconciler_1.flushSync)(function () {
            (0, react_fiber_reconciler_1.updateContainer)(initialChildren, root_2, parentComponent, callback);
        });
        return root_2;
    }
}
function warnOnInvalidCallback(callback, callerName) {
    if (__DEV__) {
        if (callback !== null && typeof callback !== "function") {
            console.error("%s(...): Expected the last optional `callback` argument to be a " + "function. Instead received: %s.", callerName, callback);
        }
    }
}
function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
    if (__DEV__) {
        topLevelUpdateWarnings(container);
        warnOnInvalidCallback(callback === undefined ? null : callback, "render");
    }
    var maybeRoot = container._reactRootContainer;
    var root;
    if (!maybeRoot) {
        // Initial mount
        root = legacyCreateRootFromDOMContainer(container, children, parentComponent, callback, forceHydrate);
    }
    else {
        root = maybeRoot;
        if (typeof callback === "function") {
            var originalCallback_3 = callback;
            callback = function () {
                var instance = (0, react_fiber_reconciler_1.getPublicRootInstance)(root);
                originalCallback_3.call(instance);
            };
        }
        // Update
        (0, react_fiber_reconciler_1.updateContainer)(children, root, parentComponent, callback);
    }
    return (0, react_fiber_reconciler_1.getPublicRootInstance)(root);
}
function findDOMNode(componentOrElement) {
    if (__DEV__) {
        var owner = ReactCurrentOwner.current;
        if (owner !== null && owner.stateNode !== null) {
            var warnedAboutRefsInRender = owner.stateNode._warnedAboutRefsInRender;
            if (!warnedAboutRefsInRender) {
                console.error("%s is accessing findDOMNode inside its render(). " + "render() should be a pure function of props and state. It should " + "never access something that requires stale data from the previous " + "render, such as refs. Move this logic to componentDidMount and " + "componentDidUpdate instead.", (0, get_component_name_from_type_1.default)(owner.type) || "A component");
            }
            owner.stateNode._warnedAboutRefsInRender = true;
        }
    }
    if (componentOrElement == null) {
        return null;
    }
    if (componentOrElement.nodeType === HTMLNodeType_1.ELEMENT_NODE) {
        return componentOrElement;
    }
    if (__DEV__) {
        return (0, react_fiber_reconciler_1.findHostInstanceWithWarning)(componentOrElement, "findDOMNode");
    }
    return (0, react_fiber_reconciler_1.findHostInstance)(componentOrElement);
}
exports.findDOMNode = findDOMNode;
function hydrate(element, container, callback) {
    if (__DEV__) {
        console.error("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot " + "instead. Until you switch to the new API, your app will behave as " + "if it's running React 17. Learn " + "more: https://reactjs.org/link/switch-to-createroot");
    }
    if (!(0, ReactDOMRoot_1.isValidContainerLegacy)(container)) {
        throw new Error("Target container is not a DOM element.");
    }
    if (__DEV__) {
        var isModernRoot = (0, ReactDOMComponentTree_1.isContainerMarkedAsRoot)(container) && container._reactRootContainer === undefined;
        if (isModernRoot) {
            console.error("You are calling ReactDOM.hydrate() on a container that was previously " + "passed to ReactDOMClient.createRoot(). This is not supported. " + "Did you mean to call hydrateRoot(container, element)?");
        }
    }
    // TODO: throw or warn if we couldn't hydrate?
    return legacyRenderSubtreeIntoContainer(null, element, container, true, callback);
}
exports.hydrate = hydrate;
function render(element, container, callback) {
    if (__DEV__) {
        console.error("ReactDOM.render is no longer supported in React 18. Use createRoot " + "instead. Until you switch to the new API, your app will behave as " + "if it's running React 17. Learn " + "more: https://reactjs.org/link/switch-to-createroot");
    }
    if (!(0, ReactDOMRoot_1.isValidContainerLegacy)(container)) {
        throw new Error("Target container is not a DOM element.");
    }
    if (__DEV__) {
        var isModernRoot = (0, ReactDOMComponentTree_1.isContainerMarkedAsRoot)(container) && container._reactRootContainer === undefined;
        if (isModernRoot) {
            console.error("You are calling ReactDOM.render() on a container that was previously " + "passed to ReactDOMClient.createRoot(). This is not supported. " + "Did you mean to call root.render(element)?");
        }
    }
    return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);
}
exports.render = render;
function unstable_renderSubtreeIntoContainer(parentComponent, element, containerNode, callback) {
    if (__DEV__) {
        console.error("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported " + "in React 18. Consider using a portal instead. Until you switch to " + "the createRoot API, your app will behave as if it's running React " + "17. Learn more: https://reactjs.org/link/switch-to-createroot");
    }
    if (!(0, ReactDOMRoot_1.isValidContainerLegacy)(containerNode)) {
        throw new Error("Target container is not a DOM element.");
    }
    if (parentComponent == null || !(0, react_instance_map_1.has)(parentComponent)) {
        throw new Error("parentComponent must be a valid React Component");
    }
    return legacyRenderSubtreeIntoContainer(parentComponent, element, containerNode, false, callback);
}
exports.unstable_renderSubtreeIntoContainer = unstable_renderSubtreeIntoContainer;
function unmountComponentAtNode(container) {
    if (!(0, ReactDOMRoot_1.isValidContainerLegacy)(container)) {
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
    }
    if (__DEV__) {
        var isModernRoot = (0, ReactDOMComponentTree_1.isContainerMarkedAsRoot)(container) && container._reactRootContainer === undefined;
        if (isModernRoot) {
            console.error("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously " + "passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
        }
    }
    if (container._reactRootContainer) {
        if (__DEV__) {
            var rootEl = getReactRootElementInContainer(container);
            var renderedByDifferentReact = rootEl && !(0, ReactDOMComponentTree_1.getInstanceFromNode)(rootEl);
            if (renderedByDifferentReact) {
                console.error("unmountComponentAtNode(): The node you're attempting to unmount " + "was rendered by another copy of React.");
            }
        }
        // Unmount should not be batched.
        (0, react_fiber_reconciler_1.flushSync)(function () {
            legacyRenderSubtreeIntoContainer(null, null, container, false, function () {
                // $FlowFixMe[incompatible-type] This should probably use `delete container._reactRootContainer`
                container._reactRootContainer = null;
                (0, ReactDOMComponentTree_1.unmarkContainerAsRoot)(container);
            });
        });
        // If you call unmountComponentAtNode twice in quick succession, you'll
        // get `true` twice. That's probably fine?
        return true;
    }
    else {
        if (__DEV__) {
            var rootEl = getReactRootElementInContainer(container);
            var hasNonRootReactChild = !!(rootEl && (0, ReactDOMComponentTree_1.getInstanceFromNode)(rootEl));
            // Check if the container itself is a React root node.
            var isContainerReactRoot = container.nodeType === HTMLNodeType_1.ELEMENT_NODE && (0, ReactDOMRoot_1.isValidContainerLegacy)(container.parentNode) && // $FlowFixMe[prop-missing]
                // $FlowFixMe[incompatible-use]
                // @ts-ignore - Who knows if parentNode will be a valid
                !!container.parentNode._reactRootContainer;
            if (hasNonRootReactChild) {
                console.error("unmountComponentAtNode(): The node you're attempting to unmount " + "was rendered by React and is not a top-level container. %s", isContainerReactRoot ? "You may have accidentally passed in a React root node instead " + "of its container." : "Instead, have the parent component update its state and " + "rerender in order to remove this component.");
            }
        }
        return false;
    }
}
exports.unmountComponentAtNode = unmountComponentAtNode;
