"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInsertionEffect = exports.mountInsertionEffect = void 0;
var react_fiber_flags_1 = require("@zenflux/react-reconciler/src/react-fiber-flags");
var react_hook_effect_tags_1 = require("@zenflux/react-reconciler/src/react-hook-effect-tags");
var react_fiber_hooks_use_effect_1 = require("@zenflux/react-reconciler/src/react-fiber-hooks-use-effect");
function mountInsertionEffect(create, deps) {
    (0, react_fiber_hooks_use_effect_1.mountEffectImpl)(react_fiber_flags_1.Update, react_hook_effect_tags_1.Insertion, create, deps);
}
exports.mountInsertionEffect = mountInsertionEffect;
function updateInsertionEffect(create, deps) {
    return (0, react_fiber_hooks_use_effect_1.updateEffectImpl)(react_fiber_flags_1.Update, react_hook_effect_tags_1.Insertion, create, deps);
}
exports.updateInsertionEffect = updateInsertionEffect;
