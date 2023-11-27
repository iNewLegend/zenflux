import { enableCache } from "@zenflux/react-shared/src/react-feature-flags";

import { releaseCache } from "@zenflux/react-reconciler/src/react-fiber-cache-component";
import { NoLanes } from "@zenflux/react-reconciler/src/react-fiber-lane-constants";

import type { Lanes} from "@zenflux/react-reconciler/src/react-fiber-lane-constants";
import type { FiberRoot } from "@zenflux/react-reconciler/src/react-internal-types";

export function reactReleaseRootPooledCache( root: FiberRoot, remainingLanes: Lanes ) {
    if ( enableCache ) {
        const pooledCacheLanes = root.pooledCacheLanes &= remainingLanes;

        if ( pooledCacheLanes === NoLanes ) {
            // None of the remaining work relies on the cache pool. Clear it so
            // subsequent requests get a new cache
            const pooledCache = root.pooledCache;

            if ( pooledCache != null ) {
                root.pooledCache = null;
                releaseCache( pooledCache );
            }
        }
    }
}
