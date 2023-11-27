"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveLazyComponentTag = exports.isSimpleFunctionComponent = exports.shouldConstruct = void 0;
var react_symbols_1 = require("@zenflux/react-shared/src/react-symbols");
var react_work_tags_1 = require("@zenflux/react-reconciler/src/react-work-tags");
function shouldConstruct(Component) {
    var prototype = Component.prototype;
    return !!(prototype && prototype.isReactComponent);
}
exports.shouldConstruct = shouldConstruct;
function isSimpleFunctionComponent(type) {
    return typeof type === "function" && !shouldConstruct(type) && type.defaultProps === undefined;
}
exports.isSimpleFunctionComponent = isSimpleFunctionComponent;
function resolveLazyComponentTag(Component) {
    if (typeof Component === "function") {
        return shouldConstruct(Component) ? react_work_tags_1.ClassComponent : react_work_tags_1.FunctionComponent;
    }
    else if (Component !== undefined && Component !== null) {
        // @ts-ignore
        var $$typeof = Component.$$typeof;
        if ($$typeof === react_symbols_1.REACT_FORWARD_REF_TYPE) {
            return react_work_tags_1.ForwardRef;
        }
        if ($$typeof === react_symbols_1.REACT_MEMO_TYPE) {
            return react_work_tags_1.MemoComponent;
        }
    }
    return react_work_tags_1.IndeterminateComponent;
}
exports.resolveLazyComponentTag = resolveLazyComponentTag;
