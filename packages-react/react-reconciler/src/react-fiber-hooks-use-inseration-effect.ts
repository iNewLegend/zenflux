import { Update as UpdateEffect } from "@zenflux/react-reconciler/src/react-fiber-flags";
import { Insertion as HookInsertion } from "@zenflux/react-reconciler/src/react-hook-effect-tags";
import { mountEffectImpl, updateEffectImpl } from "@zenflux/react-reconciler/src/react-fiber-hooks-use-effect";

import type { DependencyList } from "@zenflux/react-reconciler/src/react-fiber-hooks-types";

export function mountInsertionEffect( create: () => ( () => void ) | void, deps: DependencyList | undefined ): void {
    mountEffectImpl( UpdateEffect, HookInsertion, create, deps );
}

export function updateInsertionEffect( create: () => ( () => void ) | void, deps: DependencyList | undefined ): void {
    return updateEffectImpl( UpdateEffect, HookInsertion, create, deps );
}
