"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preinitModule = exports.preinit = exports.preloadModule = exports.preload = exports.preconnect = exports.prefetchDNS = void 0;
var crossOriginStrings_1 = require("@zenflux/react-dom-bindings/src/shared/crossOriginStrings");
var ReactDOMSharedInternals_1 = require("@zenflux/react-dom/src/ReactDOMSharedInternals");
var Dispatcher = ReactDOMSharedInternals_1.default.Dispatcher;
function prefetchDNS(href) {
    if (__DEV__) {
        if (typeof href !== "string" || !href) {
            console.error("ReactDOM.prefetchDNS(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.", getValueDescriptorExpectingObjectForWarning(href));
        }
        else if (arguments.length > 1) {
            var options = arguments[1];
            if (typeof options === "object" && options.hasOwnProperty("crossOrigin")) {
                console.error("ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. It looks like the you are attempting to set a crossOrigin property for this DNS lookup hint. Browsers do not perform DNS queries using CORS and setting this attribute on the resource hint has no effect. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.", getValueDescriptorExpectingEnumForWarning(options));
            }
            else {
                console.error("ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.", getValueDescriptorExpectingEnumForWarning(options));
            }
        }
    }
    var dispatcher = Dispatcher.current;
    if (dispatcher && typeof href === "string") {
        dispatcher.prefetchDNS(href);
    } // We don't error because preconnect needs to be resilient to being called in a variety of scopes
    // and the runtime may not be capable of responding. The function is optimistic and not critical
    // so we favor silent bailout over warning or erroring.
}
exports.prefetchDNS = prefetchDNS;
function preconnect(href, options) {
    if (__DEV__) {
        if (typeof href !== "string" || !href) {
            console.error("ReactDOM.preconnect(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.", getValueDescriptorExpectingObjectForWarning(href));
        }
        else if (options != null && typeof options !== "object") {
            console.error("ReactDOM.preconnect(): Expected the `options` argument (second) to be an object but encountered %s instead. The only supported option at this time is `crossOrigin` which accepts a string.", getValueDescriptorExpectingEnumForWarning(options));
        }
        else if (options != null && typeof options.crossOrigin !== "string") {
            console.error("ReactDOM.preconnect(): Expected the `crossOrigin` option (second argument) to be a string but encountered %s instead. Try removing this option or passing a string value instead.", getValueDescriptorExpectingObjectForWarning(options.crossOrigin));
        }
    }
    var dispatcher = Dispatcher.current;
    if (dispatcher && typeof href === "string") {
        var crossOrigin = options ? (0, crossOriginStrings_1.getCrossOriginString)(options.crossOrigin) : null;
        dispatcher.preconnect(href, crossOrigin);
    } // We don't error because preconnect needs to be resilient to being called in a variety of scopes
    // and the runtime may not be capable of responding. The function is optimistic and not critical
    // so we favor silent bailout over warning or erroring.
}
exports.preconnect = preconnect;
function preload(href, options) {
    if (__DEV__) {
        var encountered = "";
        if (typeof href !== "string" || !href) {
            encountered += " The `href` argument encountered was ".concat(getValueDescriptorExpectingObjectForWarning(href), ".");
        }
        if (options == null || typeof options !== "object") {
            encountered += " The `options` argument encountered was ".concat(getValueDescriptorExpectingObjectForWarning(options), ".");
        }
        else if (typeof options.as !== "string" || !options.as) {
            encountered += " The `as` option encountered was ".concat(getValueDescriptorExpectingObjectForWarning(options.as), ".");
        }
        if (encountered) {
            console.error("ReactDOM.preload(): Expected two arguments, a non-empty `href` string and an `options` object with an `as` property valid for a `<link rel=\"preload\" as=\"...\" />` tag.%s", encountered);
        }
    }
    var dispatcher = Dispatcher.current;
    if (dispatcher && typeof href === "string" && // We check existence because we cannot enforce this function is actually called with the stated type
        typeof options === "object" && options !== null && typeof options.as === "string") {
        var as = options.as;
        var crossOrigin = (0, crossOriginStrings_1.getCrossOriginStringAs)(as, options.crossOrigin);
        dispatcher.preload(href, as, {
            crossOrigin: crossOrigin,
            integrity: typeof options.integrity === "string" ? options.integrity : undefined,
            nonce: typeof options.nonce === "string" ? options.nonce : undefined,
            type: typeof options.type === "string" ? options.type : undefined,
            fetchPriority: typeof options.fetchPriority === "string" ? options.fetchPriority : undefined,
            referrerPolicy: typeof options.referrerPolicy === "string" ? options.referrerPolicy : undefined,
            imageSrcSet: typeof options.imageSrcSet === "string" ? options.imageSrcSet : undefined,
            imageSizes: typeof options.imageSizes === "string" ? options.imageSizes : undefined
        });
    } // We don't error because preload needs to be resilient to being called in a variety of scopes
    // and the runtime may not be capable of responding. The function is optimistic and not critical
    // so we favor silent bailout over warning or erroring.
}
exports.preload = preload;
function preloadModule(href, options) {
    if (__DEV__) {
        var encountered = "";
        if (typeof href !== "string" || !href) {
            encountered += " The `href` argument encountered was ".concat(getValueDescriptorExpectingObjectForWarning(href), ".");
        }
        if (options !== undefined && typeof options !== "object") {
            encountered += " The `options` argument encountered was ".concat(getValueDescriptorExpectingObjectForWarning(options), ".");
        }
        else if (options && "as" in options && typeof options.as !== "string") {
            encountered += " The `as` option encountered was ".concat(getValueDescriptorExpectingObjectForWarning(options.as), ".");
        }
        if (encountered) {
            console.error("ReactDOM.preloadModule(): Expected two arguments, a non-empty `href` string and, optionally, an `options` object with an `as` property valid for a `<link rel=\"modulepreload\" as=\"...\" />` tag.%s", encountered);
        }
    }
    var dispatcher = Dispatcher.current;
    if (dispatcher && typeof href === "string") {
        if (options) {
            var crossOrigin = (0, crossOriginStrings_1.getCrossOriginStringAs)(options.as, options.crossOrigin);
            dispatcher.preloadModule(href, {
                as: typeof options.as === "string" && options.as !== "script" ? options.as : undefined,
                crossOrigin: crossOrigin,
                integrity: typeof options.integrity === "string" ? options.integrity : undefined
            });
        }
        else {
            dispatcher.preloadModule(href);
        }
    } // We don't error because preload needs to be resilient to being called in a variety of scopes
    // and the runtime may not be capable of responding. The function is optimistic and not critical
    // so we favor silent bailout over warning or erroring.
}
exports.preloadModule = preloadModule;
function preinit(href, options) {
    if (__DEV__) {
        if (typeof href !== "string" || !href) {
            console.error("ReactDOM.preinit(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.", getValueDescriptorExpectingObjectForWarning(href));
        }
        else if (options == null || typeof options !== "object") {
            console.error("ReactDOM.preinit(): Expected the `options` argument (second) to be an object with an `as` property describing the type of resource to be preinitialized but encountered %s instead.", getValueDescriptorExpectingEnumForWarning(options));
        }
        else if (options.as !== "style" && options.as !== "script") {
            console.error("ReactDOM.preinit(): Expected the `as` property in the `options` argument (second) to contain a valid value describing the type of resource to be preinitialized but encountered %s instead. Valid values for `as` are \"style\" and \"script\".", getValueDescriptorExpectingEnumForWarning(options.as));
        }
    }
    var dispatcher = Dispatcher.current;
    if (dispatcher && typeof href === "string" && options && typeof options.as === "string") {
        var as = options.as;
        var crossOrigin = (0, crossOriginStrings_1.getCrossOriginStringAs)(as, options.crossOrigin);
        var integrity = typeof options.integrity === "string" ? options.integrity : undefined;
        var fetchPriority = typeof options.fetchPriority === "string" ? options.fetchPriority : undefined;
        if (as === "style") {
            dispatcher.preinitStyle(href, typeof options.precedence === "string" ? options.precedence : undefined, {
                crossOrigin: crossOrigin,
                integrity: integrity,
                fetchPriority: fetchPriority
            });
        }
        else if (as === "script") {
            dispatcher.preinitScript(href, {
                crossOrigin: crossOrigin,
                integrity: integrity,
                fetchPriority: fetchPriority,
                nonce: typeof options.nonce === "string" ? options.nonce : undefined
            });
        }
    } // We don't error because preinit needs to be resilient to being called in a variety of scopes
    // and the runtime may not be capable of responding. The function is optimistic and not critical
    // so we favor silent bailout over warning or erroring.
}
exports.preinit = preinit;
function preinitModule(href, options) {
    if (__DEV__) {
        var encountered = "";
        if (typeof href !== "string" || !href) {
            encountered += " The `href` argument encountered was ".concat(getValueDescriptorExpectingObjectForWarning(href), ".");
        }
        if (options !== undefined && typeof options !== "object") {
            encountered += " The `options` argument encountered was ".concat(getValueDescriptorExpectingObjectForWarning(options), ".");
        }
        else if (options && "as" in options && options.as !== "script") {
            encountered += " The `as` option encountered was ".concat(getValueDescriptorExpectingEnumForWarning(options.as), ".");
        }
        if (encountered) {
            console.error("ReactDOM.preinitModule(): Expected up to two arguments, a non-empty `href` string and, optionally, an `options` object with a valid `as` property.%s", encountered);
        }
        else {
            var as = options && typeof options.as === "string" ? options.as : "script";
            switch (as) {
                case "script": {
                    break;
                }
                // We have an invalid as type and need to warn
                default: {
                    var typeOfAs = getValueDescriptorExpectingEnumForWarning(as);
                    console.error("ReactDOM.preinitModule(): Currently the only supported \"as\" type for this function is \"script\"" + " but received \"%s\" instead. This warning was generated for `href` \"%s\". In the future other" + " module types will be supported, aligning with the import-attributes proposal. Learn more here:" + " (https://github.com/tc39/proposal-import-attributes)", typeOfAs, href);
                }
            }
        }
    }
    var dispatcher = Dispatcher.current;
    if (dispatcher && typeof href === "string") {
        if (typeof options === "object" && options !== null) {
            if (options.as == null || options.as === "script") {
                var crossOrigin = (0, crossOriginStrings_1.getCrossOriginStringAs)(options.as, options.crossOrigin);
                dispatcher.preinitModuleScript(href, {
                    crossOrigin: crossOrigin,
                    integrity: typeof options.integrity === "string" ? options.integrity : undefined,
                    nonce: typeof options.nonce === "string" ? options.nonce : undefined
                });
            }
        }
        else if (options == null) {
            dispatcher.preinitModuleScript(href);
        }
    } // We don't error because preinit needs to be resilient to being called in a variety of scopes
    // and the runtime may not be capable of responding. The function is optimistic and not critical
    // so we favor silent bailout over warning or erroring.
}
exports.preinitModule = preinitModule;
function getValueDescriptorExpectingObjectForWarning(thing) {
    return thing === null ? "`null`" : thing === undefined ? "`undefined`" : thing === "" ? "an empty string" : "something with type \"".concat(typeof thing, "\"");
}
function getValueDescriptorExpectingEnumForWarning(thing) {
    return thing === null ? "`null`" : thing === undefined ? "`undefined`" : thing === "" ? "an empty string" : typeof thing === "string" ? JSON.stringify(thing) : typeof thing === "number" ? "`" + thing + "`" : "something with type \"".concat(typeof thing, "\"");
}
