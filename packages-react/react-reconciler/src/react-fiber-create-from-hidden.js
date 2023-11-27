"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFiberFromLegacyHidden = void 0;
var react_symbols_1 = require("@zenflux/react-shared/src/react-symbols");
var react_fiber_activity_component_1 = require("@zenflux/react-reconciler/src/react-fiber-activity-component");
var react_work_tags_1 = require("@zenflux/react-reconciler/src/react-work-tags");
var react_fiber_commit_work_offscreen_instance_1 = require("@zenflux/react-reconciler/src/react-fiber-commit-work-offscreen-instance");
var react_fiber_1 = require("@zenflux/react-reconciler/src/react-fiber");
function createFiberFromLegacyHidden(pendingProps, mode, lanes, key) {
    var fiber = (0, react_fiber_1.createFiber)(react_work_tags_1.LegacyHiddenComponent, pendingProps, key, mode);
    fiber.elementType = react_symbols_1.REACT_LEGACY_HIDDEN_TYPE;
    fiber.lanes = lanes;
    // Adding a stateNode for legacy hidden because it's currently using
    // the offscreen implementation, which depends on a state node
    var instance = {
        _visibility: react_fiber_activity_component_1.OffscreenVisible,
        _pendingVisibility: react_fiber_activity_component_1.OffscreenVisible,
        _pendingMarkers: null,
        _transitions: null,
        _retryCache: null,
        _current: null,
        detach: function () { return (0, react_fiber_commit_work_offscreen_instance_1.detachOffscreenInstance)(instance); },
        attach: function () { return (0, react_fiber_commit_work_offscreen_instance_1.attachOffscreenInstance)(instance); }
    };
    fiber.stateNode = instance;
    return fiber;
}
exports.createFiberFromLegacyHidden = createFiberFromLegacyHidden;
