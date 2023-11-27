import type { HostDispatcher } from "@z-react-dom/shared/ReactDOMTypes";

type InternalsType = {
    usingClientEntryPoint: boolean;
    Events: [ any, any, any, any, any, any ];
    Dispatcher: {
        current: null | HostDispatcher;
    };
};

const Internals: InternalsType = ( {
    usingClientEntryPoint: false,
    Events: null,
    Dispatcher: {
        current: null
    }
} as any );

export default Internals;
