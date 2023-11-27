import { useModernStrictMode } from "@zenflux/react-shared/src/react-feature-flags";

import { REACT_STRICT_MODE_TYPE } from "@zenflux/react-shared/src/react-symbols";

import { ConcurrentRoot, LegacyRoot } from "@zenflux/react-reconciler/src/react-root-tags";
import {
    NoMode,
    NoStrictPassiveEffectsMode,
    StrictEffectsMode,
    StrictLegacyMode
} from "@zenflux/react-reconciler/src/react-type-of-mode";

import { OffscreenComponent } from "@zenflux/react-reconciler/src/react-work-tags";

import {
    MountLayoutDev,
    MountPassiveDev,
    NoFlags,
    PlacementDEV,
    Visibility
} from "@zenflux/react-reconciler/src/react-fiber-flags";

import {
    resetCurrentFiber as resetCurrentDebugFiberInDEV,
    setCurrentFiber as setCurrentDebugFiberInDEV
} from "@zenflux/react-reconciler/src/react-current-fiber";

import {
    disconnectPassiveEffect,
    reconnectPassiveEffects
} from "@zenflux/react-reconciler/src/react-fiber-work-commit-passive";

import { NoLanes } from "@zenflux/react-reconciler/src/react-fiber-lane-constants";

import {
    disappearLayoutEffects,
    invokeLayoutEffectMountInDEV,
    invokeLayoutEffectUnmountInDEV, invokePassiveEffectMountInDEV,
    invokePassiveEffectUnmountInDEV, reappearLayoutEffects
} from "@zenflux/react-reconciler/src/react-fiber-commit-effect";

import { ReactFiberWorkDoubleInvokeSharedDev } from "@zenflux/react-reconciler/src/react-fiber-work-double-invoke-shared-dev";

import type { Flags } from "@zenflux/react-reconciler/src/react-fiber-flags";
import type { Fiber, FiberRoot } from "@zenflux/react-reconciler/src/react-internal-types";

// ---
// Find better solution for this
// ---
type CommitDoubleInvokeEffectsInDEVCallback = typeof commitDoubleInvokeEffectsInDEV;

export type {
    CommitDoubleInvokeEffectsInDEVCallback
};

ReactFiberWorkDoubleInvokeSharedDev.commitDoubleInvokeEffectsInDEV = commitDoubleInvokeEffectsInDEV;

// ---

function invokeEffectsInDev( firstChild: Fiber, fiberFlags: Flags, invokeEffectFn: ( fiber: Fiber ) => void ) {
    let current: null | Fiber = firstChild;
    let subtreeRoot: null | Fiber = null;

    while ( current != null ) {
        const primarySubtreeFlag = current.subtreeFlags & fiberFlags;

        if ( current !== subtreeRoot && current.child != null && primarySubtreeFlag !== NoFlags ) {
            current = current.child;
        } else {
            if ( ( current.flags & fiberFlags ) !== NoFlags ) {
                invokeEffectFn( current );
            }

            if ( current.sibling !== null ) {
                current = current.sibling;
            } else {
                current = subtreeRoot = current.return;
            }
        }
    }
}

function legacyCommitDoubleInvokeEffectsInDEV( fiber: Fiber, hasPassiveEffects: boolean ) {
    // TODO (StrictEffects) Should we set a marker on the root if it contains strict effects
    // so we don't traverse unnecessarily? similar to subtreeFlags but just at the root level.
    // Maybe not a big deal since this is DEV only behavior.
    setCurrentDebugFiberInDEV( fiber );
    invokeEffectsInDev( fiber, MountLayoutDev, invokeLayoutEffectUnmountInDEV );

    if ( hasPassiveEffects ) {
        invokeEffectsInDev( fiber, MountPassiveDev, invokePassiveEffectUnmountInDEV );
    }

    invokeEffectsInDev( fiber, MountLayoutDev, invokeLayoutEffectMountInDEV );

    if ( hasPassiveEffects ) {
        invokeEffectsInDev( fiber, MountPassiveDev, invokePassiveEffectMountInDEV );
    }

    resetCurrentDebugFiberInDEV();
}

// Unconditionally disconnects and connects passive and layout effects.
function doubleInvokeEffectsOnFiber( root: FiberRoot, fiber: Fiber, shouldDoubleInvokePassiveEffects: boolean = true ) {
    disappearLayoutEffects( fiber );

    if ( shouldDoubleInvokePassiveEffects ) {
        disconnectPassiveEffect( fiber );
    }

    reappearLayoutEffects( root, fiber.alternate, fiber, false );

    if ( shouldDoubleInvokePassiveEffects ) {
        reconnectPassiveEffects( root, fiber, NoLanes, null, false );
    }
}

function doubleInvokeEffectsInDEVIfNecessary( root: FiberRoot, fiber: Fiber, parentIsInStrictMode: boolean ) {
    const isStrictModeFiber = fiber.type === REACT_STRICT_MODE_TYPE;
    const isInStrictMode = parentIsInStrictMode || isStrictModeFiber;

    // First case: the fiber **is not** of type OffscreenComponent. No
    // special rules apply to double invoking effects.
    if ( fiber.tag !== OffscreenComponent ) {
        if ( fiber.flags & PlacementDEV ) {
            setCurrentDebugFiberInDEV( fiber );

            if ( isInStrictMode ) {
                doubleInvokeEffectsOnFiber( root, fiber, ( fiber.mode & NoStrictPassiveEffectsMode ) === NoMode );
            }

            resetCurrentDebugFiberInDEV();
        } else {
            recursivelyTraverseAndDoubleInvokeEffectsInDEV( root, fiber, isInStrictMode );
        }

        return;
    }

    // Second case: the fiber **is** of type OffscreenComponent.
    // This branch contains cases specific to Offscreen.
    if ( fiber.memoizedState === null ) {
        // Only consider Offscreen that is visible.
        // TODO (Offscreen) Handle manual mode.
        setCurrentDebugFiberInDEV( fiber );

        if ( isInStrictMode && fiber.flags & Visibility ) {
            // Double invoke effects on Offscreen's subtree only
            // if it is visible and its visibility has changed.
            doubleInvokeEffectsOnFiber( root, fiber );
        } else if ( fiber.subtreeFlags & PlacementDEV ) {
            // Something in the subtree could have been suspended.
            // We need to continue traversal and find newly inserted fibers.
            recursivelyTraverseAndDoubleInvokeEffectsInDEV( root, fiber, isInStrictMode );
        }

        resetCurrentDebugFiberInDEV();
    }
}

function recursivelyTraverseAndDoubleInvokeEffectsInDEV( root: FiberRoot, parentFiber: Fiber, isInStrictMode: boolean ) {
    if ( ( parentFiber.subtreeFlags & ( PlacementDEV | Visibility ) ) === NoFlags ) {
        // Parent's descendants have already had effects double invoked.
        // Early exit to avoid unnecessary tree traversal.
        return;
    }

    let child = parentFiber.child;

    while ( child !== null ) {
        doubleInvokeEffectsInDEVIfNecessary( root, child, isInStrictMode );
        child = child.sibling;
    }
}

function commitDoubleInvokeEffectsInDEV( root: FiberRoot, hasPassiveEffects: boolean ) {
    if ( __DEV__ ) {
        if ( useModernStrictMode ) {
            let doubleInvokeEffects = true;

            if ( root.tag === LegacyRoot && ! ( root.current.mode & StrictLegacyMode ) ) {
                doubleInvokeEffects = false;
            }

            if ( root.tag === ConcurrentRoot && ! ( root.current.mode & ( StrictLegacyMode | StrictEffectsMode ) ) ) {
                doubleInvokeEffects = false;
            }

            recursivelyTraverseAndDoubleInvokeEffectsInDEV( root, root.current, doubleInvokeEffects );
        } else {
            legacyCommitDoubleInvokeEffectsInDEV( root.current, hasPassiveEffects );
        }
    }
}
