"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOptionProps = void 0;
var react_1 = require("react");
var didWarnSelectedSetOnOption = false;
var didWarnInvalidChild = false;
var didWarnInvalidInnerHTML = false;
/**
 * Implements an <option> host component that warns when `selected` is set.
 */
function validateOptionProps(element, props) {
    if (__DEV__) {
        // If a value is not provided, then the children must be simple.
        if (props.value == null) {
            if (typeof props.children === "object" && props.children !== null) {
                react_1.Children.forEach(props.children, function (child) {
                    if (child == null) {
                        return;
                    }
                    if (typeof child === "string" || typeof child === "number") {
                        return;
                    }
                    if (!didWarnInvalidChild) {
                        didWarnInvalidChild = true;
                        console.error("Cannot infer the option value of complex children. " + "Pass a `value` prop or use a plain string as children to <option>.");
                    }
                });
            }
            else if (props.dangerouslySetInnerHTML != null) {
                if (!didWarnInvalidInnerHTML) {
                    didWarnInvalidInnerHTML = true;
                    console.error("Pass a `value` prop if you set dangerouslyInnerHTML so React knows " + "which value should be selected.");
                }
            }
        }
        // TODO: Remove support for `selected` in <option>.
        if (props.selected != null && !didWarnSelectedSetOnOption) {
            console.error("Use the `defaultValue` or `value` props on <select> instead of " + "setting `selected` on <option>.");
            didWarnSelectedSetOnOption = true;
        }
    }
}
exports.validateOptionProps = validateOptionProps;