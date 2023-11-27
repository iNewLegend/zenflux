import {
    LayoutStatic as LayoutStaticEffect,
    MountLayoutDev as MountLayoutDevEffect,
    Update as UpdateEffect
} from "@zenflux/react-reconciler/src/react-fiber-flags";
import { ReactFiberHooksCurrent } from "@zenflux/react-reconciler/src/react-fiber-hooks-shared";
import { NoMode, StrictEffectsMode } from "@zenflux/react-reconciler/src/react-type-of-mode";
import { Layout as HookLayout } from "@zenflux/react-reconciler/src/react-hook-effect-tags";

import { mountEffectImpl, updateEffectImpl } from "@zenflux/react-reconciler/src/react-fiber-hooks-use-effect";

import type { DependencyList, Ref } from "@zenflux/react-reconciler/src/react-fiber-hooks-types";
import type {
    Flags} from "@zenflux/react-reconciler/src/react-fiber-flags";

function imperativeHandleEffect<T>( create: () => T, ref: Ref<T> | undefined ): void | ( () => void ) {
    if ( typeof ref === "function" ) {
        const refCallback = ref;
        const inst = create();
        refCallback( inst );
        return () => {
            refCallback( null );
        };
    } else if ( ref !== null && ref !== undefined ) {
        const refObject = ref;

        if ( __DEV__ ) {
            if ( ! refObject.hasOwnProperty( "current" ) ) {
                console.error( "Expected useImperativeHandle() first argument to either be a " + "ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys( refObject ).join( ", " ) + "}" );
            }
        }

        const inst = create();

        // TODO: React types protect current as readonly, but imperativelyHandle needs to
        // @ts-ignore
        refObject[ "current" ] = inst;
        return () => {
            // @ts-ignore
            refObject[ "current" ] = null;
        };
    }
}

export function mountImperativeHandle<T>( ref: Ref<T> | undefined, create: () => T, deps: DependencyList | undefined ): void {
    if ( __DEV__ ) {
        if ( typeof create !== "function" ) {
            console.error( "Expected useImperativeHandle() second argument to be a function " + "that creates a handle. Instead received: %s.", create !== null ? typeof create : "null" );
        }
    }

    // TODO: If deps are provided, should we skip comparing the ref itself?
    const effectDeps = deps !== null && deps !== undefined ? deps.concat( [ ref ] ) : null;
    let fiberFlags: Flags = UpdateEffect | LayoutStaticEffect;

    if ( __DEV__ && ( ReactFiberHooksCurrent.renderingFiber.mode & StrictEffectsMode ) !== NoMode ) {
        fiberFlags |= MountLayoutDevEffect;
    }

    mountEffectImpl( fiberFlags, HookLayout, imperativeHandleEffect.bind( null, create, ref ), effectDeps );
}

export function updateImperativeHandle<T>( ref: Ref<T> | undefined, create: () => T, deps: DependencyList | undefined ): void {
    if ( __DEV__ ) {
        if ( typeof create !== "function" ) {
            console.error( "Expected useImperativeHandle() second argument to be a function " + "that creates a handle. Instead received: %s.", create !== null ? typeof create : "null" );
        }
    }

    // TODO: If deps are provided, should we skip comparing the ref itself?
    const effectDeps = deps !== null && deps !== undefined ? deps.concat( [ ref ] ) : null;
    updateEffectImpl( UpdateEffect, HookLayout, imperativeHandleEffect.bind( null, create, ref ), effectDeps );
}
