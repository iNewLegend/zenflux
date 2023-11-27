"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxYieldMs = exports.continuousYieldMs = exports.frameYieldMs = exports.enableIsInputPendingContinuous = exports.enableIsInputPending = exports.enableProfiling = exports.enableSchedulerDebugging = void 0;
var enableProfilingFeatureFlag = require("SchedulerFeatureFlags").enableProfiling;
exports.enableSchedulerDebugging = true;
exports.enableProfiling = __PROFILE__ && enableProfilingFeatureFlag;
exports.enableIsInputPending = true;
exports.enableIsInputPendingContinuous = true;
exports.frameYieldMs = 5;
exports.continuousYieldMs = 10;
exports.maxYieldMs = 10;
