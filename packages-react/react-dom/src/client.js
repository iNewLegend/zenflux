/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hydrateRoot = exports.createRoot = void 0;
var _1 = require("./");
function createRoot(container, options) {
    if (__DEV__) {
        _1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.usingClientEntryPoint = true;
    }
    try {
        return (0, _1.createRoot)(container, options);
    }
    finally {
        if (__DEV__) {
            _1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.usingClientEntryPoint = false;
        }
    }
}
exports.createRoot = createRoot;
function hydrateRoot(container, children, options) {
    if (__DEV__) {
        _1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.usingClientEntryPoint = true;
    }
    try {
        return (0, _1.hydrateRoot)(container, children, options);
    }
    finally {
        if (__DEV__) {
            _1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.usingClientEntryPoint = false;
        }
    }
}
exports.hydrateRoot = hydrateRoot;
