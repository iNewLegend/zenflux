"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulePostPaintCallback = void 0;
var requestPostPaintCallback = globalThis.__RECONCILER__CONFIG__.requestPostPaintCallback;
var postPaintCallbackScheduled = false;
var callbacks = [];
function schedulePostPaintCallback(callback) {
    callbacks.push(callback);
    if (!postPaintCallbackScheduled) {
        postPaintCallbackScheduled = true;
        requestPostPaintCallback(function (endTime) {
            for (var i_1 = 0; i_1 < callbacks.length; i_1++) {
                callbacks[i_1](endTime);
            }
            postPaintCallbackScheduled = false;
            callbacks = [];
        });
    }
}
exports.schedulePostPaintCallback = schedulePostPaintCallback;
