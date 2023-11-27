"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preinitScriptForSSR = exports.preinitModuleForSSR = exports.dispatchHint = void 0;
// This client file is in the shared folder because it applies to both SSR and browser contexts.
// It is the configuraiton of the FlightClient behavior which can run in either environment.
var ReactDOMSharedInternals_1 = require("@zenflux/react-dom/src/ReactDOMSharedInternals");
var crossOriginStrings_1 = require("@zenflux/react-dom-bindings/src/shared/crossOriginStrings");
var ReactDOMCurrentDispatcher = ReactDOMSharedInternals_1.default.Dispatcher;
function dispatchHint(code, model) {
    var dispatcher = ReactDOMCurrentDispatcher.current;
    if (dispatcher) {
        switch (code) {
            case "D": {
                var refined = refineModel(code, model);
                var href = refined;
                dispatcher.prefetchDNS(href);
                return;
            }
            case "C": {
                var refined = refineModel(code, model);
                if (typeof refined === "string") {
                    var href = refined;
                    dispatcher.preconnect(href);
                }
                else {
                    var href = refined[0];
                    var crossOrigin = refined[1];
                    dispatcher.preconnect(href, crossOrigin);
                }
                return;
            }
            case "L": {
                var refined = refineModel(code, model);
                var href = refined[0];
                var as = refined[1];
                if (refined.length === 3) {
                    var options = refined[2];
                    dispatcher.preload(href, as, options);
                }
                else {
                    dispatcher.preload(href, as);
                }
                return;
            }
            case "m": {
                var refined = refineModel(code, model);
                if (typeof refined === "string") {
                    var href = refined;
                    dispatcher.preloadModule(href);
                }
                else {
                    var href = refined[0];
                    var options = refined[1];
                    dispatcher.preloadModule(href, options);
                }
                return;
            }
            case "S": {
                var refined = refineModel(code, model);
                if (typeof refined === "string") {
                    var href = refined;
                    dispatcher.preinitStyle(href);
                }
                else {
                    var href = refined[0];
                    var precedence = refined[1] === 0 ? undefined : refined[1];
                    var options = refined.length === 3 ? refined[2] : undefined;
                    dispatcher.preinitStyle(href, precedence, options);
                }
                return;
            }
            case "X": {
                var refined = refineModel(code, model);
                if (typeof refined === "string") {
                    var href = refined;
                    dispatcher.preinitScript(href);
                }
                else {
                    var href = refined[0];
                    var options = refined[1];
                    dispatcher.preinitScript(href, options);
                }
                return;
            }
            case "M": {
                var refined = refineModel(code, model);
                if (typeof refined === "string") {
                    var href = refined;
                    dispatcher.preinitModuleScript(href);
                }
                else {
                    var href = refined[0];
                    var options = refined[1];
                    dispatcher.preinitModuleScript(href, options);
                }
                return;
            }
        }
    }
}
exports.dispatchHint = dispatchHint;
// Flow is having troulbe refining the HintModels so we help it a bit.
// This should be compiled out in the production build.
function refineModel(code, model) {
    return model;
}
function preinitModuleForSSR(href, nonce, crossOrigin) {
    var dispatcher = ReactDOMCurrentDispatcher.current;
    if (dispatcher) {
        dispatcher.preinitModuleScript(href, {
            crossOrigin: (0, crossOriginStrings_1.getCrossOriginString)(crossOrigin),
            nonce: nonce
        });
    }
}
exports.preinitModuleForSSR = preinitModuleForSSR;
function preinitScriptForSSR(href, nonce, crossOrigin) {
    var dispatcher = ReactDOMCurrentDispatcher.current;
    if (dispatcher) {
        dispatcher.preinitScript(href, {
            crossOrigin: (0, crossOriginStrings_1.getCrossOriginString)(crossOrigin),
            nonce: nonce
        });
    }
}
exports.preinitScriptForSSR = preinitScriptForSSR;
