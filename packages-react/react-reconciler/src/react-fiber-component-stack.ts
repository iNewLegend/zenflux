import {
    describeBuiltInComponentFrame,
    describeClassComponentFrame,
    describeFunctionComponentFrame
} from "@zenflux/react-shared/src/react-component-stack-frame";

import {
    ClassComponent,
    ForwardRef,
    FunctionComponent,
    HostComponent,
    HostHoistable,
    HostSingleton,
    IndeterminateComponent,
    LazyComponent,
    SimpleMemoComponent,
    SuspenseComponent,
    SuspenseListComponent
} from "@zenflux/react-reconciler/src/react-work-tags";

import type { Fiber } from "@zenflux/react-reconciler/src/react-internal-types";

function describeFiber( fiber: Fiber ): string {
    const owner: null | ( ( ... args: Array<any> ) => any ) = __DEV__ ? fiber._debugOwner ? fiber._debugOwner.type : null : null;
    const source = __DEV__ ? fiber._debugSource : null;

    switch ( fiber.tag ) {
        case HostHoistable:
        case HostSingleton:
        case HostComponent:
            return describeBuiltInComponentFrame( fiber.type, source, owner );

        case LazyComponent:
            return describeBuiltInComponentFrame( "Lazy", source, owner );

        case SuspenseComponent:
            return describeBuiltInComponentFrame( "Suspense", source, owner );

        case SuspenseListComponent:
            return describeBuiltInComponentFrame( "SuspenseList", source, owner );

        case FunctionComponent:
        case IndeterminateComponent:
        case SimpleMemoComponent:
            return describeFunctionComponentFrame( fiber.type, source, owner );

        case ForwardRef:
            return describeFunctionComponentFrame( fiber.type.render, source, owner );

        case ClassComponent:
            return describeClassComponentFrame( fiber.type, source, owner );

        default:
            return "";
    }
}

export function getStackByFiberInDevAndProd( workInProgress: Fiber ): string {
    try {
        let info = "";
        let node: Fiber | null = workInProgress;

        do {
            info += describeFiber( node );
            // $FlowFixMe[incompatible-type] we bail out when we get a null
            node = node.return;
        } while ( node );

        return info;
    } catch ( x: any ) {
        return "\nError generating stack: " + x.message + "\n" + x.stack;
    }
}
