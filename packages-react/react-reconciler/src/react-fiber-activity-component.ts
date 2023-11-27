import type { SpawnedCachePool } from "@zenflux/react-reconciler/src/react-fiber-cache-component";
import type { Lanes } from "@zenflux/react-reconciler/src/react-fiber-lane-constants";
import type { RetryQueue } from "@zenflux/react-reconciler/src/react-fiber-suspense-component";
import type { TracingMarkerInstance, Transition } from "@zenflux/react-reconciler/src/react-fiber-tracing-marker-component";
import type { Fiber } from "@zenflux/react-reconciler/src/react-internal-types";

import type { OffscreenMode, ReactNodeList, Wakeable } from "@zenflux/react-shared/src/react-types";

export type OffscreenProps = {
    // TODO: Pick an API before exposing the Offscreen type. I've chosen an enum
    // for now, since we might have multiple variants. For example, hiding the
    // content without changing the layout.
    //
    // Default mode is visible. Kind of a weird default for a component
    // called "Offscreen." Possible alt: <Visibility />?
    mode?: OffscreenMode | null | void;
    children?: ReactNodeList;
};
// We use the existence of the state object as an indicator that the component
// is hidden.
export type OffscreenState = {
    // TODO: This doesn't do anything, yet. It's always NoLanes. But eventually it
    // will represent the pending work that must be included in the render in
    // order to unhide the component.
    baseLanes: Lanes;
    cachePool: SpawnedCachePool | null;
};
export type OffscreenQueue = {
    transitions: Array<Transition> | null;
    markerInstances: Array<TracingMarkerInstance> | null;
    retryQueue: RetryQueue | null;
};
type OffscreenVisibility = number;
export const OffscreenVisible =
    /*                     */
    0b001;
export const OffscreenDetached =
    /*                    */
    0b010;
export const OffscreenPassiveEffectsConnected =
    /*     */
    0b100;
export type OffscreenInstance = {
    _pendingVisibility: OffscreenVisibility;
    _visibility: OffscreenVisibility;
    _pendingMarkers: Set<TracingMarkerInstance> | null;
    _transitions: Set<Transition> | null;
    _retryCache: WeakSet<Wakeable> | Set<Wakeable> | null;
    // Represents the current Offscreen fiber
    _current: Fiber | null;
    detach: () => void;
    attach: () => void;
};

export function isOffscreenManual( offscreenFiber: Fiber ): boolean {
    return offscreenFiber.memoizedProps !== null && offscreenFiber.memoizedProps.mode === "manual";
}