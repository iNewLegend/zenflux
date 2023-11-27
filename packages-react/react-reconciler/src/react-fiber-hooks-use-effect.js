"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEffectImpl = exports.pushEffect = exports.useEffectEventImpl = exports.updateEffect = exports.mountEffect = exports.mountEffectImpl = exports.createEffectInstance = void 0;
var react_fiber_flags_1 = require("@zenflux/react-reconciler/src/react-fiber-flags");
var react_fiber_hooks_infra_1 = require("@zenflux/react-reconciler/src/react-fiber-hooks-infra");
var react_fiber_hooks_shared_1 = require("@zenflux/react-reconciler/src/react-fiber-hooks-shared");
var react_hook_effect_tags_1 = require("@zenflux/react-reconciler/src/react-hook-effect-tags");
var react_type_of_mode_1 = require("@zenflux/react-reconciler/src/react-type-of-mode");
function createEffectInstance() {
    return {
        destroy: undefined
    };
}
exports.createEffectInstance = createEffectInstance;
function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
    var hook = (0, react_fiber_hooks_infra_1.mountWorkInProgressHook)();
    var nextDeps = deps === undefined ? null : deps;
    react_fiber_hooks_shared_1.ReactFiberHooksCurrent.renderingFiber.flags |= fiberFlags;
    hook.memoizedState = pushEffect(react_hook_effect_tags_1.HasEffect | hookFlags, create, createEffectInstance(), nextDeps);
}
exports.mountEffectImpl = mountEffectImpl;
function mountEffect(create, deps) {
    if (__DEV__ && (react_fiber_hooks_shared_1.ReactFiberHooksCurrent.renderingFiber.mode & react_type_of_mode_1.StrictEffectsMode) !== react_type_of_mode_1.NoMode && (react_fiber_hooks_shared_1.ReactFiberHooksCurrent.renderingFiber.mode & react_type_of_mode_1.NoStrictPassiveEffectsMode) === react_type_of_mode_1.NoMode) {
        mountEffectImpl(react_fiber_flags_1.MountPassiveDev | react_fiber_flags_1.Passive | react_fiber_flags_1.PassiveStatic, react_hook_effect_tags_1.Passive, create, deps);
    }
    else {
        mountEffectImpl(react_fiber_flags_1.Passive | react_fiber_flags_1.PassiveStatic, react_hook_effect_tags_1.Passive, create, deps);
    }
}
exports.mountEffect = mountEffect;
function updateEffect(create, deps) {
    updateEffectImpl(react_fiber_flags_1.Passive, react_hook_effect_tags_1.Passive, create, deps);
}
exports.updateEffect = updateEffect;
function useEffectEventImpl(payload) {
    react_fiber_hooks_shared_1.ReactFiberHooksCurrent.renderingFiber.flags |= react_fiber_flags_1.Update;
    var componentUpdateQueue = react_fiber_hooks_shared_1.ReactFiberHooksCurrent.renderingFiber.updateQueue;
    if (componentUpdateQueue === null) {
        componentUpdateQueue = react_fiber_hooks_shared_1.ReactFiberHooksInfra.createFunctionComponentUpdateQueue();
        react_fiber_hooks_shared_1.ReactFiberHooksCurrent.renderingFiber.updateQueue = componentUpdateQueue;
        componentUpdateQueue.events = [payload];
    }
    else {
        var events = componentUpdateQueue.events;
        if (events === null) {
            componentUpdateQueue.events = [payload];
        }
        else {
            events.push(payload);
        }
    }
}
exports.useEffectEventImpl = useEffectEventImpl;
function pushEffect(tag, create, inst, deps) {
    var effect = {
        tag: tag,
        create: create,
        inst: inst,
        deps: deps,
        // Circular
        next: null
    };
    var componentUpdateQueue = react_fiber_hooks_shared_1.ReactFiberHooksCurrent.renderingFiber.updateQueue;
    if (componentUpdateQueue === null) {
        componentUpdateQueue = react_fiber_hooks_shared_1.ReactFiberHooksInfra.createFunctionComponentUpdateQueue();
        react_fiber_hooks_shared_1.ReactFiberHooksCurrent.renderingFiber.updateQueue = componentUpdateQueue;
        componentUpdateQueue.lastEffect = effect.next = effect;
    }
    else {
        var lastEffect = componentUpdateQueue.lastEffect;
        if (lastEffect === null) {
            componentUpdateQueue.lastEffect = effect.next = effect;
        }
        else {
            var firstEffect = lastEffect.next;
            lastEffect.next = effect;
            effect.next = firstEffect;
            componentUpdateQueue.lastEffect = effect;
        }
    }
    return effect;
}
exports.pushEffect = pushEffect;
function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
    var hook = (0, react_fiber_hooks_infra_1.updateWorkInProgressHook)();
    var nextDeps = deps === undefined ? null : deps;
    var effect = hook.memoizedState;
    var inst = effect.inst;
    // ReactFiberHooksCurrent.hook is null on initial mount when rendering after a render phase
    // state update or for strict mode.
    if (react_fiber_hooks_shared_1.ReactFiberHooksCurrent.hook !== null && nextDeps !== null) {
        var prevEffect = react_fiber_hooks_shared_1.ReactFiberHooksCurrent.hook.memoizedState;
        var prevDeps = prevEffect.deps;
        if ((0, react_fiber_hooks_infra_1.areHookInputsEqual)(nextDeps, prevDeps)) {
            hook.memoizedState = pushEffect(hookFlags, create, inst, nextDeps);
            return;
        }
    }
    react_fiber_hooks_shared_1.ReactFiberHooksCurrent.renderingFiber.flags |= fiberFlags;
    hook.memoizedState = pushEffect(react_hook_effect_tags_1.HasEffect | hookFlags, create, inst, nextDeps);
}
exports.updateEffectImpl = updateEffectImpl;
