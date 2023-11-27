import {
    LayoutStatic as LayoutStaticEffect,
    MountLayoutDev as MountLayoutDevEffect,
    Update as UpdateEffect
} from "@zenflux/react-reconciler/src/react-fiber-flags";
import { ReactFiberHooksCurrent } from "@zenflux/react-reconciler/src/react-fiber-hooks-shared";
import { NoMode, StrictEffectsMode } from "@zenflux/react-reconciler/src/react-type-of-mode";
import { Layout as HookLayout } from "@zenflux/react-reconciler/src/react-hook-effect-tags";
import { mountEffectImpl, updateEffectImpl } from "@zenflux/react-reconciler/src/react-fiber-hooks-use-effect";

import type { Flags } from "@zenflux/react-reconciler/src/react-fiber-flags";
import type { DependencyList } from "@zenflux/react-reconciler/src/react-fiber-hooks-types";

export function mountLayoutEffect( create: () => ( () => void ) | void, deps: DependencyList | undefined ): void {
    let fiberFlags: Flags = UpdateEffect | LayoutStaticEffect;

    if ( __DEV__ && ( ReactFiberHooksCurrent.renderingFiber.mode & StrictEffectsMode ) !== NoMode ) {
        fiberFlags |= MountLayoutDevEffect;
    }

    return mountEffectImpl( fiberFlags, HookLayout, create, deps );
}

export function updateLayoutEffect( create: () => ( () => void ) | void, deps: DependencyList | undefined ): void {
    return updateEffectImpl( UpdateEffect, HookLayout, create, deps );
}
