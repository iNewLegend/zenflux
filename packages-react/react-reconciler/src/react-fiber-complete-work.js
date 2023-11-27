"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeWork = void 0;
var react_scheduler_1 = require("@zenflux/react-scheduler");
var react_feature_flags_1 = require("@zenflux/react-shared/src/react-feature-flags");
var react_fiber_child_1 = require("@zenflux/react-reconciler/src/react-fiber-child");
var react_fiber_activity_component_1 = require("@zenflux/react-reconciler/src/react-fiber-activity-component");
var react_fiber_cache_component_provider_1 = require("@zenflux/react-reconciler/src/react-fiber-cache-component-provider");
var react_fiber_hydration_context_1 = require("@zenflux/react-reconciler/src/react-fiber-hydration-context");
var react_fiber_hydration_is_hydrating_1 = require("@zenflux/react-reconciler/src/react-fiber-hydration-is-hydrating");
var react_fiber_lane_constants_1 = require("@zenflux/react-reconciler/src/react-fiber-lane-constants");
var react_fiber_work_in_progress_1 = require("@zenflux/react-reconciler/src/react-fiber-work-in-progress");
var react_fiber_work_in_progress_ping_1 = require("@zenflux/react-reconciler/src/react-fiber-work-in-progress-ping");
var react_fiber_work_loop_should_on_previous_screen_1 = require("@zenflux/react-reconciler/src/react-fiber-work-loop-should-on-previous-screen");
var react_fiber_context_1 = require("@zenflux/react-reconciler/src/react-fiber-context");
var react_fiber_flags_1 = require("@zenflux/react-reconciler/src/react-fiber-flags");
var react_fiber_hidden_context_1 = require("@zenflux/react-reconciler/src/react-fiber-hidden-context");
var react_fiber_host_context_1 = require("@zenflux/react-reconciler/src/react-fiber-host-context");
var react_fiber_lane_1 = require("@zenflux/react-reconciler/src/react-fiber-lane");
var react_fiber_new_context_1 = require("@zenflux/react-reconciler/src/react-fiber-new-context");
var react_fiber_scope_1 = require("@zenflux/react-reconciler/src/react-fiber-scope");
var react_fiber_suspense_component_1 = require("@zenflux/react-reconciler/src/react-fiber-suspense-component");
var react_fiber_suspense_context_1 = require("@zenflux/react-reconciler/src/react-fiber-suspense-context");
var react_fiber_thenable_1 = require("@zenflux/react-reconciler/src/react-fiber-thenable");
var react_fiber_tracing_marker_component_1 = require("@zenflux/react-reconciler/src/react-fiber-tracing-marker-component");
var react_fiber_transition_1 = require("@zenflux/react-reconciler/src/react-fiber-transition");
var react_fiber_tree_context_1 = require("@zenflux/react-reconciler/src/react-fiber-tree-context");
var react_fiber_work_loop_1 = require("@zenflux/react-reconciler/src/react-fiber-work-loop");
var react_profile_timer_1 = require("@zenflux/react-reconciler/src/react-profile-timer");
var react_type_of_mode_1 = require("@zenflux/react-reconciler/src/react-type-of-mode");
var react_work_tags_1 = require("@zenflux/react-reconciler/src/react-work-tags");
var _a = globalThis.__RECONCILER__CONFIG__, appendChildToContainerChildSet = _a.appendChildToContainerChildSet, appendInitialChild = _a.appendInitialChild, cloneHiddenInstance = _a.cloneHiddenInstance, cloneHiddenTextInstance = _a.cloneHiddenTextInstance, cloneInstance = _a.cloneInstance, createContainerChildSet = _a.createContainerChildSet, createInstance = _a.createInstance, createTextInstance = _a.createTextInstance, finalizeContainerChildren = _a.finalizeContainerChildren, finalizeInitialChildren = _a.finalizeInitialChildren, mayResourceSuspendCommit = _a.mayResourceSuspendCommit, maySuspendCommit = _a.maySuspendCommit, preloadInstance = _a.preloadInstance, preloadResource = _a.preloadResource, preparePortalMount = _a.preparePortalMount, prepareScopeUpdate = _a.prepareScopeUpdate, resolveSingletonInstance = _a.resolveSingletonInstance, supportsMutation = _a.supportsMutation, supportsPersistence = _a.supportsPersistence, supportsResources = _a.supportsResources, supportsSingletons = _a.supportsSingletons;
function markUpdate(workInProgress) {
    // Tag the fiber with an update effect. This turns a Placement into
    // a PlacementAndUpdate.
    workInProgress.flags |= react_fiber_flags_1.Update;
}
function markRef(workInProgress) {
    workInProgress.flags |= react_fiber_flags_1.Ref | react_fiber_flags_1.RefStatic;
}
function hadNoMutationsEffects(current, completedWork) {
    var didBailout = current !== null && current.child === completedWork.child;
    if (didBailout) {
        return true;
    }
    if ((completedWork.flags & react_fiber_flags_1.ChildDeletion) !== react_fiber_flags_1.NoFlags) {
        return false;
    }
    // TODO: If we move the `hadNoMutationsEffects` call after `bubbleProperties`
    // then we only have to check the `completedWork.subtreeFlags`.
    var child = completedWork.child;
    while (child !== null) {
        if ((child.flags & react_fiber_flags_1.MutationMask) !== react_fiber_flags_1.NoFlags || (child.subtreeFlags & react_fiber_flags_1.MutationMask) !== react_fiber_flags_1.NoFlags) {
            return false;
        }
        child = child.sibling;
    }
    return true;
}
function appendAllChildren(parent, workInProgress, needsVisibilityToggle, isHidden) {
    if (supportsMutation) {
        // We only have the top Fiber that was created but we need recurse down its
        // children to find all the terminal nodes.
        var node = workInProgress.child;
        while (node !== null) {
            if (node.tag === react_work_tags_1.HostComponent || node.tag === react_work_tags_1.HostText) {
                appendInitialChild(parent, node.stateNode);
            }
            else if (node.tag === react_work_tags_1.HostPortal || (react_feature_flags_1.enableHostSingletons && supportsSingletons ? node.tag === react_work_tags_1.HostSingleton : false)) { // If we have a portal child, then we don't want to traverse
                // down its children. Instead, we'll get insertions from each child in
                // the portal directly.
                // If we have a HostSingleton it will be placed independently
            }
            else if (node.child !== null) {
                node.child.return = node;
                node = node.child;
                continue;
            }
            if (node === workInProgress) {
                return;
            }
            // $FlowFixMe[incompatible-use] found when upgrading Flow
            while (node.sibling === null) {
                // $FlowFixMe[incompatible-use] found when upgrading Flow
                if (node.return === null || node.return === workInProgress) {
                    return;
                }
                node = node.return;
            }
            // $FlowFixMe[incompatible-use] found when upgrading Flow
            node.sibling.return = node.return;
            node = node.sibling;
        }
    }
    else if (supportsPersistence) {
        // We only have the top Fiber that was created but we need recurse down its
        // children to find all the terminal nodes.
        var node = workInProgress.child;
        while (node !== null) {
            if (node.tag === react_work_tags_1.HostComponent) {
                var instance = node.stateNode;
                if (needsVisibilityToggle && isHidden) {
                    // This child is inside a timed out tree. Hide it.
                    var props = node.memoizedProps;
                    var type = node.type;
                    instance = cloneHiddenInstance(instance, type, props);
                }
                appendInitialChild(parent, instance);
            }
            else if (node.tag === react_work_tags_1.HostText) {
                var instance = node.stateNode;
                if (needsVisibilityToggle && isHidden) {
                    // This child is inside a timed out tree. Hide it.
                    var text = node.memoizedProps;
                    instance = cloneHiddenTextInstance(instance, text);
                }
                appendInitialChild(parent, instance);
            }
            else if (node.tag === react_work_tags_1.HostPortal) { // If we have a portal child, then we don't want to traverse
                // down its children. Instead, we'll get insertions from each child in
                // the portal directly.
            }
            else if (node.tag === react_work_tags_1.OffscreenComponent && node.memoizedState !== null) {
                // The children in this boundary are hidden. Toggle their visibility
                // before appending.
                var child = node.child;
                if (child !== null) {
                    child.return = node;
                }
                appendAllChildren(parent, node, 
                /* needsVisibilityToggle */
                true, 
                /* isHidden */
                true);
            }
            else if (node.child !== null) {
                node.child.return = node;
                node = node.child;
                continue;
            }
            node = node;
            if (node === workInProgress) {
                return;
            }
            // $FlowFixMe[incompatible-use] found when upgrading Flow
            while (node.sibling === null) {
                // $FlowFixMe[incompatible-use] found when upgrading Flow
                if (node.return === null || node.return === workInProgress) {
                    return;
                }
                node = node.return;
            }
            // $FlowFixMe[incompatible-use] found when upgrading Flow
            node.sibling.return = node.return;
            node = node.sibling;
        }
    }
}
// An unfortunate fork of appendAllChildren because we have two different parent types.
function appendAllChildrenToContainer(containerChildSet, workInProgress, needsVisibilityToggle, isHidden) {
    if (supportsPersistence) {
        // We only have the top Fiber that was created but we need recurse down its
        // children to find all the terminal nodes.
        var node = workInProgress.child;
        while (node !== null) {
            // eslint-disable-next-line no-labels
            if (node.tag === react_work_tags_1.HostComponent) {
                var instance = node.stateNode;
                if (needsVisibilityToggle && isHidden) {
                    // This child is inside a timed out tree. Hide it.
                    var props = node.memoizedProps;
                    var type = node.type;
                    instance = cloneHiddenInstance(instance, type, props);
                }
                appendChildToContainerChildSet(containerChildSet, instance);
            }
            else if (node.tag === react_work_tags_1.HostText) {
                var instance = node.stateNode;
                if (needsVisibilityToggle && isHidden) {
                    // This child is inside a timed out tree. Hide it.
                    var text = node.memoizedProps;
                    instance = cloneHiddenTextInstance(instance, text);
                }
                appendChildToContainerChildSet(containerChildSet, instance);
            }
            else if (node.tag === react_work_tags_1.HostPortal) { // If we have a portal child, then we don't want to traverse
                // down its children. Instead, we'll get insertions from each child in
                // the portal directly.
            }
            else if (node.tag === react_work_tags_1.OffscreenComponent && node.memoizedState !== null) {
                // The children in this boundary are hidden. Toggle their visibility
                // before appending.
                var child = node.child;
                if (child !== null) {
                    child.return = node;
                }
                // If Offscreen is not in manual mode, detached tree is hidden from user space.
                var _needsVisibilityToggle = !(0, react_fiber_activity_component_1.isOffscreenManual)(node);
                appendAllChildrenToContainer(containerChildSet, node, 
                /* needsVisibilityToggle */
                _needsVisibilityToggle, 
                /* isHidden */
                true);
            }
            else if (node.child !== null) {
                node.child.return = node;
                node = node.child;
                continue;
            }
            node = node;
            if (node === workInProgress) {
                return;
            }
            // $FlowFixMe[incompatible-use] found when upgrading Flow
            while (node.sibling === null) {
                // $FlowFixMe[incompatible-use] found when upgrading Flow
                if (node.return === null || node.return === workInProgress) {
                    return;
                }
                node = node.return;
            }
            // $FlowFixMe[incompatible-use] found when upgrading Flow
            node.sibling.return = node.return;
            node = node.sibling;
        }
    }
}
function updateHostContainer(current, workInProgress) {
    if (supportsPersistence) {
        var portalOrRoot = workInProgress.stateNode;
        var childrenUnchanged = hadNoMutationsEffects(current, workInProgress);
        if (childrenUnchanged) { // No changes, just reuse the existing instance.
        }
        else {
            var container = portalOrRoot.containerInfo;
            var newChildSet = createContainerChildSet();
            // If children might have changed, we have to add them all to the set.
            appendAllChildrenToContainer(newChildSet, workInProgress, 
            /* needsVisibilityToggle */
            false, 
            /* isHidden */
            false);
            portalOrRoot.pendingChildren = newChildSet;
            // Schedule an update on the container to swap out the container.
            markUpdate(workInProgress);
            finalizeContainerChildren(container, newChildSet);
        }
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateHostComponent(current, workInProgress, type, newProps, renderLanes) {
    if (supportsMutation) {
        // If we have an alternate, that means this is an update and we need to
        // schedule a side effect to do the updates.
        var oldProps = current.memoizedProps;
        if (oldProps === newProps) {
            // In mutation mode, this is sufficient for a bailout because
            // we won't touch this node even if children changed.
            return;
        }
        markUpdate(workInProgress);
    }
    else if (supportsPersistence) {
        var currentInstance = current.stateNode;
        var oldProps = current.memoizedProps;
        // If there are no effects associated with this node, then none of our children had any updates.
        // This guarantees that we can reuse all of them.
        var childrenUnchanged = hadNoMutationsEffects(current, workInProgress);
        if (childrenUnchanged && oldProps === newProps) {
            // No changes, just reuse the existing instance.
            // Note that this might release a previous clone.
            workInProgress.stateNode = currentInstance;
            return;
        }
        var currentHostContext = (0, react_fiber_host_context_1.getHostContext)();
        var newChildSet = null;
        if (!childrenUnchanged && react_feature_flags_1.passChildrenWhenCloningPersistedNodes) {
            newChildSet = createContainerChildSet();
            // If children might have changed, we have to add them all to the set.
            appendAllChildrenToContainer(newChildSet, workInProgress, 
            /* needsVisibilityToggle */
            false, 
            /* isHidden */
            false);
        }
        var newInstance = cloneInstance(currentInstance, type, oldProps, newProps, childrenUnchanged, newChildSet);
        if (newInstance === currentInstance) {
            // No changes, just reuse the existing instance.
            // Note that this might release a previous clone.
            workInProgress.stateNode = currentInstance;
            return;
        }
        // Certain renderers require commit-time effects for initial mount.
        // (eg DOM renderer supports auto-focus for certain elements).
        // Make sure such renderers get scheduled for later work.
        if (finalizeInitialChildren(newInstance, type, newProps, currentHostContext)) {
            markUpdate(workInProgress);
        }
        workInProgress.stateNode = newInstance;
        if (childrenUnchanged) {
            // If there are no other effects in this tree, we need to flag this node as having one.
            // Even though we're not going to use it for anything.
            // Otherwise parents won't know that there are new children to propagate upwards.
            markUpdate(workInProgress);
        }
        else if (!react_feature_flags_1.passChildrenWhenCloningPersistedNodes) {
            // If children might have changed, we have to add them all to the set.
            appendAllChildren(newInstance, workInProgress, 
            /* needsVisibilityToggle */
            false, 
            /* isHidden */
            false);
        }
    }
}
// This function must be called at the very end of the complete phase, because
// it might throw to suspend, and if the resource immediately loads, the work
// loop will resume rendering as if the work-in-progress completed. So it must
// fully complete.
// TODO: This should ideally move to begin phase, but currently the instance is
// not created until the complete phase. For our existing use cases, host nodes
// that suspend don't have children, so it doesn't matter. But that might not
// always be true in the future.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function preloadInstanceAndSuspendIfNeeded(workInProgress, type, props, renderLanes) {
    if (!maySuspendCommit(type, props)) {
        // If this flag was set previously, we can remove it. The flag
        // represents whether this particular set of props might ever need to
        // suspend. The safest thing to do is for maySuspendCommit to always
        // return true, but if the renderer is reasonably confident that the
        // underlying resource won't be evicted, it can return false as a
        // performance optimization.
        workInProgress.flags &= ~react_fiber_flags_1.MaySuspendCommit;
        return;
    }
    // Mark this fiber with a flag. This gets set on all host instances
    // that might possibly suspend, even if they don't need to suspend
    // currently. We use this when revealing a prerendered tree, because
    // even though the tree has "mounted", its resources might not have
    // loaded yet.
    workInProgress.flags |= react_fiber_flags_1.MaySuspendCommit;
    // Check if we're rendering at a "non-urgent" priority. This is the same
    // check that `useDeferredValue` does to determine whether it needs to
    // defer. This is partly for gradual adoption purposes (i.e. shouldn't start
    // suspending until you opt in with startTransition or Suspense) but it
    // also happens to be the desired behavior for the concrete use cases we've
    // thought of so far, like CSS loading, fonts, images, etc.
    //
    // We check the "root" render lanes here rather than the "subtree" render
    // because during a retry or offscreen prerender, the "subtree" render
    // lanes may include additional "base" lanes that were deferred during
    // a previous render.
    // TODO: We may decide to expose a way to force a fallback even during a
    // sync update.
    var rootRenderLanes = (0, react_fiber_work_in_progress_1.getWorkInProgressRootRenderLanes)();
    if (!(0, react_fiber_lane_constants_1.includesOnlyNonUrgentLanes)(rootRenderLanes)) { // This is an urgent render. Don't suspend or show a fallback. Also,
        // there's no need to preload, because we're going to commit this
        // synchronously anyway.
        // TODO: Could there be benefit to preloading even during a synchronous
        // render? The main thread will be blocked until the commit phase, but
        // maybe the browser would be able to start loading off thread anyway?
        // Likely a micro-optimization either way because typically new content
        // is loaded during a transition, not an urgent render.
    }
    else {
        // Preload the instance
        var isReady = preloadInstance(type, props);
        if (!isReady) {
            if ((0, react_fiber_work_loop_should_on_previous_screen_1.shouldRemainOnPreviousScreen)()) {
                // It's OK to suspend. Mark the fiber so we know to suspend before the
                // commit phase. Then continue rendering.
                workInProgress.flags |= react_fiber_flags_1.ShouldSuspendCommit;
            }
            else {
                // Trigger a fallback rather than block the render.
                (0, react_fiber_thenable_1.suspendCommit)();
            }
        }
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function preloadResourceAndSuspendIfNeeded(workInProgress, resource, type, props, renderLanes) {
    // This is a fork of preloadInstanceAndSuspendIfNeeded, but for resources.
    if (!mayResourceSuspendCommit(resource)) {
        workInProgress.flags &= ~react_fiber_flags_1.MaySuspendCommit;
        return;
    }
    workInProgress.flags |= react_fiber_flags_1.MaySuspendCommit;
    var rootRenderLanes = (0, react_fiber_work_in_progress_1.getWorkInProgressRootRenderLanes)();
    if (!(0, react_fiber_lane_constants_1.includesOnlyNonUrgentLanes)(rootRenderLanes)) { // This is an urgent render. Don't suspend or show a fallback.
    }
    else {
        var isReady = preloadResource(resource);
        if (!isReady) {
            if ((0, react_fiber_work_loop_should_on_previous_screen_1.shouldRemainOnPreviousScreen)()) {
                workInProgress.flags |= react_fiber_flags_1.ShouldSuspendCommit;
            }
            else {
                (0, react_fiber_thenable_1.suspendCommit)();
            }
        }
    }
}
function scheduleRetryEffect(workInProgress, retryQueue) {
    var wakeables = retryQueue;
    if (wakeables !== null) {
        // Schedule an effect to attach a retry listener to the promise.
        // TODO: Move to passive phase
        workInProgress.flags |= react_fiber_flags_1.Update;
    }
    else {
        // This boundary suspended, but no wakeables were added to the retry
        // queue. Check if the renderer suspended commit. If so, this means
        // that once the fallback is committed, we can immediately retry
        // rendering again, because rendering wasn't actually blocked. Only
        // the commit phase.
        // TODO: Consider a model where we always schedule an immediate retry, even
        // for normal Suspense. That way the retry can partially render up to the
        // first thing that suspends.
        if (workInProgress.flags & react_fiber_flags_1.ScheduleRetry) {
            var retryLane = // TODO: This check should probably be moved into claimNextRetryLane
             
            // I also suspect that we need some further consolidation of offscreen
            // and retry lanes.
            workInProgress.tag !== react_work_tags_1.OffscreenComponent ? (0, react_fiber_lane_1.claimNextRetryLane)() : react_fiber_lane_constants_1.OffscreenLane;
            workInProgress.lanes = (0, react_fiber_lane_1.mergeLanes)(workInProgress.lanes, retryLane);
        }
    }
}
function updateHostText(current, workInProgress, oldText, newText) {
    if (supportsMutation) {
        // If the text differs, mark it as an update. All the work in done in commitWork.
        if (oldText !== newText) {
            markUpdate(workInProgress);
        }
    }
    else if (supportsPersistence) {
        if (oldText !== newText) {
            // If the text content differs, we'll create a new text instance for it.
            var rootContainerInstance = (0, react_fiber_host_context_1.getRootHostContainer)();
            var currentHostContext = (0, react_fiber_host_context_1.getHostContext)();
            workInProgress.stateNode = createTextInstance(newText, rootContainerInstance, currentHostContext, workInProgress);
            // We'll have to mark it as having an effect, even though we won't use the effect for anything.
            // This lets the parents know that at least one of their children has changed.
            markUpdate(workInProgress);
        }
        else {
            workInProgress.stateNode = current.stateNode;
        }
    }
}
function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
    if ((0, react_fiber_hydration_is_hydrating_1.isHydrating)()) {
        // If we're hydrating, we should consume as many items as we can
        // so we don't leave any behind.
        return;
    }
    switch (renderState.tailMode) {
        case "hidden": {
            // Any insertions at the end of the tail list after this point
            // should be invisible. If there are already mounted boundaries
            // anything before them are not considered for collapsing.
            // Therefore we need to go through the whole tail to find if
            // there are any.
            var tailNode = renderState.tail;
            var lastTailNode = null;
            while (tailNode !== null) {
                if (tailNode.alternate !== null) {
                    lastTailNode = tailNode;
                }
                tailNode = tailNode.sibling;
            }
            // Next we're simply going to delete all insertions after the
            // last rendered item.
            if (lastTailNode === null) {
                // All remaining items in the tail are insertions.
                renderState.tail = null;
            }
            else {
                // Detach the insertion after the last node that was already
                // inserted.
                lastTailNode.sibling = null;
            }
            break;
        }
        case "collapsed": {
            // Any insertions at the end of the tail list after this point
            // should be invisible. If there are already mounted boundaries
            // anything before them are not considered for collapsing.
            // Therefore we need to go through the whole tail to find if
            // there are any.
            var tailNode = renderState.tail;
            var lastTailNode = null;
            while (tailNode !== null) {
                if ((tailNode).alternate !== null) {
                    lastTailNode = tailNode;
                }
                tailNode = tailNode.sibling;
            }
            // Next we're simply going to delete all insertions after the
            // last rendered item.
            if (lastTailNode === null) {
                // All remaining items in the tail are insertions.
                if (!hasRenderedATailFallback && renderState.tail !== null) {
                    // We suspended during the head. We want to show at least one
                    // row at the tail. So we'll keep on and cut off the rest.
                    renderState.tail.sibling = null;
                }
                else {
                    renderState.tail = null;
                }
            }
            else {
                // Detach the insertion after the last node that was already
                // inserted.
                lastTailNode.sibling = null;
            }
            break;
        }
    }
}
function bubbleProperties(completedWork) {
    var didBailout = completedWork.alternate !== null && completedWork.alternate.child === completedWork.child;
    var newChildLanes = react_fiber_lane_constants_1.NoLanes;
    var subtreeFlags = react_fiber_flags_1.NoFlags;
    if (!didBailout) {
        // Bubble up the earliest expiration time.
        if (react_feature_flags_1.enableProfilerTimer && (completedWork.mode & react_type_of_mode_1.ProfileMode) !== react_type_of_mode_1.NoMode) {
            // In profiling mode, resetChildExpirationTime is also used to reset
            // profiler durations.
            var actualDuration = completedWork.actualDuration;
            var treeBaseDuration = completedWork.selfBaseDuration;
            var child = completedWork.child;
            while (child !== null) {
                newChildLanes = (0, react_fiber_lane_1.mergeLanes)(newChildLanes, (0, react_fiber_lane_1.mergeLanes)(child.lanes, child.childLanes));
                subtreeFlags |= child.subtreeFlags;
                subtreeFlags |= child.flags;
                // When a fiber is cloned, its actualDuration is reset to 0. This value will
                // only be updated if work is done on the fiber (i.e. it doesn't bailout).
                // When work is done, it should bubble to the parent's actualDuration. If
                // the fiber has not been cloned though, (meaning no work was done), then
                // this value will reflect the amount of time spent working on a previous
                // render. In that case it should not bubble. We determine whether it was
                // cloned by comparing the child pointer.
                // $FlowFixMe[unsafe-addition] addition with possible null/undefined value
                // @ts-ignore
                actualDuration += child.actualDuration;
                // $FlowFixMe[unsafe-addition] addition with possible null/undefined value
                // @ts-ignore
                treeBaseDuration += child.treeBaseDuration;
                child = child.sibling;
            }
            completedWork.actualDuration = actualDuration;
            completedWork.treeBaseDuration = treeBaseDuration;
        }
        else {
            var child = completedWork.child;
            while (child !== null) {
                newChildLanes = (0, react_fiber_lane_1.mergeLanes)(newChildLanes, (0, react_fiber_lane_1.mergeLanes)(child.lanes, child.childLanes));
                subtreeFlags |= child.subtreeFlags;
                subtreeFlags |= child.flags;
                // Update the return pointer so the tree is consistent. This is a code
                // smell because it assumes the commit phase is never concurrent with
                // the render phase. Will address during refactor to alternate model.
                child.return = completedWork;
                child = child.sibling;
            }
        }
        completedWork.subtreeFlags |= subtreeFlags;
    }
    else {
        // Bubble up the earliest expiration time.
        if (react_feature_flags_1.enableProfilerTimer && (completedWork.mode & react_type_of_mode_1.ProfileMode) !== react_type_of_mode_1.NoMode) {
            // In profiling mode, resetChildExpirationTime is also used to reset
            // profiler durations.
            var treeBaseDuration = completedWork.selfBaseDuration;
            var child = completedWork.child;
            while (child !== null) {
                newChildLanes = (0, react_fiber_lane_1.mergeLanes)(newChildLanes, (0, react_fiber_lane_1.mergeLanes)(child.lanes, child.childLanes));
                // "Static" flags share the lifetime of the fiber/hook they belong to,
                // so we should bubble those up even during a bailout. All the other
                // flags have a lifetime only of a single render + commit, so we should
                // ignore them.
                subtreeFlags |= child.subtreeFlags & react_fiber_flags_1.StaticMask;
                subtreeFlags |= child.flags & react_fiber_flags_1.StaticMask;
                // $FlowFixMe[unsafe-addition] addition with possible null/undefined value
                // @ts-ignore
                treeBaseDuration += child.treeBaseDuration;
                child = child.sibling;
            }
            completedWork.treeBaseDuration = treeBaseDuration;
        }
        else {
            var child = completedWork.child;
            while (child !== null) {
                newChildLanes = (0, react_fiber_lane_1.mergeLanes)(newChildLanes, (0, react_fiber_lane_1.mergeLanes)(child.lanes, child.childLanes));
                // "Static" flags share the lifetime of the fiber/hook they belong to,
                // so we should bubble those up even during a bailout. All the other
                // flags have a lifetime only of a single render + commit, so we should
                // ignore them.
                subtreeFlags |= child.subtreeFlags & react_fiber_flags_1.StaticMask;
                subtreeFlags |= child.flags & react_fiber_flags_1.StaticMask;
                // Update the return pointer so the tree is consistent. This is a code
                // smell because it assumes the commit phase is never concurrent with
                // the render phase. Will address during refactor to alternate model.
                child.return = completedWork;
                child = child.sibling;
            }
        }
        completedWork.subtreeFlags |= subtreeFlags;
    }
    completedWork.childLanes = newChildLanes;
    return didBailout;
}
function completeDehydratedSuspenseBoundary(current, workInProgress, nextState) {
    if ((0, react_fiber_hydration_context_1.hasUnhydratedTailNodes)() && (workInProgress.mode & react_type_of_mode_1.ConcurrentMode) !== react_type_of_mode_1.NoMode && (workInProgress.flags & react_fiber_flags_1.DidCapture) === react_fiber_flags_1.NoFlags) {
        (0, react_fiber_hydration_context_1.warnIfUnhydratedTailNodes)(workInProgress);
        (0, react_fiber_hydration_context_1.resetHydrationState)();
        workInProgress.flags |= react_fiber_flags_1.ForceClientRender | react_fiber_flags_1.DidCapture;
        return false;
    }
    var wasHydrated = (0, react_fiber_hydration_context_1.popHydrationState)(workInProgress);
    if (nextState !== null && nextState.dehydrated !== null) {
        // We might be inside a hydration state the first time we're picking up this
        // Suspense boundary, and also after we've reentered it for further hydration.
        if (current === null) {
            if (!wasHydrated) {
                throw new Error("A dehydrated suspense component was completed without a hydrated node. " + "This is probably a bug in React.");
            }
            (0, react_fiber_hydration_context_1.prepareToHydrateHostSuspenseInstance)(workInProgress);
            bubbleProperties(workInProgress);
            if (react_feature_flags_1.enableProfilerTimer) {
                if ((workInProgress.mode & react_type_of_mode_1.ProfileMode) !== react_type_of_mode_1.NoMode) {
                    var isTimedOutSuspense = nextState !== null;
                    if (isTimedOutSuspense) {
                        // Don't count time spent in a timed out Suspense subtree as part of the base duration.
                        var primaryChildFragment = workInProgress.child;
                        if (primaryChildFragment !== null) {
                            // $FlowFixMe[unsafe-arithmetic] Flow doesn't support type casting in combination with the -= operator
                            // @ts-ignore
                            workInProgress.treeBaseDuration -= primaryChildFragment.treeBaseDuration;
                        }
                    }
                }
            }
            return false;
        }
        else {
            // We might have reentered this boundary to hydrate it. If so, we need to reset the hydration
            // state since we're now exiting out of it. popHydrationState doesn't do that for us.
            (0, react_fiber_hydration_context_1.resetHydrationState)();
            if ((workInProgress.flags & react_fiber_flags_1.DidCapture) === react_fiber_flags_1.NoFlags) {
                // This boundary did not suspend so it's now hydrated and unsuspended.
                workInProgress.memoizedState = null;
            }
            // If nothing suspended, we need to schedule an effect to mark this boundary
            // as having hydrated so events know that they're free to be invoked.
            // It's also a signal to replay events and the suspense callback.
            // If something suspended, schedule an effect to attach retry listeners.
            // So we might as well always mark this.
            workInProgress.flags |= react_fiber_flags_1.Update;
            bubbleProperties(workInProgress);
            if (react_feature_flags_1.enableProfilerTimer) {
                if ((workInProgress.mode & react_type_of_mode_1.ProfileMode) !== react_type_of_mode_1.NoMode) {
                    var isTimedOutSuspense = nextState !== null;
                    if (isTimedOutSuspense) {
                        // Don't count time spent in a timed out Suspense subtree as part of the base duration.
                        var primaryChildFragment = workInProgress.child;
                        if (primaryChildFragment !== null) {
                            // $FlowFixMe[unsafe-arithmetic] Flow doesn't support type casting in combination with the -= operator
                            // @ts-ignore
                            workInProgress.treeBaseDuration -= primaryChildFragment.treeBaseDuration;
                        }
                    }
                }
            }
            return false;
        }
    }
    else {
        // Successfully completed this tree. If this was a forced client render,
        // there may have been recoverable errors during first hydration
        // attempt. If so, add them to a queue so we can log them in the
        // commit phase.
        (0, react_fiber_hydration_context_1.upgradeHydrationErrorsToRecoverable)();
        // Fall through to normal Suspense path
        return true;
    }
}
function completeWork(current, workInProgress, renderLanes) {
    var newProps = workInProgress.pendingProps;
    // Note: This intentionally doesn't check if we're hydrating because comparing
    // to the current tree provider fiber is just as fast and less error-prone.
    // Ideally we would have a special version of the work loop only
    // for hydration.
    (0, react_fiber_tree_context_1.popTreeContext)(workInProgress);
    switch (workInProgress.tag) {
        case react_work_tags_1.IndeterminateComponent:
        case react_work_tags_1.LazyComponent:
        case react_work_tags_1.SimpleMemoComponent:
        case react_work_tags_1.FunctionComponent:
        case react_work_tags_1.ForwardRef:
        case react_work_tags_1.Fragment:
        case react_work_tags_1.Mode:
        case react_work_tags_1.Profiler:
        case react_work_tags_1.ContextConsumer:
        case react_work_tags_1.MemoComponent:
            bubbleProperties(workInProgress);
            return null;
        case react_work_tags_1.ClassComponent: {
            var Component = workInProgress.type;
            if ((0, react_fiber_context_1.isContextProvider)(Component)) {
                (0, react_fiber_context_1.popContext)(workInProgress);
            }
            bubbleProperties(workInProgress);
            return null;
        }
        case react_work_tags_1.HostRoot: {
            var fiberRoot = workInProgress.stateNode;
            if (react_feature_flags_1.enableTransitionTracing) {
                var transitions = (0, react_fiber_work_in_progress_1.getWorkInProgressTransitions)();
                // We set the Passive flag here because if there are new transitions,
                // we will need to schedule callbacks and process the transitions,
                // which we do in the passive phase
                if (transitions !== null) {
                    workInProgress.flags |= react_fiber_flags_1.Passive;
                }
            }
            if (react_feature_flags_1.enableCache) {
                var previousCache = null;
                if (current !== null) {
                    previousCache = current.memoizedState.cache;
                }
                var cache = workInProgress.memoizedState.cache;
                if (cache !== previousCache) {
                    // Run passive effects to retain/release the cache.
                    workInProgress.flags |= react_fiber_flags_1.Passive;
                }
                (0, react_fiber_cache_component_provider_1.popCacheProvider)(workInProgress, cache);
            }
            if (react_feature_flags_1.enableTransitionTracing) {
                (0, react_fiber_tracing_marker_component_1.popRootMarkerInstance)(workInProgress);
            }
            (0, react_fiber_transition_1.popRootTransition)(workInProgress, fiberRoot, renderLanes);
            (0, react_fiber_host_context_1.popHostContainer)(workInProgress);
            (0, react_fiber_context_1.popTopLevelContextObject)(workInProgress);
            if (fiberRoot.pendingContext) {
                fiberRoot.context = fiberRoot.pendingContext;
                fiberRoot.pendingContext = null;
            }
            if (current === null || current.child === null) {
                // If we hydrated, pop so that we can delete any remaining children
                // that weren't hydrated.
                var wasHydrated = (0, react_fiber_hydration_context_1.popHydrationState)(workInProgress);
                if (wasHydrated) {
                    // If we hydrated, then we'll need to schedule an update for
                    // the commit side effects on the root.
                    markUpdate(workInProgress);
                }
                else {
                    if (current !== null) {
                        var prevState = current.memoizedState;
                        if ( // Check if this is a client root
                        !prevState.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
                            (workInProgress.flags & react_fiber_flags_1.ForceClientRender) !== react_fiber_flags_1.NoFlags) {
                            // Schedule an effect to clear this container at the start of the
                            // next commit. This handles the case of React rendering into a
                            // container with previous children. It's also safe to do for
                            // updates too, because current.child would only be null if the
                            // previous render was null (so the container would already
                            // be empty).
                            workInProgress.flags |= react_fiber_flags_1.Snapshot;
                            // If this was a forced client render, there may have been
                            // recoverable errors during first hydration attempt. If so, add
                            // them to a queue so we can log them in the commit phase.
                            (0, react_fiber_hydration_context_1.upgradeHydrationErrorsToRecoverable)();
                        }
                    }
                }
            }
            updateHostContainer(current, workInProgress);
            bubbleProperties(workInProgress);
            if (react_feature_flags_1.enableTransitionTracing) {
                if ((workInProgress.subtreeFlags & react_fiber_flags_1.Visibility) !== react_fiber_flags_1.NoFlags) {
                    // If any of our suspense children toggle visibility, this means that
                    // the pending boundaries array needs to be updated, which we only
                    // do in the passive phase.
                    workInProgress.flags |= react_fiber_flags_1.Passive;
                }
            }
            return null;
        }
        case react_work_tags_1.HostHoistable: {
            if (react_feature_flags_1.enableFloat && supportsResources) {
                // The branching here is more complicated than you might expect because
                // a HostHoistable sometimes corresponds to a Resource and sometimes
                // corresponds to an Instance. It can also switch during an update.
                var type = workInProgress.type;
                var nextResource = workInProgress.memoizedState;
                if (current === null) {
                    // We are mounting and must Update this Hoistable in this commit
                    // @TODO refactor this block to create the instance here in complete
                    // phase if we are not hydrating.
                    markUpdate(workInProgress);
                    if (workInProgress.ref !== null) {
                        markRef(workInProgress);
                    }
                    if (nextResource !== null) {
                        // This is a Hoistable Resource
                        // This must come at the very end of the complete phase.
                        bubbleProperties(workInProgress);
                        preloadResourceAndSuspendIfNeeded(workInProgress, nextResource, type, newProps, renderLanes);
                        return null;
                    }
                    else {
                        // This is a Hoistable Instance
                        // This must come at the very end of the complete phase.
                        bubbleProperties(workInProgress);
                        preloadInstanceAndSuspendIfNeeded(workInProgress, type, newProps, renderLanes);
                        return null;
                    }
                }
                else {
                    // We are updating.
                    var currentResource = current.memoizedState;
                    if (nextResource !== currentResource) {
                        // We are transitioning to, from, or between Hoistable Resources
                        // and require an update
                        markUpdate(workInProgress);
                    }
                    if (current.ref !== workInProgress.ref) {
                        markRef(workInProgress);
                    }
                    if (nextResource !== null) {
                        // This is a Hoistable Resource
                        // This must come at the very end of the complete phase.
                        bubbleProperties(workInProgress);
                        if (nextResource === currentResource) {
                            workInProgress.flags &= ~react_fiber_flags_1.MaySuspendCommit;
                        }
                        else {
                            preloadResourceAndSuspendIfNeeded(workInProgress, nextResource, type, newProps, renderLanes);
                        }
                        return null;
                    }
                    else {
                        // This is a Hoistable Instance
                        // We may have props to update on the Hoistable instance.
                        if (supportsMutation) {
                            var oldProps = current.memoizedProps;
                            if (oldProps !== newProps) {
                                markUpdate(workInProgress);
                            }
                        }
                        else {
                            // We use the updateHostComponent path becuase it produces
                            // the update queue we need for Hoistables.
                            updateHostComponent(current, workInProgress, type, newProps, renderLanes);
                        }
                        // This must come at the very end of the complete phase.
                        bubbleProperties(workInProgress);
                        preloadInstanceAndSuspendIfNeeded(workInProgress, type, newProps, renderLanes);
                        return null;
                    }
                }
            } // Fall through
        }
        case react_work_tags_1.HostSingleton: {
            if (react_feature_flags_1.enableHostSingletons && supportsSingletons) {
                (0, react_fiber_host_context_1.popHostContext)(workInProgress);
                var rootContainerInstance = (0, react_fiber_host_context_1.getRootHostContainer)();
                var type = workInProgress.type;
                if (current !== null && workInProgress.stateNode != null) {
                    if (supportsMutation) {
                        var oldProps = current.memoizedProps;
                        if (oldProps !== newProps) {
                            markUpdate(workInProgress);
                        }
                    }
                    else {
                        updateHostComponent(current, workInProgress, type, newProps, renderLanes);
                    }
                    if (current.ref !== workInProgress.ref) {
                        markRef(workInProgress);
                    }
                }
                else {
                    if (!newProps) {
                        if (workInProgress.stateNode === null) {
                            throw new Error("We must have new props for new mounts. This error is likely " + "caused by a bug in React. Please file an issue.");
                        }
                        // This can happen when we abort work.
                        bubbleProperties(workInProgress);
                        return null;
                    }
                    var currentHostContext = (0, react_fiber_host_context_1.getHostContext)();
                    var wasHydrated = (0, react_fiber_hydration_context_1.popHydrationState)(workInProgress);
                    var instance = void 0;
                    if (wasHydrated) {
                        // We ignore the boolean indicating there is an updateQueue because
                        // it is used only to set text children and HostSingletons do not
                        // use them.
                        (0, react_fiber_hydration_context_1.prepareToHydrateHostInstance)(workInProgress, currentHostContext);
                        instance = workInProgress.stateNode;
                    }
                    else {
                        instance = resolveSingletonInstance(type, newProps, rootContainerInstance, currentHostContext, true);
                        workInProgress.stateNode = instance;
                        markUpdate(workInProgress);
                    }
                    if (workInProgress.ref !== null) {
                        // If there is a ref on a host node we need to schedule a callback
                        markRef(workInProgress);
                    }
                }
                bubbleProperties(workInProgress);
                return null;
            } // Fall through
        }
        case react_work_tags_1.HostComponent: {
            (0, react_fiber_host_context_1.popHostContext)(workInProgress);
            var type = workInProgress.type;
            if (current !== null && workInProgress.stateNode != null) {
                updateHostComponent(current, workInProgress, type, newProps, renderLanes);
                if (current.ref !== workInProgress.ref) {
                    markRef(workInProgress);
                }
            }
            else {
                if (!newProps) {
                    if (workInProgress.stateNode === null) {
                        throw new Error("We must have new props for new mounts. This error is likely " + "caused by a bug in React. Please file an issue.");
                    }
                    // This can happen when we abort work.
                    bubbleProperties(workInProgress);
                    return null;
                }
                var currentHostContext = (0, react_fiber_host_context_1.getHostContext)();
                // TODO: Move createInstance to beginWork and keep it on a context
                // "stack" as the parent. Then append children as we go in beginWork
                // or completeWork depending on whether we want to add them top->down or
                // bottom->up. Top->down is faster in IE11.
                var wasHydrated = (0, react_fiber_hydration_context_1.popHydrationState)(workInProgress);
                if (wasHydrated) {
                    // TODO: Move this and createInstance step into the beginPhase
                    // to consolidate.
                    (0, react_fiber_hydration_context_1.prepareToHydrateHostInstance)(workInProgress, currentHostContext);
                }
                else {
                    var rootContainerInstance = (0, react_fiber_host_context_1.getRootHostContainer)();
                    var instance = createInstance(type, newProps, rootContainerInstance, currentHostContext, workInProgress);
                    // TODO: For persistent renderers, we should pass children as part
                    // of the initial instance creation
                    appendAllChildren(instance, workInProgress, false, false);
                    workInProgress.stateNode = instance;
                    // Certain renderers require commit-time effects for initial mount.
                    // (eg DOM renderer supports auto-focus for certain elements).
                    // Make sure such renderers get scheduled for later work.
                    if (finalizeInitialChildren(instance, type, newProps, currentHostContext)) {
                        markUpdate(workInProgress);
                    }
                }
                if (workInProgress.ref !== null) {
                    // If there is a ref on a host node we need to schedule a callback
                    markRef(workInProgress);
                }
            }
            bubbleProperties(workInProgress);
            // This must come at the very end of the complete phase, because it might
            // throw to suspend, and if the resource immediately loads, the work loop
            // will resume rendering as if the work-in-progress completed. So it must
            // fully complete.
            preloadInstanceAndSuspendIfNeeded(workInProgress, workInProgress.type, workInProgress.pendingProps, renderLanes);
            return null;
        }
        case react_work_tags_1.HostText: {
            var newText = newProps;
            if (current && workInProgress.stateNode != null) {
                var oldText = current.memoizedProps;
                // If we have an alternate, that means this is an update and we need
                // to schedule a side-effect to do the updates.
                updateHostText(current, workInProgress, oldText, newText);
            }
            else {
                if (typeof newText !== "string") {
                    if (workInProgress.stateNode === null) {
                        throw new Error("We must have new props for new mounts. This error is likely " + "caused by a bug in React. Please file an issue.");
                    } // This can happen when we abort work.
                }
                var rootContainerInstance = (0, react_fiber_host_context_1.getRootHostContainer)();
                var currentHostContext = (0, react_fiber_host_context_1.getHostContext)();
                var wasHydrated = (0, react_fiber_hydration_context_1.popHydrationState)(workInProgress);
                if (wasHydrated) {
                    if ((0, react_fiber_hydration_context_1.prepareToHydrateHostTextInstance)(workInProgress)) {
                        markUpdate(workInProgress);
                    }
                }
                else {
                    workInProgress.stateNode = createTextInstance(newText, rootContainerInstance, currentHostContext, workInProgress);
                }
            }
            bubbleProperties(workInProgress);
            return null;
        }
        case react_work_tags_1.SuspenseComponent: {
            (0, react_fiber_suspense_context_1.popSuspenseHandler)(workInProgress);
            var nextState = workInProgress.memoizedState;
            // Special path for dehydrated boundaries. We may eventually move this
            // to its own fiber type so that we can add other kinds of hydration
            // boundaries that aren't associated with a Suspense tree. In anticipation
            // of such a refactor, all the hydration logic is contained in
            // this branch.
            if (current === null || current.memoizedState !== null && current.memoizedState.dehydrated !== null) {
                var fallthroughToNormalSuspensePath = completeDehydratedSuspenseBoundary(current, workInProgress, nextState);
                if (!fallthroughToNormalSuspensePath) {
                    if (workInProgress.flags & react_fiber_flags_1.ForceClientRender) {
                        // Special case. There were remaining unhydrated nodes. We treat
                        // this as a mismatch. Revert to client rendering.
                        return workInProgress;
                    }
                    else {
                        // Did not finish hydrating, either because this is the initial
                        // render or because something suspended.
                        return null;
                    }
                } // Continue with the normal Suspense path.
            }
            if ((workInProgress.flags & react_fiber_flags_1.DidCapture) !== react_fiber_flags_1.NoFlags) {
                // Something suspended. Re-render with the fallback children.
                workInProgress.lanes = renderLanes;
                // Do not reset the effect list.
                if (react_feature_flags_1.enableProfilerTimer && (workInProgress.mode & react_type_of_mode_1.ProfileMode) !== react_type_of_mode_1.NoMode) {
                    (0, react_profile_timer_1.transferActualDuration)(workInProgress);
                }
                // Don't bubble properties in this case.
                return workInProgress;
            }
            var nextDidTimeout = nextState !== null;
            var prevDidTimeout = current !== null && current.memoizedState !== null;
            if (react_feature_flags_1.enableCache && nextDidTimeout) {
                var offscreenFiber = workInProgress.child;
                var previousCache = null;
                if (offscreenFiber.alternate !== null && offscreenFiber.alternate.memoizedState !== null && offscreenFiber.alternate.memoizedState.cachePool !== null) {
                    previousCache = offscreenFiber.alternate.memoizedState.cachePool.pool;
                }
                var cache = null;
                if (offscreenFiber.memoizedState !== null && offscreenFiber.memoizedState.cachePool !== null) {
                    cache = offscreenFiber.memoizedState.cachePool.pool;
                }
                if (cache !== previousCache) {
                    // Run passive effects to retain/release the cache.
                    offscreenFiber.flags |= react_fiber_flags_1.Passive;
                }
            }
            // If the suspended state of the boundary changes, we need to schedule
            // a passive effect, which is when we process the transitions
            if (nextDidTimeout !== prevDidTimeout) {
                if (react_feature_flags_1.enableTransitionTracing) {
                    var offscreenFiber = workInProgress.child;
                    offscreenFiber.flags |= react_fiber_flags_1.Passive;
                }
                // If the suspended state of the boundary changes, we need to schedule
                // an effect to toggle the subtree's visibility. When we switch from
                // fallback -> primary, the inner Offscreen fiber schedules this effect
                // as part of its normal complete phase. But when we switch from
                // primary -> fallback, the inner Offscreen fiber does not have a complete
                // phase. So we need to schedule its effect here.
                //
                // We also use this flag to connect/disconnect the effects, but the same
                // logic applies: when re-connecting, the Offscreen fiber's complete
                // phase will handle scheduling the effect. It's only when the fallback
                // is active that we have to do anything special.
                if (nextDidTimeout) {
                    var offscreenFiber = workInProgress.child;
                    offscreenFiber.flags |= react_fiber_flags_1.Visibility;
                }
            }
            var retryQueue = workInProgress.updateQueue;
            scheduleRetryEffect(workInProgress, retryQueue);
            if (react_feature_flags_1.enableSuspenseCallback && workInProgress.updateQueue !== null && workInProgress.memoizedProps.suspenseCallback != null) {
                // Always notify the callback
                // TODO: Move to passive phase
                workInProgress.flags |= react_fiber_flags_1.Update;
            }
            bubbleProperties(workInProgress);
            if (react_feature_flags_1.enableProfilerTimer) {
                if ((workInProgress.mode & react_type_of_mode_1.ProfileMode) !== react_type_of_mode_1.NoMode) {
                    if (nextDidTimeout) {
                        // Don't count time spent in a timed out Suspense subtree as part of the base duration.
                        var primaryChildFragment = workInProgress.child;
                        if (primaryChildFragment !== null) {
                            // $FlowFixMe[unsafe-arithmetic] Flow doesn't support type casting in combination with the -= operator
                            // @ts-ignore
                            workInProgress.treeBaseDuration -= primaryChildFragment.treeBaseDuration;
                        }
                    }
                }
            }
            return null;
        }
        case react_work_tags_1.HostPortal:
            (0, react_fiber_host_context_1.popHostContainer)(workInProgress);
            updateHostContainer(current, workInProgress);
            if (current === null) {
                preparePortalMount(workInProgress.stateNode.containerInfo);
            }
            bubbleProperties(workInProgress);
            return null;
        case react_work_tags_1.ContextProvider:
            // Pop provider fiber
            var context = workInProgress.type._context;
            (0, react_fiber_new_context_1.popProvider)(context, workInProgress);
            bubbleProperties(workInProgress);
            return null;
        case react_work_tags_1.IncompleteClassComponent: {
            // Same as class component case. I put it down here so that the tags are
            // sequential to ensure this switch is compiled to a jump table.
            var Component = workInProgress.type;
            if ((0, react_fiber_context_1.isContextProvider)(Component)) {
                (0, react_fiber_context_1.popContext)(workInProgress);
            }
            bubbleProperties(workInProgress);
            return null;
        }
        case react_work_tags_1.SuspenseListComponent: {
            (0, react_fiber_suspense_context_1.popSuspenseListContext)(workInProgress);
            var renderState = workInProgress.memoizedState;
            if (renderState === null) {
                // We're running in the default, "independent" mode.
                // We don't do anything in this mode.
                bubbleProperties(workInProgress);
                return null;
            }
            var didSuspendAlready = (workInProgress.flags & react_fiber_flags_1.DidCapture) !== react_fiber_flags_1.NoFlags;
            var renderedTail = renderState.rendering;
            if (renderedTail === null) {
                // We just rendered the head.
                if (!didSuspendAlready) {
                    // This is the first pass. We need to figure out if anything is still
                    // suspended in the rendered set.
                    // If new content unsuspended, but there's still some content that
                    // didn't. Then we need to do a second pass that forces everything
                    // to keep showing their fallbacks.
                    // We might be suspended if something in this render pass suspended, or
                    // something in the previous committed pass suspended. Otherwise,
                    // there's no chance so we can skip the expensive call to
                    // findFirstSuspended.
                    var cannotBeSuspended = (0, react_fiber_work_in_progress_ping_1.renderHasNotSuspendedYet)() && (current === null || (current.flags & react_fiber_flags_1.DidCapture) === react_fiber_flags_1.NoFlags);
                    if (!cannotBeSuspended) {
                        var row = workInProgress.child;
                        while (row !== null) {
                            var suspended = (0, react_fiber_suspense_component_1.findFirstSuspended)(row);
                            if (suspended !== null) {
                                didSuspendAlready = true;
                                workInProgress.flags |= react_fiber_flags_1.DidCapture;
                                cutOffTailIfNeeded(renderState, false);
                                // If this is a newly suspended tree, it might not get committed as
                                // part of the second pass. In that case nothing will subscribe to
                                // its thenables. Instead, we'll transfer its thenables to the
                                // SuspenseList so that it can retry if they resolve.
                                // There might be multiple of these in the list but since we're
                                // going to wait for all of them anyway, it doesn't really matter
                                // which ones gets to ping. In theory we could get clever and keep
                                // track of how many dependencies remain but it gets tricky because
                                // in the meantime, we can add/remove/change items and dependencies.
                                // We might bail out of the loop before finding any but that
                                // doesn't matter since that means that the other boundaries that
                                // we did find already has their listeners attached.
                                var retryQueue = suspended.updateQueue;
                                workInProgress.updateQueue = retryQueue;
                                scheduleRetryEffect(workInProgress, retryQueue);
                                // Rerender the whole list, but this time, we'll force fallbacks
                                // to stay in place.
                                // Reset the effect flags before doing the second pass since that's now invalid.
                                // Reset the child fibers to their original state.
                                workInProgress.subtreeFlags = react_fiber_flags_1.NoFlags;
                                (0, react_fiber_child_1.resetChildFibers)(workInProgress, renderLanes);
                                // Set up the Suspense List Context to force suspense and
                                // immediately rerender the children.
                                (0, react_fiber_suspense_context_1.pushSuspenseListContext)(workInProgress, (0, react_fiber_suspense_context_1.setShallowSuspenseListContext)(react_fiber_suspense_context_1.suspenseStackCursor.current, react_fiber_suspense_context_1.ForceSuspenseFallback));
                                // Don't bubble properties in this case.
                                return workInProgress.child;
                            }
                            row = row.sibling;
                        }
                    }
                    if (renderState.tail !== null && (0, react_scheduler_1.unstable_now)() > (0, react_fiber_work_loop_1.getRenderTargetTime)()) {
                        // We have already passed our CPU deadline but we still have rows
                        // left in the tail. We'll just give up further attempts to render
                        // the main content and only render fallbacks.
                        workInProgress.flags |= react_fiber_flags_1.DidCapture;
                        didSuspendAlready = true;
                        cutOffTailIfNeeded(renderState, false);
                        // Since nothing actually suspended, there will nothing to ping this
                        // to get it started back up to attempt the next item. While in terms
                        // of priority this work has the same priority as this current render,
                        // it's not part of the same transition once the transition has
                        // committed. If it's sync, we still want to yield so that it can be
                        // painted. Conceptually, this is really the same as pinging.
                        // We can use any RetryLane even if it's the one currently rendering
                        // since we're leaving it behind on this node.
                        workInProgress.lanes = react_fiber_lane_constants_1.SomeRetryLane;
                    }
                }
                else {
                    cutOffTailIfNeeded(renderState, false);
                } // Next we're going to render the tail.
            }
            else {
                // Append the rendered row to the child list.
                if (!didSuspendAlready) {
                    var suspended = (0, react_fiber_suspense_component_1.findFirstSuspended)(renderedTail);
                    if (suspended !== null) {
                        workInProgress.flags |= react_fiber_flags_1.DidCapture;
                        didSuspendAlready = true;
                        // Ensure we transfer the update queue to the parent so that it doesn't
                        // get lost if this row ends up dropped during a second pass.
                        var retryQueue = suspended.updateQueue;
                        workInProgress.updateQueue = retryQueue;
                        scheduleRetryEffect(workInProgress, retryQueue);
                        cutOffTailIfNeeded(renderState, true);
                        // This might have been modified.
                        if (renderState.tail === null && renderState.tailMode === "hidden" && !renderedTail.alternate && !(0, react_fiber_hydration_is_hydrating_1.isHydrating)() // We don't cut it if we're hydrating.
                        ) {
                            // We're done.
                            bubbleProperties(workInProgress);
                            return null;
                        }
                    }
                    else if ( // The time it took to render last row is greater than the remaining
                    // time we have to render. So rendering one more row would likely
                    // exceed it.
                    (0, react_scheduler_1.unstable_now)() * 2 - renderState.renderingStartTime > (0, react_fiber_work_loop_1.getRenderTargetTime)() && renderLanes !== react_fiber_lane_constants_1.OffscreenLane) {
                        // We have now passed our CPU deadline and we'll just give up further
                        // attempts to render the main content and only render fallbacks.
                        // The assumption is that this is usually faster.
                        workInProgress.flags |= react_fiber_flags_1.DidCapture;
                        didSuspendAlready = true;
                        cutOffTailIfNeeded(renderState, false);
                        // Since nothing actually suspended, there will nothing to ping this
                        // to get it started back up to attempt the next item. While in terms
                        // of priority this work has the same priority as this current render,
                        // it's not part of the same transition once the transition has
                        // committed. If it's sync, we still want to yield so that it can be
                        // painted. Conceptually, this is really the same as pinging.
                        // We can use any RetryLane even if it's the one currently rendering
                        // since we're leaving it behind on this node.
                        workInProgress.lanes = react_fiber_lane_constants_1.SomeRetryLane;
                    }
                }
                if (renderState.isBackwards) {
                    // The effect list of the backwards tail will have been added
                    // to the end. This breaks the guarantee that life-cycles fire in
                    // sibling order but that isn't a strong guarantee promised by React.
                    // Especially since these might also just pop in during future commits.
                    // Append to the beginning of the list.
                    renderedTail.sibling = workInProgress.child;
                    workInProgress.child = renderedTail;
                }
                else {
                    var previousSibling = renderState.last;
                    if (previousSibling !== null) {
                        previousSibling.sibling = renderedTail;
                    }
                    else {
                        workInProgress.child = renderedTail;
                    }
                    renderState.last = renderedTail;
                }
            }
            if (renderState.tail !== null) {
                // We still have tail rows to render.
                // Pop a row.
                var next = renderState.tail;
                renderState.rendering = next;
                renderState.tail = next.sibling;
                renderState.renderingStartTime = (0, react_scheduler_1.unstable_now)();
                next.sibling = null;
                // Restore the context.
                // TODO: We can probably just avoid popping it instead and only
                // setting it the first time we go from not suspended to suspended.
                var suspenseContext = react_fiber_suspense_context_1.suspenseStackCursor.current;
                if (didSuspendAlready) {
                    suspenseContext = (0, react_fiber_suspense_context_1.setShallowSuspenseListContext)(suspenseContext, react_fiber_suspense_context_1.ForceSuspenseFallback);
                }
                else {
                    suspenseContext = (0, react_fiber_suspense_context_1.setDefaultShallowSuspenseListContext)(suspenseContext);
                }
                (0, react_fiber_suspense_context_1.pushSuspenseListContext)(workInProgress, suspenseContext);
                // Do a pass over the next row.
                // Don't bubble properties in this case.
                return next;
            }
            bubbleProperties(workInProgress);
            return null;
        }
        case react_work_tags_1.ScopeComponent: {
            if (react_feature_flags_1.enableScopeAPI) {
                if (current === null) {
                    var scopeInstance = (0, react_fiber_scope_1.createScopeInstance)();
                    workInProgress.stateNode = scopeInstance;
                    prepareScopeUpdate(scopeInstance, workInProgress);
                    if (workInProgress.ref !== null) {
                        markRef(workInProgress);
                        markUpdate(workInProgress);
                    }
                }
                else {
                    if (workInProgress.ref !== null) {
                        markUpdate(workInProgress);
                    }
                    if (current.ref !== workInProgress.ref) {
                        markRef(workInProgress);
                    }
                }
                bubbleProperties(workInProgress);
                return null;
            }
            break;
        }
        case react_work_tags_1.OffscreenComponent:
        case react_work_tags_1.LegacyHiddenComponent: {
            (0, react_fiber_suspense_context_1.popSuspenseHandler)(workInProgress);
            (0, react_fiber_hidden_context_1.popHiddenContext)(workInProgress);
            var nextState = workInProgress.memoizedState;
            var nextIsHidden = nextState !== null;
            // Schedule a Visibility effect if the visibility has changed
            if (react_feature_flags_1.enableLegacyHidden && workInProgress.tag === react_work_tags_1.LegacyHiddenComponent) { // LegacyHidden doesn't do any hiding — it only pre-renders.
            }
            else {
                if (current !== null) {
                    var prevState = current.memoizedState;
                    var prevIsHidden = prevState !== null;
                    if (prevIsHidden !== nextIsHidden) {
                        workInProgress.flags |= react_fiber_flags_1.Visibility;
                    }
                }
                else {
                    // On initial mount, we only need a Visibility effect if the tree
                    // is hidden.
                    if (nextIsHidden) {
                        workInProgress.flags |= react_fiber_flags_1.Visibility;
                    }
                }
            }
            if (!nextIsHidden || (workInProgress.mode & react_type_of_mode_1.ConcurrentMode) === react_type_of_mode_1.NoMode) {
                bubbleProperties(workInProgress);
            }
            else {
                // Don't bubble properties for hidden children unless we're rendering
                // at offscreen priority.
                if ((0, react_fiber_lane_1.includesSomeLane)(renderLanes, react_fiber_lane_constants_1.OffscreenLane) && // Also don't bubble if the tree suspended
                    (workInProgress.flags & react_fiber_flags_1.DidCapture) === react_fiber_lane_constants_1.NoLanes) {
                    bubbleProperties(workInProgress);
                    // Check if there was an insertion or update in the hidden subtree.
                    // If so, we need to hide those nodes in the commit phase, so
                    // schedule a visibility effect.
                    if ((!react_feature_flags_1.enableLegacyHidden || workInProgress.tag !== react_work_tags_1.LegacyHiddenComponent) && workInProgress.subtreeFlags & (react_fiber_flags_1.Placement | react_fiber_flags_1.Update)) {
                        workInProgress.flags |= react_fiber_flags_1.Visibility;
                    }
                }
            }
            var offscreenQueue = workInProgress.updateQueue;
            if (offscreenQueue !== null) {
                var retryQueue = offscreenQueue.retryQueue;
                scheduleRetryEffect(workInProgress, retryQueue);
            }
            if (react_feature_flags_1.enableCache) {
                var previousCache = null;
                if (current !== null && current.memoizedState !== null && current.memoizedState.cachePool !== null) {
                    previousCache = current.memoizedState.cachePool.pool;
                }
                var cache = null;
                if (workInProgress.memoizedState !== null && workInProgress.memoizedState.cachePool !== null) {
                    cache = workInProgress.memoizedState.cachePool.pool;
                }
                if (cache !== previousCache) {
                    // Run passive effects to retain/release the cache.
                    workInProgress.flags |= react_fiber_flags_1.Passive;
                }
            }
            (0, react_fiber_transition_1.popTransition)(workInProgress, current);
            return null;
        }
        case react_work_tags_1.CacheComponent: {
            if (react_feature_flags_1.enableCache) {
                var previousCache = null;
                if (current !== null) {
                    previousCache = current.memoizedState.cache;
                }
                var cache = workInProgress.memoizedState.cache;
                if (cache !== previousCache) {
                    // Run passive effects to retain/release the cache.
                    workInProgress.flags |= react_fiber_flags_1.Passive;
                }
                (0, react_fiber_cache_component_provider_1.popCacheProvider)(workInProgress, cache);
                bubbleProperties(workInProgress);
            }
            return null;
        }
        case react_work_tags_1.TracingMarkerComponent: {
            if (react_feature_flags_1.enableTransitionTracing) {
                var instance = workInProgress.stateNode;
                if (instance !== null) {
                    (0, react_fiber_tracing_marker_component_1.popMarkerInstance)(workInProgress);
                }
                bubbleProperties(workInProgress);
            }
            return null;
        }
    }
    throw new Error("Unknown unit of work tag (".concat(workInProgress.tag, "). This error is likely caused by a bug in ") + "React. Please file an issue.");
}
exports.completeWork = completeWork;
