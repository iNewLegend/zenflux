"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLayoutEffect = exports.mountLayoutEffect = void 0;
var react_fiber_flags_1 = require("@zenflux/react-reconciler/src/react-fiber-flags");
var react_fiber_hooks_shared_1 = require("@zenflux/react-reconciler/src/react-fiber-hooks-shared");
var react_type_of_mode_1 = require("@zenflux/react-reconciler/src/react-type-of-mode");
var react_hook_effect_tags_1 = require("@zenflux/react-reconciler/src/react-hook-effect-tags");
var react_fiber_hooks_use_effect_1 = require("@zenflux/react-reconciler/src/react-fiber-hooks-use-effect");
function mountLayoutEffect(create, deps) {
    var fiberFlags = react_fiber_flags_1.Update | react_fiber_flags_1.LayoutStatic;
    if (__DEV__ && (react_fiber_hooks_shared_1.ReactFiberHooksCurrent.renderingFiber.mode & react_type_of_mode_1.StrictEffectsMode) !== react_type_of_mode_1.NoMode) {
        fiberFlags |= react_fiber_flags_1.MountLayoutDev;
    }
    return (0, react_fiber_hooks_use_effect_1.mountEffectImpl)(fiberFlags, react_hook_effect_tags_1.Layout, create, deps);
}
exports.mountLayoutEffect = mountLayoutEffect;
function updateLayoutEffect(create, deps) {
    return (0, react_fiber_hooks_use_effect_1.updateEffectImpl)(react_fiber_flags_1.Update, react_hook_effect_tags_1.Layout, create, deps);
}
exports.updateLayoutEffect = updateLayoutEffect;
