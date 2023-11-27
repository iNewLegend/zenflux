
import { ConcurrentMode } from "@zenflux/react-reconciler/src/react-type-of-mode";
import { ScheduleRetry, ShouldCapture } from "@zenflux/react-reconciler/src/react-fiber-flags";
import { noopSuspenseyCommitThenable } from "@zenflux/react-reconciler/src/react-fiber-thenable";

import { attachPingListener } from "@zenflux/react-reconciler/src/react-fiber-work-in-progress-ping";

import type { OffscreenQueue } from "@zenflux/react-reconciler/src/react-fiber-activity-component";
import type { Wakeable } from "@zenflux/react-shared/src/react-types";
import type { Fiber, FiberRoot } from "@zenflux/react-reconciler/src/react-internal-types";
import type { Lanes } from "@zenflux/react-reconciler/src/react-fiber-lane-constants";

export function handleOffscreenComponent(
    sourceFiber: Fiber,
    returnFiber: Fiber,
    suspenseBoundary: any,
    root: FiberRoot,
    rootRenderLanes: Lanes,
    wakeable: Wakeable,
) {
    let halt = suspenseBoundary.mode & ConcurrentMode;

    if ( halt ) {
        suspenseBoundary.flags |= ShouldCapture;
        const isSuspenseyResource = wakeable === noopSuspenseyCommitThenable;

        if ( isSuspenseyResource ) {
            suspenseBoundary.flags |= ScheduleRetry;
        } else {
            const offscreenQueue: OffscreenQueue | null = ( suspenseBoundary.updateQueue as any );

            if ( offscreenQueue === null ) {
                suspenseBoundary.updateQueue = {
                    transitions: null,
                    markerInstances: null,
                    retryQueue: new Set( [ wakeable ] )
                };
            } else {
                const retryQueue = offscreenQueue.retryQueue;

                if ( retryQueue === null ) {
                    offscreenQueue.retryQueue = new Set( [ wakeable ] );
                } else {
                    retryQueue.add( wakeable );
                }
            }

            attachPingListener( root, wakeable, rootRenderLanes );
        }
    }

    return halt;
}
