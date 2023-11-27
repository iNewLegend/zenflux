"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE https://github.com/facebook/react/blob/main/LICENSE
 *
 * Sync with: https://github.com/facebook/react/blob/ce2bc58a9f6f3b0bfc8c738a0d8e2a5f3a332ff5/packages/shared/forks/ReactFeatureFlags.www-dynamic.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableTrustedTypesIntegration = exports.replayFailedUnitOfWorkWithInvokeGuardedCallback = exports.enableSchedulingProfiler = exports.enableDebugTracing = exports.enableUseDeferredValueInitialArg = exports.enableDO_NOT_USE_disableStrictPassiveEffect = exports.alwaysThrottleRetries = exports.enableAsyncActions = exports.enableDeferRootSchedulingToMicrotask = exports.enableCustomElementPropertySupport = exports.enableTransitionTracing = exports.enableUnifiedSyncLane = exports.forceConcurrentByDefaultForTesting = exports.enableLazyContextPropagation = exports.disableSchedulerTimeoutInWorkLoop = exports.enableProfilerNestedUpdateScheduledHook = exports.enableUseRefAccessWarning = exports.enableLegacyFBSupport = exports.disableIEWorkarounds = exports.disableInputAttributeSyncing = void 0;
// In www, these flags are controlled by GKs. Because most GKs have some
// population running in either mode, we should run our tests that way, too,
//
// Use __VARIANT__ to simulate a GK. The tests will be run twice: once
// with the __VARIANT__ set to `true`, and once set to `false`.
exports.disableInputAttributeSyncing = __VARIANT__;
exports.disableIEWorkarounds = __VARIANT__;
exports.enableLegacyFBSupport = __VARIANT__;
exports.enableUseRefAccessWarning = __VARIANT__;
exports.enableProfilerNestedUpdateScheduledHook = __VARIANT__;
exports.disableSchedulerTimeoutInWorkLoop = __VARIANT__;
exports.enableLazyContextPropagation = __VARIANT__;
exports.forceConcurrentByDefaultForTesting = __VARIANT__;
exports.enableUnifiedSyncLane = __VARIANT__;
exports.enableTransitionTracing = __VARIANT__;
exports.enableCustomElementPropertySupport = __VARIANT__;
exports.enableDeferRootSchedulingToMicrotask = __VARIANT__;
exports.enableAsyncActions = __VARIANT__;
exports.alwaysThrottleRetries = __VARIANT__;
exports.enableDO_NOT_USE_disableStrictPassiveEffect = __VARIANT__;
exports.enableUseDeferredValueInitialArg = __VARIANT__;
// Enable this flag to help with concurrent mode debugging.
// It logs information to the console about React scheduling, rendering, and commit phases.
//
// NOTE: This feature will only work in DEV mode; all callsites are wrapped with __DEV__.
exports.enableDebugTracing = __EXPERIMENTAL__;
exports.enableSchedulingProfiler = __VARIANT__;
// These are already tested in both modes using the build type dimension,
// so we don't need to use __VARIANT__ to get extra coverage.
exports.replayFailedUnitOfWorkWithInvokeGuardedCallback = __DEV__;
// TODO: These flags are hard-coded to the default values used in open source.
// Update the tests so that they pass in either mode, then set these
// to __VARIANT__.
exports.enableTrustedTypesIntegration = false; // You probably *don't* want to add more hardcoded ones.
// Instead, try to add them above with the __VARIANT__ value.
