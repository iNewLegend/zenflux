"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwOnHydrationMismatch = exports.shouldClientRenderOnMismatch = void 0;
var react_type_of_mode_1 = require("@zenflux/react-reconciler/src/react-type-of-mode");
var react_fiber_flags_1 = require("@zenflux/react-reconciler/src/react-fiber-flags");
function shouldClientRenderOnMismatch(fiber) {
    return (fiber.mode & react_type_of_mode_1.ConcurrentMode) !== react_type_of_mode_1.NoMode && (fiber.flags & react_fiber_flags_1.DidCapture) === react_fiber_flags_1.NoFlags;
}
exports.shouldClientRenderOnMismatch = shouldClientRenderOnMismatch;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function throwOnHydrationMismatch(fiber) {
    throw new Error("Hydration failed because the initial UI does not match what was " + "rendered on the server.");
}
exports.throwOnHydrationMismatch = throwOnHydrationMismatch;
