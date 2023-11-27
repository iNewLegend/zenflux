"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignFiberPropertiesInDEV = exports.createFiberFromPortal = exports.createFiberFromDehydratedFragment = exports.createFiberFromHostInstanceForDeletion = exports.createFiberFromText = exports.createFiberFromTracingMarker = exports.createFiberFromCache = exports.createFiberFromSuspenseList = exports.createFiberFromSuspense = exports.createFiberFromFragment = exports.createHostRootFiber = exports.createFiber = exports.FiberNode = void 0;
var react_feature_flags_1 = require("@zenflux/react-shared/src/react-feature-flags");
var react_symbols_1 = require("@zenflux/react-shared/src/react-symbols");
var react_fiber_lane_constants_1 = require("@zenflux/react-reconciler/src/react-fiber-lane-constants");
var react_fiber_dev_tools_hook_1 = require("@zenflux/react-reconciler/src/react-fiber-dev-tools-hook");
var react_fiber_flags_1 = require("@zenflux/react-reconciler/src/react-fiber-flags");
var react_fiber_tracing_marker_component_1 = require("@zenflux/react-reconciler/src/react-fiber-tracing-marker-component");
var react_root_tags_1 = require("@zenflux/react-reconciler/src/react-root-tags");
var react_type_of_mode_1 = require("@zenflux/react-reconciler/src/react-type-of-mode");
var react_work_tags_1 = require("@zenflux/react-reconciler/src/react-work-tags");
var hasBadMapPolyfill;
if (__DEV__) {
    hasBadMapPolyfill = false;
    try {
        var nonExtensibleObject = Object.preventExtensions({});
        /* eslint-disable no-new */
        new Map([[nonExtensibleObject, null]]);
        new Set([nonExtensibleObject]);
        /* eslint-enable no-new */
    }
    catch (e) {
        // TODO: Consider warning about bad polyfills
        hasBadMapPolyfill = true;
    }
}
function FiberNode(tag, pendingProps, key, mode) {
    // Instance
    this.tag = tag;
    this.key = key;
    this.elementType = null;
    this.type = null;
    this.stateNode = null;
    // Fiber
    this.return = null;
    this.child = null;
    this.sibling = null;
    this.index = 0;
    this.ref = null;
    this.refCleanup = null;
    this.pendingProps = pendingProps;
    this.memoizedProps = null;
    this.updateQueue = null;
    this.memoizedState = null;
    this.dependencies = null;
    this.mode = mode;
    // Effects
    this.flags = react_fiber_flags_1.NoFlags;
    this.subtreeFlags = react_fiber_flags_1.NoFlags;
    this.deletions = null;
    this.lanes = react_fiber_lane_constants_1.NoLanes;
    this.childLanes = react_fiber_lane_constants_1.NoLanes;
    this.alternate = null;
    if (react_feature_flags_1.enableProfilerTimer) {
        // Note: The following is done to avoid a v8 performance cliff.
        //
        // Initializing the fields below to smis and later updating them with
        // double values will cause Fibers to end up having separate shapes.
        // This behavior/bug has something to do with Object.preventExtension().
        // Fortunately this only impacts DEV builds.
        // Unfortunately it makes React unusably slow for some applications.
        // To work around this, initialize the fields below with doubles.
        //
        // Learn more about this here:
        // https://github.com/facebook/react/issues/14365
        // https://bugs.chromium.org/p/v8/issues/detail?id=8538
        this.actualDuration = Number.NaN;
        this.actualStartTime = Number.NaN;
        this.selfBaseDuration = Number.NaN;
        this.treeBaseDuration = Number.NaN;
        // It's okay to replace the initial doubles with smis after initialization.
        // This won't trigger the performance cliff mentioned above,
        // and it simplifies other profiler code (including DevTools).
        this.actualDuration = 0;
        this.actualStartTime = -1;
        this.selfBaseDuration = 0;
        this.treeBaseDuration = 0;
    }
    if (__DEV__) {
        // This isn't directly used but is handy for debugging internals:
        this._debugSource = null;
        this._debugOwner = null;
        this._debugNeedsRemount = false;
        this._debugHookTypes = null;
        if (!hasBadMapPolyfill && typeof Object.preventExtensions === "function") {
            Object.preventExtensions(this);
        }
    }
}
exports.FiberNode = FiberNode;
// This is a constructor function, rather than a POJO constructor, still
// please ensure we do the following:
// 1) Nobody should add any instance methods on this. Instance methods can be
//    more difficult to predict when they get optimized and they are almost
//    never inlined properly in static compilers.
// 2) Nobody should rely on `instanceof Fiber` for type testing. We should
//    always know when it is a fiber.
// 3) We might want to experiment with using numeric keys since they are easier
//    to optimize in a non-JIT environment.
// 4) We can easily go from a constructor to a createFiber object literal if that
//    is faster.
// 5) It should be easy to port this to a C struct and keep a C implementation
//    compatible.
function createFiber(tag, pendingProps, key, mode) {
    // $FlowFixMe[invalid-constructor]: the shapes are exact here but Flow doesn't like constructors
    // @ts-ignore
    return new FiberNode(tag, pendingProps, key, mode);
}
exports.createFiber = createFiber;
function createHostRootFiber(tag, isStrictMode, concurrentUpdatesByDefaultOverride) {
    var mode;
    if (tag === react_root_tags_1.ConcurrentRoot) {
        mode = react_type_of_mode_1.ConcurrentMode;
        if (isStrictMode === true || react_feature_flags_1.createRootStrictEffectsByDefault) {
            mode |= react_type_of_mode_1.StrictLegacyMode | react_type_of_mode_1.StrictEffectsMode;
        }
        if ( // We only use this flag for our repo tests to check both behaviors.
        react_feature_flags_1.forceConcurrentByDefaultForTesting) {
            mode |= react_type_of_mode_1.ConcurrentUpdatesByDefaultMode;
        }
        else if ( // Only for internal experiments.
        react_feature_flags_1.allowConcurrentByDefault && concurrentUpdatesByDefaultOverride) {
            mode |= react_type_of_mode_1.ConcurrentUpdatesByDefaultMode;
        }
    }
    else {
        mode = react_type_of_mode_1.NoMode;
    }
    if (react_feature_flags_1.enableProfilerTimer && react_fiber_dev_tools_hook_1.isDevToolsPresent) {
        // Always collect profile timings when DevTools are present.
        // This enables DevTools to start capturing timing at any point–
        // Without some nodes in the tree having empty base times.
        mode |= react_type_of_mode_1.ProfileMode;
    }
    return createFiber(react_work_tags_1.HostRoot, null, null, mode);
}
exports.createHostRootFiber = createHostRootFiber;
function createFiberFromFragment(elements, mode, lanes, key) {
    var fiber = createFiber(react_work_tags_1.Fragment, elements, key, mode);
    fiber.lanes = lanes;
    return fiber;
}
exports.createFiberFromFragment = createFiberFromFragment;
function createFiberFromSuspense(pendingProps, mode, lanes, key) {
    var fiber = createFiber(react_work_tags_1.SuspenseComponent, pendingProps, key, mode);
    fiber.elementType = react_symbols_1.REACT_SUSPENSE_TYPE;
    fiber.lanes = lanes;
    return fiber;
}
exports.createFiberFromSuspense = createFiberFromSuspense;
function createFiberFromSuspenseList(pendingProps, mode, lanes, key) {
    var fiber = createFiber(react_work_tags_1.SuspenseListComponent, pendingProps, key, mode);
    fiber.elementType = react_symbols_1.REACT_SUSPENSE_LIST_TYPE;
    fiber.lanes = lanes;
    return fiber;
}
exports.createFiberFromSuspenseList = createFiberFromSuspenseList;
function createFiberFromCache(pendingProps, mode, lanes, key) {
    var fiber = createFiber(react_work_tags_1.CacheComponent, pendingProps, key, mode);
    fiber.elementType = react_symbols_1.REACT_CACHE_TYPE;
    fiber.lanes = lanes;
    return fiber;
}
exports.createFiberFromCache = createFiberFromCache;
function createFiberFromTracingMarker(pendingProps, mode, lanes, key) {
    var fiber = createFiber(react_work_tags_1.TracingMarkerComponent, pendingProps, key, mode);
    fiber.elementType = react_symbols_1.REACT_TRACING_MARKER_TYPE;
    fiber.lanes = lanes;
    var tracingMarkerInstance = {
        tag: react_fiber_tracing_marker_component_1.TransitionTracingMarker,
        transitions: null,
        pendingBoundaries: null,
        aborts: null,
        name: pendingProps.name
    };
    fiber.stateNode = tracingMarkerInstance;
    return fiber;
}
exports.createFiberFromTracingMarker = createFiberFromTracingMarker;
function createFiberFromText(content, mode, lanes) {
    var fiber = createFiber(react_work_tags_1.HostText, content, null, mode);
    fiber.lanes = lanes;
    return fiber;
}
exports.createFiberFromText = createFiberFromText;
function createFiberFromHostInstanceForDeletion() {
    var fiber = createFiber(react_work_tags_1.HostComponent, null, null, react_type_of_mode_1.NoMode);
    fiber.elementType = "DELETED";
    return fiber;
}
exports.createFiberFromHostInstanceForDeletion = createFiberFromHostInstanceForDeletion;
function createFiberFromDehydratedFragment(dehydratedNode) {
    var fiber = createFiber(react_work_tags_1.DehydratedFragment, null, null, react_type_of_mode_1.NoMode);
    fiber.stateNode = dehydratedNode;
    return fiber;
}
exports.createFiberFromDehydratedFragment = createFiberFromDehydratedFragment;
function createFiberFromPortal(portal, mode, lanes) {
    var pendingProps = portal.children !== null ? portal.children : [];
    var fiber = createFiber(react_work_tags_1.HostPortal, pendingProps, portal.key, mode);
    fiber.lanes = lanes;
    fiber.stateNode = {
        containerInfo: portal.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: portal.implementation
    };
    return fiber;
}
exports.createFiberFromPortal = createFiberFromPortal;
// Used for stashing WIP properties to replay failed work in DEV.
function assignFiberPropertiesInDEV(target, source) {
    if (target === null) {
        // This Fiber's initial properties will always be overwritten.
        // We only use a Fiber to ensure the same hidden class so DEV isn't slow.
        target = createFiber(react_work_tags_1.IndeterminateComponent, null, null, react_type_of_mode_1.NoMode);
    }
    // This is intentionally written as a list of all properties.
    // We tried to use Object.assign() instead but this is called in
    // the hottest path, and Object.assign() was too slow:
    // https://github.com/facebook/react/issues/12502
    // This code is DEV-only so size is not a concern.
    target.tag = source.tag;
    target.key = source.key;
    target.elementType = source.elementType;
    target.type = source.type;
    target.stateNode = source.stateNode;
    target.return = source.return;
    target.child = source.child;
    target.sibling = source.sibling;
    target.index = source.index;
    target.ref = source.ref;
    target.refCleanup = source.refCleanup;
    target.pendingProps = source.pendingProps;
    target.memoizedProps = source.memoizedProps;
    target.updateQueue = source.updateQueue;
    target.memoizedState = source.memoizedState;
    target.dependencies = source.dependencies;
    target.mode = source.mode;
    target.flags = source.flags;
    target.subtreeFlags = source.subtreeFlags;
    target.deletions = source.deletions;
    target.lanes = source.lanes;
    target.childLanes = source.childLanes;
    target.alternate = source.alternate;
    if (react_feature_flags_1.enableProfilerTimer) {
        target.actualDuration = source.actualDuration;
        target.actualStartTime = source.actualStartTime;
        target.selfBaseDuration = source.selfBaseDuration;
        target.treeBaseDuration = source.treeBaseDuration;
    }
    target._debugSource = source._debugSource;
    target._debugOwner = source._debugOwner;
    target._debugNeedsRemount = source._debugNeedsRemount;
    target._debugHookTypes = source._debugHookTypes;
    return target;
}
exports.assignFiberPropertiesInDEV = assignFiberPropertiesInDEV;
