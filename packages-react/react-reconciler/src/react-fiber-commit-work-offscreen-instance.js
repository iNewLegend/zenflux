"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachOffscreenInstance = exports.detachOffscreenInstance = void 0;
var react_fiber_activity_component_1 = require("@zenflux/react-reconciler/src/react-fiber-activity-component");
var react_fiber_flags_1 = require("@zenflux/react-reconciler/src/react-fiber-flags");
var react_fiber_concurrent_updates_1 = require("@zenflux/react-reconciler/src/react-fiber-concurrent-updates");
var react_fiber_lane_constants_1 = require("@zenflux/react-reconciler/src/react-fiber-lane-constants");
var react_fiber_work_schedule_update_1 = require("@zenflux/react-reconciler/src/react-fiber-work-schedule-update");
function detachOffscreenInstance(instance) {
    var fiber = instance._current;
    if (fiber === null) {
        throw new Error("Calling Offscreen.detach before instance handle has been set.");
    }
    if ((instance._pendingVisibility & react_fiber_activity_component_1.OffscreenDetached) !== react_fiber_flags_1.NoFlags) {
        // The instance is already detached, this is a noop.
        return;
    }
    // TODO: There is an opportunity to optimise this by not entering commit phase
    // and unmounting effects directly.
    var root = (0, react_fiber_concurrent_updates_1.enqueueConcurrentRenderForLane)(fiber, react_fiber_lane_constants_1.SyncLane);
    if (root !== null) {
        instance._pendingVisibility |= react_fiber_activity_component_1.OffscreenDetached;
        (0, react_fiber_work_schedule_update_1.scheduleUpdateOnFiber)(root, fiber, react_fiber_lane_constants_1.SyncLane);
    }
}
exports.detachOffscreenInstance = detachOffscreenInstance;
function attachOffscreenInstance(instance) {
    var fiber = instance._current;
    if (fiber === null) {
        throw new Error("Calling Offscreen.detach before instance handle has been set.");
    }
    if ((instance._pendingVisibility & react_fiber_activity_component_1.OffscreenDetached) === react_fiber_flags_1.NoFlags) {
        // The instance is already attached, this is a noop.
        return;
    }
    var root = (0, react_fiber_concurrent_updates_1.enqueueConcurrentRenderForLane)(fiber, react_fiber_lane_constants_1.SyncLane);
    if (root !== null) {
        instance._pendingVisibility &= ~react_fiber_activity_component_1.OffscreenDetached;
        (0, react_fiber_work_schedule_update_1.scheduleUpdateOnFiber)(root, fiber, react_fiber_lane_constants_1.SyncLane);
    }
}
exports.attachOffscreenInstance = attachOffscreenInstance;
