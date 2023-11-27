import { clearContainer } from "@zenflux/react-dom-bindings/src/client/ReactFiberConfigDOM";
import {
    getInstanceFromNode,
    isContainerMarkedAsRoot,
    markContainerAsRoot,
    unmarkContainerAsRoot
} from "@zenflux/react-dom-bindings/src/client/ReactDOMComponentTree";
import { listenToAllSupportedEvents } from "@zenflux/react-dom-bindings/src/events/DOMPluginEventSystem";

import { COMMENT_NODE, DOCUMENT_NODE, ELEMENT_NODE } from "@zenflux/react-dom-bindings/src/client/HTMLNodeType";
import {
    createContainer,
    createHydrationContainer,
    findHostInstance,
    findHostInstanceWithNoPortals,
    findHostInstanceWithWarning,
    flushSync,
    getPublicRootInstance,
    updateContainer
} from "@zenflux/react-reconciler/src/react-fiber-reconciler";
import { LegacyRoot } from "@zenflux/react-reconciler/src/react-root-tags";

import getComponentNameFromType from "@zenflux/react-shared/src/get-component-name-from-type";
import ReactSharedInternals from "@zenflux/react-shared/src/react-shared-internals";
import { has as hasInstance } from "@zenflux/react-shared/src/react-instance-map";

import { enableHostSingletons } from "@zenflux/react-shared/src/react-feature-flags";
import type { Container, PublicInstance } from "@zenflux/react-dom-bindings/src/client/ReactFiberConfigDOM";

import type { FiberRoot } from "@zenflux/react-reconciler/src/react-internal-types";

import { isValidContainerLegacy } from "@z-react-dom/client/ReactDOMRoot";

import type { ReactNodeList } from "@zenflux/react-shared/src/react-types";

const ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
let topLevelUpdateWarnings;

if ( __DEV__ ) {
    topLevelUpdateWarnings = ( container: Container ) => {
        if ( container._reactRootContainer && container.nodeType !== COMMENT_NODE ) {
            const hostInstance = findHostInstanceWithNoPortals( container._reactRootContainer.current );

            if ( hostInstance ) {
                if ( hostInstance.parentNode !== container ) {
                    console.error( "render(...): It looks like the React-rendered content of this " + "container was removed without using React. This is not " + "supported and will cause errors. Instead, call " + "ReactDOM.unmountComponentAtNode to empty a container." );
                }
            }
        }

        const isRootRenderedBySomeReact = !! container._reactRootContainer;
        const rootEl = getReactRootElementInContainer( container );
        const hasNonRootReactChild = !! ( rootEl && getInstanceFromNode( rootEl ) );

        if ( hasNonRootReactChild && ! isRootRenderedBySomeReact ) {
            console.error( "render(...): Replacing React-rendered children with a new root " + "component. If you intended to update the children of this node, " + "you should instead have the existing children update their state " + "and render the new components instead of calling ReactDOM.render." );
        }

        if ( ! enableHostSingletons && container.nodeType === ELEMENT_NODE && ( ( container as any ) as Element ).tagName && ( ( container as any ) as Element ).tagName.toUpperCase() === "BODY" ) {
            console.error( "render(): Rendering components directly into document.body is " + "discouraged, since its children are often manipulated by third-party " + "scripts and browser extensions. This may lead to subtle " + "reconciliation issues. Try rendering into a container element created " + "for your app." );
        }
    };
}

function getReactRootElementInContainer( container: any ) {
    if ( ! container ) {
        return null;
    }

    if ( container.nodeType === DOCUMENT_NODE ) {
        return container.documentElement;
    } else {
        return container.firstChild;
    }
}

function noopOnRecoverableError() {// This isn't reachable because onRecoverableError isn't called in the
    // legacy API.
}

function legacyCreateRootFromDOMContainer( container: Container, initialChildren: ReactNodeList, parentComponent: React.Component<any, any> | null | undefined, callback: ( ( ... args: Array<any> ) => any ) | null | undefined, isHydrationContainer: boolean ): FiberRoot {
    if ( isHydrationContainer ) {
        if ( typeof callback === "function" ) {
            const originalCallback = callback;

            callback = function () {
                const instance = getPublicRootInstance( root );
                originalCallback.call( instance );
            };
        }

        const root: FiberRoot = createHydrationContainer( initialChildren, callback, container, LegacyRoot, null, // hydrationCallbacks
            false, // isStrictMode
            false, // concurrentUpdatesByDefaultOverride,
            "", // identifierPrefix
            noopOnRecoverableError, // TODO(luna) Support hydration later
            null, null );
        container._reactRootContainer = root;
        markContainerAsRoot( root.current, container );
        const rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;
        // $FlowFixMe[incompatible-call]
        listenToAllSupportedEvents( rootContainerElement );
        flushSync();
        return root;
    } else {
        // First clear any existing content.
        clearContainer( container );

        if ( typeof callback === "function" ) {
            const originalCallback = callback;

            callback = function () {
                const instance = getPublicRootInstance( root );
                originalCallback.call( instance );
            };
        }

        const root = createContainer( container, LegacyRoot, null, // hydrationCallbacks
            false, // isStrictMode
            false, // concurrentUpdatesByDefaultOverride,
            "", // identifierPrefix
            noopOnRecoverableError, // onRecoverableError
            null // transitionCallbacks
        );
        container._reactRootContainer = root;
        markContainerAsRoot( root.current, container );
        const rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;
        // $FlowFixMe[incompatible-call]
        listenToAllSupportedEvents( rootContainerElement );
        // Initial mount should not be batched.
        flushSync( () => {
            updateContainer( initialChildren, root, parentComponent, callback );
        } );
        return root;
    }
}

function warnOnInvalidCallback( callback: unknown, callerName: string ): void {
    if ( __DEV__ ) {
        if ( callback !== null && typeof callback !== "function" ) {
            console.error( "%s(...): Expected the last optional `callback` argument to be a " + "function. Instead received: %s.", callerName, callback );
        }
    }
}

function legacyRenderSubtreeIntoContainer( parentComponent: React.Component<any, any> | null | undefined, children: ReactNodeList, container: Container, forceHydrate: boolean, callback: ( ( ... args: Array<any> ) => any ) | null | undefined ): React.Component<any, any> | PublicInstance | null {
    if ( __DEV__ ) {
        topLevelUpdateWarnings( container );
        warnOnInvalidCallback( callback === undefined ? null : callback, "render" );
    }

    const maybeRoot = container._reactRootContainer;
    let root: FiberRoot;

    if ( ! maybeRoot ) {
        // Initial mount
        root = legacyCreateRootFromDOMContainer( container, children, parentComponent, callback, forceHydrate );
    } else {
        root = maybeRoot;

        if ( typeof callback === "function" ) {
            const originalCallback = callback;

            callback = function () {
                const instance = getPublicRootInstance( root );
                originalCallback.call( instance );
            };
        }

        // Update
        updateContainer( children, root, parentComponent, callback );
    }

    return getPublicRootInstance( root );
}

export function findDOMNode( componentOrElement: Element | ( React.Component<any, any> | null | undefined ) ): null | Element | Text {
    if ( __DEV__ ) {
        const owner = ( ReactCurrentOwner.current as any );

        if ( owner !== null && owner.stateNode !== null ) {
            const warnedAboutRefsInRender = owner.stateNode._warnedAboutRefsInRender;

            if ( ! warnedAboutRefsInRender ) {
                console.error( "%s is accessing findDOMNode inside its render(). " + "render() should be a pure function of props and state. It should " + "never access something that requires stale data from the previous " + "render, such as refs. Move this logic to componentDidMount and " + "componentDidUpdate instead.", getComponentNameFromType( owner.type ) || "A component" );
            }

            owner.stateNode._warnedAboutRefsInRender = true;
        }
    }

    if ( componentOrElement == null ) {
        return null;
    }

    if ( ( componentOrElement as any ).nodeType === ELEMENT_NODE ) {
        return ( componentOrElement as any );
    }

    if ( __DEV__ ) {
        return findHostInstanceWithWarning( componentOrElement, "findDOMNode" );
    }

    return findHostInstance( componentOrElement );
}

export function hydrate( element: React.ReactNode, container: Container, callback: ( ( ... args: Array<any> ) => any ) | null | undefined ): React.Component<any, any> | PublicInstance | null {
    if ( __DEV__ ) {
        console.error( "ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot " + "instead. Until you switch to the new API, your app will behave as " + "if it's running React 17. Learn " + "more: https://reactjs.org/link/switch-to-createroot" );
    }

    if ( ! isValidContainerLegacy( container ) ) {
        throw new Error( "Target container is not a DOM element." );
    }

    if ( __DEV__ ) {
        const isModernRoot = isContainerMarkedAsRoot( container ) && container._reactRootContainer === undefined;

        if ( isModernRoot ) {
            console.error( "You are calling ReactDOM.hydrate() on a container that was previously " + "passed to ReactDOMClient.createRoot(). This is not supported. " + "Did you mean to call hydrateRoot(container, element)?" );
        }
    }

    // TODO: throw or warn if we couldn't hydrate?
    return legacyRenderSubtreeIntoContainer( null, element, container, true, callback );
}

export function render( element: React.ReactElement<React.ComponentProps<any>, any>, container: Container, callback: ( ( ... args: Array<any> ) => any ) | null | undefined ): React.Component<any, any> | PublicInstance | null {
    if ( __DEV__ ) {
        console.error( "ReactDOM.render is no longer supported in React 18. Use createRoot " + "instead. Until you switch to the new API, your app will behave as " + "if it's running React 17. Learn " + "more: https://reactjs.org/link/switch-to-createroot" );
    }

    if ( ! isValidContainerLegacy( container ) ) {
        throw new Error( "Target container is not a DOM element." );
    }

    if ( __DEV__ ) {
        const isModernRoot = isContainerMarkedAsRoot( container ) && container._reactRootContainer === undefined;

        if ( isModernRoot ) {
            console.error( "You are calling ReactDOM.render() on a container that was previously " + "passed to ReactDOMClient.createRoot(). This is not supported. " + "Did you mean to call root.render(element)?" );
        }
    }

    return legacyRenderSubtreeIntoContainer( null, element, container, false, callback );
}

export function unstable_renderSubtreeIntoContainer( parentComponent: React.Component<any, any>, element: React.ReactElement<React.ComponentProps<any>, any>, containerNode: Container, callback: ( ( ... args: Array<any> ) => any ) | null | undefined ): React.Component<any, any> | PublicInstance | null {
    if ( __DEV__ ) {
        console.error( "ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported " + "in React 18. Consider using a portal instead. Until you switch to " + "the createRoot API, your app will behave as if it's running React " + "17. Learn more: https://reactjs.org/link/switch-to-createroot" );
    }

    if ( ! isValidContainerLegacy( containerNode ) ) {
        throw new Error( "Target container is not a DOM element." );
    }

    if ( parentComponent == null || ! hasInstance( parentComponent ) ) {
        throw new Error( "parentComponent must be a valid React Component" );
    }

    return legacyRenderSubtreeIntoContainer( parentComponent, element, containerNode, false, callback );
}

export function unmountComponentAtNode( container: Container ): boolean {
    if ( ! isValidContainerLegacy( container ) ) {
        throw new Error( "unmountComponentAtNode(...): Target container is not a DOM element." );
    }

    if ( __DEV__ ) {
        const isModernRoot = isContainerMarkedAsRoot( container ) && container._reactRootContainer === undefined;

        if ( isModernRoot ) {
            console.error( "You are calling ReactDOM.unmountComponentAtNode() on a container that was previously " + "passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?" );
        }
    }

    if ( container._reactRootContainer ) {
        if ( __DEV__ ) {
            const rootEl = getReactRootElementInContainer( container );
            const renderedByDifferentReact = rootEl && ! getInstanceFromNode( rootEl );

            if ( renderedByDifferentReact ) {
                console.error( "unmountComponentAtNode(): The node you're attempting to unmount " + "was rendered by another copy of React." );
            }
        }

        // Unmount should not be batched.
        flushSync( () => {
            legacyRenderSubtreeIntoContainer( null, null, container, false, () => {
                // $FlowFixMe[incompatible-type] This should probably use `delete container._reactRootContainer`
                container._reactRootContainer = null;
                unmarkContainerAsRoot( container );
            } );
        } );
        // If you call unmountComponentAtNode twice in quick succession, you'll
        // get `true` twice. That's probably fine?
        return true;
    } else {
        if ( __DEV__ ) {
            const rootEl = getReactRootElementInContainer( container );
            const hasNonRootReactChild = !! ( rootEl && getInstanceFromNode( rootEl ) );
            // Check if the container itself is a React root node.
            const isContainerReactRoot = container.nodeType === ELEMENT_NODE && isValidContainerLegacy( container.parentNode ) && // $FlowFixMe[prop-missing]
                // $FlowFixMe[incompatible-use]
                // @ts-ignore - Who knows if parentNode will be a valid
                !! container.parentNode._reactRootContainer;

            if ( hasNonRootReactChild ) {
                console.error( "unmountComponentAtNode(): The node you're attempting to unmount " + "was rendered by React and is not a top-level container. %s", isContainerReactRoot ? "You may have accidentally passed in a React root node instead " + "of its container." : "Instead, have the parent component update its state and " + "rerender in order to remove this component." );
            }
        }

        return false;
    }
}
