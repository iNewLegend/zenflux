"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRenderConsistentWithExternalStores = void 0;
var object_is_1 = require("@zenflux/react-shared/src/object-is");
var react_fiber_flags_1 = require("@zenflux/react-reconciler/src/react-fiber-flags");
function isRenderConsistentWithExternalStores(finishedWork) {
    // Search the rendered tree for external store reads, and check whether the
    // stores were mutated in a concurrent event. Intentionally using an iterative
    // loop instead of recursion so we can exit early.
    var node = finishedWork;
    while (true) {
        if (node.flags & react_fiber_flags_1.StoreConsistency) {
            var updateQueue = node.updateQueue;
            if (updateQueue !== null) {
                var checks = updateQueue.stores;
                if (checks !== null) {
                    for (var i_1 = 0; i_1 < checks.length; i_1++) {
                        var check = checks[i_1];
                        var getSnapshot = check.getSnapshot;
                        var renderedValue = check.value;
                        try {
                            if (!(0, object_is_1.default)(getSnapshot(), renderedValue)) {
                                // Found an inconsistent store.
                                return false;
                            }
                        }
                        catch (error) {
                            // If `getSnapshot` throws, return `false`. This will schedule
                            // a re-render, and the error will be rethrown during render.
                            return false;
                        }
                    }
                }
            }
        }
        var child = node.child;
        if (node.subtreeFlags & react_fiber_flags_1.StoreConsistency && child !== null) {
            child.return = node;
            node = child;
            continue;
        }
        if (node === finishedWork) {
            return true;
        }
        while (node.sibling === null) {
            if (node.return === null || node.return === finishedWork) {
                return true;
            }
            node = node.return;
        }
        node.sibling.return = node.return;
        node = node.sibling;
    }
    // Flow doesn't know this is unreachable, but eslint does
    // eslint-disable-next-line no-unreachable
    return true;
}
exports.isRenderConsistentWithExternalStores = isRenderConsistentWithExternalStores;
