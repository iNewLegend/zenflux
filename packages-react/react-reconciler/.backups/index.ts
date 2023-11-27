import "@z-react-reconciler/zenflux/enviroment";

import {
    attemptContinuousHydration,
    attemptDiscreteHydration,
    attemptHydrationAtCurrentPriority,
    attemptSynchronousHydration,
    batchedUpdates,
    createComponentSelector,
    createContainer,
    createHasPseudoClassSelector,
    createHydrationContainer,
    createPortal,
    createRoleSelector,
    createTestNameSelector,
    createTextSelector,
    deferredUpdates,
    discreteUpdates,
    findAllNodes,
    findBoundingRects,
    findHostInstance,
    findHostInstanceWithNoPortals,
    findHostInstanceWithWarning,
    flushPassiveEffects,
    flushSync,
    focusWithin,
    getCurrentUpdatePriority,
    getFindAllNodesFailureDescription,
    getPublicRootInstance,
    injectIntoDevTools,
    isAlreadyRendering,
    observeVisibleRects,
    runWithPriority,
    shouldError,
    shouldSuspend,
    updateContainer,
} from "@z-react-reconciler/ReactFiberReconciler";

import type { ReactNodeList, ReactPortal, } from "@zenflux/react-shared/src/react-types";

import type { DevToolsConfig, OpaqueRoot, } from "@z-react-reconciler/ReactFiberReconciler";

import type {
    Container,
    Instance,
    PublicInstance,
    TextInstance,
} from "@z-react-reconciler/forks/ReactFiberConfig.dom";

import type {
    Fiber,
    FiberRoot,
    SuspenseHydrationCallbacks,
    TransitionTracingCallbacks,
} from "@z-react-reconciler/ReactInternalTypes";

import type {
    BoundingRect,
    ComponentSelector,
    HasPseudoClassSelector,
    IntersectionObserverOptions,
    React$AbstractComponent,
    RoleSelector,
    Selector,
    TestNameSelector,
    TextSelector,
} from "@z-react-reconciler/ReactTestSelectors";
import type { RootTag } from "@z-react-reconciler/ReactRootTags";

import type { Lane } from "@z-react-reconciler/ReactFiberLane";
import type { Component } from "@zenflux/react-shared/src/zenflux/react/component";

export type { Update } from "@z-react-reconciler/ReactFiberHooks";

export { listenToAllSupportedEvents } from "@zenflux/react-dom-bindings/src/events/DOMPluginEventSystem";
export { scheduleUpdateOnFiber, requestUpdateLane } from "@z-react-reconciler/ReactFiberWorkLoop";
export { enqueueConcurrentHookUpdate } from "@z-react-reconciler/ReactFiberConcurrentUpdates";
export { entangleTransitionUpdate } from "@z-react-reconciler/ReactFiberHooks";

export type {
    Fiber,
    Container,
};

// import type { Component } from "react";

// declare namespace ReactReconcilerNamespace {
//     // interface HostConfig<
//     //     Type,
//     //     Props,
//     //     Container,
//     //     Instance,
//     //     TextInstance,
//     //     SuspenseInstance,
//     //     HydratableInstance,
//     //     PublicInstance,
//     //     HostContext,
//     //     UpdatePayload,
//     //     ChildSet,
//     //     TimeoutHandle,
//     //     NoTimeout,
//     // > {
//     //     // -------------------
//     //     //    Core Methods
//     //     // -------------------
//     //
//     //     /**
//     //      * This method should return a newly created node. For example, the DOM renderer would call `document.createElement(type)` here and then set the properties from `props`.
//     //      *
//     //      * You can use `rootContainer` to access the root container associated with that tree. For example, in the DOM renderer, this is useful to get the correct `document` reference that the root belongs to.
//     //      *
//     //      * The `hostContext` parameter lets you keep track of some information about your current place in the tree. To learn more about it, see `getChildHostContext` below.
//     //      *
//     //      * The `internalHandle` data structure is meant to be opaque. If you bend the rules and rely on its internal fields, be aware that it may change significantly between versions. You're taking on additional maintenance risk by reading from it, and giving up all guarantees if you write something to it.
//     //      *
//     //      * This method happens **in the render phase**. It can (and usually should) mutate the node it has just created before returning it, but it must not modify any other nodes. It must not register any event handlers on the parent tree. This is because an instance being created doesn't guarantee it would be placed in the tree — it could be left unused and later collected by GC. If you need to do something when an instance is definitely in the tree, look at `commitMount` instead.
//     //      */
//     //     createInstance(
//     //         type: Type,
//     //         props: Props,
//     //         rootContainer: Container,
//     //         hostContext: HostContext,
//     //         internalHandle: OpaqueHandle,
//     //     ): Instance;
//     //
//     //     /**
//     //      * Same as `createInstance`, but for text nodes. If your renderer doesn't support text nodes, you can throw here.
//     //      */
//     //     createTextInstance(
//     //         text: string,
//     //         rootContainer: Container,
//     //         hostContext: HostContext,
//     //         internalHandle: OpaqueHandle,
//     //     ): TextInstance;
//     //
//     //     /**
//     //      * This method should mutate the `parentInstance` and add the child to its list of children. For example, in the DOM this would translate to a `parentInstance.appendChild(child)` call.
//     //      *
//     //      * This method happens **in the render phase**. It can mutate `parentInstance` and `child`, but it must not modify any other nodes. It's called while the tree is still being built up and not connected to the actual tree on the screen.
//     //      */
//     //     appendInitialChild(parentInstance: Instance, child: Instance | TextInstance): void;
//     //
//     //     /**
//     //      * In this method, you can perform some final mutations on the `instance`. Unlike with `createInstance`, by the time `finalizeInitialChildren` is called, all the initial children have already been added to the `instance`, but the instance itself has not yet been connected to the tree on the screen.
//     //      *
//     //      * This method happens **in the render phase**. It can mutate `instance`, but it must not modify any other nodes. It's called while the tree is still being built up and not connected to the actual tree on the screen.
//     //      *
//     //      * There is a second purpose to this method. It lets you specify whether there is some work that needs to happen when the node is connected to the tree on the screen. If you return `true`, the instance will receive a `commitMount` call later. See its documentation below.
//     //      *
//     //      * If you don't want to do anything here, you should return `false`.
//     //      */
//     //     finalizeInitialChildren(
//     //         instance: Instance,
//     //         type: Type,
//     //         props: Props,
//     //         rootContainer: Container,
//     //         hostContext: HostContext,
//     //     ): boolean;
//     //
//     //     /**
//     //      * React calls this method so that you can compare the previous and the next props, and decide whether you need to update the underlying instance or not. If you don't need to update it, return `null`. If you need to update it, you can return an arbitrary object representing the changes that need to happen. Then in `commitUpdate` you would need to apply those changes to the instance.
//     //      *
//     //      * This method happens **in the render phase**. It should only *calculate* the update — but not apply it! For example, the DOM renderer returns an array that looks like `[prop1, value1, prop2, value2, ...]` for all props that have actually changed. And only in `commitUpdate` it applies those changes. You should calculate as much as you can in `prepareUpdate` so that `commitUpdate` can be very fast and straightforward.
//     //      *
//     //      * See the meaning of `rootContainer` and `hostContext` in the `createInstance` documentation.
//     //      */
//     //     prepareUpdate(
//     //         instance: Instance,
//     //         type: Type,
//     //         oldProps: Props,
//     //         newProps: Props,
//     //         rootContainer: Container,
//     //         hostContext: HostContext,
//     //     ): UpdatePayload | null;
//     //
//     //     /**
//     //      * Some target platforms support setting an instance's text content without manually creating a text node. For example, in the DOM, you can set `node.textContent` instead of creating a text node and appending it.
//     //      *
//     //      * If you return `true` from this method, React will assume that this node's children are text, and will not create nodes for them. It will instead rely on you to have filled that text during `createInstance`. This is a performance optimization. For example, the DOM renderer returns `true` only if `type` is a known text-only parent (like `'textarea'`) or if `props.children` has a `'string'` type. If you return `true`, you will need to implement `resetTextContent` too.
//     //      *
//     //      * If you don't want to do anything here, you should return `false`.
//     //      *
//     //      * This method happens **in the render phase**. Do not mutate the tree from it.
//     //      */
//     //     shouldSetTextContent(type: Type, props: Props): boolean;
//     //
//     //     /**
//     //      * This method lets you return the initial host context from the root of the tree. See `getChildHostContext` for the explanation of host context.
//     //      *
//     //      * If you don't intend to use host context, you can return `null`.
//     //      *
//     //      * This method happens **in the render phase**. Do not mutate the tree from it.
//     //      */
//     //     getRootHostContext(rootContainer: Container): HostContext | null;
//     //
//     //     /**
//     //      * Host context lets you track some information about where you are in the tree so that it's available inside `createInstance` as the `hostContext` parameter. For example, the DOM renderer uses it to track whether it's inside an HTML or an SVG tree, because `createInstance` implementation needs to be different for them.
//     //      *
//     //      * If the node of this `type` does not influence the context you want to pass down, you can return `parentHostContext`. Alternatively, you can return any custom object representing the information you want to pass down.
//     //      *
//     //      * If you don't want to do anything here, return `parentHostContext`.
//     //      *
//     //      * This method happens **in the render phase**. Do not mutate the tree from it.
//     //      */
//     //     getChildHostContext(parentHostContext: HostContext, type: Type, rootContainer: Container): HostContext;
//     //
//     //     /**
//     //      * Determines what object gets exposed as a ref. You'll likely want to return the `instance` itself. But in some cases it might make sense to only expose some part of it.
//     //      *
//     //      * If you don't want to do anything here, return `instance`.
//     //      */
//     //     getPublicInstance(instance: Instance | TextInstance): PublicInstance;
//     //
//     //     /**
//     //      * This method lets you store some information before React starts making changes to the tree on the screen. For example, the DOM renderer stores the current text selection so that it can later restore it. This method is mirrored by `resetAfterCommit`.
//     //      *
//     //      * Even if you don't want to do anything here, you need to return `null` from it.
//     //      */
//     //     prepareForCommit(containerInfo: Container): Record<string, any> | null;
//     //
//     //     /**
//     //      * This method is called right after React has performed the tree mutations. You can use it to restore something you've stored in `prepareForCommit` — for example, text selection.
//     //      *
//     //      * You can leave it empty.
//     //      */
//     //     resetAfterCommit(containerInfo: Container): void;
//     //
//     //     /**
//     //      * This method is called for a container that's used as a portal target. Usually you can leave it empty.
//     //      */
//     //     preparePortalMount(containerInfo: Container): void;
//     //
//     //     /**
//     //      * You can proxy this to `setTimeout` or its equivalent in your environment.
//     //      */
//     //     scheduleTimeout(fn: (...args: unknown[]) => unknown, delay?: number): TimeoutHandle;
//     //
//     //     /**
//     //      * You can proxy this to `clearTimeout` or its equivalent in your environment.
//     //      */
//     //     cancelTimeout(id: TimeoutHandle): void;
//     //
//     //     /**
//     //      * This is a property (not a function) that should be set to something that can never be a valid timeout ID. For example, you can set it to `-1`.
//     //      */
//     //     noTimeout: NoTimeout;
//     //
//     //     /**
//     //      * Set this to `true` to indicate that your renderer supports `scheduleMicrotask`. We use microtasks as part of our discrete event implementation in React DOM. If you're not sure if your renderer should support this, you probably should. The option to not implement `scheduleMicrotask` exists so that platforms with more control over user events, like React Native, can choose to use a different mechanism.
//     //      */
//     //     supportsMicrotasks?: boolean;
//     //
//     //     /**
//     //      * Optional. You can proxy this to `queueMicrotask` or its equivalent in your environment.
//     //      */
//     //     scheduleMicrotask?(fn: () => unknown): void;
//     //
//     //     /**
//     //      * This is a property (not a function) that should be set to `true` if your renderer is the main one on the page. For example, if you're writing a renderer for the Terminal, it makes sense to set it to `true`, but if your renderer is used *on top of* React DOM or some other existing renderer, set it to `false`.
//     //      */
//     //     isPrimaryRenderer: boolean;
//     //
//     //     /**
//     //      * Whether the renderer shouldn't trigger missing `act()` warnings
//     //      */
//     //     warnsIfNotActing?: boolean;
//     //
//     //     /**
//     //      * To implement this method, you'll need some constants available on the special `react-reconciler/constants` entry point:
//     //      *
//     //      * ```
//     //      * import {
//     //      *   DiscreteEventPriority,
//     //      *   ContinuousEventPriority,
//     //      *   DefaultEventPriority,
//     //      * } from 'react-reconciler/constants';
//     //      *
//     //      * const HostConfig = {
//     //      *   // ...
//     //      *   getCurrentEventPriority() {
//     //      *     return DefaultEventPriority;
//     //      *   },
//     //      *   // ...
//     //      * }
//     //      *
//     //      * const MyRenderer = Reconciler(HostConfig);
//     //      * ```
//     //      *
//     //      * The constant you return depends on which event, if any, is being handled right now. (In the browser, you can check this using `window.event && window.event.type`).
//     //      *
//     //      * - **Discrete events**: If the active event is directly caused by the user (such as mouse and keyboard events) and each event in a sequence is intentional (e.g. click), return DiscreteEventPriority. This tells React that they should interrupt any background work and cannot be batched across time.
//     //      *
//     //      * - **Continuous events**: If the active event is directly caused by the user but the user can't distinguish between individual events in a sequence (e.g. mouseover), return ContinuousEventPriority. This tells React they should interrupt any background work but can be batched across time.
//     //      *
//     //      * - **Other events / No active event**: In all other cases, return DefaultEventPriority. This tells React that this event is considered background work, and interactive events will be prioritized over it.
//     //      *
//     //      * You can consult the `getCurrentEventPriority()` implementation in `ReactDOMHostConfig.js` for a reference implementation.
//     //      */
//     //     getCurrentEventPriority(): Lane;
//     //
//     //     getInstanceFromNode(node: any): Fiber | null | undefined;
//     //
//     //     beforeActiveInstanceBlur(): void;
//     //
//     //     afterActiveInstanceBlur(): void;
//     //
//     //     prepareScopeUpdate(scopeInstance: any, instance: any): void;
//     //
//     //     getInstanceFromScope(scopeInstance: any): null | Instance;
//     //
//     //     detachDeletedInstance(node: Instance): void;
//     //
//     //     // -------------------
//     //     //  Mutation Methods
//     //     //    (optional)
//     //     //  If you're using React in mutation mode (you probably do), you'll need to implement a few more methods.
//     //     // -------------------
//     //
//     //     /**
//     //      * This method should mutate the `parentInstance` and add the child to its list of children. For example, in the DOM this would translate to a `parentInstance.appendChild(child)` call.
//     //      *
//     //      * Although this method currently runs in the commit phase, you still should not mutate any other nodes in it. If you need to do some additional work when a node is definitely connected to the visible tree, look at `commitMount`.
//     //      */
//     //     appendChild?(parentInstance: Instance, child: Instance | TextInstance): void;
//     //
//     //     /**
//     //      * Same as `appendChild`, but for when a node is attached to the root container. This is useful if attaching to the root has a slightly different implementation, or if the root container nodes are of a different type than the rest of the tree.
//     //      */
//     //     appendChildToContainer?(container: Container, child: Instance | TextInstance): void;
//     //
//     //     /**
//     //      * This method should mutate the `parentInstance` and place the `child` before `beforeChild` in the list of its children. For example, in the DOM this would translate to a `parentInstance.insertBefore(child, beforeChild)` call.
//     //      *
//     //      * Note that React uses this method both for insertions and for reordering nodes. Similar to DOM, it is expected that you can call `insertBefore` to reposition an existing child. Do not mutate any other parts of the tree from it.
//     //      */
//     //     insertBefore?(
//     //         parentInstance: Instance,
//     //         child: Instance | TextInstance,
//     //         beforeChild: Instance | TextInstance | SuspenseInstance,
//     //     ): void;
//     //
//     //     /**
//     //      * Same as `insertBefore`, but for when a node is attached to the root container. This is useful if attaching to the root has a slightly different implementation, or if the root container nodes are of a different type than the rest of the tree.
//     //      */
//     //     insertInContainerBefore?(
//     //         container: Container,
//     //         child: Instance | TextInstance,
//     //         beforeChild: Instance | TextInstance | SuspenseInstance,
//     //     ): void;
//     //
//     //     /**
//     //      * This method should mutate the `parentInstance` to remove the `child` from the list of its children.
//     //      *
//     //      * React will only call it for the top-level node that is being removed. It is expected that garbage collection would take care of the whole subtree. You are not expected to traverse the child tree in it.
//     //      */
//     //     removeChild?(parentInstance: Instance, child: Instance | TextInstance | SuspenseInstance): void;
//     //
//     //     /**
//     //      * Same as `removeChild`, but for when a node is detached from the root container. This is useful if attaching to the root has a slightly different implementation, or if the root container nodes are of a different type than the rest of the tree.
//     //      */
//     //     removeChildFromContainer?(container: Container, child: Instance | TextInstance | SuspenseInstance): void;
//     //
//     //     /**
//     //      * If you returned `true` from `shouldSetTextContent` for the previous props, but returned `false` from `shouldSetTextContent` for the next props, React will call this method so that you can clear the text content you were managing manually. For example, in the DOM you could set `node.textContent = ''`.
//     //      *
//     //      * If you never return `true` from `shouldSetTextContent`, you can leave it empty.
//     //      */
//     //     resetTextContent?(instance: Instance): void;
//     //
//     //     /**
//     //      * This method should mutate the `textInstance` and update its text content to `nextText`.
//     //      *
//     //      * Here, `textInstance` is a node created by `createTextInstance`.
//     //      */
//     //     commitTextUpdate?(textInstance: TextInstance, oldText: string, newText: string): void;
//     //
//     //     /**
//     //      * This method is only called if you returned `true` from `finalizeInitialChildren` for this instance.
//     //      *
//     //      * It lets you do some additional work after the node is actually attached to the tree on the screen for the first time. For example, the DOM renderer uses it to trigger focus on nodes with the `autoFocus` attribute.
//     //      *
//     //      * Note that `commitMount` does not mirror `removeChild` one to one because `removeChild` is only called for the top-level removed node. This is why ideally `commitMount` should not mutate any nodes other than the `instance` itself. For example, if it registers some events on some node above, it will be your responsibility to traverse the tree in `removeChild` and clean them up, which is not ideal.
//     //      *
//     //      * The `internalHandle` data structure is meant to be opaque. If you bend the rules and rely on its internal fields, be aware that it may change significantly between versions. You're taking on additional maintenance risk by reading from it, and giving up all guarantees if you write something to it.
//     //      *
//     //      * If you never return `true` from `finalizeInitialChildren`, you can leave it empty.
//     //      */
//     //     commitMount?(instance: Instance, type: Type, props: Props, internalInstanceHandle: OpaqueHandle): void;
//     //
//     //     /**
//     //      * This method should mutate the `instance` according to the set of changes in `updatePayload`. Here, `updatePayload` is the object that you've returned from `prepareUpdate` and has an arbitrary structure that makes sense for your renderer. For example, the DOM renderer returns an update payload like `[prop1, value1, prop2, value2, ...]` from `prepareUpdate`, and that structure gets passed into `commitUpdate`. Ideally, all the diffing and calculation should happen inside `prepareUpdate` so that `commitUpdate` can be fast and straightforward.
//     //      *
//     //      * The `internalHandle` data structure is meant to be opaque. If you bend the rules and rely on its internal fields, be aware that it may change significantly between versions. You're taking on additional maintenance risk by reading from it, and giving up all guarantees if you write something to it.
//     //      */
//     //     commitUpdate?(
//     //         instance: Instance,
//     //         updatePayload: UpdatePayload,
//     //         type: Type,
//     //         prevProps: Props,
//     //         nextProps: Props,
//     //         internalHandle: OpaqueHandle,
//     //     ): void;
//     //
//     //     /**
//     //      * This method should make the `instance` invisible without removing it from the tree. For example, it can apply visual styling to hide it. It is used by Suspense to hide the tree while the fallback is visible.
//     //      */
//     //     hideInstance?(instance: Instance): void;
//     //
//     //     /**
//     //      * Same as `hideInstance`, but for nodes created by `createTextInstance`.
//     //      */
//     //     hideTextInstance?(textInstance: TextInstance): void;
//     //
//     //     /**
//     //      * This method should make the `instance` visible, undoing what `hideInstance` did.
//     //      */
//     //     unhideInstance?(instance: Instance, props: Props): void;
//     //
//     //     /**
//     //      * Same as `unhideInstance`, but for nodes created by `createTextInstance`.
//     //      */
//     //     unhideTextInstance?(textInstance: TextInstance, text: string): void;
//     //
//     //     /**
//     //      * This method should mutate the `container` root node and remove all children from it.
//     //      */
//     //     clearContainer?(container: Container): void;
//     //
//     //     // -------------------
//     //     // Persistence Methods
//     //     //    (optional)
//     //     //  If you use the persistent mode instead of the mutation mode, you would still need the "Core Methods". However, instead of the Mutation Methods above you will implement a different set of methods that performs cloning nodes and replacing them at the root level. You can find a list of them in the "Persistence" section [listed in this file](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/forks/ReactFiberHostConfig.custom.js). File an issue if you need help.
//     //     // -------------------
//     //     cloneInstance?(
//     //         instance: Instance,
//     //         updatePayload: UpdatePayload,
//     //         type: Type,
//     //         oldProps: Props,
//     //         newProps: Props,
//     //         internalInstanceHandle: OpaqueHandle,
//     //         keepChildren: boolean,
//     //         recyclableInstance: null | Instance,
//     //     ): Instance;
//     //     createContainerChildSet?(container: Container): ChildSet;
//     //     appendChildToContainerChildSet?(childSet: ChildSet, child: Instance | TextInstance): void;
//     //     finalizeContainerChildren?(container: Container, newChildren: ChildSet): void;
//     //     replaceContainerChildren?(container: Container, newChildren: ChildSet): void;
//     //     cloneHiddenInstance?(
//     //         instance: Instance,
//     //         type: Type,
//     //         props: Props,
//     //         internalInstanceHandle: OpaqueHandle,
//     //     ): Instance;
//     //     cloneHiddenTextInstance?(instance: Instance, text: Type, internalInstanceHandle: OpaqueHandle): TextInstance;
//     //
//     //     // -------------------
//     //     // Hydration Methods
//     //     //    (optional)
//     //     // You can optionally implement hydration to "attach" to the existing tree during the initial render instead of creating it from scratch. For example, the DOM renderer uses this to attach to an HTML markup.
//     //     //
//     //     // To support hydration, you need to declare `supportsHydration: true` and then implement the methods in the "Hydration" section [listed in this file](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/forks/ReactFiberHostConfig.custom.js). File an issue if you need help.
//     //     // -------------------
//     //     supportsHydration: boolean;
//     //
//     //     canHydrateInstance?(instance: HydratableInstance, type: Type, props: Props): null | Instance;
//     //
//     //     canHydrateTextInstance?(instance: HydratableInstance, text: string): null | TextInstance;
//     //
//     //     canHydrateSuspenseInstance?(instance: HydratableInstance): null | SuspenseInstance;
//     //
//     //     isSuspenseInstancePending?(instance: SuspenseInstance): boolean;
//     //
//     //     isSuspenseInstanceFallback?(instance: SuspenseInstance): boolean;
//     //
//     //     registerSuspenseInstanceRetry?(instance: SuspenseInstance, callback: () => void): void;
//     //
//     //     getNextHydratableSibling?(instance: HydratableInstance): null | HydratableInstance;
//     //
//     //     getFirstHydratableChild?(parentInstance: Container | Instance): null | HydratableInstance;
//     //
//     //     hydrateInstance?(
//     //         instance: Instance,
//     //         type: Type,
//     //         props: Props,
//     //         rootContainerInstance: Container,
//     //         hostContext: HostContext,
//     //         internalInstanceHandle: any,
//     //     ): null | any[];
//     //
//     //     hydrateTextInstance?(textInstance: TextInstance, text: string, internalInstanceHandle: any): boolean;
//     //
//     //     hydrateSuspenseInstance?(suspenseInstance: SuspenseInstance, internalInstanceHandle: any): void;
//     //
//     //     getNextHydratableInstanceAfterSuspenseInstance?(suspenseInstance: SuspenseInstance): null | HydratableInstance;
//     //
//     //     // Returns the SuspenseInstance if this node is a direct child of a
//     //     // SuspenseInstance. I.e. if its previous sibling is a Comment with
//     //     // SUSPENSE_x_START_DATA. Otherwise, null.
//     //     getParentSuspenseInstance?(targetInstance: any): null | SuspenseInstance;
//     //
//     //     commitHydratedContainer?(container: Container): void;
//     //
//     //     commitHydratedSuspenseInstance?(suspenseInstance: SuspenseInstance): void;
//     //
//     //     didNotMatchHydratedContainerTextInstance?(
//     //         parentContainer: Container,
//     //         textInstance: TextInstance,
//     //         text: string,
//     //     ): void;
//     //
//     //     didNotMatchHydratedTextInstance?(
//     //         parentType: Type,
//     //         parentProps: Props,
//     //         parentInstance: Instance,
//     //         textInstance: TextInstance,
//     //         text: string,
//     //     ): void;
//     //
//     //     didNotHydrateContainerInstance?(parentContainer: Container, instance: HydratableInstance): void;
//     //
//     //     didNotHydrateInstance?(
//     //         parentType: Type,
//     //         parentProps: Props,
//     //         parentInstance: Instance,
//     //         instance: HydratableInstance,
//     //     ): void;
//     //
//     //     didNotFindHydratableContainerInstance?(parentContainer: Container, type: Type, props: Props): void;
//     //
//     //     didNotFindHydratableContainerTextInstance?(parentContainer: Container, text: string): void;
//     //
//     //     didNotFindHydratableContainerSuspenseInstance?(parentContainer: Container): void;
//     //
//     //     didNotFindHydratableInstance?(
//     //         parentType: Type,
//     //         parentProps: Props,
//     //         parentInstance: Instance,
//     //         type: Type,
//     //         props: Props,
//     //     ): void;
//     //
//     //     didNotFindHydratableTextInstance?(
//     //         parentType: Type,
//     //         parentProps: Props,
//     //         parentInstance: Instance,
//     //         text: string,
//     //     ): void;
//     //
//     //     didNotFindHydratableSuspenseInstance?(parentType: Type, parentProps: Props, parentInstance: Instance): void;
//     //
//     //     errorHydratingContainer?(parentContainer: Container): void;
//     // }
//
//     type Thenable<T> = _Thenable<T>;
//
//     type RootTag = _RootTag;
//     type WorkTag = _WorkTag;
//     type HookType = _HookType;
//
//     type Source = _Source;
//
//     // TODO: Ideally these types would be opaque but that doesn't work well with
//     // our reconciler fork infra, since these leak into non-reconciler packages.
//     type LanePriority = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17;
//
//     type Lanes = _Lane;
//     type Lane = _Lanes;
//
//     type Flags = _Flags;
//
//     type TypeOfMode = _TypeOfMode;
//
//     type ReactProvider<T> = _ReactProvider<T>;
//     type ReactProviderType<T> = _ReactProviderType<T>;
//     type ReactConsumer<T> = _ReactConsumer<T>;
//     type ReactContext<T> = _ReactContext<T>;
//     type ReactPortal = _ReactPortal;
//
//     type RefObject = _RefObject;
//
//     type ContextDependency<T> = _ContextDependency<T>;
//     type Dependencies = _Dependencies;
//
//     type Fiber = _Fiber;
//     type FiberRoot = _FiberRoot;
//
//     type MutableSource = any;
//
//     type OpaqueHandle = any;
//     type OpaqueRoot = _OpaqueRoot;
//
//     type BundleType = _BundleType;
//
//     type DevToolsConfig<Instance extends _Instance, TextInstance extends _TextInstance> =
//         _DevToolsConfig<Instance, TextInstance>;
//
//     type SuspenseHydrationCallbacks = _SuspenseHydrationCallbacks;
//     type TransitionTracingCallbacks = _TransitionTracingCallbacks;
//
//     type ComponentSelector = _ComponentSelector;
//     type HasPseudoClassSelector = _HasPseudoClassSelector;
//     type RoleSelector = _RoleSelector;
//     type TextSelector = _TextSelector;
//     type TestNameSelector = _TestNameSelector;
//     type Selector = _Selector;
//
//     type React$AbstractComponent<Props, State> = _React$AbstractComponent<Props, State>;
//
//     interface BoundingRect {
//         x: number;
//         y: number;
//         width: number;
//         height: number;
//     }
//
//     type IntersectionObserverOptions = any;
//
//     interface Reconciler {
//         // createContainer(
//         //     containerInfo: Container,
//         //     tag: RootTag,
//         //     hydrationCallbacks: null | SuspenseHydrationCallbacks,
//         //     isStrictMode: boolean,
//         //     concurrentUpdatesByDefaultOverride: null | boolean,
//         //     identifierPrefix: string,
//         //     onRecoverableError: ( error: Error ) => void,
//         //     transitionCallbacks: null | TransitionTracingCallbacks,
//         // ): OpaqueRoot;
//         //
//         // createPortal(
//         //     // Original: children: ReactNode from definition
//         //     children: ReactNodeList,
//         //     // children: ReactNode,
//         //     containerInfo: any, // TODO: figure out the API for cross-renderer implementation.
//         //     implementation: any,
//         //     key?: string | null,
//         // ): ReactPortal;
//         //
//         // registerMutableSourceForHydration( root: FiberRoot, mutableSource: MutableSource ): void;
//         //
//         // createComponentSelector( component: React$AbstractComponent<never, unknown> ): ComponentSelector;
//         //
//         // createHasPseudoClassSelector( selectors: Selector[] ): HasPseudoClassSelector;
//         //
//         // createRoleSelector( role: string ): RoleSelector;
//         //
//         // createTextSelector( text: string ): TextSelector;
//         //
//         // createTestNameSelector( id: string ): TestNameSelector;
//         //
//         // getFindAllNodesFailureDescription( hostRoot: Instance, selectors: Selector[] ): string | null;
//         //
//         // findAllNodes( hostRoot: Instance, selectors: Selector[] ): Instance[];
//         //
//         // findBoundingRects( hostRoot: Instance, selectors: Selector[] ): BoundingRect[];
//         //
//         // focusWithin( hostRoot: Instance, selectors: Selector[] ): boolean;
//         //
//         // observeVisibleRects(
//         //     hostRoot: Instance,
//         //     selectors: Selector[],
//         //     callback: ( intersections: Array<{ ratio: number; rect: BoundingRect }> ) => void,
//         //     options?: IntersectionObserverOptions,
//         // ): { disconnect: () => void };
//         //
//         // createHydrationContainer(
//         //     // initialChildren: ReactNode, - Original from definition
//         //     initialChildren: ReactNodeList,
//         //     callback: ( () => void ) | null | undefined,
//         //     containerInfo: Container,
//         //     tag: RootTag,
//         //     hydrationCallbacks: null | SuspenseHydrationCallbacks,
//         //     isStrictMode: boolean,
//         //     concurrentUpdatesByDefaultOverride: null | boolean,
//         //     identifierPrefix: string,
//         //     onRecoverableError: ( error: Error ) => void,
//         //     transitionCallbacks: null | TransitionTracingCallbacks,
//         // ): OpaqueRoot;
//         //
//         // updateContainer(
//         //     // element: ReactNode, - Original from definition
//         //     element: ReactNodeList,
//         //     container: OpaqueRoot,
//         //     parentComponent?: Component<any, any> | null,
//         //     callback?: ( () => void ) | null,
//         // ): Lane;
//         //
//         // batchedUpdates<A, R>( fn: ( a: A ) => R, a: A ): R;
//         //
//         // deferredUpdates<A>( fn: () => A ): A;
//         //
//         // discreteUpdates<A, B, C, D, R>( fn: ( arg0: A, arg1: B, arg2: C, arg3: D ) => R, a: A, b: B, c: C, d: D ): R;
//         //
//         // flushControlled( fn: () => any ): void;
//         //
//         // flushSync(): void;
//         //
//         // flushSync<R>( fn: () => R ): R;
//         //
//         // isAlreadyRendering(): boolean;
//         //
//         // flushPassiveEffects(): boolean;
//         //
//         // getPublicRootInstance( container: OpaqueRoot ): Component<any, any> | PublicInstance | null;
//         //
//         // attemptSynchronousHydration( fiber: Fiber ): void;
//         //
//         // attemptDiscreteHydration( fiber: Fiber ): void;
//         //
//         // attemptContinuousHydration( fiber: Fiber ): void;
//         //
//         // attemptHydrationAtCurrentPriority( fiber: Fiber ): void;
//         //
//         // getCurrentUpdatePriority(): LanePriority;
//         //
//         // runWithPriority<T>( priority: LanePriority, fn: () => T ): T;
//         //
//         // findHostInstance( component: any ): PublicInstance | null;
//         //
//         // findHostInstanceWithWarning( component: any, methodName: string ): PublicInstance | null;
//         //
//         // findHostInstanceWithNoPortals( fiber: Fiber ): PublicInstance | null;
//         //
//         // shouldError( fiber: Fiber ): boolean | undefined;
//         //
//         // shouldSuspend( fiber: Fiber ): boolean;
//         //
//         // injectIntoDevTools( devToolsConfig: DevToolsConfig<_Instance, _TextInstance> ): boolean;
//     }
// }
//
// interface DefaultInterface extends ReactReconcilerNamespace.Reconciler

type LanePriority = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17;

type MutableSource = any;

// type OpaqueHandle = any;

export class ZenFluxReactReconciler
// <
    // Container extends Container = Container,
    // Instance extends Instance = Instance,
    // TextInstance extends TextInstance = TextInstance,
    // SuspenseInstance extends SuspenseInstance = SuspenseInstance,
    // PublicInstance extends PublicInstance = PublicInstance,
    // Type = Type,
    // Props = Props,
    // HydratableInstance extends HydratableInstance = HydratableInstance,
    // HostContext = HostContext,
    // UpdatePayload = UpdatePayload,
    // ChildSet = ChildSet,
    // TimeoutHandle = TimeoutHandle,
    // NoTimeout = NoTimeout,
// >  implements Reconciler<Container, Instance, PublicInstance> */ {
    // public constructor(public readonly config: HostConfig<
    //     Type,
    //     Props,
    //     Container,
    //     Instance,
    //     TextInstance,
    //     SuspenseInstance,
    //     HydratableInstance,
    //     PublicInstance,
    //     HostContext,
    //     UpdatePayload,
    //     ChildSet,
    //     TimeoutHandle,
    //     NoTimeout
    // >) {
    // }
{

    public attemptContinuousHydration( fiber: Fiber ): void {
        return attemptContinuousHydration( fiber );
    };

    public attemptDiscreteHydration( fiber: Fiber ): void {
        return attemptDiscreteHydration( fiber ); // Not implemented
    }

    public attemptHydrationAtCurrentPriority( fiber: Fiber ): void {
        return attemptHydrationAtCurrentPriority( fiber );
    }

    public attemptSynchronousHydration( fiber: Fiber ): void {
        return attemptSynchronousHydration( fiber );
    }

    public batchedUpdates<A, R>( fn: ( a: A ) => R, a: A ): R {
        return batchedUpdates<A, R>( fn, a );
    }

    public createComponentSelector( component: React$AbstractComponent<never, unknown> ): ComponentSelector {
        return createComponentSelector( component );
    }

    public createContainer( containerInfo: Container, tag: RootTag, hydrationCallbacks: SuspenseHydrationCallbacks | null, isStrictMode: boolean, concurrentUpdatesByDefaultOverride: boolean | null, identifierPrefix: string, onRecoverableError: ( error: Error ) => void, transitionCallbacks: TransitionTracingCallbacks | null ): OpaqueRoot {
        return createContainer( containerInfo, tag, hydrationCallbacks as SuspenseHydrationCallbacks, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError, transitionCallbacks );
    }

    public createHasPseudoClassSelector( selectors: Selector[] ): HasPseudoClassSelector {
        return createHasPseudoClassSelector( selectors );
    }

    public createHydrationContainer(
        initialChildren: ReactNodeList, callback: ( () => void ) | null | undefined,
        containerInfo: Container,
        tag: RootTag,
        hydrationCallbacks: SuspenseHydrationCallbacks | null,
        isStrictMode: boolean,
        concurrentUpdatesByDefaultOverride: boolean | null,
        identifierPrefix: string,
        onRecoverableError: ( error: Error ) => void,
        transitionCallbacks: TransitionTracingCallbacks | null
    ): OpaqueRoot {
        return createHydrationContainer(
            initialChildren,
            callback,
            containerInfo,
            tag,
            hydrationCallbacks as SuspenseHydrationCallbacks,
            isStrictMode,
            concurrentUpdatesByDefaultOverride,
            identifierPrefix,
            onRecoverableError,
            transitionCallbacks,
            null, // formState not provided by definition
        );
    }

    public createPortal( children: ReactNodeList, containerInfo: any, implementation: any, key?: string | null ): ReactPortal {
        return createPortal( children, containerInfo, implementation, key );
    }

    public createRoleSelector( role: string ): RoleSelector {
        return createRoleSelector( role );
    }

    public createTestNameSelector( id: string ): TestNameSelector {
        return createTestNameSelector( id );
    }

    public createTextSelector( text: string ): TextSelector {
        return createTextSelector( text );
    }

    public deferredUpdates<A>( fn: () => A ): A {
        return deferredUpdates<A>( fn );
    }

    public discreteUpdates<A, B, C, D, R>( fn: ( arg0: A, arg1: B, arg2: C, arg3: D ) => R, a: A, b: B, c: C, d: D ): R {
        return discreteUpdates( fn, a, b, c, d );
    }

    public findAllNodes( hostRoot: Instance, selectors: Selector[] ): Instance[] {
        return findAllNodes( hostRoot, selectors );
    }

    public findBoundingRects( hostRoot: Instance, selectors: Selector[] ): BoundingRect[] {
        return findBoundingRects( hostRoot, selectors );
    }

    public findHostInstance( component: any ): PublicInstance | null {
        return findHostInstance( component );
    }

    public findHostInstanceWithNoPortals( fiber: Fiber ): PublicInstance | null {
        return findHostInstanceWithNoPortals( fiber );
    }

    public findHostInstanceWithWarning( component: any, methodName: string ): PublicInstance | null {
        return findHostInstanceWithWarning( component, methodName );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public flushControlled( fn: () => any ): void {
        throw new Error( "Method not implemented." );
    }

    public flushPassiveEffects(): boolean {
        return flushPassiveEffects();
    }

    public flushSync(): void;
    public flushSync<R>( fn: () => R ): R;
    public flushSync( fn?: any ): any {
        return flushSync( fn );
    }

    public focusWithin( hostRoot: Instance, selectors: Selector[] ): boolean {
        return focusWithin( hostRoot, selectors );
    }

    public getCurrentUpdatePriority(): LanePriority {
        return getCurrentUpdatePriority() as LanePriority;
    }

    public getFindAllNodesFailureDescription( hostRoot: Instance, selectors: Selector[] ): string | null {
        return getFindAllNodesFailureDescription( hostRoot, selectors );
    }

    public getPublicRootInstance( container: OpaqueRoot ): React.Component<any, any> | PublicInstance | null {
        return getPublicRootInstance( container );
    }

    public injectIntoDevTools( devToolsConfig: DevToolsConfig<Instance, TextInstance> ): boolean {
        // TODO Handle issue with devToolsConfig generics.
        return injectIntoDevTools( devToolsConfig as DevToolsConfig<Instance, TextInstance> );
    }

    public isAlreadyRendering(): boolean {
        return isAlreadyRendering();
    }

    public observeVisibleRects( hostRoot: Instance, selectors: Selector[], callback: ( intersections: Array<{
        ratio: number;
        rect: BoundingRect
    }> ) => void, options?: IntersectionObserverOptions ): { disconnect: () => void } {
        return observeVisibleRects( hostRoot, selectors, callback, options );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public registerMutableSourceForHydration( root: FiberRoot, mutableSource: MutableSource ): void {
        throw new Error( "Method not implemented." );
    }

    public runWithPriority<T>( priority: LanePriority, fn: () => T ): T {
        return runWithPriority( priority, fn );
    }

    public shouldError( fiber: Fiber ): boolean | undefined {
        // TODO: Try to see what about 'null';
        return shouldError( fiber ) as boolean | undefined;
    }

    public shouldSuspend( fiber: Fiber ): boolean {
        return shouldSuspend( fiber );
    }

    public updateContainer( element: ReactNodeList, container: OpaqueRoot, parentComponent?: Component | null, callback?: ( () => void ) | null ): Lane {
        return updateContainer( element, container, parentComponent, callback );
    }
}

export default function ReactReconciler
//     <
//     Type extends Type,
//     Props extends Props,
//     Container extends Container,
//     Instance extends Instance,
//     TextInstance extends TextInstance,
//     SuspenseInstance extends SuspenseInstance,
//     HydratableInstance extends HydratableInstance,
//     PublicInstance extends PublicInstance,
//     HostContext extends HostContext,
//     UpdatePayload extends UpdatePayload,
//     ChildSet extends ChildSet,
//     TimeoutHandle extends TimeoutHandle,
//     NoTimeout extends NoTimeout,
// >
(
    // config: HostConfig<
    //     Type,
    //     Props,
    //     Container,
    //     Instance,
    //     TextInstance,
    //     SuspenseInstance,
    //     HydratableInstance,
    //     PublicInstance,
    //     HostContext,
    //     UpdatePayload,
    //     ChildSet,
    //     TimeoutHandle,
    //     NoTimeout
    // >,
) {
    // return new ReactReconciler( config );
    return new ZenFluxReactReconciler();
}
