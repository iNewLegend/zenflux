"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStackByFiberInDevAndProd = void 0;
var react_component_stack_frame_1 = require("@zenflux/react-shared/src/react-component-stack-frame");
var react_work_tags_1 = require("@zenflux/react-reconciler/src/react-work-tags");
function describeFiber(fiber) {
    var owner = __DEV__ ? fiber._debugOwner ? fiber._debugOwner.type : null : null;
    var source = __DEV__ ? fiber._debugSource : null;
    switch (fiber.tag) {
        case react_work_tags_1.HostHoistable:
        case react_work_tags_1.HostSingleton:
        case react_work_tags_1.HostComponent:
            return (0, react_component_stack_frame_1.describeBuiltInComponentFrame)(fiber.type, source, owner);
        case react_work_tags_1.LazyComponent:
            return (0, react_component_stack_frame_1.describeBuiltInComponentFrame)("Lazy", source, owner);
        case react_work_tags_1.SuspenseComponent:
            return (0, react_component_stack_frame_1.describeBuiltInComponentFrame)("Suspense", source, owner);
        case react_work_tags_1.SuspenseListComponent:
            return (0, react_component_stack_frame_1.describeBuiltInComponentFrame)("SuspenseList", source, owner);
        case react_work_tags_1.FunctionComponent:
        case react_work_tags_1.IndeterminateComponent:
        case react_work_tags_1.SimpleMemoComponent:
            return (0, react_component_stack_frame_1.describeFunctionComponentFrame)(fiber.type, source, owner);
        case react_work_tags_1.ForwardRef:
            return (0, react_component_stack_frame_1.describeFunctionComponentFrame)(fiber.type.render, source, owner);
        case react_work_tags_1.ClassComponent:
            return (0, react_component_stack_frame_1.describeClassComponentFrame)(fiber.type, source, owner);
        default:
            return "";
    }
}
function getStackByFiberInDevAndProd(workInProgress) {
    try {
        var info = "";
        var node = workInProgress;
        do {
            info += describeFiber(node);
            // $FlowFixMe[incompatible-type] we bail out when we get a null
            node = node.return;
        } while (node);
        return info;
    }
    catch (x) {
        return "\nError generating stack: " + x.message + "\n" + x.stack;
    }
}
exports.getStackByFiberInDevAndProd = getStackByFiberInDevAndProd;
