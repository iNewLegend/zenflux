"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preinitModule = exports.preinit = exports.preloadModule = exports.preload = exports.preconnect = exports.prefetchDNS = exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = void 0;
// This is the subset of APIs that can be accessed from Server Component modules
var ReactDOMSharedInternals_1 = require("./ReactDOMSharedInternals");
Object.defineProperty(exports, "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED", { enumerable: true, get: function () { return ReactDOMSharedInternals_1.default; } });
var ReactDOMFloat_1 = require("./shared/ReactDOMFloat");
Object.defineProperty(exports, "prefetchDNS", { enumerable: true, get: function () { return ReactDOMFloat_1.prefetchDNS; } });
Object.defineProperty(exports, "preconnect", { enumerable: true, get: function () { return ReactDOMFloat_1.preconnect; } });
Object.defineProperty(exports, "preload", { enumerable: true, get: function () { return ReactDOMFloat_1.preload; } });
Object.defineProperty(exports, "preloadModule", { enumerable: true, get: function () { return ReactDOMFloat_1.preloadModule; } });
Object.defineProperty(exports, "preinit", { enumerable: true, get: function () { return ReactDOMFloat_1.preinit; } });
Object.defineProperty(exports, "preinitModule", { enumerable: true, get: function () { return ReactDOMFloat_1.preinitModule; } });
