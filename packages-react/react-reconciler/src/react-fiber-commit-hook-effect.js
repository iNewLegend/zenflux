"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitHookEffectListMount = exports.commitHookEffectListUnmount = void 0;
var react_feature_flags_1 = require("@zenflux/react-shared/src/react-feature-flags");
var react_hook_effect_tags_1 = require("@zenflux/react-reconciler/src/react-hook-effect-tags");
var react_fiber_dev_tools_hook_1 = require("@zenflux/react-reconciler/src/react-fiber-dev-tools-hook");
var react_fiber_work_running_insertion_effect_1 = require("@zenflux/react-reconciler/src/react-fiber-work-running-insertion-effect");
var react_fiber_flags_1 = require("@zenflux/react-reconciler/src/react-fiber-flags");
var react_fiber_commit_phase_error_1 = require("@zenflux/react-reconciler/src/react-fiber-commit-phase-error");
function commitHookEffectListUnmount(flags, finishedWork, nearestMountedAncestor) {
    var updateQueue = finishedWork.updateQueue;
    var lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
    if (lastEffect !== null) {
        var firstEffect = lastEffect.next;
        var effect = firstEffect;
        do {
            if ((effect.tag & flags) === flags) {
                // Unmount
                var inst = effect.inst;
                var destroy = inst.destroy;
                if (destroy !== undefined) {
                    inst.destroy = undefined;
                    if (react_feature_flags_1.enableSchedulingProfiler) {
                        if ((flags & react_hook_effect_tags_1.Passive) !== react_hook_effect_tags_1.NoFlags) {
                            (0, react_fiber_dev_tools_hook_1.markComponentPassiveEffectUnmountStarted)(finishedWork);
                        }
                        else if ((flags & react_hook_effect_tags_1.Layout) !== react_hook_effect_tags_1.NoFlags) {
                            (0, react_fiber_dev_tools_hook_1.markComponentLayoutEffectUnmountStarted)(finishedWork);
                        }
                    }
                    if (__DEV__) {
                        if ((flags & react_hook_effect_tags_1.Insertion) !== react_hook_effect_tags_1.NoFlags) {
                            (0, react_fiber_work_running_insertion_effect_1.setIsRunningInsertionEffect)(true);
                        }
                    }
                    (0, react_fiber_commit_phase_error_1.safelyCallDestroy)(finishedWork, nearestMountedAncestor, destroy);
                    if (__DEV__) {
                        if ((flags & react_hook_effect_tags_1.Insertion) !== react_hook_effect_tags_1.NoFlags) {
                            (0, react_fiber_work_running_insertion_effect_1.setIsRunningInsertionEffect)(false);
                        }
                    }
                    if (react_feature_flags_1.enableSchedulingProfiler) {
                        if ((flags & react_hook_effect_tags_1.Passive) !== react_hook_effect_tags_1.NoFlags) {
                            (0, react_fiber_dev_tools_hook_1.markComponentPassiveEffectUnmountStopped)();
                        }
                        else if ((flags & react_hook_effect_tags_1.Layout) !== react_hook_effect_tags_1.NoFlags) {
                            (0, react_fiber_dev_tools_hook_1.markComponentLayoutEffectUnmountStopped)();
                        }
                    }
                }
            }
            effect = effect.next;
        } while (effect !== firstEffect);
    }
}
exports.commitHookEffectListUnmount = commitHookEffectListUnmount;
function commitHookEffectListMount(flags, finishedWork) {
    var updateQueue = finishedWork.updateQueue;
    var lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
    if (lastEffect !== null) {
        var firstEffect = lastEffect.next;
        var effect = firstEffect;
        do {
            if ((effect.tag & flags) === flags) {
                if (react_feature_flags_1.enableSchedulingProfiler) {
                    if ((flags & react_hook_effect_tags_1.Passive) !== react_hook_effect_tags_1.NoFlags) {
                        (0, react_fiber_dev_tools_hook_1.markComponentPassiveEffectMountStarted)(finishedWork);
                    }
                    else if ((flags & react_hook_effect_tags_1.Layout) !== react_hook_effect_tags_1.NoFlags) {
                        (0, react_fiber_dev_tools_hook_1.markComponentLayoutEffectMountStarted)(finishedWork);
                    }
                }
                // Mount
                var create = effect.create;
                if (__DEV__) {
                    if ((flags & react_hook_effect_tags_1.Insertion) !== react_hook_effect_tags_1.NoFlags) {
                        (0, react_fiber_work_running_insertion_effect_1.setIsRunningInsertionEffect)(true);
                    }
                }
                var inst = effect.inst;
                var destroy = create();
                inst.destroy = destroy;
                if (__DEV__) {
                    if ((flags & react_hook_effect_tags_1.Insertion) !== react_hook_effect_tags_1.NoFlags) {
                        (0, react_fiber_work_running_insertion_effect_1.setIsRunningInsertionEffect)(false);
                    }
                }
                if (react_feature_flags_1.enableSchedulingProfiler) {
                    if ((flags & react_hook_effect_tags_1.Passive) !== react_hook_effect_tags_1.NoFlags) {
                        (0, react_fiber_dev_tools_hook_1.markComponentPassiveEffectMountStopped)();
                    }
                    else if ((flags & react_hook_effect_tags_1.Layout) !== react_hook_effect_tags_1.NoFlags) {
                        (0, react_fiber_dev_tools_hook_1.markComponentLayoutEffectMountStopped)();
                    }
                }
                if (__DEV__) {
                    if (destroy !== undefined && typeof destroy !== "function") {
                        var hookName = void 0;
                        if ((effect.tag & react_hook_effect_tags_1.Layout) !== react_fiber_flags_1.NoFlags) {
                            hookName = "useLayoutEffect";
                        }
                        else if ((effect.tag & react_hook_effect_tags_1.Insertion) !== react_fiber_flags_1.NoFlags) {
                            hookName = "useInsertionEffect";
                        }
                        else {
                            hookName = "useEffect";
                        }
                        var addendum = void 0;
                        if (destroy === null) {
                            addendum = " You returned null. If your effect does not require clean " + "up, return undefined (or nothing).";
                        }
                        else if (typeof destroy.then === "function") {
                            addendum = "\n\nIt looks like you wrote " + hookName + "(async () => ...) or returned a Promise. " + "Instead, write the async function inside your effect " + "and call it immediately:\n\n" + hookName + "(() => {\n" + "  async function fetchData() {\n" + "    // You can await here\n" + "    const response = await MyAPI.getData(someId);\n" + "    // ...\n" + "  }\n" + "  fetchData();\n" + "}, [someId]); // Or [] if effect doesn't need props or state\n\n" + "Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching";
                        }
                        else {
                            addendum = " You returned: " + destroy;
                        }
                        console.error("%s must not return anything besides a function, " + "which is used for clean-up.%s", hookName, addendum);
                    }
                }
            }
            effect = effect.next;
        } while (effect !== firstEffect);
    }
}
exports.commitHookEffectListMount = commitHookEffectListMount;
