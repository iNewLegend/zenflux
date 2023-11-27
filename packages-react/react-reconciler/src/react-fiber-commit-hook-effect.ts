import { enableSchedulingProfiler } from "@zenflux/react-shared/src/react-feature-flags";

import { Insertion as HookInsertion,
    Layout as HookLayout,
    NoFlags as NoHookEffect,
    Passive as HookPassive
} from "@zenflux/react-reconciler/src/react-hook-effect-tags";

import {
    markComponentLayoutEffectMountStarted,
    markComponentLayoutEffectMountStopped,
    markComponentLayoutEffectUnmountStarted,
    markComponentLayoutEffectUnmountStopped,
    markComponentPassiveEffectMountStarted,
    markComponentPassiveEffectMountStopped,
    markComponentPassiveEffectUnmountStarted,
    markComponentPassiveEffectUnmountStopped
} from "@zenflux/react-reconciler/src/react-fiber-dev-tools-hook";
import { setIsRunningInsertionEffect } from "@zenflux/react-reconciler/src/react-fiber-work-running-insertion-effect";
import { NoFlags } from "@zenflux/react-reconciler/src/react-fiber-flags";
import { safelyCallDestroy } from "@zenflux/react-reconciler/src/react-fiber-commit-phase-error";

import type { FunctionComponentUpdateQueue } from "@zenflux/react-reconciler/src/react-fiber-hooks-types";
import type { Fiber } from "@zenflux/react-reconciler/src/react-internal-types";
import type {
    HookFlags} from "@zenflux/react-reconciler/src/react-hook-effect-tags";

export function commitHookEffectListUnmount( flags: HookFlags, finishedWork: Fiber, nearestMountedAncestor: Fiber | null ) {
    const updateQueue: FunctionComponentUpdateQueue | null = ( finishedWork.updateQueue as any );
    const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;

    if ( lastEffect !== null ) {
        const firstEffect = lastEffect.next;
        let effect = firstEffect;

        do {
            if ( ( effect.tag & flags ) === flags ) {
                // Unmount
                const inst = effect.inst;
                const destroy = inst.destroy;

                if ( destroy !== undefined ) {
                    inst.destroy = undefined;

                    if ( enableSchedulingProfiler ) {
                        if ( ( flags & HookPassive ) !== NoHookEffect ) {
                            markComponentPassiveEffectUnmountStarted( finishedWork );
                        } else if ( ( flags & HookLayout ) !== NoHookEffect ) {
                            markComponentLayoutEffectUnmountStarted( finishedWork );
                        }
                    }

                    if ( __DEV__ ) {
                        if ( ( flags & HookInsertion ) !== NoHookEffect ) {
                            setIsRunningInsertionEffect( true );
                        }
                    }

                    safelyCallDestroy( finishedWork, nearestMountedAncestor, destroy );

                    if ( __DEV__ ) {
                        if ( ( flags & HookInsertion ) !== NoHookEffect ) {
                            setIsRunningInsertionEffect( false );
                        }
                    }

                    if ( enableSchedulingProfiler ) {
                        if ( ( flags & HookPassive ) !== NoHookEffect ) {
                            markComponentPassiveEffectUnmountStopped();
                        } else if ( ( flags & HookLayout ) !== NoHookEffect ) {
                            markComponentLayoutEffectUnmountStopped();
                        }
                    }
                }
            }

            effect = effect.next;
        } while ( effect !== firstEffect );
    }
}

export function commitHookEffectListMount( flags: HookFlags, finishedWork: Fiber ) {
    const updateQueue: FunctionComponentUpdateQueue | null = ( finishedWork.updateQueue as any );
    const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;

    if ( lastEffect !== null ) {
        const firstEffect = lastEffect.next;
        let effect = firstEffect;

        do {
            if ( ( effect.tag & flags ) === flags ) {
                if ( enableSchedulingProfiler ) {
                    if ( ( flags & HookPassive ) !== NoHookEffect ) {
                        markComponentPassiveEffectMountStarted( finishedWork );
                    } else if ( ( flags & HookLayout ) !== NoHookEffect ) {
                        markComponentLayoutEffectMountStarted( finishedWork );
                    }
                }

                // Mount
                const create = effect.create;

                if ( __DEV__ ) {
                    if ( ( flags & HookInsertion ) !== NoHookEffect ) {
                        setIsRunningInsertionEffect( true );
                    }
                }

                const inst = effect.inst;
                const destroy = create();
                inst.destroy = destroy;

                if ( __DEV__ ) {
                    if ( ( flags & HookInsertion ) !== NoHookEffect ) {
                        setIsRunningInsertionEffect( false );
                    }
                }

                if ( enableSchedulingProfiler ) {
                    if ( ( flags & HookPassive ) !== NoHookEffect ) {
                        markComponentPassiveEffectMountStopped();
                    } else if ( ( flags & HookLayout ) !== NoHookEffect ) {
                        markComponentLayoutEffectMountStopped();
                    }
                }

                if ( __DEV__ ) {
                    if ( destroy !== undefined && typeof destroy !== "function" ) {
                        let hookName;

                        if ( ( effect.tag & HookLayout ) !== NoFlags ) {
                            hookName = "useLayoutEffect";
                        } else if ( ( effect.tag & HookInsertion ) !== NoFlags ) {
                            hookName = "useInsertionEffect";
                        } else {
                            hookName = "useEffect";
                        }

                        let addendum;

                        if ( destroy === null ) {
                            addendum = " You returned null. If your effect does not require clean " + "up, return undefined (or nothing).";
                        } else if ( typeof ( destroy as any ).then === "function" ) {
                            addendum = "\n\nIt looks like you wrote " + hookName + "(async () => ...) or returned a Promise. " + "Instead, write the async function inside your effect " + "and call it immediately:\n\n" + hookName + "(() => {\n" + "  async function fetchData() {\n" + "    // You can await here\n" + "    const response = await MyAPI.getData(someId);\n" + "    // ...\n" + "  }\n" + "  fetchData();\n" + "}, [someId]); // Or [] if effect doesn't need props or state\n\n" + "Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching";
                        } else {
                            addendum = " You returned: " + destroy;
                        }

                        console.error( "%s must not return anything besides a function, " + "which is used for clean-up.%s", hookName, addendum );
                    }
                }
            }

            effect = effect.next;
        } while ( effect !== firstEffect );
    }
}
