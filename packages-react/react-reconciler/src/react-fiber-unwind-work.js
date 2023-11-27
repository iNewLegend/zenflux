"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwindInterruptedWork = exports.unwindWork = void 0;
var react_feature_flags_1 = require("@zenflux/react-shared/src/react-feature-flags");
var react_fiber_tracing_marker_component_1 = require("@zenflux/react-reconciler/src/react-fiber-tracing-marker-component");
var react_work_tags_1 = require("@zenflux/react-reconciler/src/react-work-tags");
var react_fiber_flags_1 = require("@zenflux/react-reconciler/src/react-fiber-flags");
var react_type_of_mode_1 = require("@zenflux/react-reconciler/src/react-type-of-mode");
var react_fiber_host_context_1 = require("@zenflux/react-reconciler/src/react-fiber-host-context");
var react_fiber_suspense_context_1 = require("@zenflux/react-reconciler/src/react-fiber-suspense-context");
var react_fiber_hidden_context_1 = require("@zenflux/react-reconciler/src/react-fiber-hidden-context");
var react_fiber_hydration_context_1 = require("@zenflux/react-reconciler/src/react-fiber-hydration-context");
var react_fiber_new_context_1 = require("@zenflux/react-reconciler/src/react-fiber-new-context");
var react_profile_timer_1 = require("@zenflux/react-reconciler/src/react-profile-timer");
var react_fiber_tree_context_1 = require("@zenflux/react-reconciler/src/react-fiber-tree-context");
var react_fiber_transition_1 = require("@zenflux/react-reconciler/src/react-fiber-transition");
var react_fiber_context_1 = require("@zenflux/react-reconciler/src/react-fiber-context");
var react_fiber_cache_component_provider_1 = require("@zenflux/react-reconciler/src/react-fiber-cache-component-provider");
function unwindWork(current, workInProgress, renderLanes) {
    // Note: This intentionally doesn't check if we're hydrating because comparing
    // to the current tree provider fiber is just as fast and less error-prone.
    // Ideally we would have a special version of the work loop only
    // for hydration.
    (0, react_fiber_tree_context_1.popTreeContext)(workInProgress);
    switch (workInProgress.tag) {
        case react_work_tags_1.ClassComponent: {
            var Component = workInProgress.type;
            if ((0, react_fiber_context_1.isContextProvider)(Component)) {
                (0, react_fiber_context_1.popContext)(workInProgress);
            }
            var flags = workInProgress.flags;
            if (flags & react_fiber_flags_1.ShouldCapture) {
                workInProgress.flags = flags & ~react_fiber_flags_1.ShouldCapture | react_fiber_flags_1.DidCapture;
                if (react_feature_flags_1.enableProfilerTimer && (workInProgress.mode & react_type_of_mode_1.ProfileMode) !== react_type_of_mode_1.NoMode) {
                    (0, react_profile_timer_1.transferActualDuration)(workInProgress);
                }
                return workInProgress;
            }
            return null;
        }
        case react_work_tags_1.HostRoot: {
            var root = workInProgress.stateNode;
            if (react_feature_flags_1.enableCache) {
                var cache = workInProgress.memoizedState.cache;
                (0, react_fiber_cache_component_provider_1.popCacheProvider)(workInProgress, cache);
            }
            if (react_feature_flags_1.enableTransitionTracing) {
                (0, react_fiber_tracing_marker_component_1.popRootMarkerInstance)(workInProgress);
            }
            (0, react_fiber_transition_1.popRootTransition)(workInProgress, root, renderLanes);
            (0, react_fiber_host_context_1.popHostContainer)(workInProgress);
            (0, react_fiber_context_1.popTopLevelContextObject)(workInProgress);
            var flags = workInProgress.flags;
            if ((flags & react_fiber_flags_1.ShouldCapture) !== react_fiber_flags_1.NoFlags && (flags & react_fiber_flags_1.DidCapture) === react_fiber_flags_1.NoFlags) {
                // There was an error during render that wasn't captured by a suspense
                // boundary. Do a second pass on the root to unmount the children.
                workInProgress.flags = flags & ~react_fiber_flags_1.ShouldCapture | react_fiber_flags_1.DidCapture;
                return workInProgress;
            }
            // We unwound to the root without completing it. Exit.
            return null;
        }
        case react_work_tags_1.HostHoistable:
        case react_work_tags_1.HostSingleton:
        case react_work_tags_1.HostComponent: {
            // TODO: popHydrationState
            (0, react_fiber_host_context_1.popHostContext)(workInProgress);
            return null;
        }
        case react_work_tags_1.SuspenseComponent: {
            (0, react_fiber_suspense_context_1.popSuspenseHandler)(workInProgress);
            var suspenseState = workInProgress.memoizedState;
            if (suspenseState !== null && suspenseState.dehydrated !== null) {
                if (workInProgress.alternate === null) {
                    throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in " + "React. Please file an issue.");
                }
                (0, react_fiber_hydration_context_1.resetHydrationState)();
            }
            var flags = workInProgress.flags;
            if (flags & react_fiber_flags_1.ShouldCapture) {
                workInProgress.flags = flags & ~react_fiber_flags_1.ShouldCapture | react_fiber_flags_1.DidCapture;
                // Captured a suspense effect. Re-render the boundary.
                if (react_feature_flags_1.enableProfilerTimer && (workInProgress.mode & react_type_of_mode_1.ProfileMode) !== react_type_of_mode_1.NoMode) {
                    (0, react_profile_timer_1.transferActualDuration)(workInProgress);
                }
                return workInProgress;
            }
            return null;
        }
        case react_work_tags_1.SuspenseListComponent: {
            (0, react_fiber_suspense_context_1.popSuspenseListContext)(workInProgress);
            // SuspenseList doesn't actually catch anything. It should've been
            // caught by a nested boundary. If not, it should bubble through.
            return null;
        }
        case react_work_tags_1.HostPortal:
            (0, react_fiber_host_context_1.popHostContainer)(workInProgress);
            return null;
        case react_work_tags_1.ContextProvider:
            var context = workInProgress.type._context;
            (0, react_fiber_new_context_1.popProvider)(context, workInProgress);
            return null;
        case react_work_tags_1.OffscreenComponent:
        case react_work_tags_1.LegacyHiddenComponent: {
            (0, react_fiber_suspense_context_1.popSuspenseHandler)(workInProgress);
            (0, react_fiber_hidden_context_1.popHiddenContext)(workInProgress);
            (0, react_fiber_transition_1.popTransition)(workInProgress, current);
            var flags = workInProgress.flags;
            if (flags & react_fiber_flags_1.ShouldCapture) {
                workInProgress.flags = flags & ~react_fiber_flags_1.ShouldCapture | react_fiber_flags_1.DidCapture;
                // Captured a suspense effect. Re-render the boundary.
                if (react_feature_flags_1.enableProfilerTimer && (workInProgress.mode & react_type_of_mode_1.ProfileMode) !== react_type_of_mode_1.NoMode) {
                    (0, react_profile_timer_1.transferActualDuration)(workInProgress);
                }
                return workInProgress;
            }
            return null;
        }
        case react_work_tags_1.CacheComponent:
            if (react_feature_flags_1.enableCache) {
                var cache = workInProgress.memoizedState.cache;
                (0, react_fiber_cache_component_provider_1.popCacheProvider)(workInProgress, cache);
            }
            return null;
        case react_work_tags_1.TracingMarkerComponent:
            if (react_feature_flags_1.enableTransitionTracing) {
                if (workInProgress.stateNode !== null) {
                    (0, react_fiber_tracing_marker_component_1.popMarkerInstance)(workInProgress);
                }
            }
            return null;
        default:
            return null;
    }
}
exports.unwindWork = unwindWork;
function unwindInterruptedWork(current, interruptedWork, renderLanes) {
    // Note: This intentionally doesn't check if we're hydrating because comparing
    // to the current tree provider fiber is just as fast and less error-prone.
    // Ideally we would have a special version of the work loop only
    // for hydration.
    (0, react_fiber_tree_context_1.popTreeContext)(interruptedWork);
    switch (interruptedWork.tag) {
        case react_work_tags_1.ClassComponent: {
            var childContextTypes = interruptedWork.type.childContextTypes;
            if (childContextTypes !== null && childContextTypes !== undefined) {
                (0, react_fiber_context_1.popContext)(interruptedWork);
            }
            break;
        }
        case react_work_tags_1.HostRoot: {
            var root = interruptedWork.stateNode;
            if (react_feature_flags_1.enableCache) {
                var cache = interruptedWork.memoizedState.cache;
                (0, react_fiber_cache_component_provider_1.popCacheProvider)(interruptedWork, cache);
            }
            if (react_feature_flags_1.enableTransitionTracing) {
                (0, react_fiber_tracing_marker_component_1.popRootMarkerInstance)(interruptedWork);
            }
            (0, react_fiber_transition_1.popRootTransition)(interruptedWork, root, renderLanes);
            (0, react_fiber_host_context_1.popHostContainer)(interruptedWork);
            (0, react_fiber_context_1.popTopLevelContextObject)(interruptedWork);
            break;
        }
        case react_work_tags_1.HostHoistable:
        case react_work_tags_1.HostSingleton:
        case react_work_tags_1.HostComponent: {
            (0, react_fiber_host_context_1.popHostContext)(interruptedWork);
            break;
        }
        case react_work_tags_1.HostPortal:
            (0, react_fiber_host_context_1.popHostContainer)(interruptedWork);
            break;
        case react_work_tags_1.SuspenseComponent:
            (0, react_fiber_suspense_context_1.popSuspenseHandler)(interruptedWork);
            break;
        case react_work_tags_1.SuspenseListComponent:
            (0, react_fiber_suspense_context_1.popSuspenseListContext)(interruptedWork);
            break;
        case react_work_tags_1.ContextProvider:
            var context = interruptedWork.type._context;
            (0, react_fiber_new_context_1.popProvider)(context, interruptedWork);
            break;
        case react_work_tags_1.OffscreenComponent:
        case react_work_tags_1.LegacyHiddenComponent:
            (0, react_fiber_suspense_context_1.popSuspenseHandler)(interruptedWork);
            (0, react_fiber_hidden_context_1.popHiddenContext)(interruptedWork);
            (0, react_fiber_transition_1.popTransition)(interruptedWork, current);
            break;
        case react_work_tags_1.CacheComponent:
            if (react_feature_flags_1.enableCache) {
                var cache = interruptedWork.memoizedState.cache;
                (0, react_fiber_cache_component_provider_1.popCacheProvider)(interruptedWork, cache);
            }
            break;
        case react_work_tags_1.TracingMarkerComponent:
            if (react_feature_flags_1.enableTransitionTracing) {
                var instance = interruptedWork.stateNode;
                if (instance !== null) {
                    (0, react_fiber_tracing_marker_component_1.popMarkerInstance)(interruptedWork);
                }
            }
            break;
        default:
            break;
    }
}
exports.unwindInterruptedWork = unwindInterruptedWork;
