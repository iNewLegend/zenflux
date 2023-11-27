"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resume = exports.renderToStaticMarkup = exports.renderToString = exports.renderToStaticNodeStream = exports.renderToNodeStream = exports.renderToReadableStream = exports.version = void 0;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// This file is only used for tests.
// It lazily loads the implementation so that we get the correct set of host configs.
var react_version_1 = require("../../zenflux-react-shared/src/react-version");
exports.version = react_version_1.default;
function renderToReadableStream() {
    return require("./src/server/react-dom-server.bun").renderToReadableStream.apply(this, arguments);
}
exports.renderToReadableStream = renderToReadableStream;
function renderToNodeStream() {
    return require("./src/server/react-dom-server.bun").renderToNodeStream.apply(this, arguments);
}
exports.renderToNodeStream = renderToNodeStream;
function renderToStaticNodeStream() {
    return require("./src/server/react-dom-server.bun").renderToStaticNodeStream.apply(this, arguments);
}
exports.renderToStaticNodeStream = renderToStaticNodeStream;
function renderToString() {
    return require("./src/server/ReactDOMLegacyServerBrowser").renderToString.apply(this, arguments);
}
exports.renderToString = renderToString;
function renderToStaticMarkup() {
    return require("./src/server/ReactDOMLegacyServerBrowser").renderToStaticMarkup.apply(this, arguments);
}
exports.renderToStaticMarkup = renderToStaticMarkup;
function resume() {
    return require("./src/server/react-dom-server.bun").resume.apply(this, arguments);
}
exports.resume = resume;
