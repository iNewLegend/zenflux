"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRootDehydrated = void 0;
// This is imported by the event replaying implementation in React DOM. It's
// in a separate file to break a circular dependency between the renderer and
// the reconciler.
function isRootDehydrated(root) {
    var currentState = root.current.memoizedState;
    return currentState.isDehydrated;
}
exports.isRootDehydrated = isRootDehydrated;
