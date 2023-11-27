"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findFirstSuspended = void 0;
var react_fiber_flags_1 = require("@zenflux/react-reconciler/src/react-fiber-flags");
var react_work_tags_1 = require("@zenflux/react-reconciler/src/react-work-tags");
var _a = globalThis.__RECONCILER__CONFIG__, isSuspenseInstancePending = _a.isSuspenseInstancePending, isSuspenseInstanceFallback = _a.isSuspenseInstanceFallback;
function findFirstSuspended(row) {
    var node = row;
    while (node !== null) {
        if (node.tag === react_work_tags_1.SuspenseComponent) {
            var state = node.memoizedState;
            if (state !== null) {
                var dehydrated = state.dehydrated;
                if (dehydrated === null || isSuspenseInstancePending(dehydrated) || isSuspenseInstanceFallback(dehydrated)) {
                    return node;
                }
            }
        }
        else if (node.tag === react_work_tags_1.SuspenseListComponent && // revealOrder undefined can't be trusted because it don't
            // keep track of whether it suspended or not.
            node.memoizedProps.revealOrder !== undefined) {
            var didSuspend = (node.flags & react_fiber_flags_1.DidCapture) !== react_fiber_flags_1.NoFlags;
            if (didSuspend) {
                return node;
            }
        }
        else if (node.child !== null) {
            node.child.return = node;
            node = node.child;
            continue;
        }
        if (node === row) {
            return null;
        }
        while (node.sibling === null) {
            if (node.return === null || node.return === row) {
                return null;
            }
            node = node.return;
        }
        node.sibling.return = node.return;
        node = node.sibling;
    }
    return null;
}
exports.findFirstSuspended = findFirstSuspended;
