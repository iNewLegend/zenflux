"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOffscreenComponent = void 0;
var react_type_of_mode_1 = require("@zenflux/react-reconciler/src/react-type-of-mode");
var react_fiber_flags_1 = require("@zenflux/react-reconciler/src/react-fiber-flags");
var react_fiber_thenable_1 = require("@zenflux/react-reconciler/src/react-fiber-thenable");
var react_fiber_work_in_progress_ping_1 = require("@zenflux/react-reconciler/src/react-fiber-work-in-progress-ping");
function handleOffscreenComponent(sourceFiber, returnFiber, suspenseBoundary, root, rootRenderLanes, wakeable) {
    var halt = suspenseBoundary.mode & react_type_of_mode_1.ConcurrentMode;
    if (halt) {
        suspenseBoundary.flags |= react_fiber_flags_1.ShouldCapture;
        var isSuspenseyResource = wakeable === react_fiber_thenable_1.noopSuspenseyCommitThenable;
        if (isSuspenseyResource) {
            suspenseBoundary.flags |= react_fiber_flags_1.ScheduleRetry;
        }
        else {
            var offscreenQueue = suspenseBoundary.updateQueue;
            if (offscreenQueue === null) {
                suspenseBoundary.updateQueue = {
                    transitions: null,
                    markerInstances: null,
                    retryQueue: new Set([wakeable])
                };
            }
            else {
                var retryQueue = offscreenQueue.retryQueue;
                if (retryQueue === null) {
                    offscreenQueue.retryQueue = new Set([wakeable]);
                }
                else {
                    retryQueue.add(wakeable);
                }
            }
            (0, react_fiber_work_in_progress_ping_1.attachPingListener)(root, wakeable, rootRenderLanes);
        }
    }
    return halt;
}
exports.handleOffscreenComponent = handleOffscreenComponent;
