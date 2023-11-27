"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE https://github.com/facebook/react/blob/main/LICENSE
 *
 * Sync with: https://github.com/facebook/react/blob/ce2bc58a9f6f3b0bfc8c738a0d8e2a5f3a332ff5/packages/shared/ReactFeatureFlags.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugRenderPhaseSideEffectsForStrictMode = exports.enableSchedulingProfiler = exports.disableTextareaChildren = exports.enableCustomElementPropertySupport = exports.enableFilterEmptyStringAttributesDOM = exports.disableIEWorkarounds = exports.disableInputAttributeSyncing = exports.enableTrustedTypesIntegration = exports.disableJavaScriptURLs = exports.disableCommentsAsDOMContainers = exports.allowConcurrentByDefault = exports.enableUnifiedSyncLane = exports.forceConcurrentByDefaultForTesting = exports.enableUseRefAccessWarning = exports.disableLegacyContext = exports.disableModulePatternComponents = exports.createRootStrictEffectsByDefault = exports.enableUseDeferredValueInitialArg = exports.passChildrenWhenCloningPersistedNodes = exports.useMicrotasksForSchedulingInFabric = exports.alwaysThrottleRetries = exports.enableFizzExternalRuntime = exports.enableUseEffectEventHook = exports.enableUseMemoCacheHook = exports.enableFloat = exports.enableHostSingletons = exports.enableCPUSuspense = exports.enableSuspenseAvoidThisFallbackFizz = exports.enableSuspenseAvoidThisFallback = exports.enableLegacyHidden = exports.enableLazyContextPropagation = exports.enableTransitionTracing = exports.enablePostpone = exports.enableTaint = exports.enableBinaryFlight = exports.enableFetchInstrumentation = exports.enableCacheElement = exports.enableLegacyCache = exports.enableCache = exports.enableLegacyFBSupport = exports.enableCreateEventHandleAPI = exports.enableScopeAPI = exports.enableSuspenseCallback = exports.enableDeferRootSchedulingToMicrotask = exports.disableSchedulerTimeoutInWorkLoop = exports.enableSchedulerDebugging = exports.enableAsyncActions = exports.enableFormActions = exports.enableClientRenderFallbackOnTextMismatch = exports.enableComponentStackLocations = void 0;
exports.enableDO_NOT_USE_disableStrictPassiveEffect = exports.useModernStrictMode = exports.consoleManagedByDevToolsDuringStrictMode = exports.enableProfilerNestedUpdateScheduledHook = exports.enableGetInspectorDataForInstanceInProduction = exports.enableServerContext = exports.enableUpdaterTracking = exports.enableDebugTracing = exports.enableProfilerNestedUpdatePhase = exports.enableProfilerCommitHooks = exports.enableProfilerTimer = exports.replayFailedUnitOfWorkWithInvokeGuardedCallback = void 0;
// -----------------------------------------------------------------------------
// Land or remove (zero effort)
//
// Flags that can likely be deleted or landed without consequences
// -----------------------------------------------------------------------------
exports.enableComponentStackLocations = true;
// -----------------------------------------------------------------------------
// Kill-switch
//
// Flags that exist solely to turn off a change in case it causes a regression
// when it rolls out to prod. We should remove these as soon as possible.
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Land or remove (moderate effort)
//
// Flags that can be probably deleted or landed, but might require extra effort
// like migrating internal callers or performance testing.
// -----------------------------------------------------------------------------
// TODO: Finish rolling out in www
exports.enableClientRenderFallbackOnTextMismatch = true;
exports.enableFormActions = true;
exports.enableAsyncActions = true;
// Not sure if www still uses this. We don't have a replacement but whatever we
// replace it with will likely be different than what's already there, so we
// probably should just delete it as long as nothing in www relies on it.
exports.enableSchedulerDebugging = false;
// Need to remove didTimeout argument from Scheduler before landing
exports.disableSchedulerTimeoutInWorkLoop = false;
// This will break some internal tests at Meta so we need to gate this until
// those can be fixed.
exports.enableDeferRootSchedulingToMicrotask = true;
// -----------------------------------------------------------------------------
// Slated for removal in the future (significant effort)
//
// These are experiments that didn't work out, and never shipped, but we can't
// delete from the codebase until we migrate internal callers.
// -----------------------------------------------------------------------------
// Add a callback property to suspense to notify which promises are currently
// in the update queue. This allows reporting and tracing of what is causing
// the user to see a loading state.
//
// Also allows hydration callbacks to fire when a dehydrated boundary gets
// hydrated or deleted.
//
// This will eventually be replaced by the Transition Tracing proposal.
exports.enableSuspenseCallback = false;
// Experimental Scope support.
exports.enableScopeAPI = false;
// Experimental Create Event Handle API.
exports.enableCreateEventHandleAPI = false;
// Support legacy Primer support on internal FB www
exports.enableLegacyFBSupport = false;
// -----------------------------------------------------------------------------
// Ongoing experiments
//
// These are features that we're either actively exploring or are reasonably
// likely to include in an upcoming release.
// -----------------------------------------------------------------------------
exports.enableCache = true;
exports.enableLegacyCache = __EXPERIMENTAL__;
exports.enableCacheElement = __EXPERIMENTAL__;
exports.enableFetchInstrumentation = true;
exports.enableBinaryFlight = __EXPERIMENTAL__;
exports.enableTaint = __EXPERIMENTAL__;
exports.enablePostpone = __EXPERIMENTAL__;
exports.enableTransitionTracing = false;
// No known bugs, but needs performance testing
exports.enableLazyContextPropagation = false;
// FB-only usage. The new API has different semantics.
exports.enableLegacyHidden = false;
// Enables unstable_avoidThisFallback feature in Fiber
exports.enableSuspenseAvoidThisFallback = false;
// Enables unstable_avoidThisFallback feature in Fizz
exports.enableSuspenseAvoidThisFallbackFizz = false;
exports.enableCPUSuspense = __EXPERIMENTAL__;
exports.enableHostSingletons = true;
exports.enableFloat = true;
// Enables unstable_useMemoCache hook, intended as a compilation target for
// auto-memoization.
exports.enableUseMemoCacheHook = __EXPERIMENTAL__;
exports.enableUseEffectEventHook = __EXPERIMENTAL__;
// Test in www before enabling in open source.
// Enables DOM-server to stream its instruction set as data-attributes
// (handled with an MutationObserver) instead of inline-scripts
exports.enableFizzExternalRuntime = true;
exports.alwaysThrottleRetries = true;
exports.useMicrotasksForSchedulingInFabric = false;
exports.passChildrenWhenCloningPersistedNodes = false;
exports.enableUseDeferredValueInitialArg = __EXPERIMENTAL__;
// -----------------------------------------------------------------------------
// Chopping Block
//
// Planned feature deprecations and breaking changes. Sorted roughly in order of
// when we plan to enable them.
// -----------------------------------------------------------------------------
// This flag enables Strict Effects by default. We're not turning this on until
// after 18 because it requires migration work. Recommendation is to use
// <StrictMode /> to gradually upgrade components.
// If TRUE, trees rendered with createRoot will be StrictEffectsMode.
// If FALSE, these trees will be StrictLegacyMode.
exports.createRootStrictEffectsByDefault = false;
exports.disableModulePatternComponents = false;
exports.disableLegacyContext = false;
exports.enableUseRefAccessWarning = false;
// Enables time slicing for updates that aren't wrapped in startTransition.
exports.forceConcurrentByDefaultForTesting = false;
exports.enableUnifiedSyncLane = __EXPERIMENTAL__;
// Adds an opt-in to time slicing for updates that aren't wrapped in startTransition.
exports.allowConcurrentByDefault = false;
// -----------------------------------------------------------------------------
// React DOM Chopping Block
//
// Similar to main Chopping Block but only flags related to React DOM. These are
// grouped because we will likely batch all of them into a single major release.
// -----------------------------------------------------------------------------
// Disable support for comment nodes as React DOM containers. Already disabled
// in open source, but www codebase still relies on it. Need to remove.
exports.disableCommentsAsDOMContainers = true;
// Disable javascript: URL strings in href for XSS protection.
exports.disableJavaScriptURLs = false;
exports.enableTrustedTypesIntegration = false;
// Prevent the value and checked attributes from syncing with their related
// DOM properties
exports.disableInputAttributeSyncing = false;
// Remove IE and MsApp specific workarounds for innerHTML
exports.disableIEWorkarounds = __EXPERIMENTAL__;
// Filter certain DOM attributes (e.g. src, href) if their values are empty
// strings. This prevents e.g. <img src=""> from making an unnecessary HTTP
// request for certain browsers.
exports.enableFilterEmptyStringAttributesDOM = __EXPERIMENTAL__;
// Changes the behavior for rendering custom elements in both server rendering
// and client rendering, mostly to allow JSX attributes to apply to the custom
// element's object properties instead of only HTML attributes.
// https://github.com/facebook/react/issues/11347
exports.enableCustomElementPropertySupport = __EXPERIMENTAL__;
// Disables children for <textarea> elements
exports.disableTextareaChildren = false;
// -----------------------------------------------------------------------------
// Debugging and DevTools
// -----------------------------------------------------------------------------
// Adds user timing marks for e.g. state updates, suspense, and work loop stuff,
// for an experimental timeline tool.
exports.enableSchedulingProfiler = __PROFILE__;
// Helps identify side effects in render-phase lifecycle hooks and setState
// reducers by double invoking them in StrictLegacyMode.
exports.debugRenderPhaseSideEffectsForStrictMode = __DEV__;
// To preserve the "Pause on caught exceptions" behavior of the debugger, we
// replay the begin phase of a failed component inside invokeGuardedCallback.
exports.replayFailedUnitOfWorkWithInvokeGuardedCallback = __DEV__;
// Gather advanced timing metrics for Profiler subtrees.
exports.enableProfilerTimer = __PROFILE__;
// Record durations for commit and passive effects phases.
exports.enableProfilerCommitHooks = __PROFILE__;
// Phase param passed to onRender callback differentiates between an "update" and a "cascading-update".
exports.enableProfilerNestedUpdatePhase = __PROFILE__;
// Adds verbose console logging for e.g. state updates, suspense, and work loop
// stuff. Intended to enable React core members to more easily debug scheduling
// issues in DEV builds.
exports.enableDebugTracing = false;
// Track which Fiber(s) schedule render work.
exports.enableUpdaterTracking = __PROFILE__;
exports.enableServerContext = __EXPERIMENTAL__;
// Internal only.
exports.enableGetInspectorDataForInstanceInProduction = false;
// Profiler API accepts a function to be called when a nested update is scheduled.
// This callback accepts the component type (class instance or function) the update is scheduled for.
exports.enableProfilerNestedUpdateScheduledHook = false;
exports.consoleManagedByDevToolsDuringStrictMode = true;
// Modern <StrictMode /> behaviour aligns more with what components
// components will encounter in production, especially when used With <Offscreen />.
// TODO: clean up legacy <StrictMode /> once tests pass WWW.
exports.useModernStrictMode = false;
exports.enableDO_NOT_USE_disableStrictPassiveEffect = false;
