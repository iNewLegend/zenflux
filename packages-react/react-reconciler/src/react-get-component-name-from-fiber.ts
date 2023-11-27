import { enableLegacyHidden } from "@zenflux/react-shared/src/react-feature-flags";

import getComponentNameFromType from "@zenflux/react-shared/src/get-component-name-from-type";
import { REACT_STRICT_MODE_TYPE } from "@zenflux/react-shared/src/react-symbols";

import {
    CacheComponent,
    ClassComponent,
    ContextConsumer,
    ContextProvider,
    DehydratedFragment,
    ForwardRef,
    Fragment,
    FunctionComponent,
    HostComponent,
    HostHoistable,
    HostPortal,
    HostRoot,
    HostSingleton,
    HostText,
    IncompleteClassComponent,
    IndeterminateComponent,
    LazyComponent,
    LegacyHiddenComponent,
    MemoComponent,
    Mode,
    OffscreenComponent,
    Profiler,
    ScopeComponent,
    SimpleMemoComponent,
    SuspenseComponent,
    SuspenseListComponent,
    TracingMarkerComponent
} from "@zenflux/react-reconciler/src/react-work-tags";

import type { ReactContext, ReactProviderType } from "@zenflux/react-shared/src/react-types";

import type { Fiber } from "@zenflux/react-reconciler/src/react-internal-types";

// Keep in sync with shared/getComponentNameFromType
function getWrappedName( outerType: unknown, innerType: any, wrapperName: string ): string {
    const functionName = innerType.displayName || innerType.name || "";
    return ( outerType as any ).displayName || ( functionName !== "" ? `${ wrapperName }(${ functionName })` : wrapperName );
}

// Keep in sync with shared/getComponentNameFromType
function getContextName( type: ReactContext<any> ) {
    return type.displayName || "Context";
}

export default function reactGetComponentNameFromFiber( fiber: Fiber ): string | null {
    const {
        tag,
        type
    } = fiber;

    switch ( tag ) {
        case CacheComponent:
            return "Cache";

        case ContextConsumer:
            const context: ReactContext<any> = ( type as any );
            return getContextName( context ) + ".Consumer";

        case ContextProvider:
            const provider: ReactProviderType<any> = ( type as any );
            return getContextName( provider._context ) + ".Provider";

        case DehydratedFragment:
            return "DehydratedFragment";

        case ForwardRef:
            return getWrappedName( type, type.render, "ForwardRef" );

        case Fragment:
            return "Fragment";

        case HostHoistable:
        case HostSingleton:
        case HostComponent:
            // Host component type is the display name (e.g. "div", "View")
            return type;

        case HostPortal:
            return "Portal";

        case HostRoot:
            return "Root";

        case HostText:
            return "Text";

        case LazyComponent:
            // Name comes from the type in this case; we don't have a tag.
            return getComponentNameFromType( type );

        case Mode:
            if ( type === REACT_STRICT_MODE_TYPE ) {
                // Don't be less specific than shared/getComponentNameFromType
                return "StrictMode";
            }

            return "Mode";

        case OffscreenComponent:
            return "Offscreen";

        case Profiler:
            return "Profiler";

        case ScopeComponent:
            return "Scope";

        case SuspenseComponent:
            return "Suspense";

        case SuspenseListComponent:
            return "SuspenseList";

        case TracingMarkerComponent:
            return "TracingMarker";

        // The display name for this tags come from the user-provided type:
        case ClassComponent:
        case FunctionComponent:
        case IncompleteClassComponent:
        case IndeterminateComponent:
        case MemoComponent:
        case SimpleMemoComponent:
            if ( typeof type === "function" ) {
                return ( type as any ).displayName || type.name || null;
            }

            if ( typeof type === "string" ) {
                return type;
            }

            break;

        case LegacyHiddenComponent:
            if ( enableLegacyHidden ) {
                return "LegacyHidden";
            }

    }

    return null;
}
