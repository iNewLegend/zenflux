"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line no-restricted-imports
require("./env");
// eslint-disable-next-line import/order
var react_1 = require("react");
if ("undefined" === typeof globalThis.React) {
    // @ts-ignore
    globalThis.React = react_1.default;
}
if ("undefined" === typeof react_1.default.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentCache) {
    react_1.default.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentCache = {
        current: null,
    };
}
