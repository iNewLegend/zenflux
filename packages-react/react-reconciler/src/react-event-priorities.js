"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lanesToEventPriority = exports.isHigherEventPriority = exports.lowerEventPriority = exports.higherEventPriority = exports.runWithPriority = exports.setCurrentUpdatePriority = exports.getCurrentUpdatePriority = exports.IdleEventPriority = exports.DefaultEventPriority = exports.ContinuousEventPriority = exports.DiscreteEventPriority = void 0;
// TODO? Should be shared?
var react_fiber_lane_constants_1 = require("@zenflux/react-reconciler/src/react-fiber-lane-constants");
exports.DiscreteEventPriority = react_fiber_lane_constants_1.SyncLane;
exports.ContinuousEventPriority = react_fiber_lane_constants_1.InputContinuousLane;
exports.DefaultEventPriority = react_fiber_lane_constants_1.DefaultLane;
exports.IdleEventPriority = react_fiber_lane_constants_1.IdleLane;
var currentUpdatePriority = react_fiber_lane_constants_1.NoLane;
function getCurrentUpdatePriority() {
    return currentUpdatePriority;
}
exports.getCurrentUpdatePriority = getCurrentUpdatePriority;
function setCurrentUpdatePriority(newPriority) {
    currentUpdatePriority = newPriority;
}
exports.setCurrentUpdatePriority = setCurrentUpdatePriority;
function runWithPriority(priority, fn) {
    var previousPriority = currentUpdatePriority;
    try {
        currentUpdatePriority = priority;
        return fn();
    }
    finally {
        currentUpdatePriority = previousPriority;
    }
}
exports.runWithPriority = runWithPriority;
function higherEventPriority(a, b) {
    return a !== 0 && a < b ? a : b;
}
exports.higherEventPriority = higherEventPriority;
function lowerEventPriority(a, b) {
    return a === 0 || a > b ? a : b;
}
exports.lowerEventPriority = lowerEventPriority;
function isHigherEventPriority(a, b) {
    return a !== 0 && a < b;
}
exports.isHigherEventPriority = isHigherEventPriority;
function lanesToEventPriority(lanes) {
    var lane = (0, react_fiber_lane_constants_1.getHighestPriorityLane)(lanes);
    if (!isHigherEventPriority(exports.DiscreteEventPriority, lane)) {
        return exports.DiscreteEventPriority;
    }
    if (!isHigherEventPriority(exports.ContinuousEventPriority, lane)) {
        return exports.ContinuousEventPriority;
    }
    if ((0, react_fiber_lane_constants_1.includesNonIdleWork)(lane)) {
        return exports.DefaultEventPriority;
    }
    return exports.IdleEventPriority;
}
exports.lanesToEventPriority = lanesToEventPriority;
