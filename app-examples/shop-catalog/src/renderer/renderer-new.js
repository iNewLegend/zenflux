"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customRenderer = exports.useObservable = void 0;
var react_reconciler_1 = require("@zenflux/react-reconciler");
var rxjs_1 = require("rxjs");
var react_1 = require("react");
// Replace orignal behaivor subject next method with our own, and save previous value.
var originalNext = rxjs_1.BehaviorSubject.prototype.next;
rxjs_1.BehaviorSubject.prototype.next = function (value) {
    // @ts-ignore
    this._previousValue = this.getValue();
    originalNext.call(this, value);
};
var reconciler;
var rootContainer;
var observables = new Map();
// @ts-ignore
globalThis.observables = observables;
var useObservable = function (observable) {
    // noinspection JSVoidFunctionReturnValueUsed
    var id = react_1.default.useId();
    // console.log( "id", id );
    react_1.default.useSyncExternalStore(function (onStoreChange) {
        if (observables.has(id)) {
            return function () { };
        }
        var subscription = observable.subscribe(function () {
            if (observables.has(id)) {
                return onStoreChange();
            }
            observables.set(id, observable);
        });
        return function () {
            subscription.unsubscribe();
            observables.delete(id);
        };
        // In more advanced use cases, you may want to avoid comparing the snapshots
    }, function () { return observable.getValue(); });
    return observable;
};
exports.useObservable = useObservable;
var customRenderer = function (root) {
    // Create a ReactReconciler instance for the custom renderer.
    reconciler = (0, react_reconciler_1.default)();
    rootContainer = reconciler.createContainer(root, 
    // @ts-ignore
    root.tagName.toLowerCase(), false, false, // Check if <Strict.Mode> is even working
    null, null, null, null);
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
    var rootContainerElement = root;
    (0, react_reconciler_1.listenToAllSupportedEvents)(rootContainerElement);
    // Return a function that can be used to update the custom renderer.
    return function (newChildren) {
        // Update the children.
        // @ts-ignore
        reconciler.updateContainer(newChildren, rootContainer, null);
    };
};
exports.customRenderer = customRenderer;
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
