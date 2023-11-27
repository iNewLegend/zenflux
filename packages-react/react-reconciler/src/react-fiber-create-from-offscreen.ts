import { REACT_OFFSCREEN_TYPE } from "@zenflux/react-shared/src/react-symbols";

import { OffscreenVisible } from "@zenflux/react-reconciler/src/react-fiber-activity-component";

import { OffscreenComponent } from "@zenflux/react-reconciler/src/react-work-tags";

import { attachOffscreenInstance, detachOffscreenInstance } from "@zenflux/react-reconciler/src/react-fiber-commit-work-offscreen-instance";

import { createFiber } from "@zenflux/react-reconciler/src/react-fiber";

import type { OffscreenInstance, OffscreenProps} from "@zenflux/react-reconciler/src/react-fiber-activity-component";
import type { TypeOfMode } from "@zenflux/react-reconciler/src/react-type-of-mode";
import type { Lanes } from "@zenflux/react-reconciler/src/react-fiber-lane-constants";
import type { Fiber } from "@zenflux/react-reconciler/src/react-internal-types";

export function createFiberFromOffscreen( pendingProps: OffscreenProps, mode: TypeOfMode, lanes: Lanes, key: null | string ): Fiber {
    const fiber = createFiber( OffscreenComponent, pendingProps, key, mode );
    fiber.elementType = REACT_OFFSCREEN_TYPE;
    fiber.lanes = lanes;
    const primaryChildInstance: OffscreenInstance = {
        _visibility: OffscreenVisible,
        _pendingVisibility: OffscreenVisible,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null,
        _current: null,
        detach: () => detachOffscreenInstance( primaryChildInstance ),
        attach: () => attachOffscreenInstance( primaryChildInstance )
    };
    fiber.stateNode = primaryChildInstance;
    return fiber;
}
