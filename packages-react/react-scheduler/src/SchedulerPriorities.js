"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdlePriority = exports.LowPriority = exports.NormalPriority = exports.UserBlockingPriority = exports.ImmediatePriority = exports.NoPriority = void 0;
// TODO: Use symbols?
exports.NoPriority = 0;
exports.ImmediatePriority = 1;
exports.UserBlockingPriority = 2;
exports.NormalPriority = 3;
exports.LowPriority = 4;
exports.IdlePriority = 5;
// Debug protection to make sure we don't double-define the package.
if ("undefined" === typeof globalThis.__REACT_SCHEDULER_DEF__) {
    globalThis.__REACT_SCHEDULER_DEF__ = true;
}
else {
    throw new Error("Scheduler already loaded");
}
