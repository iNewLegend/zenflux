const {
    enableProfiling: enableProfilingFeatureFlag
} = // $FlowFixMe[cannot-resolve-module]
    require( "SchedulerFeatureFlags" );

export const enableSchedulerDebugging = true;
export const enableProfiling: boolean = __PROFILE__ && enableProfilingFeatureFlag;
export const enableIsInputPending = true;
export const enableIsInputPendingContinuous = true;
export const frameYieldMs = 5;
export const continuousYieldMs = 10;
export const maxYieldMs = 10;

// TODO: Find better solution for this
declare const __PROFILE__: boolean;
