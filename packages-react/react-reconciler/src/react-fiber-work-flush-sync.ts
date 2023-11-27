import ReactSharedInternals from "@zenflux/react-shared/src/react-shared-internals";

import {
    activateBatchedExecutionContext,
    getExecutionContext,
    isExecutionContextRenderOrCommitActivate, setExecutionContext
} from "@zenflux/react-reconciler/src/react-fiber-work-excution-context";
import { ReactFiberWorkOnRootShared } from "@zenflux/react-reconciler/src/react-fiber-work-on-root-shared";
import {
    flushPassiveEffects,
    getRootWithPendingPassiveEffectsSafe,
    hasRootWithPendingPassiveEffects
} from "@zenflux/react-reconciler/src/react-fiber-work-passive-effects";

import {
    DiscreteEventPriority,
    getCurrentUpdatePriority,
    setCurrentUpdatePriority
} from "@zenflux/react-reconciler/src/react-event-priorities";

import { LegacyRoot } from "@zenflux/react-reconciler/src/react-root-tags";

const {
    ReactCurrentBatchConfig,
} = ReactSharedInternals;

// Overload the definition to the two valid signatures.
// Warning, this opts-out of checking the function body.
// eslint-disable-next-line no-unused-vars
// declare function flushSync<R>( fn: () => R ): R;
// eslint-disable-next-line no-redeclare
// declare function flushSync( arg0: void ): void;
// eslint-disable-next-line no-redeclare
export function flushSync<R>( fn: ( () => R ) | void ): R | void {
    // In legacy mode, we flush pending passive effects at the beginning of the
    // next event, not at the end of the previous one.
    if ( hasRootWithPendingPassiveEffects() && getRootWithPendingPassiveEffectsSafe().tag === LegacyRoot && isExecutionContextRenderOrCommitActivate()) {
        flushPassiveEffects();
    }

    const prevExecutionContext = getExecutionContext();

    activateBatchedExecutionContext();

    const prevTransition = ReactCurrentBatchConfig.transition;
    const previousPriority = getCurrentUpdatePriority();

    try {
        ReactCurrentBatchConfig.transition = null;
        setCurrentUpdatePriority( DiscreteEventPriority );

        if ( fn ) {
            return fn();
        } else {
            return undefined;
        }
    } finally {
        setCurrentUpdatePriority( previousPriority );
        ReactCurrentBatchConfig.transition = prevTransition;
        setExecutionContext( prevExecutionContext );

        // Flush the immediate callbacks that were scheduled during this batch.
        // Note that this will happen even if batchedUpdates is higher up
        // the stack.
        if ( isExecutionContextRenderOrCommitActivate()) {
            ReactFiberWorkOnRootShared.flushSyncWorkOnAllRoots();
        }
    }
}
