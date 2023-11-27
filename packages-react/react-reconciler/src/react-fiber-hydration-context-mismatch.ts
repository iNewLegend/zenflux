
import { ConcurrentMode, NoMode } from "@zenflux/react-reconciler/src/react-type-of-mode";
import { DidCapture, NoFlags } from "@zenflux/react-reconciler/src/react-fiber-flags";

import type { Fiber } from "@zenflux/react-reconciler/src/react-internal-types";

export function shouldClientRenderOnMismatch( fiber: Fiber ) {
    return ( fiber.mode & ConcurrentMode ) !== NoMode && ( fiber.flags & DidCapture ) === NoFlags;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function throwOnHydrationMismatch( fiber: Fiber ) {
    throw new Error( "Hydration failed because the initial UI does not match what was " + "rendered on the server." );
}
