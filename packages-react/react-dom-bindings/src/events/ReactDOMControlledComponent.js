"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreStateIfNeeded = exports.needsStateRestore = exports.enqueueStateRestore = void 0;
// eslint-disable-next-line import/no-cycle
var ReactDOMComponent_1 = require("@zenflux/react-dom-bindings/src/client/ReactDOMComponent");
var ReactDOMComponentTree_1 = require("@zenflux/react-dom-bindings/src/client/ReactDOMComponentTree");
// Use to restore controlled state after a change event has fired.
var restoreTarget = null;
var restoreQueue = null;
function restoreStateOfTarget(target) {
    // We perform this translation at the end of the event loop so that we
    // always receive the correct fiber here
    var internalInstance = (0, ReactDOMComponentTree_1.getInstanceFromNode)(target);
    if (!internalInstance) {
        // Unmounted
        return;
    }
    var stateNode = internalInstance.stateNode;
    // Guard against Fiber being unmounted.
    if (stateNode) {
        var props = (0, ReactDOMComponentTree_1.getFiberCurrentPropsFromNode)(stateNode);
        (0, ReactDOMComponent_1.restoreControlledState)(internalInstance.stateNode, internalInstance.type, props);
    }
}
function enqueueStateRestore(target) {
    if (restoreTarget) {
        if (restoreQueue) {
            restoreQueue.push(target);
        }
        else {
            restoreQueue = [target];
        }
    }
    else {
        restoreTarget = target;
    }
}
exports.enqueueStateRestore = enqueueStateRestore;
function needsStateRestore() {
    return restoreTarget !== null || restoreQueue !== null;
}
exports.needsStateRestore = needsStateRestore;
function restoreStateIfNeeded() {
    if (!restoreTarget) {
        return;
    }
    var target = restoreTarget;
    var queuedTargets = restoreQueue;
    restoreTarget = null;
    restoreQueue = null;
    restoreStateOfTarget(target);
    if (queuedTargets) {
        for (var i_1 = 0; i_1 < queuedTargets.length; i_1++) {
            restoreStateOfTarget(queuedTargets[i_1]);
        }
    }
}
exports.restoreStateIfNeeded = restoreStateIfNeeded;
