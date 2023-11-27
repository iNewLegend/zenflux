import { ReactDOMClientDispatcher } from "@zenflux/react-dom-bindings/src/client/ReactFiberConfigDOM";
import { queueExplicitHydrationTarget } from "@zenflux/react-dom-bindings/src/events/ReactDOMEventReplaying";

import {
    isContainerMarkedAsRoot,
    markContainerAsRoot,
    unmarkContainerAsRoot
} from "@zenflux/react-dom-bindings/src/client/ReactDOMComponentTree";
import { listenToAllSupportedEvents } from "@zenflux/react-dom-bindings/src/events/DOMPluginEventSystem";
import {
    COMMENT_NODE,
    DOCUMENT_FRAGMENT_NODE,
    DOCUMENT_NODE,
    ELEMENT_NODE
} from "@zenflux/react-dom-bindings/src/client/HTMLNodeType";
import {
    createContainer,
    createHydrationContainer,
    findHostInstanceWithNoPortals,
    flushSync,
    isAlreadyRendering,
    updateContainer
} from "@zenflux/react-reconciler/src/react-fiber-reconciler";
import { ConcurrentRoot } from "@zenflux/react-reconciler/src/react-root-tags";

import {
    allowConcurrentByDefault,
    disableCommentsAsDOMContainers,
    enableAsyncActions,
    enableFloat,
    enableFormActions,
    enableHostSingletons
} from "@zenflux/react-shared/src/react-feature-flags";
import { REACT_ELEMENT_TYPE } from "@zenflux/react-shared/src/react-symbols";

import ReactDOMSharedInternals from "../ReactDOMSharedInternals";

import type { FiberRoot, TransitionTracingCallbacks } from "@zenflux/react-reconciler/src/react-internal-types";

import type { ReactFormState, ReactNodeList } from "@zenflux/react-shared/src/react-types";

const {
    Dispatcher
} = ReactDOMSharedInternals;

if ( enableFloat && typeof document !== "undefined" ) {
    // Set the default dispatcher to the client dispatcher
    Dispatcher.current = ReactDOMClientDispatcher;
}

export type RootType = {
    render( children: ReactNodeList ): void;
    unmount(): void;
    _internalRoot: FiberRoot | null;
};
export type CreateRootOptions = {
    unstable_strictMode?: boolean;
    unstable_concurrentUpdatesByDefault?: boolean;
    unstable_transitionCallbacks?: TransitionTracingCallbacks;
    identifierPrefix?: string;
    onRecoverableError?: ( error: unknown ) => void;
};
export type HydrateRootOptions = {
    // Hydration options
    onHydrated?: ( suspenseNode: Comment ) => void;
    onDeleted?: ( suspenseNode: Comment ) => void;
    // Options for all roots
    unstable_strictMode?: boolean;
    unstable_concurrentUpdatesByDefault?: boolean;
    unstable_transitionCallbacks?: TransitionTracingCallbacks;
    identifierPrefix?: string;
    onRecoverableError?: ( error: unknown ) => void;
    formState?: ReactFormState<any, any> | null;
};

/* global reportError */
const defaultOnRecoverableError = typeof reportError === "function" ? // In modern browsers, reportError will dispatch an error event,
    // emulating an uncaught JavaScript error.
    reportError : ( error: unknown ) => {
        // In older browsers and test environments, fallback to console.error.
        // eslint-disable-next-line react-internal/no-production-logging
        console[ "error" ]( error );
    };

// @ts-expect-error[missing-this-annot]
function ReactDOMRoot( internalRoot: FiberRoot ) {
    this._internalRoot = internalRoot;
}

// @ts-expect-error[prop-missing] found when upgrading Flow
ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render = // $FlowFixMe[missing-this-annot]
    function ( children: ReactNodeList ): void {
        const root = this._internalRoot;

        if ( root === null ) {
            throw new Error( "Cannot update an unmounted root." );
        }

        if ( __DEV__ ) {
            if ( typeof arguments[ 1 ] === "function" ) {
                console.error( "render(...): does not support the second callback argument. " + "To execute a side effect after rendering, declare it in a component body with useEffect()." );
            } else if ( isValidContainer( arguments[ 1 ] ) ) {
                console.error( "You passed a container to the second argument of root.render(...). " + "You don't need to pass it again since you already passed it to create the root." );
            } else if ( typeof arguments[ 1 ] !== "undefined" ) {
                console.error( "You passed a second argument to root.render(...) but it only accepts " + "one argument." );
            }

            const container = root.containerInfo;

            if ( ! enableFloat && ! enableHostSingletons && container.nodeType !== COMMENT_NODE ) {
                const hostInstance = findHostInstanceWithNoPortals( root.current );

                if ( hostInstance ) {
                    if ( hostInstance.parentNode !== container ) {
                        console.error( "render(...): It looks like the React-rendered content of the " + "root container was removed without using React. This is not " + "supported and will cause errors. Instead, call " + "root.unmount() to empty a root's container." );
                    }
                }
            }
        }

        updateContainer( children, root, null, null );
    };

// @ts-expect-error[prop-missing] found when upgrading Flow
ReactDOMHydrationRoot.prototype.unmount = ReactDOMRoot.prototype.unmount = // $FlowFixMe[missing-this-annot]
    function (): void {
        if ( __DEV__ ) {
            if ( typeof arguments[ 0 ] === "function" ) {
                console.error( "unmount(...): does not support a callback argument. " + "To execute a side effect after rendering, declare it in a component body with useEffect()." );
            }
        }

        const root = this._internalRoot;

        if ( root !== null ) {
            this._internalRoot = null;
            const container = root.containerInfo;

            if ( __DEV__ ) {
                if ( isAlreadyRendering() ) {
                    console.error( "Attempted to synchronously unmount a root while React was already " + "rendering. React cannot finish unmounting the root until the " + "current render has completed, which may lead to a race condition." );
                }
            }

            flushSync( () => {
                updateContainer( null, root, null, null );
            } );
            unmarkContainerAsRoot( container );
        }
    };

export function createRoot( container: Element | Document | DocumentFragment, options?: CreateRootOptions ): RootType {
    if ( ! isValidContainer( container ) ) {
        throw new Error( "createRoot(...): Target container is not a DOM element." );
    }

    warnIfReactDOMContainerInDEV( container );
    let isStrictMode = false;
    let concurrentUpdatesByDefaultOverride = false;
    let identifierPrefix = "";
    let onRecoverableError = defaultOnRecoverableError;
    let transitionCallbacks = null;

    if ( options !== null && options !== undefined ) {
        if ( __DEV__ ) {
            if ( ( options as any ).hydrate ) {
                console.warn( "hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead." );
            } else {
                if ( typeof options === "object" && options !== null && ( options as any ).$$typeof === REACT_ELEMENT_TYPE ) {
                    console.error( "You passed a JSX element to createRoot. You probably meant to " + "call root.render instead. " + "Example usage:\n\n" + "  let root = createRoot(domContainer);\n" + "  root.render(<App />);" );
                }
            }
        }

        if ( options.unstable_strictMode === true ) {
            isStrictMode = true;
        }

        if ( allowConcurrentByDefault && options.unstable_concurrentUpdatesByDefault === true ) {
            concurrentUpdatesByDefaultOverride = true;
        }

        if ( options.identifierPrefix !== undefined ) {
            identifierPrefix = options.identifierPrefix;
        }

        if ( options.onRecoverableError !== undefined ) {
            onRecoverableError = options.onRecoverableError;
        }

        if ( options.unstable_transitionCallbacks !== undefined ) {
            transitionCallbacks = options.unstable_transitionCallbacks;
        }
    }

    const root = createContainer( container, ConcurrentRoot, null, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError, transitionCallbacks );
    markContainerAsRoot( root.current, container );
    Dispatcher.current = ReactDOMClientDispatcher;
    const rootContainerElement: Document | Element | DocumentFragment = container.nodeType === COMMENT_NODE ? ( container.parentNode as any ) : container;
    listenToAllSupportedEvents( rootContainerElement );
    // $FlowFixMe[invalid-constructor] Flow no longer supports calling new on functions
    return new ReactDOMRoot( root );
}

// @ts-expect-error[missing-this-annot]
function ReactDOMHydrationRoot( internalRoot: FiberRoot ) {
    this._internalRoot = internalRoot;
}

function scheduleHydration( target: Node ) {
    if ( target ) {
        queueExplicitHydrationTarget( target );
    }
}

// @ts-expect-error[prop-missing] found when upgrading Flow
ReactDOMHydrationRoot.prototype.unstable_scheduleHydration = scheduleHydration;

export function hydrateRoot( container: Document | Element, initialChildren: ReactNodeList, options?: HydrateRootOptions ): RootType {
    if ( ! isValidContainer( container ) ) {
        throw new Error( "hydrateRoot(...): Target container is not a DOM element." );
    }

    warnIfReactDOMContainerInDEV( container );

    if ( __DEV__ ) {
        if ( initialChildren === undefined ) {
            console.error( "Must provide initial children as second argument to hydrateRoot. " + "Example usage: hydrateRoot(domContainer, <App />)" );
        }
    }

    // For now we reuse the whole bag of options since they contain
    // the hydration callbacks.
    const hydrationCallbacks = options != null ? options : null;
    let isStrictMode = false;
    let concurrentUpdatesByDefaultOverride = false;
    let identifierPrefix = "";
    let onRecoverableError = defaultOnRecoverableError;
    let transitionCallbacks = null;
    let formState = null;

    if ( options !== null && options !== undefined ) {
        if ( options.unstable_strictMode === true ) {
            isStrictMode = true;
        }

        if ( allowConcurrentByDefault && options.unstable_concurrentUpdatesByDefault === true ) {
            concurrentUpdatesByDefaultOverride = true;
        }

        if ( options.identifierPrefix !== undefined ) {
            identifierPrefix = options.identifierPrefix;
        }

        if ( options.onRecoverableError !== undefined ) {
            onRecoverableError = options.onRecoverableError;
        }

        if ( options.unstable_transitionCallbacks !== undefined ) {
            transitionCallbacks = options.unstable_transitionCallbacks;
        }

        if ( enableAsyncActions && enableFormActions ) {
            if ( options.formState !== undefined ) {
                formState = options.formState;
            }
        }
    }

    const root = createHydrationContainer( initialChildren, null, container, ConcurrentRoot, hydrationCallbacks, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError, transitionCallbacks, formState );
    markContainerAsRoot( root.current, container );
    Dispatcher.current = ReactDOMClientDispatcher;
    // This can't be a comment node since hydration doesn't work on comment nodes anyway.
    listenToAllSupportedEvents( container );
    // $FlowFixMe[invalid-constructor] Flow no longer supports calling new on functions
    return new ReactDOMHydrationRoot( root );
}

export function isValidContainer( node: any ): boolean {
    return !! ( node && ( node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE || ! disableCommentsAsDOMContainers && node.nodeType === COMMENT_NODE && ( node as any ).nodeValue === " react-mount-point-unstable " ) );
}

// TODO: Remove this function which also includes comment nodes.
// We only use it in places that are currently more relaxed.
export function isValidContainerLegacy( node: any ): boolean {
    return !! ( node && ( node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE || node.nodeType === COMMENT_NODE && ( node as any ).nodeValue === " react-mount-point-unstable " ) );
}

function warnIfReactDOMContainerInDEV( container: any ) {
    if ( __DEV__ ) {
        if ( ! enableHostSingletons && container.nodeType === ELEMENT_NODE && ( ( container as any ) as Element ).tagName && ( ( container as any ) as Element ).tagName.toUpperCase() === "BODY" ) {
            console.error( "createRoot(): Creating roots directly with document.body is " + "discouraged, since its children are often manipulated by third-party " + "scripts and browser extensions. This may lead to subtle " + "reconciliation issues. Try using a container element created " + "for your app." );
        }

        if ( isContainerMarkedAsRoot( container ) ) {
            if ( container._reactRootContainer ) {
                console.error( "You are calling ReactDOMClient.createRoot() on a container that was previously " + "passed to ReactDOM.render(). This is not supported." );
            } else {
                console.error( "You are calling ReactDOMClient.createRoot() on a container that " + "has already been passed to createRoot() before. Instead, call " + "root.render() on the existing root instead if you want to update it." );
            }
        }
    }
}
