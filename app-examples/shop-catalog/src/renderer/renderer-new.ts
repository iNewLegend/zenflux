// Create a map to store all used useObservables.
// Create a map to store all used useObservables.
import { Fiber } from "@zenflux/react-reconciler/dist/packages/zenflux-react-reconciler/src/ReactInternalTypes";
import ReactReconciler, {
    enqueueConcurrentHookUpdate,
    entangleTransitionUpdate,
    listenToAllSupportedEvents,
    requestUpdateLane,
    scheduleUpdateOnFiber,
    Update,
    ZenFluxReactReconciler,
} from "@zenflux/react-reconciler";
import { BehaviorSubject } from "rxjs";
import { NoLane } from "../react-dom-bindings/react-fiber-lane.ts";
import { current } from "../react-dom-bindings/react-current-fiber.ts";
import React from "react";


// Replace orignal behaivor subject next method with our own, and save previous value.
const originalNext = BehaviorSubject.prototype.next;

BehaviorSubject.prototype.next = function ( value ) {
    // @ts-ignore
    this._previousValue = this.getValue();
    originalNext.call( this, value );
};


let reconciler: ZenFluxReactReconciler;

let rootContainer: ReturnType<typeof reconciler.createContainer>;

const observables = new Map<string, BehaviorSubject<any>>();

// @ts-ignore
globalThis.observables = observables;

export const useObservable = <T>( observable: BehaviorSubject<T> ) => {
    // noinspection JSVoidFunctionReturnValueUsed
    const id = React.useId();

    // console.log( "id", id );

    React.useSyncExternalStore( ( onStoreChange ) => {
        if ( observables.has( id ) ) {
            return () => {};
        }

        const subscription = observable.subscribe( () => {
            if ( observables.has( id ) ) {
                return onStoreChange();
            }

            observables.set( id, observable );
        } );

        return () => {
            subscription.unsubscribe();
            observables.delete( id );
        }
        // In more advanced use cases, you may want to avoid comparing the snapshots
    }, () => observable.getValue() );

    return observable;
};

export const customRenderer = ( root: HTMLElement ) => {
    // Create a ReactReconciler instance for the custom renderer.
    reconciler = ReactReconciler();

    rootContainer = reconciler.createContainer(
        root,
        // @ts-ignore
        root.tagName.toLowerCase(),
        false,
        false, // Check if <Strict.Mode> is even working
        null,
        null,
        null,
        null,
    );

    // rootContainer = createContainer(
    //         root,
    //         // @ts-ignore
    //         root.tagName.toLowerCase(),
    //         false,
    //         false,
    //         null,
    //         null,
    //         null,
    //         null,
    // );

    // const rootDom = ReactDOMClient.createRoot( root );
    //
    // // Get property that starts with '__reactContainer'
    //
    // // @ts-ignore
    // const key = Object.keys( rootDom._internalRoot.containerInfo ).find( i => i.startsWith( "__reactContainer") );
    //
    // // @ts-ignore
    // rootContainer = rootDom._internalRoot.containerInfo[ key ];

    const rootContainerElement = root;

    listenToAllSupportedEvents( rootContainerElement );

    // Return a function that can be used to update the custom renderer.
    return ( newChildren: React.ReactNode ) => {
        // Update the children.
        // @ts-ignore
        reconciler.updateContainer( newChildren, rootContainer, null );
    };
};


/*
    // Check for changes in observables and update components accordingly.
    const updateIfObservableChanged = () => {
        for (const [observable, value] of observables.entries()) {
            if (observable.getValue() !== value) {
                observables.set(observable, observable.getValue());
                reconciler.updateContainer(children, root, null);
            }
        }
    };

    // Use RxJS to subscribe to observables and trigger updates.
    observables.forEach((observable) => {
        observable.subscribe(updateIfObservableChanged);
    });

 */



// setTimeout( () => {
//         observable.subscribe( () => {
//             if ( ! currentFiber ) {
//                 return;
//             }
//
//             console.log( "id", id, "mode", currentFiber.mode );
//
//             // const bc = React.createElement( type );
//             // const wtf = reconciler.getPublicRootInstance( rootContainer );
//
//             const alt = currentFiber.alternate;
//
//             if ( alt ) {
//                 console.log( "alted", id, "mode", currentFiber.mode );
//
//                 /**
//                  *     pending: Update<S, A> | null;
//                  *     lanes: Lanes;
//                  *     dispatch: ((arg0: A) => unknown) | null;
//                  *     lastRenderedReducer: ((arg0: S, arg1: A) => S) | null;
//                  *     lastRenderedState: S | null;
//                  */
//                     // console.log( "currentFiber", currentFiber, b, type );
//
//                     const lane = requestUpdateLane( alt );
//                     const update: Update<any, any> = {
//                         lane,
//                         revertLane: NoLane,
//                         action: observable.getValue(),
//                         hasEagerState: true,
//                         eagerState: observable.getValue(),
//                         next: ( null as any )
//                     };
//
//                     const queue = {
//                         pending: null,
//                         lanes: lane,
//                         dispatch: () => {
//                             debugger
//                         },
//                         lastRenderedReducer: () => {
//                             debugger;
//                         },
//                         lastRenderedState: observable._lastValue,
//                     };
//
//                     const rootFlagged = enqueueConcurrentHookUpdate(
//                         alt,
//                         queue,
//                         update,
//                         lane
//                     );
//
//
//                     debugger
//
//                     if ( rootFlagged ) {
// // Trigger update once
// //                         alt.dependencies = {
// //                             lanes: lane,
// //                             firstContext: Math.random(),
// //                         };
//
//                         // alt.lanes = 2; // Render lane
//
//                         // alt._debugHookTypes =[
//                         //     "test"
//                         // ];
//
//                         // alt.memoizedProps = Math.random();
//
//                         scheduleUpdateOnFiber( rootFlagged, alt, lane );
//                         entangleTransitionUpdate( rootFlagged, queue, lane )
//                     }
//             }
//             // @ts-ignore
//             // reconciler.updateContainer( bc, {
//             //     current: currentFiber,
//             // }, null );
//         } );
// }, 0 );


// Return the observable.
