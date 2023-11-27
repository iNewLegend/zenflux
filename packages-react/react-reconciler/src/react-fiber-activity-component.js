"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOffscreenManual = exports.OffscreenPassiveEffectsConnected = exports.OffscreenDetached = exports.OffscreenVisible = void 0;
exports.OffscreenVisible = 
/*                     */
1;
exports.OffscreenDetached = 
/*                    */
2;
exports.OffscreenPassiveEffectsConnected = 
/*     */
4;
function isOffscreenManual(offscreenFiber) {
    return offscreenFiber.memoizedProps !== null && offscreenFiber.memoizedProps.mode === "manual";
}
exports.isOffscreenManual = isOffscreenManual;
