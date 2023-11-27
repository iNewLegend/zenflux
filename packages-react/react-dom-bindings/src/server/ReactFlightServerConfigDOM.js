"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHints = exports.isPrimaryRenderer = void 0;
// Out of sync
var ReactDOMSharedInternals_1 = require("@zenflux/react-dom/src/ReactDOMSharedInternals");
var ReactDOMCurrentDispatcher = ReactDOMSharedInternals_1.default.Dispatcher;
// Used to distinguish these contexts from ones used in other renderers.
// E.g. this can be used to distinguish legacy renderers from this modern one.
exports.isPrimaryRenderer = true;
function createHints() {
    return new Set();
}
exports.createHints = createHints;
