"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScopeInstance = void 0;
var react_feature_flags_1 = require("@zenflux/react-shared/src/react-feature-flags");
var react_fiber_tree_reflection_1 = require("@zenflux/react-reconciler/src/react-fiber-tree-reflection");
var react_work_tags_1 = require("@zenflux/react-reconciler/src/react-work-tags");
function getSuspenseFallbackChild(fiber) {
    return fiber.child.sibling.child;
}
var emptyObject = {};
var _a = globalThis.__RECONCILER__CONFIG__, getInstanceFromNode = _a.getInstanceFromNode, getInstanceFromScope = _a.getInstanceFromScope, getPublicInstance = _a.getPublicInstance;
function collectScopedNodes(node, fn, scopedNodes) {
    if (react_feature_flags_1.enableScopeAPI) {
        if (node.tag === react_work_tags_1.HostComponent) {
            var type = node.type, memoizedProps = node.memoizedProps, stateNode = node.stateNode;
            var instance = getPublicInstance(stateNode);
            if (instance !== null && fn(type, memoizedProps || emptyObject, instance) === true) {
                scopedNodes.push(instance);
            }
        }
        var child = node.child;
        if ((0, react_fiber_tree_reflection_1.isFiberSuspenseAndTimedOut)(node)) {
            child = getSuspenseFallbackChild(node);
        }
        if (child !== null) {
            collectScopedNodesFromChildren(child, fn, scopedNodes);
        }
    }
}
function collectFirstScopedNode(node, fn) {
    if (react_feature_flags_1.enableScopeAPI) {
        if (node.tag === react_work_tags_1.HostComponent) {
            var type = node.type, memoizedProps = node.memoizedProps, stateNode = node.stateNode;
            var instance = getPublicInstance(stateNode);
            if (instance !== null && fn(type, memoizedProps, instance) === true) {
                return instance;
            }
        }
        var child = node.child;
        if ((0, react_fiber_tree_reflection_1.isFiberSuspenseAndTimedOut)(node)) {
            child = getSuspenseFallbackChild(node);
        }
        if (child !== null) {
            return collectFirstScopedNodeFromChildren(child, fn);
        }
    }
    return null;
}
function collectScopedNodesFromChildren(startingChild, fn, scopedNodes) {
    var child = startingChild;
    while (child !== null) {
        collectScopedNodes(child, fn, scopedNodes);
        child = child.sibling;
    }
}
function collectFirstScopedNodeFromChildren(startingChild, fn) {
    var child = startingChild;
    while (child !== null) {
        var scopedNode = collectFirstScopedNode(child, fn);
        if (scopedNode !== null) {
            return scopedNode;
        }
        child = child.sibling;
    }
    return null;
}
function collectNearestContextValues(node, context, childContextValues) {
    if (node.tag === react_work_tags_1.ContextProvider && node.type._context === context) {
        var contextValue = node.memoizedProps.value;
        childContextValues.push(contextValue);
    }
    else {
        var child = node.child;
        if ((0, react_fiber_tree_reflection_1.isFiberSuspenseAndTimedOut)(node)) {
            child = getSuspenseFallbackChild(node);
        }
        if (child !== null) {
            collectNearestChildContextValues(child, context, childContextValues);
        }
    }
}
function collectNearestChildContextValues(startingChild, context, childContextValues) {
    var child = startingChild;
    while (child !== null) {
        collectNearestContextValues(child, context, childContextValues);
        child = child.sibling;
    }
}
function DO_NOT_USE_queryAllNodes(fn) {
    var currentFiber = getInstanceFromScope(this);
    if (currentFiber === null) {
        return null;
    }
    var child = currentFiber.child;
    var scopedNodes = [];
    if (child !== null) {
        collectScopedNodesFromChildren(child, fn, scopedNodes);
    }
    return scopedNodes.length === 0 ? null : scopedNodes;
}
function DO_NOT_USE_queryFirstNode(fn) {
    var currentFiber = getInstanceFromScope(this);
    if (currentFiber === null) {
        return null;
    }
    var child = currentFiber.child;
    if (child !== null) {
        return collectFirstScopedNodeFromChildren(child, fn);
    }
    return null;
}
function containsNode(node) {
    var fiber = getInstanceFromNode(node);
    while (fiber !== null) {
        if (fiber.tag === react_work_tags_1.ScopeComponent && fiber.stateNode === this) {
            return true;
        }
        fiber = fiber.return;
    }
    return false;
}
function getChildContextValues(context) {
    var currentFiber = getInstanceFromScope(this);
    if (currentFiber === null) {
        return [];
    }
    var child = currentFiber.child;
    var childContextValues = [];
    if (child !== null) {
        collectNearestChildContextValues(child, context, childContextValues);
    }
    return childContextValues;
}
function createScopeInstance() {
    return {
        DO_NOT_USE_queryAllNodes: DO_NOT_USE_queryAllNodes,
        DO_NOT_USE_queryFirstNode: DO_NOT_USE_queryFirstNode,
        containsNode: containsNode,
        getChildContextValues: getChildContextValues
    };
}
exports.createScopeInstance = createScopeInstance;
