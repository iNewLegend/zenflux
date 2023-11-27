/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE https://github.com/facebook/react/blob/main/LICENSE
 *
 * Sync with: https://github.com/facebook/react/blob/ce2bc58a9f6f3b0bfc8c738a0d8e2a5f3a332ff5/packages/shared/forks/ReactFeatureFlags.www.js
 */

import * as RequestFeatureFlags from "@zenflux/react-shared/src/react-feature-flags";

import type * as FeatureFlagsType from "@zenflux/react-shared/src/react-feature-flags";
// Import types for Flow type checking (assuming you have corresponding .d.ts files)
import type * as ExportsType from "@zenflux/react-shared/src/forks/react-feature-flags.www";
import type * as DynamicFeatureFlags from "@zenflux/react-shared/src/forks/react-feature-flags.www-dynamic";

// Re-export dynamic flags from the www version.
const dynamicFeatureFlags: typeof DynamicFeatureFlags = RequestFeatureFlags;

export const {
    disableInputAttributeSyncing,
    disableIEWorkarounds,
    enableTrustedTypesIntegration,
    replayFailedUnitOfWorkWithInvokeGuardedCallback,
    enableLegacyFBSupport,
    enableDebugTracing,
    enableUseRefAccessWarning,
    enableLazyContextPropagation,
    enableUnifiedSyncLane,
    enableTransitionTracing,
    enableCustomElementPropertySupport,
    enableDeferRootSchedulingToMicrotask,
    enableAsyncActions,
    alwaysThrottleRetries,
    enableDO_NOT_USE_disableStrictPassiveEffect,
    disableSchedulerTimeoutInWorkLoop,
    enableUseDeferredValueInitialArg,
} = dynamicFeatureFlags;

// On WWW, __EXPERIMENTAL__ is used for a new modern build.
// It's not used anywhere in production yet.

export const debugRenderPhaseSideEffectsForStrictMode: boolean = __DEV__;
export const enableProfilerTimer: boolean = __PROFILE__;
export const enableProfilerCommitHooks: boolean = __PROFILE__;
export const enableProfilerNestedUpdatePhase: boolean = __PROFILE__;
export const enableProfilerNestedUpdateScheduledHook: boolean =
    __PROFILE__ && dynamicFeatureFlags.enableProfilerNestedUpdateScheduledHook;
export const enableUpdaterTracking: boolean = __PROFILE__;

export const createRootStrictEffectsByDefault: boolean = false;
export const enableSuspenseAvoidThisFallback: boolean = true;
export const enableSuspenseAvoidThisFallbackFizz: boolean = false;

export const enableCPUSuspense: boolean = true;
export const enableFloat: boolean = true;
export const enableUseMemoCacheHook: boolean = true;
export const enableUseEffectEventHook: boolean = true;
export const enableHostSingletons: boolean = true;
export const enableClientRenderFallbackOnTextMismatch: boolean = false;
export const enableFilterEmptyStringAttributesDOM: boolean = true;

// Logs additional User Timing API marks for use with an experimental profiling tool.
export const enableSchedulingProfiler: boolean =
    __PROFILE__ && dynamicFeatureFlags.enableSchedulingProfiler;

// Note: we'll want to remove this when we to userland implementation.
// For now, we'll turn it on for everyone because it's *already* on for everyone in practice.
// At least this will let us stop shipping <Profiler> implementation to all users.
export const enableSchedulerDebugging: boolean = true;
export const disableLegacyContext: boolean = __EXPERIMENTAL__;
export const enableGetInspectorDataForInstanceInProduction: boolean = false;

export const enableCache: boolean = true;
export const enableLegacyCache: boolean = true;
export const enableCacheElement: boolean = true;
export const enableFetchInstrumentation: boolean = false;

export const enableFormActions: boolean = false;

export const enableBinaryFlight: boolean = true;
export const enableTaint: boolean = false;

export const enablePostpone: boolean = false;

export const disableJavaScriptURLs: boolean = true;

// TODO: www currently relies on this feature. It's disabled in open source.
// Need to remove it.
export const disableCommentsAsDOMContainers: boolean = false;

export const disableModulePatternComponents: boolean = true;

export const enableCreateEventHandleAPI: boolean = true;

export const enableScopeAPI: boolean = true;

export const enableSuspenseCallback: boolean = true;

export const enableLegacyHidden: boolean = true;

export const enableComponentStackLocations: boolean = true;

export const disableTextareaChildren: boolean = __EXPERIMENTAL__;

export const allowConcurrentByDefault: boolean = true;

export const consoleManagedByDevToolsDuringStrictMode: boolean = true;
export const enableServerContext: boolean = false;

export const useModernStrictMode: boolean = false;
export const enableFizzExternalRuntime: boolean = true;

export const forceConcurrentByDefaultForTesting: boolean = false;

export const useMicrotasksForSchedulingInFabric: boolean = false;
export const passChildrenWhenCloningPersistedNodes: boolean = false;

( ( null as any ) as typeof ExportsType ) as typeof FeatureFlagsType;
