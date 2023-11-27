import type { Dispatcher, MemoCache } from "@zenflux/react-reconciler/src/react-internal-types";
import type { HookFlags } from "@zenflux/react-reconciler/src/react-hook-effect-tags";
import type { Lane, Lanes } from "@zenflux/react-reconciler/src/react-fiber-lane-constants";

export type {
    DispatchWithoutAction,
    MutableRefObject,
    Reducer,
    ReducerAction,
    ReducerState,
    ReducerStateWithoutAction,
    ReducerWithoutAction,
    Ref,
    RefObject,
    SetStateAction
} from "react";

// Find better solution for this
export type DependencyList = ReadonlyArray<unknown>;

export type Hook = {
    memoizedState: any;
    baseState: any;
    baseQueue: Update<any, any> | null;
    queue: any;
    next: Hook | null;
};

// The effect "instance" is a shared object that remains the same for the entire
// lifetime of an effect. In Rust terms, a RefCell. We use it to store the
// "destroy" function that is returned from an effect, because that is stateful.
// The field is `undefined` if the effect is unmounted, or if the effect ran
// but is not stateful. We don't explicitly track whether the effect is mounted
// or unmounted because that can be inferred by the hiddenness of the fiber in
// the tree, i.e. whether there is a hidden Offscreen fiber above it.
//
// It's unfortunate that this is stored on a separate object, because it adds
// more memory per effect instance, but it's conceptually sound. I think there's
// likely a better data structure we could use for effects; perhaps just one
// array of effect instances per fiber. But I think this is OK for now despite
// the additional memory and we can follow up with performance
// optimizations later.
export type EffectInstance = {
    destroy: ReturnType<Parameters<Dispatcher["useEffect"]>[0]>
};
export type Effect = {
    tag: HookFlags;
    create: Parameters<Dispatcher["useEffect"]>[0]
    inst: EffectInstance;
    deps: DependencyList | null;
    next: Effect;
};
export type StoreInstance<T> = {
    value: T;
    getSnapshot: () => T;
};
export type StoreConsistencyCheck<T> = {
    value: T;
    getSnapshot: () => T;
};
export type EventFunctionPayload<Args, Return, F extends ( ... args: Array<Args> ) => Return> = {
    ref: {
        eventFn: F;
        impl: F;
    };
    nextImpl: F;
};

export type FunctionComponentUpdateQueue = {
    lastEffect: Effect | null;
    events: Array<EventFunctionPayload<any, any, any>> | null;
    stores: Array<StoreConsistencyCheck<any>> | null;
    // NOTE: optional, only set when enableUseMemoCacheHook is enabled
    memoCache?: MemoCache | null;
};
export type BasicStateAction<S> = ( ( arg0: S ) => S ) | S;
export type Dispatch<A> = ( arg0: A ) => void;

export type Update<S, A> = {
    lane: Lane;
    revertLane: Lane;
    action: A;
    hasEagerState: boolean;
    eagerState: S | null;
    next: Update<S, A>;
};
export type UpdateQueue<S, A> = {
    pending: Update<S, A> | null;
    lanes: Lanes;
    dispatch: ( ( arg0: A ) => unknown ) | null;
    lastRenderedReducer: ( ( arg0: S, arg1: A ) => S ) | null;
    lastRenderedState: S | null;
};

// useFormState actions run sequentially, because each action receives the
// previous state as an argument. We store pending actions on a queue.
export type FormStateActionQueue<S, P> = {
    // This is the most recent state returned from an action. It's updated as
    // soon as the action finishes running.
    state: Awaited<S>;
    // A stable dispatch method, passed to the user.
    dispatch: Dispatch<P>;
    // This is the most recent action function that was rendered. It's updated
    // during the commit phase.
    action: ( arg0: Awaited<S>, arg1: P ) => S;
    // This is a circular linked list of pending action payloads. It incudes the
    // action that is currently running.
    pending: FormStateActionQueueNode<P> | null;
};

export type FormStateActionQueueNode<P> = {
    payload: P;
    // This is never null because it's part of a circular linked list.
    next: FormStateActionQueueNode<P>;
};
