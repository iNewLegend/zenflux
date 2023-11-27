"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_feature_flags_1 = require("@zenflux/react-shared/src/react-feature-flags");
var get_component_name_from_type_1 = require("@zenflux/react-shared/src/get-component-name-from-type");
var react_symbols_1 = require("@zenflux/react-shared/src/react-symbols");
var react_work_tags_1 = require("@zenflux/react-reconciler/src/react-work-tags");
// Keep in sync with shared/getComponentNameFromType
function getWrappedName(outerType, innerType, wrapperName) {
    var functionName = innerType.displayName || innerType.name || "";
    return outerType.displayName || (functionName !== "" ? "".concat(wrapperName, "(").concat(functionName, ")") : wrapperName);
}
// Keep in sync with shared/getComponentNameFromType
function getContextName(type) {
    return type.displayName || "Context";
}
function reactGetComponentNameFromFiber(fiber) {
    var tag = fiber.tag, type = fiber.type;
    switch (tag) {
        case react_work_tags_1.CacheComponent:
            return "Cache";
        case react_work_tags_1.ContextConsumer:
            var context = type;
            return getContextName(context) + ".Consumer";
        case react_work_tags_1.ContextProvider:
            var provider = type;
            return getContextName(provider._context) + ".Provider";
        case react_work_tags_1.DehydratedFragment:
            return "DehydratedFragment";
        case react_work_tags_1.ForwardRef:
            return getWrappedName(type, type.render, "ForwardRef");
        case react_work_tags_1.Fragment:
            return "Fragment";
        case react_work_tags_1.HostHoistable:
        case react_work_tags_1.HostSingleton:
        case react_work_tags_1.HostComponent:
            // Host component type is the display name (e.g. "div", "View")
            return type;
        case react_work_tags_1.HostPortal:
            return "Portal";
        case react_work_tags_1.HostRoot:
            return "Root";
        case react_work_tags_1.HostText:
            return "Text";
        case react_work_tags_1.LazyComponent:
            // Name comes from the type in this case; we don't have a tag.
            return (0, get_component_name_from_type_1.default)(type);
        case react_work_tags_1.Mode:
            if (type === react_symbols_1.REACT_STRICT_MODE_TYPE) {
                // Don't be less specific than shared/getComponentNameFromType
                return "StrictMode";
            }
            return "Mode";
        case react_work_tags_1.OffscreenComponent:
            return "Offscreen";
        case react_work_tags_1.Profiler:
            return "Profiler";
        case react_work_tags_1.ScopeComponent:
            return "Scope";
        case react_work_tags_1.SuspenseComponent:
            return "Suspense";
        case react_work_tags_1.SuspenseListComponent:
            return "SuspenseList";
        case react_work_tags_1.TracingMarkerComponent:
            return "TracingMarker";
        // The display name for this tags come from the user-provided type:
        case react_work_tags_1.ClassComponent:
        case react_work_tags_1.FunctionComponent:
        case react_work_tags_1.IncompleteClassComponent:
        case react_work_tags_1.IndeterminateComponent:
        case react_work_tags_1.MemoComponent:
        case react_work_tags_1.SimpleMemoComponent:
            if (typeof type === "function") {
                return type.displayName || type.name || null;
            }
            if (typeof type === "string") {
                return type;
            }
            break;
        case react_work_tags_1.LegacyHiddenComponent:
            if (react_feature_flags_1.enableLegacyHidden) {
                return "LegacyHidden";
            }
    }
    return null;
}
exports.default = reactGetComponentNameFromFiber;
