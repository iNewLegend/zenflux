"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE https://github.com/facebook/react/blob/main/LICENSE
 *
 * Sync with: https://github.com/facebook/react/blob/ce2bc58a9f6f3b0bfc8c738a0d8e2a5f3a332ff5/packages/shared/forks/ReactFeatureFlags.www.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableScopeAPI = exports.enableCreateEventHandleAPI = exports.disableModulePatternComponents = exports.disableCommentsAsDOMContainers = exports.disableJavaScriptURLs = exports.enablePostpone = exports.enableTaint = exports.enableBinaryFlight = exports.enableFormActions = exports.enableFetchInstrumentation = exports.enableCacheElement = exports.enableLegacyCache = exports.enableCache = exports.enableGetInspectorDataForInstanceInProduction = exports.disableLegacyContext = exports.enableSchedulerDebugging = exports.enableSchedulingProfiler = exports.enableFilterEmptyStringAttributesDOM = exports.enableClientRenderFallbackOnTextMismatch = exports.enableHostSingletons = exports.enableUseEffectEventHook = exports.enableUseMemoCacheHook = exports.enableFloat = exports.enableCPUSuspense = exports.enableSuspenseAvoidThisFallbackFizz = exports.enableSuspenseAvoidThisFallback = exports.createRootStrictEffectsByDefault = exports.enableUpdaterTracking = exports.enableProfilerNestedUpdateScheduledHook = exports.enableProfilerNestedUpdatePhase = exports.enableProfilerCommitHooks = exports.enableProfilerTimer = exports.debugRenderPhaseSideEffectsForStrictMode = exports.enableUseDeferredValueInitialArg = exports.disableSchedulerTimeoutInWorkLoop = exports.enableDO_NOT_USE_disableStrictPassiveEffect = exports.alwaysThrottleRetries = exports.enableAsyncActions = exports.enableDeferRootSchedulingToMicrotask = exports.enableCustomElementPropertySupport = exports.enableTransitionTracing = exports.enableUnifiedSyncLane = exports.enableLazyContextPropagation = exports.enableUseRefAccessWarning = exports.enableDebugTracing = exports.enableLegacyFBSupport = exports.replayFailedUnitOfWorkWithInvokeGuardedCallback = exports.enableTrustedTypesIntegration = exports.disableIEWorkarounds = exports.disableInputAttributeSyncing = void 0;
exports.passChildrenWhenCloningPersistedNodes = exports.useMicrotasksForSchedulingInFabric = exports.forceConcurrentByDefaultForTesting = exports.enableFizzExternalRuntime = exports.useModernStrictMode = exports.enableServerContext = exports.consoleManagedByDevToolsDuringStrictMode = exports.allowConcurrentByDefault = exports.disableTextareaChildren = exports.enableComponentStackLocations = exports.enableLegacyHidden = exports.enableSuspenseCallback = void 0;
var RequestFeatureFlags = require("@zenflux/react-shared/src/react-feature-flags");
// Re-export dynamic flags from the www version.
var dynamicFeatureFlags = RequestFeatureFlags;
exports.disableInputAttributeSyncing = dynamicFeatureFlags.disableInputAttributeSyncing, exports.disableIEWorkarounds = dynamicFeatureFlags.disableIEWorkarounds, exports.enableTrustedTypesIntegration = dynamicFeatureFlags.enableTrustedTypesIntegration, exports.replayFailedUnitOfWorkWithInvokeGuardedCallback = dynamicFeatureFlags.replayFailedUnitOfWorkWithInvokeGuardedCallback, exports.enableLegacyFBSupport = dynamicFeatureFlags.enableLegacyFBSupport, exports.enableDebugTracing = dynamicFeatureFlags.enableDebugTracing, exports.enableUseRefAccessWarning = dynamicFeatureFlags.enableUseRefAccessWarning, exports.enableLazyContextPropagation = dynamicFeatureFlags.enableLazyContextPropagation, exports.enableUnifiedSyncLane = dynamicFeatureFlags.enableUnifiedSyncLane, exports.enableTransitionTracing = dynamicFeatureFlags.enableTransitionTracing, exports.enableCustomElementPropertySupport = dynamicFeatureFlags.enableCustomElementPropertySupport, exports.enableDeferRootSchedulingToMicrotask = dynamicFeatureFlags.enableDeferRootSchedulingToMicrotask, exports.enableAsyncActions = dynamicFeatureFlags.enableAsyncActions, exports.alwaysThrottleRetries = dynamicFeatureFlags.alwaysThrottleRetries, exports.enableDO_NOT_USE_disableStrictPassiveEffect = dynamicFeatureFlags.enableDO_NOT_USE_disableStrictPassiveEffect, exports.disableSchedulerTimeoutInWorkLoop = dynamicFeatureFlags.disableSchedulerTimeoutInWorkLoop, exports.enableUseDeferredValueInitialArg = dynamicFeatureFlags.enableUseDeferredValueInitialArg;
// On WWW, __EXPERIMENTAL__ is used for a new modern build.
// It's not used anywhere in production yet.
exports.debugRenderPhaseSideEffectsForStrictMode = __DEV__;
exports.enableProfilerTimer = __PROFILE__;
exports.enableProfilerCommitHooks = __PROFILE__;
exports.enableProfilerNestedUpdatePhase = __PROFILE__;
exports.enableProfilerNestedUpdateScheduledHook = __PROFILE__ && dynamicFeatureFlags.enableProfilerNestedUpdateScheduledHook;
exports.enableUpdaterTracking = __PROFILE__;
exports.createRootStrictEffectsByDefault = false;
exports.enableSuspenseAvoidThisFallback = true;
exports.enableSuspenseAvoidThisFallbackFizz = false;
exports.enableCPUSuspense = true;
exports.enableFloat = true;
exports.enableUseMemoCacheHook = true;
exports.enableUseEffectEventHook = true;
exports.enableHostSingletons = true;
exports.enableClientRenderFallbackOnTextMismatch = false;
exports.enableFilterEmptyStringAttributesDOM = true;
// Logs additional User Timing API marks for use with an experimental profiling tool.
exports.enableSchedulingProfiler = __PROFILE__ && dynamicFeatureFlags.enableSchedulingProfiler;
// Note: we'll want to remove this when we to userland implementation.
// For now, we'll turn it on for everyone because it's *already* on for everyone in practice.
// At least this will let us stop shipping <Profiler> implementation to all users.
exports.enableSchedulerDebugging = true;
exports.disableLegacyContext = __EXPERIMENTAL__;
exports.enableGetInspectorDataForInstanceInProduction = false;
exports.enableCache = true;
exports.enableLegacyCache = true;
exports.enableCacheElement = true;
exports.enableFetchInstrumentation = false;
exports.enableFormActions = false;
exports.enableBinaryFlight = true;
exports.enableTaint = false;
exports.enablePostpone = false;
exports.disableJavaScriptURLs = true;
// TODO: www currently relies on this feature. It's disabled in open source.
// Need to remove it.
exports.disableCommentsAsDOMContainers = false;
exports.disableModulePatternComponents = true;
exports.enableCreateEventHandleAPI = true;
exports.enableScopeAPI = true;
exports.enableSuspenseCallback = true;
exports.enableLegacyHidden = true;
exports.enableComponentStackLocations = true;
exports.disableTextareaChildren = __EXPERIMENTAL__;
exports.allowConcurrentByDefault = true;
exports.consoleManagedByDevToolsDuringStrictMode = true;
exports.enableServerContext = false;
exports.useModernStrictMode = false;
exports.enableFizzExternalRuntime = true;
exports.forceConcurrentByDefaultForTesting = false;
exports.useMicrotasksForSchedulingInFabric = false;
exports.passChildrenWhenCloningPersistedNodes = false;
null;
