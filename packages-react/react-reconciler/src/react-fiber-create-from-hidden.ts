import { REACT_LEGACY_HIDDEN_TYPE } from "@zenflux/react-shared/src/react-symbols";

import { OffscreenVisible } from "@zenflux/react-reconciler/src/react-fiber-activity-component";

import { LegacyHiddenComponent } from "@zenflux/react-reconciler/src/react-work-tags";

import { attachOffscreenInstance, detachOffscreenInstance } from "@zenflux/react-reconciler/src/react-fiber-commit-work-offscreen-instance";

import { createFiber } from "@zenflux/react-reconciler/src/react-fiber";

import type { OffscreenInstance, OffscreenProps} from "@zenflux/react-reconciler/src/react-fiber-activity-component";
import type { TypeOfMode } from "@zenflux/react-reconciler/src/react-type-of-mode";
import type { Lanes } from "@zenflux/react-reconciler/src/react-fiber-lane-constants";
import type { Fiber } from "@zenflux/react-reconciler/src/react-internal-types";

export function createFiberFromLegacyHidden( pendingProps: OffscreenProps, mode: TypeOfMode, lanes: Lanes, key: null | string ): Fiber {
    const fiber = createFiber( LegacyHiddenComponent, pendingProps, key, mode );
    fiber.elementType = REACT_LEGACY_HIDDEN_TYPE;
    fiber.lanes = lanes;
    // Adding a stateNode for legacy hidden because it's currently using
    // the offscreen implementation, which depends on a state node
    const instance: OffscreenInstance = {
        _visibility: OffscreenVisible,
        _pendingVisibility: OffscreenVisible,
        _pendingMarkers: null,
        _transitions: null,
        _retryCache: null,
        _current: null,
        detach: () => detachOffscreenInstance( instance ),
        attach: () => attachOffscreenInstance( instance )
    };
    fiber.stateNode = instance;
    return fiber;
}
