"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotPendingTransition = exports.hoistResources = exports.setCurrentlyRenderingBoundaryResourcesTarget = exports.createBoundaryResources = exports.writePostamble = exports.writeHoistables = exports.writePreamble = exports.writeResourcesForBoundary = exports.writeClientRenderBoundaryInstruction = exports.writeCompletedBoundaryInstruction = exports.writeCompletedSegmentInstruction = exports.writeEndSegment = exports.writeStartSegment = exports.writeEndClientRenderedSuspenseBoundary = exports.writeEndPendingSuspenseBoundary = exports.writeEndCompletedSuspenseBoundary = exports.writeStartClientRenderedSuspenseBoundary = exports.writeStartPendingSuspenseBoundary = exports.writeStartCompletedSuspenseBoundary = exports.pushEndCompletedSuspenseBoundary = exports.pushStartCompletedSuspenseBoundary = exports.writePlaceholder = exports.writeCompletedRoot = exports.pushEndInstance = exports.pushStartInstance = exports.doctypeChunk = exports.pushFormStateMarkerIsNotMatching = exports.pushFormStateMarkerIsMatching = exports.pushSegmentFinale = exports.pushTextInstance = exports.makeId = exports.getChildFormatContext = exports.createRootFormatContext = exports.ROOT_HTML_MODE = exports.resetResumableState = exports.createResumableState = exports.resumeRenderState = exports.createRenderState = exports.isPrimaryRenderer = exports.prepareHostDispatcher = void 0;
var react_1 = require("react");
var ReactServerStreamConfig_1 = require("react-server/src/ReactServerStreamConfig");
var ReactFizzServer_1 = require("react-server/src/ReactFizzServer");
var ReactDOMSharedInternals_1 = require("@zenflux/react-dom/src/ReactDOMSharedInternals");
var ReactFizzConfig_1 = require("react-server/src/ReactFizzConfig");
var has_own_property_1 = require("@zenflux/react-shared/src/has-own-property");
var react_feature_flags_1 = require("@zenflux/react-shared/src/react-feature-flags");
var check_string_coercion_1 = require("@zenflux/react-shared/src/check-string-coercion");
var ReactDOMFormActions_1 = require("../shared/ReactDOMFormActions");
var isAttributeNameSafe_1 = require("../shared/isAttributeNameSafe");
var isUnitlessNumber_1 = require("../shared/isUnitlessNumber");
var getAttributeAlias_1 = require("../shared/getAttributeAlias");
var ReactControlledValuePropTypes_1 = require("../shared/ReactControlledValuePropTypes");
var ReactDOMInvalidARIAHook_1 = require("../shared/ReactDOMInvalidARIAHook");
var ReactDOMNullInputValuePropHook_1 = require("../shared/ReactDOMNullInputValuePropHook");
var ReactDOMUnknownPropertyHook_1 = require("../shared/ReactDOMUnknownPropertyHook");
var warnValidStyle_1 = require("../shared/warnValidStyle");
var hyphenateStyleName_1 = require("../shared/hyphenateStyleName");
var sanitizeURL_1 = require("../shared/sanitizeURL");
var ReactDOMResourceValidation_1 = require("../shared/ReactDOMResourceValidation");
var ReactDOMFizzInstructionSetInlineCodeStrings_1 = require("@zenflux/react-dom-bindings/src/server/fizz-instruction-set/ReactDOMFizzInstructionSetInlineCodeStrings");
var escapeTextForBrowser_1 = require("@zenflux/react-dom-bindings/src/server/escapeTextForBrowser");
var ReactDOMCurrentDispatcher = ReactDOMSharedInternals_1.default.Dispatcher;
var ReactDOMServerDispatcher = {
    prefetchDNS: prefetchDNS,
    preconnect: preconnect,
    preload: preload,
    preloadModule: preloadModule,
    preinitStyle: preinitStyle,
    preinitScript: preinitScript,
    preinitModuleScript: preinitModuleScript
};
function prepareHostDispatcher() {
    ReactDOMCurrentDispatcher.current = ReactDOMServerDispatcher;
}
exports.prepareHostDispatcher = prepareHostDispatcher;
// Used to distinguish these contexts from ones used in other renderers.
// E.g. this can be used to distinguish legacy renderers from this modern one.
exports.isPrimaryRenderer = true;
var ScriptStreamingFormat = 0;
var DataStreamingFormat = 1;
var NothingSent 
/*                      */
= 0;
var SentCompleteSegmentFunction 
/*      */
= 1;
var SentCompleteBoundaryFunction 
/*     */
= 2;
var SentClientRenderFunction 
/*         */
= 4;
var SentStyleInsertionFunction 
/*       */
= 8;
var SentFormReplayingRuntime 
/*         */
= 16;
var EXISTS = null;
// This constant is to mark preloads that have no unique credentials
// to convey. It should never be checked by identity and we should not
// assume Preload values in ResumableState equal this value because they
// will have come from some parsed input.
var PRELOAD_NO_CREDS = [];
if (__DEV__) {
    Object.freeze(PRELOAD_NO_CREDS);
}
var dataElementQuotedEnd = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\"></template>");
var startInlineScript = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<script>");
var endInlineScript = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("</script>");
var startScriptSrc = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<script src=\"");
var startModuleSrc = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<script type=\"module\" src=\"");
var scriptNonce = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\" nonce=\"");
var scriptIntegirty = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\" integrity=\"");
var scriptCrossOrigin = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\" crossorigin=\"");
var endAsyncScript = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\" async=\"\"></script>");
/**
 * This escaping function is designed to work with bootstrapScriptContent and importMap only.
 * because we know we are escaping the entire script. We can avoid for instance
 * escaping html comment string sequences that are valid javascript as well because
 * if there are no sebsequent <script sequences the html parser will never enter
 * script data double escaped state (see: https://www.w3.org/TR/html53/syntax.html#script-data-double-escaped-state)
 *
 * While untrusted script content should be made safe before using this api it will
 * ensure that the script cannot be early terminated or never terminated state
 */
function escapeBootstrapAndImportMapScriptContent(scriptText) {
    if (__DEV__) {
        (0, check_string_coercion_1.checkHtmlStringCoercion)(scriptText);
    }
    return ("" + scriptText).replace(scriptRegex, scriptReplacer);
}
var scriptRegex = /(<\/|<)(s)(cript)/gi;
var scriptReplacer = function (match, prefix, s, suffix) { return "".concat(prefix).concat(s === "s" ? "\\u0073" : "\\u0053").concat(suffix); };
var importMapScriptStart = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<script type=\"importmap\">");
var importMapScriptEnd = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("</script>");
// Allows us to keep track of what we've already written so we can refer back to it.
// if passed externalRuntimeConfig and the enableFizzExternalRuntime feature flag
// is set, the server will send instructions via data attributes (instead of inline scripts)
function createRenderState(resumableState, nonce, bootstrapScriptContent, bootstrapScripts, bootstrapModules, externalRuntimeConfig, importMap) {
    var inlineScriptWithNonce = nonce === undefined ? startInlineScript : (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<script nonce=\"" + (0, escapeTextForBrowser_1.default)(nonce) + "\">");
    var idPrefix = resumableState.idPrefix;
    var bootstrapChunks = [];
    var externalRuntimeScript = null;
    if (bootstrapScriptContent !== undefined) {
        bootstrapChunks.push(inlineScriptWithNonce, (0, ReactServerStreamConfig_1.stringToChunk)(escapeBootstrapAndImportMapScriptContent(bootstrapScriptContent)), endInlineScript);
    }
    if (react_feature_flags_1.enableFizzExternalRuntime) {
        if (!react_feature_flags_1.enableFloat) {
            throw new Error("enableFizzExternalRuntime without enableFloat is not supported. This should never appear in production, since it means you are using a misconfigured React bundle.");
        }
        if (externalRuntimeConfig !== undefined) {
            if (typeof externalRuntimeConfig === "string") {
                externalRuntimeScript = {
                    src: externalRuntimeConfig,
                    chunks: []
                };
                pushScriptImpl(externalRuntimeScript.chunks, {
                    src: externalRuntimeConfig,
                    async: true,
                    integrity: undefined,
                    nonce: nonce
                });
            }
            else {
                externalRuntimeScript = {
                    src: externalRuntimeConfig.src,
                    chunks: []
                };
                pushScriptImpl(externalRuntimeScript.chunks, {
                    src: externalRuntimeConfig.src,
                    async: true,
                    integrity: externalRuntimeConfig.integrity,
                    nonce: nonce
                });
            }
        }
    }
    var importMapChunks = [];
    if (importMap !== undefined) {
        var map = importMap;
        importMapChunks.push(importMapScriptStart);
        importMapChunks.push((0, ReactServerStreamConfig_1.stringToChunk)(escapeBootstrapAndImportMapScriptContent(JSON.stringify(map))));
        importMapChunks.push(importMapScriptEnd);
    }
    var renderState = {
        placeholderPrefix: (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(idPrefix + "P:"),
        segmentPrefix: (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(idPrefix + "S:"),
        boundaryPrefix: (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(idPrefix + "B:"),
        startInlineScript: inlineScriptWithNonce,
        htmlChunks: null,
        headChunks: null,
        externalRuntimeScript: externalRuntimeScript,
        bootstrapChunks: bootstrapChunks,
        charsetChunks: [],
        preconnectChunks: [],
        importMapChunks: importMapChunks,
        preloadChunks: [],
        hoistableChunks: [],
        // cleared on flush
        preconnects: new Set(),
        fontPreloads: new Set(),
        highImagePreloads: new Set(),
        // usedImagePreloads: new Set(),
        styles: new Map(),
        bootstrapScripts: new Set(),
        scripts: new Set(),
        bulkPreloads: new Set(),
        preloads: {
            images: new Map(),
            stylesheets: new Map(),
            scripts: new Map(),
            moduleScripts: new Map()
        },
        nonce: nonce,
        // like a module global for currently rendering boundary
        boundaryResources: null,
        stylesToHoist: false
    };
    if (bootstrapScripts !== undefined) {
        for (var i_1 = 0; i_1 < bootstrapScripts.length; i_1++) {
            var scriptConfig = bootstrapScripts[i_1];
            var src = void 0, crossOrigin = void 0, integrity = void 0;
            var props = {
                rel: "preload",
                as: "script",
                fetchPriority: "low",
                nonce: nonce
            };
            if (typeof scriptConfig === "string") {
                props.href = src = scriptConfig;
            }
            else {
                props.href = src = scriptConfig.src;
                props.integrity = integrity = typeof scriptConfig.integrity === "string" ? scriptConfig.integrity : undefined;
                props.crossOrigin = crossOrigin = typeof scriptConfig === "string" || scriptConfig.crossOrigin == null ? undefined : scriptConfig.crossOrigin === "use-credentials" ? "use-credentials" : "";
            }
            preloadBootstrapScriptOrModule(resumableState, renderState, src, props);
            bootstrapChunks.push(startScriptSrc, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(src)));
            if (nonce) {
                bootstrapChunks.push(scriptNonce, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(nonce)));
            }
            if (typeof integrity === "string") {
                bootstrapChunks.push(scriptIntegirty, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(integrity)));
            }
            if (typeof crossOrigin === "string") {
                bootstrapChunks.push(scriptCrossOrigin, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(crossOrigin)));
            }
            bootstrapChunks.push(endAsyncScript);
        }
    }
    if (bootstrapModules !== undefined) {
        for (var i_2 = 0; i_2 < bootstrapModules.length; i_2++) {
            var scriptConfig = bootstrapModules[i_2];
            var src = void 0, crossOrigin = void 0, integrity = void 0;
            var props = {
                rel: "modulepreload",
                fetchPriority: "low",
                nonce: nonce
            };
            if (typeof scriptConfig === "string") {
                props.href = src = scriptConfig;
            }
            else {
                props.href = src = scriptConfig.src;
                props.integrity = integrity = typeof scriptConfig.integrity === "string" ? scriptConfig.integrity : undefined;
                props.crossOrigin = crossOrigin = typeof scriptConfig === "string" || scriptConfig.crossOrigin == null ? undefined : scriptConfig.crossOrigin === "use-credentials" ? "use-credentials" : "";
            }
            preloadBootstrapScriptOrModule(resumableState, renderState, src, props);
            bootstrapChunks.push(startModuleSrc, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(src)));
            if (nonce) {
                bootstrapChunks.push(scriptNonce, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(nonce)));
            }
            if (typeof integrity === "string") {
                bootstrapChunks.push(scriptIntegirty, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(integrity)));
            }
            if (typeof crossOrigin === "string") {
                bootstrapChunks.push(scriptCrossOrigin, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(crossOrigin)));
            }
            bootstrapChunks.push(endAsyncScript);
        }
    }
    return renderState;
}
exports.createRenderState = createRenderState;
function resumeRenderState(resumableState, nonce) {
    return createRenderState(resumableState, nonce, // These should have already been flushed in the prerender.
    undefined, undefined, undefined, undefined, undefined);
}
exports.resumeRenderState = resumeRenderState;
function createResumableState(identifierPrefix, externalRuntimeConfig) {
    var idPrefix = identifierPrefix === undefined ? "" : identifierPrefix;
    var streamingFormat = ScriptStreamingFormat;
    if (react_feature_flags_1.enableFizzExternalRuntime) {
        if (externalRuntimeConfig !== undefined) {
            streamingFormat = DataStreamingFormat;
        }
    }
    return {
        idPrefix: idPrefix,
        nextFormID: 0,
        streamingFormat: streamingFormat,
        instructions: NothingSent,
        hasBody: false,
        hasHtml: false,
        // @TODO add bootstrap script to implicit preloads
        // persistent
        unknownResources: {},
        dnsResources: {},
        connectResources: {
            default: {},
            anonymous: {},
            credentials: {}
        },
        imageResources: {},
        styleResources: {},
        scriptResources: {},
        moduleUnknownResources: {},
        moduleScriptResources: {}
    };
}
exports.createResumableState = createResumableState;
function resetResumableState(resumableState, renderState) {
    // Resets the resumable state based on what didn't manage to fully flush in the render state.
    // This currently assumes nothing was flushed.
    resumableState.nextFormID = 0;
    resumableState.hasBody = false;
    resumableState.hasHtml = false;
    resumableState.unknownResources = {};
    resumableState.dnsResources = {};
    resumableState.connectResources = {
        default: {},
        anonymous: {},
        credentials: {}
    };
    resumableState.imageResources = {};
    resumableState.styleResources = {};
    resumableState.scriptResources = {};
    resumableState.moduleUnknownResources = {};
    resumableState.moduleScriptResources = {};
}
exports.resetResumableState = resetResumableState;
// Constants for the insertion mode we're currently writing in. We don't encode all HTML5 insertion
// modes. We only include the variants as they matter for the sake of our purposes.
// We don't actually provide the namespace therefore we use constants instead of the string.
exports.ROOT_HTML_MODE = 0; // Used for the root most element tag.
// We have a less than HTML_HTML_MODE check elsewhere. If you add more cases here, make sure it
// still makes sense
var HTML_HTML_MODE = 1; // Used for the <html> if it is at the top level.
var HTML_MODE = 2;
var SVG_MODE = 3;
var MATHML_MODE = 4;
var HTML_TABLE_MODE = 5;
var HTML_TABLE_BODY_MODE = 6;
var HTML_TABLE_ROW_MODE = 7;
var HTML_COLGROUP_MODE = 8;
var NO_SCOPE = 
/*         */
0;
var NOSCRIPT_SCOPE = 
/*   */
1;
var PICTURE_SCOPE = 
/*    */
2;
function createFormatContext(insertionMode, selectedValue, tagScope) {
    return {
        insertionMode: insertionMode,
        selectedValue: selectedValue,
        tagScope: tagScope
    };
}
function createRootFormatContext(namespaceURI) {
    var insertionMode = namespaceURI === "http://www.w3.org/2000/svg" ? SVG_MODE : namespaceURI === "http://www.w3.org/1998/Math/MathML" ? MATHML_MODE : exports.ROOT_HTML_MODE;
    return createFormatContext(insertionMode, null, NO_SCOPE);
}
exports.createRootFormatContext = createRootFormatContext;
function getChildFormatContext(parentContext, type, props) {
    switch (type) {
        case "noscript":
            return createFormatContext(HTML_MODE, null, parentContext.tagScope | NOSCRIPT_SCOPE);
        case "select":
            return createFormatContext(HTML_MODE, props.value != null ? props.value : props.defaultValue, parentContext.tagScope);
        case "svg":
            return createFormatContext(SVG_MODE, null, parentContext.tagScope);
        case "picture":
            return createFormatContext(HTML_MODE, null, parentContext.tagScope | PICTURE_SCOPE);
        case "math":
            return createFormatContext(MATHML_MODE, null, parentContext.tagScope);
        case "foreignObject":
            return createFormatContext(HTML_MODE, null, parentContext.tagScope);
        // Table parents are special in that their children can only be created at all if they're
        // wrapped in a table parent. So we need to encode that we're entering this mode.
        case "table":
            return createFormatContext(HTML_TABLE_MODE, null, parentContext.tagScope);
        case "thead":
        case "tbody":
        case "tfoot":
            return createFormatContext(HTML_TABLE_BODY_MODE, null, parentContext.tagScope);
        case "colgroup":
            return createFormatContext(HTML_COLGROUP_MODE, null, parentContext.tagScope);
        case "tr":
            return createFormatContext(HTML_TABLE_ROW_MODE, null, parentContext.tagScope);
    }
    if (parentContext.insertionMode >= HTML_TABLE_MODE) {
        // Whatever tag this was, it wasn't a table parent or other special parent, so we must have
        // entered plain HTML again.
        return createFormatContext(HTML_MODE, null, parentContext.tagScope);
    }
    if (parentContext.insertionMode === exports.ROOT_HTML_MODE) {
        if (type === "html") {
            // We've emitted the root and is now in <html> mode.
            return createFormatContext(HTML_HTML_MODE, null, parentContext.tagScope);
        }
        else {
            // We've emitted the root and is now in plain HTML mode.
            return createFormatContext(HTML_MODE, null, parentContext.tagScope);
        }
    }
    else if (parentContext.insertionMode === HTML_HTML_MODE) {
        // We've emitted the document element and is now in plain HTML mode.
        return createFormatContext(HTML_MODE, null, parentContext.tagScope);
    }
    return parentContext;
}
exports.getChildFormatContext = getChildFormatContext;
function makeId(resumableState, treeId, localId) {
    var idPrefix = resumableState.idPrefix;
    var id = ":" + idPrefix + "R" + treeId;
    // Unless this is the first id at this level, append a number at the end
    // that represents the position of this useId hook among all the useId
    // hooks for this fiber.
    if (localId > 0) {
        id += "H" + localId.toString(32);
    }
    return id + ":";
}
exports.makeId = makeId;
function encodeHTMLTextNode(text) {
    return (0, escapeTextForBrowser_1.default)(text);
}
var textSeparator = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<!-- -->");
function pushTextInstance(target, text, renderState, textEmbedded) {
    if (text === "") {
        // Empty text doesn't have a DOM node representation and the hydration is aware of this.
        return textEmbedded;
    }
    if (textEmbedded) {
        target.push(textSeparator);
    }
    target.push((0, ReactServerStreamConfig_1.stringToChunk)(encodeHTMLTextNode(text)));
    return true;
}
exports.pushTextInstance = pushTextInstance;
// Called when Fizz is done with a Segment. Currently the only purpose is to conditionally
// emit a text separator when we don't know for sure it is safe to omit
function pushSegmentFinale(target, renderState, lastPushedText, textEmbedded) {
    if (lastPushedText && textEmbedded) {
        target.push(textSeparator);
    }
}
exports.pushSegmentFinale = pushSegmentFinale;
var styleNameCache = new Map();
function processStyleName(styleName) {
    var chunk = styleNameCache.get(styleName);
    if (chunk !== undefined) {
        return chunk;
    }
    var result = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)((0, escapeTextForBrowser_1.default)((0, hyphenateStyleName_1.default)(styleName)));
    styleNameCache.set(styleName, result);
    return result;
}
var styleAttributeStart = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(" style=\"");
var styleAssign = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(":");
var styleSeparator = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(";");
function pushStyleAttribute(target, style) {
    if (typeof style !== "object") {
        throw new Error("The `style` prop expects a mapping from style properties to values, " + "not a string. For example, style={{marginRight: spacing + 'em'}} when " + "using JSX.");
    }
    var isFirst = true;
    for (var styleName in style) {
        if (!has_own_property_1.default.call(style, styleName)) {
            continue;
        }
        // If you provide unsafe user data here they can inject arbitrary CSS
        // which may be problematic (I couldn't repro this):
        // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
        // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
        // This is not an XSS hole but instead a potential CSS injection issue
        // which has lead to a greater discussion about how we're going to
        // trust URLs moving forward. See #2115901
        var styleValue = style[styleName];
        if (styleValue == null || typeof styleValue === "boolean" || styleValue === "") {
            // TODO: We used to set empty string as a style with an empty value. Does that ever make sense?
            continue;
        }
        var nameChunk = void 0;
        var valueChunk = void 0;
        var isCustomProperty = styleName.indexOf("--") === 0;
        if (isCustomProperty) {
            nameChunk = (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(styleName));
            if (__DEV__) {
                (0, check_string_coercion_1.checkCSSPropertyStringCoercion)(styleValue, styleName);
            }
            valueChunk = (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(("" + styleValue).trim()));
        }
        else {
            if (__DEV__) {
                (0, warnValidStyle_1.default)(styleName, styleValue);
            }
            nameChunk = processStyleName(styleName);
            if (typeof styleValue === "number") {
                if (styleValue !== 0 && !(0, isUnitlessNumber_1.default)(styleName)) {
                    valueChunk = (0, ReactServerStreamConfig_1.stringToChunk)(styleValue + "px"); // Presumes implicit 'px' suffix for unitless numbers
                }
                else {
                    valueChunk = (0, ReactServerStreamConfig_1.stringToChunk)("" + styleValue);
                }
            }
            else {
                if (__DEV__) {
                    (0, check_string_coercion_1.checkCSSPropertyStringCoercion)(styleValue, styleName);
                }
                valueChunk = (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(("" + styleValue).trim()));
            }
        }
        if (isFirst) {
            isFirst = false;
            // If it's first, we don't need any separators prefixed.
            target.push(styleAttributeStart, nameChunk, styleAssign, valueChunk);
        }
        else {
            target.push(styleSeparator, nameChunk, styleAssign, valueChunk);
        }
    }
    if (!isFirst) {
        target.push(attributeEnd);
    }
}
var attributeSeparator = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(" ");
var attributeAssign = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("=\"");
var attributeEnd = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\"");
var attributeEmptyString = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("=\"\"");
function pushBooleanAttribute(target, name, value) {
    if (value && typeof value !== "function" && typeof value !== "symbol") {
        target.push(attributeSeparator, (0, ReactServerStreamConfig_1.stringToChunk)(name), attributeEmptyString);
    }
}
function pushStringAttribute(target, name, value) {
    if (typeof value !== "function" && typeof value !== "symbol" && typeof value !== "boolean") {
        target.push(attributeSeparator, (0, ReactServerStreamConfig_1.stringToChunk)(name), attributeAssign, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(value)), attributeEnd);
    }
}
function makeFormFieldPrefix(resumableState) {
    var id = resumableState.nextFormID++;
    return resumableState.idPrefix + id;
}
// Since this will likely be repeated a lot in the HTML, we use a more concise message
// than on the client and hopefully it's googleable.
var actionJavaScriptURL = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)((0, escapeTextForBrowser_1.default)(// eslint-disable-next-line no-script-url
"javascript:throw new Error('A React form was unexpectedly submitted.')"));
var startHiddenInputChunk = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<input type=\"hidden\"");
function pushAdditionalFormField(value, key) {
    var target = this;
    target.push(startHiddenInputChunk);
    if (typeof value !== "string") {
        throw new Error("File/Blob fields are not yet supported in progressive forms. " + "It probably means you are closing over binary data or FormData in a Server Action.");
    }
    pushStringAttribute(target, "name", key);
    pushStringAttribute(target, "value", value);
    target.push(endOfStartTagSelfClosing);
}
function pushAdditionalFormFields(target, formData) {
    if (formData !== null) {
        // $FlowFixMe[prop-missing]: FormData has forEach.
        formData.forEach(pushAdditionalFormField, target);
    }
}
function pushFormActionAttribute(target, resumableState, renderState, formAction, formEncType, formMethod, formTarget, name) {
    var formData = null;
    if (react_feature_flags_1.enableFormActions && typeof formAction === "function") {
        // Function form actions cannot control the form properties
        if (__DEV__) {
            if (name !== null && !didWarnFormActionName) {
                didWarnFormActionName = true;
                console.error("Cannot specify a \"name\" prop for a button that specifies a function as a formAction. " + "React needs it to encode which action should be invoked. It will get overridden.");
            }
            if ((formEncType !== null || formMethod !== null) && !didWarnFormActionMethod) {
                didWarnFormActionMethod = true;
                console.error("Cannot specify a formEncType or formMethod for a button that specifies a " + "function as a formAction. React provides those automatically. They will get overridden.");
            }
            if (formTarget !== null && !didWarnFormActionTarget) {
                didWarnFormActionTarget = true;
                console.error("Cannot specify a formTarget for a button that specifies a function as a formAction. " + "The function will always be executed in the same window.");
            }
        }
        var customAction = formAction.$$FORM_ACTION;
        if (typeof customAction === "function") {
            // This action has a custom progressive enhancement form that can submit the form
            // back to the server if it's invoked before hydration. Such as a Server Action.
            var prefix = makeFormFieldPrefix(resumableState);
            var customFields = formAction.$$FORM_ACTION(prefix);
            name = customFields.name;
            formAction = customFields.action || "";
            formEncType = customFields.encType;
            formMethod = customFields.method;
            formTarget = customFields.target;
            formData = customFields.data;
        }
        else {
            // Set a javascript URL that doesn't do anything. We don't expect this to be invoked
            // because we'll preventDefault in the Fizz runtime, but it can happen if a form is
            // manually submitted or if someone calls stopPropagation before React gets the event.
            // If CSP is used to block javascript: URLs that's fine too. It just won't show this
            // error message but the URL will be logged.
            target.push(attributeSeparator, (0, ReactServerStreamConfig_1.stringToChunk)("formAction"), attributeAssign, actionJavaScriptURL, attributeEnd);
            name = null;
            formAction = null;
            formEncType = null;
            formMethod = null;
            formTarget = null;
            injectFormReplayingRuntime(resumableState, renderState);
        }
    }
    if (name != null) {
        pushAttribute(target, "name", name);
    }
    if (formAction != null) {
        pushAttribute(target, "formAction", formAction);
    }
    if (formEncType != null) {
        pushAttribute(target, "formEncType", formEncType);
    }
    if (formMethod != null) {
        pushAttribute(target, "formMethod", formMethod);
    }
    if (formTarget != null) {
        pushAttribute(target, "formTarget", formTarget);
    }
    return formData;
}
function pushAttribute(target, name, value) {
    switch (name) {
        // These are very common props and therefore are in the beginning of the switch.
        // TODO: aria-label is a very common prop but allows booleans so is not like the others
        // but should ideally go in this list too.
        case "className": {
            pushStringAttribute(target, "class", value);
            break;
        }
        case "tabIndex": {
            pushStringAttribute(target, "tabindex", value);
            break;
        }
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height": {
            pushStringAttribute(target, name, value);
            break;
        }
        case "style": {
            pushStyleAttribute(target, value);
            return;
        }
        case "src":
        case "href": {
            if (react_feature_flags_1.enableFilterEmptyStringAttributesDOM) {
                if (value === "") {
                    if (__DEV__) {
                        if (name === "src") {
                            console.error("An empty string (\"\") was passed to the %s attribute. " + "This may cause the browser to download the whole page again over the network. " + "To fix this, either do not render the element at all " + "or pass null to %s instead of an empty string.", name, name);
                        }
                        else {
                            console.error("An empty string (\"\") was passed to the %s attribute. " + "To fix this, either do not render the element at all " + "or pass null to %s instead of an empty string.", name, name);
                        }
                    }
                    return;
                }
            }
        }
        // Fall through to the last case which shouldn't remove empty strings.
        case "action":
        case "formAction": {
            // TODO: Consider only special casing these for each tag.
            if (value == null || typeof value === "function" || typeof value === "symbol" || typeof value === "boolean") {
                return;
            }
            if (__DEV__) {
                (0, check_string_coercion_1.checkAttributeStringCoercion)(value, name);
            }
            var sanitizedValue = (0, sanitizeURL_1.default)("" + value);
            target.push(attributeSeparator, (0, ReactServerStreamConfig_1.stringToChunk)(name), attributeAssign, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(sanitizedValue)), attributeEnd);
            return;
        }
        case "defaultValue":
        case "defaultChecked": // These shouldn't be set as attributes on generic HTML elements.
        case "innerHTML": // Must use dangerouslySetInnerHTML instead.
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
            // Ignored. These are built-in to React on the client.
            return;
        case "autoFocus":
        case "multiple":
        case "muted": {
            pushBooleanAttribute(target, name.toLowerCase(), value);
            return;
        }
        case "xlinkHref": {
            if (typeof value === "function" || typeof value === "symbol" || typeof value === "boolean") {
                return;
            }
            if (__DEV__) {
                (0, check_string_coercion_1.checkAttributeStringCoercion)(value, name);
            }
            var sanitizedValue = (0, sanitizeURL_1.default)("" + value);
            target.push(attributeSeparator, (0, ReactServerStreamConfig_1.stringToChunk)("xlink:href"), attributeAssign, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(sanitizedValue)), attributeEnd);
            return;
        }
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha": {
            // Booleanish String
            // These are "enumerated" attributes that accept "true" and "false".
            // In React, we let users pass `true` and `false` even though technically
            // these aren't boolean attributes (they are coerced to strings).
            if (typeof value !== "function" && typeof value !== "symbol") {
                target.push(attributeSeparator, (0, ReactServerStreamConfig_1.stringToChunk)(name), attributeAssign, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(value)), attributeEnd);
            }
            return;
        }
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope": {
            // Boolean
            if (value && typeof value !== "function" && typeof value !== "symbol") {
                target.push(attributeSeparator, (0, ReactServerStreamConfig_1.stringToChunk)(name), attributeEmptyString);
            }
            return;
        }
        case "capture":
        case "download": {
            // Overloaded Boolean
            if (value === true) {
                target.push(attributeSeparator, (0, ReactServerStreamConfig_1.stringToChunk)(name), attributeEmptyString);
            }
            else if (value === false) { // Ignored
            }
            else if (typeof value !== "function" && typeof value !== "symbol") {
                target.push(attributeSeparator, (0, ReactServerStreamConfig_1.stringToChunk)(name), attributeAssign, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(value)), attributeEnd);
            }
            return;
        }
        case "cols":
        case "rows":
        case "size":
        case "span": {
            // These are HTML attributes that must be positive numbers.
            if (typeof value !== "function" && typeof value !== "symbol" && !isNaN(value) && value >= 1) {
                target.push(attributeSeparator, (0, ReactServerStreamConfig_1.stringToChunk)(name), attributeAssign, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(value)), attributeEnd);
            }
            return;
        }
        case "rowSpan":
        case "start": {
            // These are HTML attributes that must be numbers.
            if (typeof value !== "function" && typeof value !== "symbol" && !isNaN(value)) {
                target.push(attributeSeparator, (0, ReactServerStreamConfig_1.stringToChunk)(name), attributeAssign, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(value)), attributeEnd);
            }
            return;
        }
        case "xlinkActuate":
            pushStringAttribute(target, "xlink:actuate", value);
            return;
        case "xlinkArcrole":
            pushStringAttribute(target, "xlink:arcrole", value);
            return;
        case "xlinkRole":
            pushStringAttribute(target, "xlink:role", value);
            return;
        case "xlinkShow":
            pushStringAttribute(target, "xlink:show", value);
            return;
        case "xlinkTitle":
            pushStringAttribute(target, "xlink:title", value);
            return;
        case "xlinkType":
            pushStringAttribute(target, "xlink:type", value);
            return;
        case "xmlBase":
            pushStringAttribute(target, "xml:base", value);
            return;
        case "xmlLang":
            pushStringAttribute(target, "xml:lang", value);
            return;
        case "xmlSpace":
            pushStringAttribute(target, "xml:space", value);
            return;
        default:
            if ( // shouldIgnoreAttribute
            // We have already filtered out null/undefined and reserved words.
            name.length > 2 && (name[0] === "o" || name[0] === "O") && (name[1] === "n" || name[1] === "N")) {
                return;
            }
            var attributeName = (0, getAttributeAlias_1.default)(name);
            if ((0, isAttributeNameSafe_1.default)(attributeName)) {
                // shouldRemoveAttribute
                switch (typeof value) {
                    case "function":
                    case "symbol":
                        // eslint-disable-line
                        return;
                    case "boolean": {
                        var prefix = attributeName.toLowerCase().slice(0, 5);
                        if (prefix !== "data-" && prefix !== "aria-") {
                            return;
                        }
                    }
                }
                target.push(attributeSeparator, (0, ReactServerStreamConfig_1.stringToChunk)(attributeName), attributeAssign, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(value)), attributeEnd);
            }
    }
}
var endOfStartTag = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(">");
var endOfStartTagSelfClosing = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("/>");
function pushInnerHTML(target, innerHTML, children) {
    if (innerHTML != null) {
        if (children != null) {
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
        }
        if (typeof innerHTML !== "object" || !("__html" in innerHTML)) {
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. " + "Please visit https://reactjs.org/link/dangerously-set-inner-html " + "for more information.");
        }
        var html = innerHTML.__html;
        if (html !== null && html !== undefined) {
            if (__DEV__) {
                (0, check_string_coercion_1.checkHtmlStringCoercion)(html);
            }
            target.push((0, ReactServerStreamConfig_1.stringToChunk)("" + html));
        }
    }
}
// TODO: Move these to RenderState so that we warn for every request.
// It would help debugging in stateful servers (e.g. service worker).
var didWarnDefaultInputValue = false;
var didWarnDefaultChecked = false;
var didWarnDefaultSelectValue = false;
var didWarnDefaultTextareaValue = false;
var didWarnInvalidOptionChildren = false;
var didWarnInvalidOptionInnerHTML = false;
var didWarnSelectedSetOnOption = false;
var didWarnFormActionType = false;
var didWarnFormActionName = false;
var didWarnFormActionTarget = false;
var didWarnFormActionMethod = false;
function checkSelectProp(props, propName) {
    if (__DEV__) {
        var value = props[propName];
        if (value != null) {
            var array = Array.isArray(value);
            if (props.multiple && !array) {
                console.error("The `%s` prop supplied to <select> must be an array if " + "`multiple` is true.", propName);
            }
            else if (!props.multiple && array) {
                console.error("The `%s` prop supplied to <select> must be a scalar " + "value if `multiple` is false.", propName);
            }
        }
    }
}
function pushStartSelect(target, props) {
    if (__DEV__) {
        (0, ReactControlledValuePropTypes_1.checkControlledValueProps)("select", props);
        checkSelectProp(props, "value");
        checkSelectProp(props, "defaultValue");
        if (props.value !== undefined && props.defaultValue !== undefined && !didWarnDefaultSelectValue) {
            console.error("Select elements must be either controlled or uncontrolled " + "(specify either the value prop, or the defaultValue prop, but not " + "both). Decide between using a controlled or uncontrolled select " + "element and remove one of these props. More info: " + "https://reactjs.org/link/controlled-components");
            didWarnDefaultSelectValue = true;
        }
    }
    target.push(startChunkForTag("select"));
    var children = null;
    var innerHTML = null;
    for (var propKey in props) {
        if (has_own_property_1.default.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
                continue;
            }
            switch (propKey) {
                case "children":
                    children = propValue;
                    break;
                case "dangerouslySetInnerHTML":
                    // TODO: This doesn't really make sense for select since it can't use the controlled
                    // value in the innerHTML.
                    innerHTML = propValue;
                    break;
                case "defaultValue":
                case "value":
                    // These are set on the Context instead and applied to the nested options.
                    break;
                default:
                    pushAttribute(target, propKey, propValue);
                    break;
            }
        }
    }
    target.push(endOfStartTag);
    pushInnerHTML(target, innerHTML, children);
    return children;
}
function flattenOptionChildren(children) {
    var content = "";
    // Flatten children and warn if they aren't strings or numbers;
    // invalid types are ignored.
    react_1.Children.forEach(children, function (child) {
        if (child == null) {
            return;
        }
        content += child;
        if (__DEV__) {
            if (!didWarnInvalidOptionChildren && typeof child !== "string" && typeof child !== "number") {
                didWarnInvalidOptionChildren = true;
                console.error("Cannot infer the option value of complex children. " + "Pass a `value` prop or use a plain string as children to <option>.");
            }
        }
    });
    return content;
}
var selectedMarkerAttribute = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(" selected=\"\"");
function pushStartOption(target, props, formatContext) {
    var selectedValue = formatContext.selectedValue;
    target.push(startChunkForTag("option"));
    var children = null;
    var value = null;
    var selected = null;
    var innerHTML = null;
    for (var propKey in props) {
        if (has_own_property_1.default.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
                continue;
            }
            switch (propKey) {
                case "children":
                    children = propValue;
                    break;
                case "selected":
                    // ignore
                    selected = propValue;
                    if (__DEV__) {
                        // TODO: Remove support for `selected` in <option>.
                        if (!didWarnSelectedSetOnOption) {
                            console.error("Use the `defaultValue` or `value` props on <select> instead of " + "setting `selected` on <option>.");
                            didWarnSelectedSetOnOption = true;
                        }
                    }
                    break;
                case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                case "value":
                    value = propValue;
                // We intentionally fallthrough to also set the attribute on the node.
                default:
                    pushAttribute(target, propKey, propValue);
                    break;
            }
        }
    }
    if (selectedValue != null) {
        var stringValue = void 0;
        if (value !== null) {
            if (__DEV__) {
                (0, check_string_coercion_1.checkAttributeStringCoercion)(value, "value");
            }
            stringValue = "" + value;
        }
        else {
            if (__DEV__) {
                if (innerHTML !== null) {
                    if (!didWarnInvalidOptionInnerHTML) {
                        didWarnInvalidOptionInnerHTML = true;
                        console.error("Pass a `value` prop if you set dangerouslyInnerHTML so React knows " + "which value should be selected.");
                    }
                }
            }
            stringValue = flattenOptionChildren(children);
        }
        if (Array.isArray(selectedValue)) {
            // multiple
            for (var i_3 = 0; i_3 < selectedValue.length; i_3++) {
                if (__DEV__) {
                    (0, check_string_coercion_1.checkAttributeStringCoercion)(selectedValue[i_3], "value");
                }
                var v = "" + selectedValue[i_3];
                if (v === stringValue) {
                    target.push(selectedMarkerAttribute);
                    break;
                }
            }
        }
        else {
            if (__DEV__) {
                (0, check_string_coercion_1.checkAttributeStringCoercion)(selectedValue, "select.value");
            }
            if ("" + selectedValue === stringValue) {
                target.push(selectedMarkerAttribute);
            }
        }
    }
    else if (selected) {
        target.push(selectedMarkerAttribute);
    }
    target.push(endOfStartTag);
    pushInnerHTML(target, innerHTML, children);
    return children;
}
var formReplayingRuntimeScript = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(ReactDOMFizzInstructionSetInlineCodeStrings_1.formReplaying);
function injectFormReplayingRuntime(resumableState, renderState) {
    // If we haven't sent it yet, inject the runtime that tracks submitted JS actions
    // for later replaying by Fiber. If we use an external runtime, we don't need
    // to emit anything. It's always used.
    if ((resumableState.instructions & SentFormReplayingRuntime) === NothingSent && (!react_feature_flags_1.enableFizzExternalRuntime || !renderState.externalRuntimeScript)) {
        resumableState.instructions |= SentFormReplayingRuntime;
        renderState.bootstrapChunks.unshift(renderState.startInlineScript, formReplayingRuntimeScript, endInlineScript);
    }
}
var formStateMarkerIsMatching = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<!--F!-->");
var formStateMarkerIsNotMatching = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<!--F-->");
function pushFormStateMarkerIsMatching(target) {
    target.push(formStateMarkerIsMatching);
}
exports.pushFormStateMarkerIsMatching = pushFormStateMarkerIsMatching;
function pushFormStateMarkerIsNotMatching(target) {
    target.push(formStateMarkerIsNotMatching);
}
exports.pushFormStateMarkerIsNotMatching = pushFormStateMarkerIsNotMatching;
function pushStartForm(target, props, resumableState, renderState) {
    target.push(startChunkForTag("form"));
    var children = null;
    var innerHTML = null;
    var formAction = null;
    var formEncType = null;
    var formMethod = null;
    var formTarget = null;
    for (var propKey in props) {
        if (has_own_property_1.default.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
                continue;
            }
            switch (propKey) {
                case "children":
                    children = propValue;
                    break;
                case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                case "action":
                    formAction = propValue;
                    break;
                case "encType":
                    formEncType = propValue;
                    break;
                case "method":
                    formMethod = propValue;
                    break;
                case "target":
                    formTarget = propValue;
                    break;
                default:
                    pushAttribute(target, propKey, propValue);
                    break;
            }
        }
    }
    var formData = null;
    var formActionName = null;
    if (react_feature_flags_1.enableFormActions && typeof formAction === "function") {
        // Function form actions cannot control the form properties
        if (__DEV__) {
            if ((formEncType !== null || formMethod !== null) && !didWarnFormActionMethod) {
                didWarnFormActionMethod = true;
                console.error("Cannot specify a encType or method for a form that specifies a " + "function as the action. React provides those automatically. " + "They will get overridden.");
            }
            if (formTarget !== null && !didWarnFormActionTarget) {
                didWarnFormActionTarget = true;
                console.error("Cannot specify a target for a form that specifies a function as the action. " + "The function will always be executed in the same window.");
            }
        }
        var customAction = formAction.$$FORM_ACTION;
        if (typeof customAction === "function") {
            // This action has a custom progressive enhancement form that can submit the form
            // back to the server if it's invoked before hydration. Such as a Server Action.
            var prefix = makeFormFieldPrefix(resumableState);
            var customFields = formAction.$$FORM_ACTION(prefix);
            formAction = customFields.action || "";
            formEncType = customFields.encType;
            formMethod = customFields.method;
            formTarget = customFields.target;
            formData = customFields.data;
            formActionName = customFields.name;
        }
        else {
            // Set a javascript URL that doesn't do anything. We don't expect this to be invoked
            // because we'll preventDefault in the Fizz runtime, but it can happen if a form is
            // manually submitted or if someone calls stopPropagation before React gets the event.
            // If CSP is used to block javascript: URLs that's fine too. It just won't show this
            // error message but the URL will be logged.
            target.push(attributeSeparator, (0, ReactServerStreamConfig_1.stringToChunk)("action"), attributeAssign, actionJavaScriptURL, attributeEnd);
            formAction = null;
            formEncType = null;
            formMethod = null;
            formTarget = null;
            injectFormReplayingRuntime(resumableState, renderState);
        }
    }
    if (formAction != null) {
        pushAttribute(target, "action", formAction);
    }
    if (formEncType != null) {
        pushAttribute(target, "encType", formEncType);
    }
    if (formMethod != null) {
        pushAttribute(target, "method", formMethod);
    }
    if (formTarget != null) {
        pushAttribute(target, "target", formTarget);
    }
    target.push(endOfStartTag);
    if (formActionName !== null) {
        target.push(startHiddenInputChunk);
        pushStringAttribute(target, "name", formActionName);
        target.push(endOfStartTagSelfClosing);
        pushAdditionalFormFields(target, formData);
    }
    pushInnerHTML(target, innerHTML, children);
    if (typeof children === "string") {
        // Special case children as a string to avoid the unnecessary comment.
        // TODO: Remove this special case after the general optimization is in place.
        target.push((0, ReactServerStreamConfig_1.stringToChunk)(encodeHTMLTextNode(children)));
        return null;
    }
    return children;
}
function pushInput(target, props, resumableState, renderState) {
    if (__DEV__) {
        (0, ReactControlledValuePropTypes_1.checkControlledValueProps)("input", props);
    }
    target.push(startChunkForTag("input"));
    var name = null;
    var formAction = null;
    var formEncType = null;
    var formMethod = null;
    var formTarget = null;
    var value = null;
    var defaultValue = null;
    var checked = null;
    var defaultChecked = null;
    for (var propKey in props) {
        if (has_own_property_1.default.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
                continue;
            }
            switch (propKey) {
                case "children":
                case "dangerouslySetInnerHTML":
                    throw new Error("".concat("input", " is a self-closing tag and must neither have `children` nor ") + "use `dangerouslySetInnerHTML`.");
                case "name":
                    name = propValue;
                    break;
                case "formAction":
                    formAction = propValue;
                    break;
                case "formEncType":
                    formEncType = propValue;
                    break;
                case "formMethod":
                    formMethod = propValue;
                    break;
                case "formTarget":
                    formTarget = propValue;
                    break;
                case "defaultChecked":
                    defaultChecked = propValue;
                    break;
                case "defaultValue":
                    defaultValue = propValue;
                    break;
                case "checked":
                    checked = propValue;
                    break;
                case "value":
                    value = propValue;
                    break;
                default:
                    pushAttribute(target, propKey, propValue);
                    break;
            }
        }
    }
    if (__DEV__) {
        if (formAction !== null && props.type !== "image" && props.type !== "submit" && !didWarnFormActionType) {
            didWarnFormActionType = true;
            console.error("An input can only specify a formAction along with type=\"submit\" or type=\"image\".");
        }
    }
    var formData = pushFormActionAttribute(target, resumableState, renderState, formAction, formEncType, formMethod, formTarget, name);
    if (__DEV__) {
        if (checked !== null && defaultChecked !== null && !didWarnDefaultChecked) {
            console.error("%s contains an input of type %s with both checked and defaultChecked props. " + "Input elements must be either controlled or uncontrolled " + "(specify either the checked prop, or the defaultChecked prop, but not " + "both). Decide between using a controlled or uncontrolled input " + "element and remove one of these props. More info: " + "https://reactjs.org/link/controlled-components", "A component", props.type);
            didWarnDefaultChecked = true;
        }
        if (value !== null && defaultValue !== null && !didWarnDefaultInputValue) {
            console.error("%s contains an input of type %s with both value and defaultValue props. " + "Input elements must be either controlled or uncontrolled " + "(specify either the value prop, or the defaultValue prop, but not " + "both). Decide between using a controlled or uncontrolled input " + "element and remove one of these props. More info: " + "https://reactjs.org/link/controlled-components", "A component", props.type);
            didWarnDefaultInputValue = true;
        }
    }
    if (checked !== null) {
        pushBooleanAttribute(target, "checked", checked);
    }
    else if (defaultChecked !== null) {
        pushBooleanAttribute(target, "checked", defaultChecked);
    }
    if (value !== null) {
        pushAttribute(target, "value", value);
    }
    else if (defaultValue !== null) {
        pushAttribute(target, "value", defaultValue);
    }
    target.push(endOfStartTagSelfClosing);
    // We place any additional hidden form fields after the input.
    pushAdditionalFormFields(target, formData);
    return null;
}
function pushStartButton(target, props, resumableState, renderState) {
    target.push(startChunkForTag("button"));
    var children = null;
    var innerHTML = null;
    var name = null;
    var formAction = null;
    var formEncType = null;
    var formMethod = null;
    var formTarget = null;
    for (var propKey in props) {
        if (has_own_property_1.default.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
                continue;
            }
            switch (propKey) {
                case "children":
                    children = propValue;
                    break;
                case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                case "name":
                    name = propValue;
                    break;
                case "formAction":
                    formAction = propValue;
                    break;
                case "formEncType":
                    formEncType = propValue;
                    break;
                case "formMethod":
                    formMethod = propValue;
                    break;
                case "formTarget":
                    formTarget = propValue;
                    break;
                default:
                    pushAttribute(target, propKey, propValue);
                    break;
            }
        }
    }
    if (__DEV__) {
        if (formAction !== null && props.type != null && props.type !== "submit" && !didWarnFormActionType) {
            didWarnFormActionType = true;
            console.error("A button can only specify a formAction along with type=\"submit\" or no type.");
        }
    }
    var formData = pushFormActionAttribute(target, resumableState, renderState, formAction, formEncType, formMethod, formTarget, name);
    target.push(endOfStartTag);
    // We place any additional hidden form fields we need to include inside the button itself.
    pushAdditionalFormFields(target, formData);
    pushInnerHTML(target, innerHTML, children);
    if (typeof children === "string") {
        // Special case children as a string to avoid the unnecessary comment.
        // TODO: Remove this special case after the general optimization is in place.
        target.push((0, ReactServerStreamConfig_1.stringToChunk)(encodeHTMLTextNode(children)));
        return null;
    }
    return children;
}
function pushStartTextArea(target, props) {
    if (__DEV__) {
        (0, ReactControlledValuePropTypes_1.checkControlledValueProps)("textarea", props);
        if (props.value !== undefined && props.defaultValue !== undefined && !didWarnDefaultTextareaValue) {
            console.error("Textarea elements must be either controlled or uncontrolled " + "(specify either the value prop, or the defaultValue prop, but not " + "both). Decide between using a controlled or uncontrolled textarea " + "and remove one of these props. More info: " + "https://reactjs.org/link/controlled-components");
            didWarnDefaultTextareaValue = true;
        }
    }
    target.push(startChunkForTag("textarea"));
    var value = null;
    var defaultValue = null;
    var children = null;
    for (var propKey in props) {
        if (has_own_property_1.default.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
                continue;
            }
            switch (propKey) {
                case "children":
                    children = propValue;
                    break;
                case "value":
                    value = propValue;
                    break;
                case "defaultValue":
                    defaultValue = propValue;
                    break;
                case "dangerouslySetInnerHTML":
                    throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
                default:
                    pushAttribute(target, propKey, propValue);
                    break;
            }
        }
    }
    if (value === null && defaultValue !== null) {
        value = defaultValue;
    }
    target.push(endOfStartTag);
    // TODO (yungsters): Remove support for children content in <textarea>.
    if (children != null) {
        if (__DEV__) {
            console.error("Use the `defaultValue` or `value` props instead of setting " + "children on <textarea>.");
        }
        if (value != null) {
            throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
        }
        if (Array.isArray(children)) {
            if (children.length > 1) {
                throw new Error("<textarea> can only have at most one child.");
            }
            // TODO: remove the coercion and the DEV check below because it will
            // always be overwritten by the coercion several lines below it. #22309
            if (__DEV__) {
                (0, check_string_coercion_1.checkHtmlStringCoercion)(children[0]);
            }
            value = "" + children[0];
        }
        if (__DEV__) {
            (0, check_string_coercion_1.checkHtmlStringCoercion)(children);
        }
        value = "" + children;
    }
    if (typeof value === "string" && value[0] === "\n") {
        // text/html ignores the first character in these tags if it's a newline
        // Prefer to break application/xml over text/html (for now) by adding
        // a newline specifically to get eaten by the parser. (Alternately for
        // textareas, replacing "^\n" with "\r\n" doesn't get eaten, and the first
        // \r is normalized out by HTMLTextAreaElement#value.)
        // See: <http://www.w3.org/TR/html-polyglot/#newlines-in-textarea-and-pre>
        // See: <http://www.w3.org/TR/html5/syntax.html#element-restrictions>
        // See: <http://www.w3.org/TR/html5/syntax.html#newlines>
        // See: Parsing of "textarea" "listing" and "pre" elements
        //  from <http://www.w3.org/TR/html5/syntax.html#parsing-main-inbody>
        target.push(leadingNewline);
    }
    // ToString and push directly instead of recurse over children.
    // We don't really support complex children in the value anyway.
    // This also currently avoids a trailing comment node which breaks textarea.
    if (value !== null) {
        if (__DEV__) {
            (0, check_string_coercion_1.checkAttributeStringCoercion)(value, "value");
        }
        target.push((0, ReactServerStreamConfig_1.stringToChunk)(encodeHTMLTextNode("" + value)));
    }
    return null;
}
function pushMeta(target, props, renderState, textEmbedded, insertionMode, noscriptTagInScope) {
    if (react_feature_flags_1.enableFloat) {
        if (insertionMode === SVG_MODE || noscriptTagInScope || props.itemProp != null) {
            return pushSelfClosing(target, props, "meta");
        }
        else {
            if (textEmbedded) {
                // This link follows text but we aren't writing a tag. while not as efficient as possible we need
                // to be safe and assume text will follow by inserting a textSeparator
                target.push(textSeparator);
            }
            if (typeof props.charSet === "string") {
                return pushSelfClosing(renderState.charsetChunks, props, "meta");
            }
            else if (props.name === "viewport") {
                // "viewport" isn't related to preconnect but it has the right priority
                return pushSelfClosing(renderState.preconnectChunks, props, "meta");
            }
            else {
                return pushSelfClosing(renderState.hoistableChunks, props, "meta");
            }
        }
    }
    else {
        return pushSelfClosing(target, props, "meta");
    }
}
function pushLink(target, props, resumableState, renderState, textEmbedded, insertionMode, noscriptTagInScope) {
    if (react_feature_flags_1.enableFloat) {
        var rel = props.rel;
        var href = props.href;
        var precedence = props.precedence;
        if (insertionMode === SVG_MODE || noscriptTagInScope || props.itemProp != null || typeof rel !== "string" || typeof href !== "string" || href === "") {
            if (__DEV__) {
                if (rel === "stylesheet" && typeof props.precedence === "string") {
                    if (typeof href !== "string" || !href) {
                        console.error("React encountered a `<link rel=\"stylesheet\" .../>` with a `precedence` prop and expected the `href` prop to be a non-empty string but ecountered %s instead. If your intent was to have React hoist and deduplciate this stylesheet using the `precedence` prop ensure there is a non-empty string `href` prop as well, otherwise remove the `precedence` prop.", (0, ReactDOMResourceValidation_1.getValueDescriptorExpectingObjectForWarning)(href));
                    }
                }
            }
            pushLinkImpl(target, props);
            return null;
        }
        if (props.rel === "stylesheet") {
            // This <link> may hoistable as a Stylesheet Resource, otherwise it will emit in place
            var key = getResourceKey(href);
            if (typeof precedence !== "string" || props.disabled != null || props.onLoad || props.onError) {
                // This stylesheet is either not opted into Resource semantics or has conflicting properties which
                // disqualify it for such. We can still create a preload resource to help it load faster on the
                // client
                if (__DEV__) {
                    if (typeof precedence === "string") {
                        if (props.disabled != null) {
                            console.error("React encountered a `<link rel=\"stylesheet\" .../>` with a `precedence` prop and a `disabled` prop. The presence of the `disabled` prop indicates an intent to manage the stylesheet active state from your from your Component code and React will not hoist or deduplicate this stylesheet. If your intent was to have React hoist and deduplciate this stylesheet using the `precedence` prop remove the `disabled` prop, otherwise remove the `precedence` prop.");
                        }
                        else if (props.onLoad || props.onError) {
                            var propDescription = props.onLoad && props.onError ? "`onLoad` and `onError` props" : props.onLoad ? "`onLoad` prop" : "`onError` prop";
                            console.error("React encountered a `<link rel=\"stylesheet\" .../>` with a `precedence` prop and %s. The presence of loading and error handlers indicates an intent to manage the stylesheet loading state from your from your Component code and React will not hoist or deduplicate this stylesheet. If your intent was to have React hoist and deduplciate this stylesheet using the `precedence` prop remove the %s, otherwise remove the `precedence` prop.", propDescription, propDescription);
                        }
                    }
                }
                return pushLinkImpl(target, props);
            }
            else {
                // This stylesheet refers to a Resource and we create a new one if necessary
                var styleQueue = renderState.styles.get(precedence);
                var hasKey = resumableState.styleResources.hasOwnProperty(key);
                var resourceState = hasKey ? resumableState.styleResources[key] : undefined;
                if (resourceState !== EXISTS) {
                    // We are going to create this resource now so it is marked as Exists
                    resumableState.styleResources[key] = EXISTS;
                    // If this is the first time we've encountered this precedence we need
                    // to create a StyleQueue
                    if (!styleQueue) {
                        styleQueue = {
                            precedence: (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(precedence)),
                            rules: [],
                            hrefs: [],
                            sheets: new Map()
                        };
                        renderState.styles.set(precedence, styleQueue);
                    }
                    var resource = {
                        state: PENDING,
                        props: stylesheetPropsFromRawProps(props)
                    };
                    if (resourceState) {
                        // When resourceState is truty it is a Preload state. We cast it for clarity
                        var preloadState = resourceState;
                        if (preloadState.length === 2) {
                            adoptPreloadCredentials(resource.props, preloadState);
                        }
                        var preloadResource = renderState.preloads.stylesheets.get(key);
                        if (preloadResource && preloadResource.length > 0) {
                            // The Preload for this resource was created in this render pass and has not flushed yet so
                            // we need to clear it to avoid it flushing.
                            preloadResource.length = 0;
                        }
                        else {
                            // Either the preload resource from this render already flushed in this render pass
                            // or the preload flushed in a prior pass (prerender). In either case we need to mark
                            // this resource as already having been preloaded.
                            resource.state = PRELOADED;
                        }
                    }
                    else { // We don't need to check whether a preloadResource exists in the renderState
                        // because if it did exist then the resourceState would also exist and we would
                        // have hit the primary if condition above.
                    }
                    // We add the newly created resource to our StyleQueue and if necessary
                    // track the resource with the currently rendering boundary
                    styleQueue.sheets.set(key, resource);
                    if (renderState.boundaryResources) {
                        renderState.boundaryResources.stylesheets.add(resource);
                    }
                }
                else {
                    // We need to track whether this boundary should wait on this resource or not.
                    // Typically this resource should always exist since we either had it or just created
                    // it. However, it's possible when you resume that the style has already been emitted
                    // and then it wouldn't be recreated in the RenderState and there's no need to track
                    // it again since we should've hoisted it to the shell already.
                    if (styleQueue) {
                        var resource = styleQueue.sheets.get(key);
                        if (resource) {
                            if (renderState.boundaryResources) {
                                renderState.boundaryResources.stylesheets.add(resource);
                            }
                        }
                    }
                }
                if (textEmbedded) {
                    // This link follows text but we aren't writing a tag. while not as efficient as possible we need
                    // to be safe and assume text will follow by inserting a textSeparator
                    target.push(textSeparator);
                }
                return null;
            }
        }
        else if (props.onLoad || props.onError) {
            // When using load handlers we cannot hoist and need to emit links in place
            return pushLinkImpl(target, props);
        }
        else {
            // We can hoist this link so we may need to emit a text separator.
            // @TODO refactor text separators so we don't have to defensively add
            // them when we don't end up emitting a tag as a result of pushStartInstance
            if (textEmbedded) {
                // This link follows text but we aren't writing a tag. while not as efficient as possible we need
                // to be safe and assume text will follow by inserting a textSeparator
                target.push(textSeparator);
            }
            switch (props.rel) {
                case "preconnect":
                case "dns-prefetch":
                    return pushLinkImpl(renderState.preconnectChunks, props);
                case "preload":
                    return pushLinkImpl(renderState.preloadChunks, props);
                default:
                    return pushLinkImpl(renderState.hoistableChunks, props);
            }
        }
    }
    else {
        return pushLinkImpl(target, props);
    }
}
function pushLinkImpl(target, props) {
    target.push(startChunkForTag("link"));
    for (var propKey in props) {
        if (has_own_property_1.default.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
                continue;
            }
            switch (propKey) {
                case "children":
                case "dangerouslySetInnerHTML":
                    throw new Error("".concat("link", " is a self-closing tag and must neither have `children` nor ") + "use `dangerouslySetInnerHTML`.");
                default:
                    pushAttribute(target, propKey, propValue);
                    break;
            }
        }
    }
    target.push(endOfStartTagSelfClosing);
    return null;
}
function pushStyle(target, props, resumableState, renderState, textEmbedded, insertionMode, noscriptTagInScope) {
    if (__DEV__) {
        if (has_own_property_1.default.call(props, "children")) {
            var children = props.children;
            var child = Array.isArray(children) ? children.length < 2 ? children[0] : null : children;
            if (typeof child === "function" || typeof child === "symbol" || Array.isArray(child)) {
                var childType = typeof child === "function" ? "a Function" : typeof child === "symbol" ? "a Sybmol" : "an Array";
                console.error("React expect children of <style> tags to be a string, number, or object with a `toString` method but found %s instead. " + "In browsers style Elements can only have `Text` Nodes as children.", childType);
            }
        }
    }
    if (react_feature_flags_1.enableFloat) {
        var precedence = props.precedence;
        var href = props.href;
        if (insertionMode === SVG_MODE || noscriptTagInScope || props.itemProp != null || typeof precedence !== "string" || typeof href !== "string" || href === "") {
            // This style tag is not able to be turned into a Style Resource
            return pushStyleImpl(target, props);
        }
        if (__DEV__) {
            if (href.includes(" ")) {
                console.error("React expected the `href` prop for a <style> tag opting into hoisting semantics using the `precedence` prop to not have any spaces but ecountered spaces instead. using spaces in this prop will cause hydration of this style to fail on the client. The href for the <style> where this ocurred is \"%s\".", href);
            }
        }
        var key = getResourceKey(href);
        var styleQueue = renderState.styles.get(precedence);
        var hasKey = resumableState.styleResources.hasOwnProperty(key);
        var resourceState = hasKey ? resumableState.styleResources[key] : undefined;
        if (resourceState !== EXISTS) {
            // We are going to create this resource now so it is marked as Exists
            resumableState.styleResources[key] = EXISTS;
            if (__DEV__) {
                if (resourceState) {
                    console.error("React encountered a hoistable style tag for the same href as a preload: \"%s\". When using a style tag to inline styles you should not also preload it as a stylsheet.", href);
                }
            }
            if (!styleQueue) {
                // This is the first time we've encountered this precedence we need
                // to create a StyleQueue.
                styleQueue = {
                    precedence: (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(precedence)),
                    rules: [],
                    hrefs: [(0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(href))],
                    sheets: new Map()
                };
                renderState.styles.set(precedence, styleQueue);
            }
            else {
                // We have seen this precedence before and need to track this href
                styleQueue.hrefs.push((0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(href)));
            }
            pushStyleContents(styleQueue.rules, props);
        }
        if (styleQueue) {
            // We need to track whether this boundary should wait on this resource or not.
            // Typically this resource should always exist since we either had it or just created
            // it. However, it's possible when you resume that the style has already been emitted
            // and then it wouldn't be recreated in the RenderState and there's no need to track
            // it again since we should've hoisted it to the shell already.
            if (renderState.boundaryResources) {
                renderState.boundaryResources.styles.add(styleQueue);
            }
        }
        if (textEmbedded) {
            // This link follows text but we aren't writing a tag. while not as efficient as possible we need
            // to be safe and assume text will follow by inserting a textSeparator
            target.push(textSeparator);
        }
    }
    else {
        return pushStartGenericElement(target, props, "style");
    }
}
function pushStyleImpl(target, props) {
    target.push(startChunkForTag("style"));
    var children = null;
    var innerHTML = null;
    for (var propKey in props) {
        if (has_own_property_1.default.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
                continue;
            }
            switch (propKey) {
                case "children":
                    children = propValue;
                    break;
                case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                default:
                    pushAttribute(target, propKey, propValue);
                    break;
            }
        }
    }
    target.push(endOfStartTag);
    var child = Array.isArray(children) ? children.length < 2 ? children[0] : null : children;
    if (typeof child !== "function" && typeof child !== "symbol" && child !== null && child !== undefined) {
        // eslint-disable-next-line react-internal/safe-string-coercion
        target.push((0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)("" + child)));
    }
    pushInnerHTML(target, innerHTML, children);
    target.push(endChunkForTag("style"));
    return null;
}
function pushStyleContents(target, props) {
    var children = null;
    var innerHTML = null;
    for (var propKey in props) {
        if (has_own_property_1.default.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
                continue;
            }
            switch (propKey) {
                case "children":
                    children = propValue;
                    break;
                case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
            }
        }
    }
    var child = Array.isArray(children) ? children.length < 2 ? children[0] : null : children;
    if (typeof child !== "function" && typeof child !== "symbol" && child !== null && child !== undefined) {
        // eslint-disable-next-line react-internal/safe-string-coercion
        target.push((0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)("" + child)));
    }
    pushInnerHTML(target, innerHTML, children);
    return;
}
function pushImg(target, props, resumableState, renderState, pictureTagInScope) {
    var src = props.src, srcSet = props.srcSet;
    if (props.loading !== "lazy" && (src || srcSet) && (typeof src === "string" || src == null) && (typeof srcSet === "string" || srcSet == null) && props.fetchPriority !== "low" && pictureTagInScope === false && // We exclude data URIs in src and srcSet since these should not be preloaded
        !(typeof src === "string" && src[4] === ":" && (src[0] === "d" || src[0] === "D") && (src[1] === "a" || src[1] === "A") && (src[2] === "t" || src[2] === "T") && (src[3] === "a" || src[3] === "A")) && !(typeof srcSet === "string" && srcSet[4] === ":" && (srcSet[0] === "d" || srcSet[0] === "D") && (srcSet[1] === "a" || srcSet[1] === "A") && (srcSet[2] === "t" || srcSet[2] === "T") && (srcSet[3] === "a" || srcSet[3] === "A"))) {
        // We have a suspensey image and ought to preload it to optimize the loading of display blocking
        // resumableState.
        var sizes = typeof props.sizes === "string" ? props.sizes : undefined;
        var key = getImageResourceKey(src, srcSet, sizes);
        var promotablePreloads = renderState.preloads.images;
        var resource = promotablePreloads.get(key);
        if (resource) {
            // We consider whether this preload can be promoted to higher priority flushing queue.
            // The only time a resource will exist here is if it was created during this render
            // and was not already in the high priority queue.
            if (props.fetchPriority === "high" || renderState.highImagePreloads.size < 10) {
                // Delete the resource from the map since we are promoting it and don't want to
                // reenter this branch in a second pass for duplicate img hrefs.
                promotablePreloads.delete(key);
                // $FlowFixMe - Flow should understand that this is a Resource if the condition was true
                renderState.highImagePreloads.add(resource);
            }
        }
        else if (!resumableState.imageResources.hasOwnProperty(key)) {
            // We must construct a new preload resource
            resumableState.imageResources[key] = PRELOAD_NO_CREDS;
            resource = [];
            pushLinkImpl(resource, {
                rel: "preload",
                as: "image",
                // There is a bug in Safari where imageSrcSet is not respected on preload links
                // so we omit the href here if we have imageSrcSet b/c safari will load the wrong image.
                // This harms older browers that do not support imageSrcSet by making their preloads not work
                // but this population is shrinking fast and is already small so we accept this tradeoff.
                href: srcSet ? undefined : src,
                imageSrcSet: srcSet,
                imageSizes: sizes,
                crossOrigin: props.crossOrigin,
                integrity: props.integrity,
                type: props.type,
                fetchPriority: props.fetchPriority,
                referrerPolicy: props.referrerPolicy
            });
            if (props.fetchPriority === "high" || renderState.highImagePreloads.size < 10) {
                renderState.highImagePreloads.add(resource);
            }
            else {
                renderState.bulkPreloads.add(resource);
                // We can bump the priority up if the same img is rendered later
                // with fetchPriority="high"
                promotablePreloads.set(key, resource);
            }
        }
    }
    return pushSelfClosing(target, props, "img");
}
function pushSelfClosing(target, props, tag) {
    target.push(startChunkForTag(tag));
    for (var propKey in props) {
        if (has_own_property_1.default.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
                continue;
            }
            switch (propKey) {
                case "children":
                case "dangerouslySetInnerHTML":
                    throw new Error("".concat(tag, " is a self-closing tag and must neither have `children` nor ") + "use `dangerouslySetInnerHTML`.");
                default:
                    pushAttribute(target, propKey, propValue);
                    break;
            }
        }
    }
    target.push(endOfStartTagSelfClosing);
    return null;
}
function pushStartMenuItem(target, props) {
    target.push(startChunkForTag("menuitem"));
    for (var propKey in props) {
        if (has_own_property_1.default.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
                continue;
            }
            switch (propKey) {
                case "children":
                case "dangerouslySetInnerHTML":
                    throw new Error("menuitems cannot have `children` nor `dangerouslySetInnerHTML`.");
                default:
                    pushAttribute(target, propKey, propValue);
                    break;
            }
        }
    }
    target.push(endOfStartTag);
    return null;
}
function pushTitle(target, props, renderState, insertionMode, noscriptTagInScope) {
    if (__DEV__) {
        if (has_own_property_1.default.call(props, "children")) {
            var children = props.children;
            var child = Array.isArray(children) ? children.length < 2 ? children[0] : null : children;
            if (Array.isArray(children) && children.length > 1) {
                console.error("React expects the `children` prop of <title> tags to be a string, number, or object with a novel `toString` method but found an Array with length %s instead." + " Browsers treat all child Nodes of <title> tags as Text content and React expects to be able to convert `children` of <title> tags to a single string value" + " which is why Arrays of length greater than 1 are not supported. When using JSX it can be commong to combine text nodes and value nodes." + " For example: <title>hello {nameOfUser}</title>. While not immediately apparent, `children` in this case is an Array with length 2. If your `children` prop" + " is using this form try rewriting it using a template string: <title>{`hello ${nameOfUser}`}</title>.", children.length);
            }
            else if (typeof child === "function" || typeof child === "symbol") {
                var childType = typeof child === "function" ? "a Function" : "a Sybmol";
                console.error("React expect children of <title> tags to be a string, number, or object with a novel `toString` method but found %s instead." + " Browsers treat all child Nodes of <title> tags as Text content and React expects to be able to convert children of <title>" + " tags to a single string value.", childType);
            }
            else if (child && child.toString === {}.toString) {
                if (child.$$typeof != null) {
                    console.error("React expects the `children` prop of <title> tags to be a string, number, or object with a novel `toString` method but found an object that appears to be" + " a React element which never implements a suitable `toString` method. Browsers treat all child Nodes of <title> tags as Text content and React expects to" + " be able to convert children of <title> tags to a single string value which is why rendering React elements is not supported. If the `children` of <title> is" + " a React Component try moving the <title> tag into that component. If the `children` of <title> is some HTML markup change it to be Text only to be valid HTML.");
                }
                else {
                    console.error("React expects the `children` prop of <title> tags to be a string, number, or object with a novel `toString` method but found an object that does not implement" + " a suitable `toString` method. Browsers treat all child Nodes of <title> tags as Text content and React expects to be able to convert children of <title> tags" + " to a single string value. Using the default `toString` method available on every object is almost certainly an error. Consider whether the `children` of this <title>" + " is an object in error and change it to a string or number value if so. Otherwise implement a `toString` method that React can use to produce a valid <title>.");
                }
            }
        }
    }
    if (react_feature_flags_1.enableFloat) {
        if (insertionMode !== SVG_MODE && !noscriptTagInScope && props.itemProp == null) {
            pushTitleImpl(renderState.hoistableChunks, props);
            return null;
        }
        else {
            return pushTitleImpl(target, props);
        }
    }
    else {
        return pushTitleImpl(target, props);
    }
}
function pushTitleImpl(target, props) {
    target.push(startChunkForTag("title"));
    var children = null;
    var innerHTML = null;
    for (var propKey in props) {
        if (has_own_property_1.default.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
                continue;
            }
            switch (propKey) {
                case "children":
                    children = propValue;
                    break;
                case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                default:
                    pushAttribute(target, propKey, propValue);
                    break;
            }
        }
    }
    target.push(endOfStartTag);
    var child = Array.isArray(children) ? children.length < 2 ? children[0] : null : children;
    if (typeof child !== "function" && typeof child !== "symbol" && child !== null && child !== undefined) {
        // eslint-disable-next-line react-internal/safe-string-coercion
        target.push((0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)("" + child)));
    }
    pushInnerHTML(target, innerHTML, children);
    target.push(endChunkForTag("title"));
    return null;
}
function pushStartTitle(target, props) {
    target.push(startChunkForTag("title"));
    var children = null;
    for (var propKey in props) {
        if (has_own_property_1.default.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
                continue;
            }
            switch (propKey) {
                case "children":
                    children = propValue;
                    break;
                case "dangerouslySetInnerHTML":
                    throw new Error("`dangerouslySetInnerHTML` does not make sense on <title>.");
                default:
                    pushAttribute(target, propKey, propValue);
                    break;
            }
        }
    }
    target.push(endOfStartTag);
    if (__DEV__) {
        var childForValidation = Array.isArray(children) && children.length < 2 ? children[0] || null : children;
        if (Array.isArray(children) && children.length > 1) {
            console.error("A title element received an array with more than 1 element as children. " + "In browsers title Elements can only have Text Nodes as children. If " + "the children being rendered output more than a single text node in aggregate the browser " + "will display markup and comments as text in the title and hydration will likely fail and " + "fall back to client rendering");
        }
        else if (childForValidation != null && childForValidation.$$typeof != null) {
            console.error("A title element received a React element for children. " + "In the browser title Elements can only have Text Nodes as children. If " + "the children being rendered output more than a single text node in aggregate the browser " + "will display markup and comments as text in the title and hydration will likely fail and " + "fall back to client rendering");
        }
        else if (childForValidation != null && typeof childForValidation !== "string" && typeof childForValidation !== "number") {
            console.error("A title element received a value that was not a string or number for children. " + "In the browser title Elements can only have Text Nodes as children. If " + "the children being rendered output more than a single text node in aggregate the browser " + "will display markup and comments as text in the title and hydration will likely fail and " + "fall back to client rendering");
        }
    }
    return children;
}
function pushStartHead(target, props, renderState, insertionMode) {
    if (react_feature_flags_1.enableFloat) {
        if (insertionMode < HTML_MODE && renderState.headChunks === null) {
            // This <head> is the Document.head and should be part of the preamble
            renderState.headChunks = [];
            return pushStartGenericElement(renderState.headChunks, props, "head");
        }
        else {
            // This <head> is deep and is likely just an error. we emit it inline though.
            // Validation should warn that this tag is the the wrong spot.
            return pushStartGenericElement(target, props, "head");
        }
    }
    else {
        return pushStartGenericElement(target, props, "head");
    }
}
function pushStartHtml(target, props, renderState, insertionMode) {
    if (react_feature_flags_1.enableFloat) {
        if (insertionMode === exports.ROOT_HTML_MODE && renderState.htmlChunks === null) {
            // This <html> is the Document.documentElement and should be part of the preamble
            renderState.htmlChunks = [ReactFizzConfig_1.doctypeChunk];
            return pushStartGenericElement(renderState.htmlChunks, props, "html");
        }
        else {
            // This <html> is deep and is likely just an error. we emit it inline though.
            // Validation should warn that this tag is the the wrong spot.
            return pushStartGenericElement(target, props, "html");
        }
    }
    else {
        if (insertionMode === exports.ROOT_HTML_MODE) {
            // If we're rendering the html tag and we're at the root (i.e. not in foreignObject)
            // then we also emit the DOCTYPE as part of the root content as a convenience for
            // rendering the whole document.
            target.push(ReactFizzConfig_1.doctypeChunk);
        }
        return pushStartGenericElement(target, props, "html");
    }
}
function pushScript(target, props, resumableState, renderState, textEmbedded, insertionMode, noscriptTagInScope) {
    if (react_feature_flags_1.enableFloat) {
        var asyncProp = props.async;
        if (typeof props.src !== "string" || !props.src || !(asyncProp && typeof asyncProp !== "function" && typeof asyncProp !== "symbol") || props.onLoad || props.onError || insertionMode === SVG_MODE || noscriptTagInScope || props.itemProp != null) {
            // This script will not be a resource, we bailout early and emit it in place.
            return pushScriptImpl(target, props);
        }
        var src = props.src;
        var key = getResourceKey(src);
        // We can make this <script> into a ScriptResource
        var resources = void 0, preloads = void 0;
        if (props.type === "module") {
            resources = resumableState.moduleScriptResources;
            preloads = renderState.preloads.moduleScripts;
        }
        else {
            resources = resumableState.scriptResources;
            preloads = renderState.preloads.scripts;
        }
        var hasKey = resources.hasOwnProperty(key);
        var resourceState = hasKey ? resources[key] : undefined;
        if (resourceState !== EXISTS) {
            // We are going to create this resource now so it is marked as Exists
            resources[key] = EXISTS;
            var scriptProps = props;
            if (resourceState) {
                // When resourceState is truty it is a Preload state. We cast it for clarity
                var preloadState = resourceState;
                if (preloadState.length === 2) {
                    scriptProps = __assign({}, props);
                    adoptPreloadCredentials(scriptProps, preloadState);
                }
                var preloadResource = preloads.get(key);
                if (preloadResource) {
                    // the preload resource exists was created in this render. Now that we have
                    // a script resource which will emit earlier than a preload would if it
                    // hasn't already flushed we prevent it from flushing by zeroing the length
                    preloadResource.length = 0;
                }
            }
            var resource = [];
            // Add to the script flushing queue
            renderState.scripts.add(resource);
            // encode the tag as Chunks
            pushScriptImpl(resource, scriptProps);
        }
        if (textEmbedded) {
            // This script follows text but we aren't writing a tag. while not as efficient as possible we need
            // to be safe and assume text will follow by inserting a textSeparator
            target.push(textSeparator);
        }
        return null;
    }
    else {
        return pushScriptImpl(target, props);
    }
}
function pushScriptImpl(target, props) {
    target.push(startChunkForTag("script"));
    var children = null;
    var innerHTML = null;
    for (var propKey in props) {
        if (has_own_property_1.default.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
                continue;
            }
            switch (propKey) {
                case "children":
                    children = propValue;
                    break;
                case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                default:
                    pushAttribute(target, propKey, propValue);
                    break;
            }
        }
    }
    target.push(endOfStartTag);
    if (__DEV__) {
        if (children != null && typeof children !== "string") {
            var descriptiveStatement = typeof children === "number" ? "a number for children" : Array.isArray(children) ? "an array for children" : "something unexpected for children";
            console.error("A script element was rendered with %s. If script element has children it must be a single string." + " Consider using dangerouslySetInnerHTML or passing a plain string as children.", descriptiveStatement);
        }
    }
    pushInnerHTML(target, innerHTML, children);
    if (typeof children === "string") {
        target.push((0, ReactServerStreamConfig_1.stringToChunk)(encodeHTMLTextNode(children)));
    }
    target.push(endChunkForTag("script"));
    return null;
}
function pushStartGenericElement(target, props, tag) {
    target.push(startChunkForTag(tag));
    var children = null;
    var innerHTML = null;
    for (var propKey in props) {
        if (has_own_property_1.default.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
                continue;
            }
            switch (propKey) {
                case "children":
                    children = propValue;
                    break;
                case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                default:
                    pushAttribute(target, propKey, propValue);
                    break;
            }
        }
    }
    target.push(endOfStartTag);
    pushInnerHTML(target, innerHTML, children);
    if (typeof children === "string") {
        // Special case children as a string to avoid the unnecessary comment.
        // TODO: Remove this special case after the general optimization is in place.
        target.push((0, ReactServerStreamConfig_1.stringToChunk)(encodeHTMLTextNode(children)));
        return null;
    }
    return children;
}
function pushStartCustomElement(target, props, tag) {
    target.push(startChunkForTag(tag));
    var children = null;
    var innerHTML = null;
    for (var propKey in props) {
        if (has_own_property_1.default.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
                continue;
            }
            var attributeName = propKey;
            switch (propKey) {
                case "children":
                    children = propValue;
                    break;
                case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                case "style":
                    pushStyleAttribute(target, propValue);
                    break;
                case "suppressContentEditableWarning":
                case "suppressHydrationWarning":
                    // Ignored. These are built-in to React on the client.
                    break;
                case "className":
                    if (react_feature_flags_1.enableCustomElementPropertySupport) {
                        // className gets rendered as class on the client, so it should be
                        // rendered as class on the server.
                        attributeName = "class";
                    }
                // intentional fallthrough
                default:
                    if ((0, isAttributeNameSafe_1.default)(propKey) && typeof propValue !== "function" && typeof propValue !== "symbol") {
                        if (react_feature_flags_1.enableCustomElementPropertySupport) {
                            if (propValue === false) {
                                continue;
                            }
                            else if (propValue === true) {
                                propValue = "";
                            }
                            else if (typeof propValue === "object") {
                                continue;
                            }
                        }
                        target.push(attributeSeparator, (0, ReactServerStreamConfig_1.stringToChunk)(attributeName), attributeAssign, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(propValue)), attributeEnd);
                    }
                    break;
            }
        }
    }
    target.push(endOfStartTag);
    pushInnerHTML(target, innerHTML, children);
    return children;
}
var leadingNewline = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\n");
function pushStartPreformattedElement(target, props, tag) {
    target.push(startChunkForTag(tag));
    var children = null;
    var innerHTML = null;
    for (var propKey in props) {
        if (has_own_property_1.default.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
                continue;
            }
            switch (propKey) {
                case "children":
                    children = propValue;
                    break;
                case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                default:
                    pushAttribute(target, propKey, propValue);
                    break;
            }
        }
    }
    target.push(endOfStartTag);
    // text/html ignores the first character in these tags if it's a newline
    // Prefer to break application/xml over text/html (for now) by adding
    // a newline specifically to get eaten by the parser. (Alternately for
    // textareas, replacing "^\n" with "\r\n" doesn't get eaten, and the first
    // \r is normalized out by HTMLTextAreaElement#value.)
    // See: <http://www.w3.org/TR/html-polyglot/#newlines-in-textarea-and-pre>
    // See: <http://www.w3.org/TR/html5/syntax.html#element-restrictions>
    // See: <http://www.w3.org/TR/html5/syntax.html#newlines>
    // See: Parsing of "textarea" "listing" and "pre" elements
    //  from <http://www.w3.org/TR/html5/syntax.html#parsing-main-inbody>
    // TODO: This doesn't deal with the case where the child is an array
    // or component that returns a string.
    if (innerHTML != null) {
        if (children != null) {
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
        }
        if (typeof innerHTML !== "object" || !("__html" in innerHTML)) {
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. " + "Please visit https://reactjs.org/link/dangerously-set-inner-html " + "for more information.");
        }
        var html = innerHTML.__html;
        if (html !== null && html !== undefined) {
            if (typeof html === "string" && html.length > 0 && html[0] === "\n") {
                target.push(leadingNewline, (0, ReactServerStreamConfig_1.stringToChunk)(html));
            }
            else {
                if (__DEV__) {
                    (0, check_string_coercion_1.checkHtmlStringCoercion)(html);
                }
                target.push((0, ReactServerStreamConfig_1.stringToChunk)("" + html));
            }
        }
    }
    if (typeof children === "string" && children[0] === "\n") {
        target.push(leadingNewline);
    }
    return children;
}
// We accept any tag to be rendered but since this gets injected into arbitrary
// HTML, we want to make sure that it's a safe tag.
// http://www.w3.org/TR/REC-xml/#NT-Name
var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/; // Simplified subset
var validatedTagCache = new Map();
function startChunkForTag(tag) {
    var tagStartChunk = validatedTagCache.get(tag);
    if (tagStartChunk === undefined) {
        if (!VALID_TAG_REGEX.test(tag)) {
            throw new Error("Invalid tag: ".concat(tag));
        }
        tagStartChunk = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<" + tag);
        validatedTagCache.set(tag, tagStartChunk);
    }
    return tagStartChunk;
}
exports.doctypeChunk = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<!DOCTYPE html>");
function pushStartInstance(target, type, props, resumableState, renderState, formatContext, textEmbedded) {
    if (__DEV__) {
        (0, ReactDOMInvalidARIAHook_1.validateProperties)(type, props);
        (0, ReactDOMNullInputValuePropHook_1.validateProperties)(type, props);
        (0, ReactDOMUnknownPropertyHook_1.validateProperties)(type, props, null);
        if (!props.suppressContentEditableWarning && props.contentEditable && props.children != null) {
            console.error("A component is `contentEditable` and contains `children` managed by " + "React. It is now your responsibility to guarantee that none of " + "those nodes are unexpectedly modified or duplicated. This is " + "probably not intentional.");
        }
        if (formatContext.insertionMode !== SVG_MODE && formatContext.insertionMode !== MATHML_MODE) {
            if (type.indexOf("-") === -1 && type.toLowerCase() !== type) {
                console.error("<%s /> is using incorrect casing. " + "Use PascalCase for React components, " + "or lowercase for HTML elements.", type);
            }
        }
    }
    switch (type) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
            // Fast track very common tags
            break;
        // Special tags
        case "select":
            return pushStartSelect(target, props);
        case "option":
            return pushStartOption(target, props, formatContext);
        case "textarea":
            return pushStartTextArea(target, props);
        case "input":
            return pushInput(target, props, resumableState, renderState);
        case "button":
            return pushStartButton(target, props, resumableState, renderState);
        case "form":
            return pushStartForm(target, props, resumableState, renderState);
        case "menuitem":
            return pushStartMenuItem(target, props);
        case "title":
            return react_feature_flags_1.enableFloat ? pushTitle(target, props, renderState, formatContext.insertionMode, !!(formatContext.tagScope & NOSCRIPT_SCOPE)) : pushStartTitle(target, props);
        case "link":
            return pushLink(target, props, resumableState, renderState, textEmbedded, formatContext.insertionMode, !!(formatContext.tagScope & NOSCRIPT_SCOPE));
        case "script":
            return react_feature_flags_1.enableFloat ? pushScript(target, props, resumableState, renderState, textEmbedded, formatContext.insertionMode, !!(formatContext.tagScope & NOSCRIPT_SCOPE)) : pushStartGenericElement(target, props, type);
        case "style":
            return pushStyle(target, props, resumableState, renderState, textEmbedded, formatContext.insertionMode, !!(formatContext.tagScope & NOSCRIPT_SCOPE));
        case "meta":
            return pushMeta(target, props, renderState, textEmbedded, formatContext.insertionMode, !!(formatContext.tagScope & NOSCRIPT_SCOPE));
        // Newline eating tags
        case "listing":
        case "pre": {
            return pushStartPreformattedElement(target, props, type);
        }
        case "img": {
            return react_feature_flags_1.enableFloat ? pushImg(target, props, resumableState, renderState, !!(formatContext.tagScope & PICTURE_SCOPE)) : pushSelfClosing(target, props, type);
        }
        // Omitted close tags
        case "base":
        case "area":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "param":
        case "source":
        case "track":
        case "wbr": {
            return pushSelfClosing(target, props, type);
        }
        // These are reserved SVG and MathML elements, that are never custom elements.
        // https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph": {
            break;
        }
        // Preamble start tags
        case "head":
            return pushStartHead(target, props, renderState, formatContext.insertionMode);
        case "html": {
            return pushStartHtml(target, props, renderState, formatContext.insertionMode);
        }
        default: {
            if (type.indexOf("-") !== -1) {
                // Custom element
                return pushStartCustomElement(target, props, type);
            }
        }
    }
    // Generic element
    return pushStartGenericElement(target, props, type);
}
exports.pushStartInstance = pushStartInstance;
var endTagCache = new Map();
function endChunkForTag(tag) {
    var chunk = endTagCache.get(tag);
    if (chunk === undefined) {
        chunk = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("</" + tag + ">");
        endTagCache.set(tag, chunk);
    }
    return chunk;
}
function pushEndInstance(target, type, props, resumableState, formatContext) {
    switch (type) {
        // When float is on we expect title and script tags to always be pushed in
        // a unit and never return children. when we end up pushing the end tag we
        // want to ensure there is no extra closing tag pushed
        case "title":
        case "style":
        case "script": {
            if (!react_feature_flags_1.enableFloat) {
                break;
            } // Fall through
        }
        // Omitted close tags
        // TODO: Instead of repeating this switch we could try to pass a flag from above.
        // That would require returning a tuple. Which might be ok if it gets inlined.
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "img":
        case "input":
        case "keygen":
        case "link":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr": {
            // No close tag needed.
            return;
        }
        // Postamble end tags
        // When float is enabled we omit the end tags for body and html when
        // they represent the Document.body and Document.documentElement Nodes.
        // This is so we can withhold them until the postamble when we know
        // we won't emit any more tags
        case "body": {
            if (react_feature_flags_1.enableFloat && formatContext.insertionMode <= HTML_HTML_MODE) {
                resumableState.hasBody = true;
                return;
            }
            break;
        }
        case "html":
            if (react_feature_flags_1.enableFloat && formatContext.insertionMode === exports.ROOT_HTML_MODE) {
                resumableState.hasHtml = true;
                return;
            }
            break;
    }
    target.push(endChunkForTag(type));
}
exports.pushEndInstance = pushEndInstance;
function writeBootstrap(destination, renderState) {
    var bootstrapChunks = renderState.bootstrapChunks;
    var i = 0;
    for (; i < bootstrapChunks.length - 1; i++) {
        (0, ReactServerStreamConfig_1.writeChunk)(destination, bootstrapChunks[i]);
    }
    if (i < bootstrapChunks.length) {
        var lastChunk = bootstrapChunks[i];
        bootstrapChunks.length = 0;
        return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, lastChunk);
    }
    return true;
}
function writeCompletedRoot(destination, renderState) {
    return writeBootstrap(destination, renderState);
}
exports.writeCompletedRoot = writeCompletedRoot;
// Structural Nodes
// A placeholder is a node inside a hidden partial tree that can be filled in later, but before
// display. It's never visible to users. We use the template tag because it can be used in every
// type of parent. <script> tags also work in every other tag except <colgroup>.
var placeholder1 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<template id=\"");
var placeholder2 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\"></template>");
function writePlaceholder(destination, renderState, id) {
    (0, ReactServerStreamConfig_1.writeChunk)(destination, placeholder1);
    (0, ReactServerStreamConfig_1.writeChunk)(destination, renderState.placeholderPrefix);
    var formattedID = (0, ReactServerStreamConfig_1.stringToChunk)(id.toString(16));
    (0, ReactServerStreamConfig_1.writeChunk)(destination, formattedID);
    return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, placeholder2);
}
exports.writePlaceholder = writePlaceholder;
// Suspense boundaries are encoded as comments.
var startCompletedSuspenseBoundary = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<!--$-->");
var startPendingSuspenseBoundary1 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<!--$?--><template id=\"");
var startPendingSuspenseBoundary2 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\"></template>");
var startClientRenderedSuspenseBoundary = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<!--$!-->");
var endSuspenseBoundary = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<!--/$-->");
var clientRenderedSuspenseBoundaryError1 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<template");
var clientRenderedSuspenseBoundaryErrorAttrInterstitial = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\"");
var clientRenderedSuspenseBoundaryError1A = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(" data-dgst=\"");
var clientRenderedSuspenseBoundaryError1B = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(" data-msg=\"");
var clientRenderedSuspenseBoundaryError1C = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(" data-stck=\"");
var clientRenderedSuspenseBoundaryError2 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("></template>");
function pushStartCompletedSuspenseBoundary(target) {
    target.push(startCompletedSuspenseBoundary);
}
exports.pushStartCompletedSuspenseBoundary = pushStartCompletedSuspenseBoundary;
function pushEndCompletedSuspenseBoundary(target) {
    target.push(endSuspenseBoundary);
}
exports.pushEndCompletedSuspenseBoundary = pushEndCompletedSuspenseBoundary;
function writeStartCompletedSuspenseBoundary(destination, renderState) {
    return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, startCompletedSuspenseBoundary);
}
exports.writeStartCompletedSuspenseBoundary = writeStartCompletedSuspenseBoundary;
function writeStartPendingSuspenseBoundary(destination, renderState, id) {
    (0, ReactServerStreamConfig_1.writeChunk)(destination, startPendingSuspenseBoundary1);
    if (id === null) {
        throw new Error("An ID must have been assigned before we can complete the boundary.");
    }
    (0, ReactServerStreamConfig_1.writeChunk)(destination, renderState.boundaryPrefix);
    (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)(id.toString(16)));
    return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, startPendingSuspenseBoundary2);
}
exports.writeStartPendingSuspenseBoundary = writeStartPendingSuspenseBoundary;
function writeStartClientRenderedSuspenseBoundary(destination, renderState, errorDigest, errorMesssage, errorComponentStack) {
    var result;
    result = (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, startClientRenderedSuspenseBoundary);
    (0, ReactServerStreamConfig_1.writeChunk)(destination, clientRenderedSuspenseBoundaryError1);
    if (errorDigest) {
        (0, ReactServerStreamConfig_1.writeChunk)(destination, clientRenderedSuspenseBoundaryError1A);
        (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(errorDigest)));
        (0, ReactServerStreamConfig_1.writeChunk)(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
    }
    if (__DEV__) {
        if (errorMesssage) {
            (0, ReactServerStreamConfig_1.writeChunk)(destination, clientRenderedSuspenseBoundaryError1B);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(errorMesssage)));
            (0, ReactServerStreamConfig_1.writeChunk)(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
        }
        if (errorComponentStack) {
            (0, ReactServerStreamConfig_1.writeChunk)(destination, clientRenderedSuspenseBoundaryError1C);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(errorComponentStack)));
            (0, ReactServerStreamConfig_1.writeChunk)(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
        }
    }
    result = (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, clientRenderedSuspenseBoundaryError2);
    return result;
}
exports.writeStartClientRenderedSuspenseBoundary = writeStartClientRenderedSuspenseBoundary;
function writeEndCompletedSuspenseBoundary(destination, renderState) {
    return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, endSuspenseBoundary);
}
exports.writeEndCompletedSuspenseBoundary = writeEndCompletedSuspenseBoundary;
function writeEndPendingSuspenseBoundary(destination, renderState) {
    return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, endSuspenseBoundary);
}
exports.writeEndPendingSuspenseBoundary = writeEndPendingSuspenseBoundary;
function writeEndClientRenderedSuspenseBoundary(destination, renderState) {
    return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, endSuspenseBoundary);
}
exports.writeEndClientRenderedSuspenseBoundary = writeEndClientRenderedSuspenseBoundary;
var startSegmentHTML = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<div hidden id=\"");
var startSegmentHTML2 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\">");
var endSegmentHTML = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("</div>");
var startSegmentSVG = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<svg aria-hidden=\"true\" style=\"display:none\" id=\"");
var startSegmentSVG2 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\">");
var endSegmentSVG = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("</svg>");
var startSegmentMathML = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<math aria-hidden=\"true\" style=\"display:none\" id=\"");
var startSegmentMathML2 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\">");
var endSegmentMathML = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("</math>");
var startSegmentTable = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<table hidden id=\"");
var startSegmentTable2 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\">");
var endSegmentTable = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("</table>");
var startSegmentTableBody = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<table hidden><tbody id=\"");
var startSegmentTableBody2 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\">");
var endSegmentTableBody = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("</tbody></table>");
var startSegmentTableRow = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<table hidden><tr id=\"");
var startSegmentTableRow2 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\">");
var endSegmentTableRow = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("</tr></table>");
var startSegmentColGroup = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<table hidden><colgroup id=\"");
var startSegmentColGroup2 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\">");
var endSegmentColGroup = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("</colgroup></table>");
function writeStartSegment(destination, renderState, formatContext, id) {
    switch (formatContext.insertionMode) {
        case exports.ROOT_HTML_MODE:
        case HTML_HTML_MODE:
        case HTML_MODE: {
            (0, ReactServerStreamConfig_1.writeChunk)(destination, startSegmentHTML);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, renderState.segmentPrefix);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)(id.toString(16)));
            return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, startSegmentHTML2);
        }
        case SVG_MODE: {
            (0, ReactServerStreamConfig_1.writeChunk)(destination, startSegmentSVG);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, renderState.segmentPrefix);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)(id.toString(16)));
            return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, startSegmentSVG2);
        }
        case MATHML_MODE: {
            (0, ReactServerStreamConfig_1.writeChunk)(destination, startSegmentMathML);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, renderState.segmentPrefix);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)(id.toString(16)));
            return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, startSegmentMathML2);
        }
        case HTML_TABLE_MODE: {
            (0, ReactServerStreamConfig_1.writeChunk)(destination, startSegmentTable);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, renderState.segmentPrefix);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)(id.toString(16)));
            return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, startSegmentTable2);
        }
        // TODO: For the rest of these, there will be extra wrapper nodes that never
        // get deleted from the document. We need to delete the table too as part
        // of the injected scripts. They are invisible though so it's not too terrible
        // and it's kind of an edge case to suspend in a table. Totally supported though.
        case HTML_TABLE_BODY_MODE: {
            (0, ReactServerStreamConfig_1.writeChunk)(destination, startSegmentTableBody);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, renderState.segmentPrefix);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)(id.toString(16)));
            return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, startSegmentTableBody2);
        }
        case HTML_TABLE_ROW_MODE: {
            (0, ReactServerStreamConfig_1.writeChunk)(destination, startSegmentTableRow);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, renderState.segmentPrefix);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)(id.toString(16)));
            return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, startSegmentTableRow2);
        }
        case HTML_COLGROUP_MODE: {
            (0, ReactServerStreamConfig_1.writeChunk)(destination, startSegmentColGroup);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, renderState.segmentPrefix);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)(id.toString(16)));
            return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, startSegmentColGroup2);
        }
        default: {
            throw new Error("Unknown insertion mode. This is a bug in React.");
        }
    }
}
exports.writeStartSegment = writeStartSegment;
function writeEndSegment(destination, formatContext) {
    switch (formatContext.insertionMode) {
        case exports.ROOT_HTML_MODE:
        case HTML_HTML_MODE:
        case HTML_MODE: {
            return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, endSegmentHTML);
        }
        case SVG_MODE: {
            return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, endSegmentSVG);
        }
        case MATHML_MODE: {
            return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, endSegmentMathML);
        }
        case HTML_TABLE_MODE: {
            return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, endSegmentTable);
        }
        case HTML_TABLE_BODY_MODE: {
            return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, endSegmentTableBody);
        }
        case HTML_TABLE_ROW_MODE: {
            return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, endSegmentTableRow);
        }
        case HTML_COLGROUP_MODE: {
            return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, endSegmentColGroup);
        }
        default: {
            throw new Error("Unknown insertion mode. This is a bug in React.");
        }
    }
}
exports.writeEndSegment = writeEndSegment;
var completeSegmentScript1Full = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(ReactDOMFizzInstructionSetInlineCodeStrings_1.completeSegment + "$RS(\"");
var completeSegmentScript1Partial = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("$RS(\"");
var completeSegmentScript2 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\",\"");
var completeSegmentScriptEnd = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\")</script>");
var completeSegmentData1 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<template data-rsi=\"\" data-sid=\"");
var completeSegmentData2 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\" data-pid=\"");
var completeSegmentDataEnd = dataElementQuotedEnd;
function writeCompletedSegmentInstruction(destination, resumableState, renderState, contentSegmentID) {
    var scriptFormat = !react_feature_flags_1.enableFizzExternalRuntime || resumableState.streamingFormat === ScriptStreamingFormat;
    if (scriptFormat) {
        (0, ReactServerStreamConfig_1.writeChunk)(destination, renderState.startInlineScript);
        if ((resumableState.instructions & SentCompleteSegmentFunction) === NothingSent) {
            // The first time we write this, we'll need to include the full implementation.
            resumableState.instructions |= SentCompleteSegmentFunction;
            (0, ReactServerStreamConfig_1.writeChunk)(destination, completeSegmentScript1Full);
        }
        else {
            // Future calls can just reuse the same function.
            (0, ReactServerStreamConfig_1.writeChunk)(destination, completeSegmentScript1Partial);
        }
    }
    else {
        (0, ReactServerStreamConfig_1.writeChunk)(destination, completeSegmentData1);
    }
    // Write function arguments, which are string literals
    (0, ReactServerStreamConfig_1.writeChunk)(destination, renderState.segmentPrefix);
    var formattedID = (0, ReactServerStreamConfig_1.stringToChunk)(contentSegmentID.toString(16));
    (0, ReactServerStreamConfig_1.writeChunk)(destination, formattedID);
    if (scriptFormat) {
        (0, ReactServerStreamConfig_1.writeChunk)(destination, completeSegmentScript2);
    }
    else {
        (0, ReactServerStreamConfig_1.writeChunk)(destination, completeSegmentData2);
    }
    (0, ReactServerStreamConfig_1.writeChunk)(destination, renderState.placeholderPrefix);
    (0, ReactServerStreamConfig_1.writeChunk)(destination, formattedID);
    if (scriptFormat) {
        return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, completeSegmentScriptEnd);
    }
    else {
        return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, completeSegmentDataEnd);
    }
}
exports.writeCompletedSegmentInstruction = writeCompletedSegmentInstruction;
var completeBoundaryScript1Full = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(ReactDOMFizzInstructionSetInlineCodeStrings_1.completeBoundary + "$RC(\"");
var completeBoundaryScript1Partial = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("$RC(\"");
var completeBoundaryWithStylesScript1FullBoth = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(ReactDOMFizzInstructionSetInlineCodeStrings_1.completeBoundary + ReactDOMFizzInstructionSetInlineCodeStrings_1.completeBoundaryWithStyles + "$RR(\"");
var completeBoundaryWithStylesScript1FullPartial = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(ReactDOMFizzInstructionSetInlineCodeStrings_1.completeBoundaryWithStyles + "$RR(\"");
var completeBoundaryWithStylesScript1Partial = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("$RR(\"");
var completeBoundaryScript2 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\",\"");
var completeBoundaryScript3a = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\",");
var completeBoundaryScript3b = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\"");
var completeBoundaryScriptEnd = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(")</script>");
var completeBoundaryData1 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<template data-rci=\"\" data-bid=\"");
var completeBoundaryWithStylesData1 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<template data-rri=\"\" data-bid=\"");
var completeBoundaryData2 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\" data-sid=\"");
var completeBoundaryData3a = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\" data-sty=\"");
var completeBoundaryDataEnd = dataElementQuotedEnd;
function writeCompletedBoundaryInstruction(destination, resumableState, renderState, id, boundaryResources) {
    var requiresStyleInsertion;
    if (react_feature_flags_1.enableFloat) {
        requiresStyleInsertion = renderState.stylesToHoist;
        // If necessary stylesheets will be flushed with this instruction.
        // Any style tags not yet hoisted in the Document will also be hoisted.
        // We reset this state since after this instruction executes all styles
        // up to this point will have been hoisted
        renderState.stylesToHoist = false;
    }
    var scriptFormat = !react_feature_flags_1.enableFizzExternalRuntime || resumableState.streamingFormat === ScriptStreamingFormat;
    if (scriptFormat) {
        (0, ReactServerStreamConfig_1.writeChunk)(destination, renderState.startInlineScript);
        if (react_feature_flags_1.enableFloat && requiresStyleInsertion) {
            if ((resumableState.instructions & SentCompleteBoundaryFunction) === NothingSent) {
                resumableState.instructions |= SentStyleInsertionFunction | SentCompleteBoundaryFunction;
                (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.clonePrecomputedChunk)(completeBoundaryWithStylesScript1FullBoth));
            }
            else if ((resumableState.instructions & SentStyleInsertionFunction) === NothingSent) {
                resumableState.instructions |= SentStyleInsertionFunction;
                (0, ReactServerStreamConfig_1.writeChunk)(destination, completeBoundaryWithStylesScript1FullPartial);
            }
            else {
                (0, ReactServerStreamConfig_1.writeChunk)(destination, completeBoundaryWithStylesScript1Partial);
            }
        }
        else {
            if ((resumableState.instructions & SentCompleteBoundaryFunction) === NothingSent) {
                resumableState.instructions |= SentCompleteBoundaryFunction;
                (0, ReactServerStreamConfig_1.writeChunk)(destination, completeBoundaryScript1Full);
            }
            else {
                (0, ReactServerStreamConfig_1.writeChunk)(destination, completeBoundaryScript1Partial);
            }
        }
    }
    else {
        if (react_feature_flags_1.enableFloat && requiresStyleInsertion) {
            (0, ReactServerStreamConfig_1.writeChunk)(destination, completeBoundaryWithStylesData1);
        }
        else {
            (0, ReactServerStreamConfig_1.writeChunk)(destination, completeBoundaryData1);
        }
    }
    var idChunk = (0, ReactServerStreamConfig_1.stringToChunk)(id.toString(16));
    (0, ReactServerStreamConfig_1.writeChunk)(destination, renderState.boundaryPrefix);
    (0, ReactServerStreamConfig_1.writeChunk)(destination, idChunk);
    // Write function arguments, which are string and array literals
    if (scriptFormat) {
        (0, ReactServerStreamConfig_1.writeChunk)(destination, completeBoundaryScript2);
    }
    else {
        (0, ReactServerStreamConfig_1.writeChunk)(destination, completeBoundaryData2);
    }
    (0, ReactServerStreamConfig_1.writeChunk)(destination, renderState.segmentPrefix);
    (0, ReactServerStreamConfig_1.writeChunk)(destination, idChunk);
    if (react_feature_flags_1.enableFloat && requiresStyleInsertion) {
        // Script and data writers must format this differently:
        //  - script writer emits an array literal, whose string elements are
        //    escaped for javascript  e.g. ["A", "B"]
        //  - data writer emits a string literal, which is escaped as html
        //    e.g. [&#34;A&#34;, &#34;B&#34;]
        if (scriptFormat) {
            (0, ReactServerStreamConfig_1.writeChunk)(destination, completeBoundaryScript3a);
            // boundaryResources encodes an array literal
            writeStyleResourceDependenciesInJS(destination, boundaryResources);
        }
        else {
            (0, ReactServerStreamConfig_1.writeChunk)(destination, completeBoundaryData3a);
            writeStyleResourceDependenciesInAttr(destination, boundaryResources);
        }
    }
    else {
        if (scriptFormat) {
            (0, ReactServerStreamConfig_1.writeChunk)(destination, completeBoundaryScript3b);
        }
    }
    var writeMore;
    if (scriptFormat) {
        writeMore = (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, completeBoundaryScriptEnd);
    }
    else {
        writeMore = (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, completeBoundaryDataEnd);
    }
    return writeBootstrap(destination, renderState) && writeMore;
}
exports.writeCompletedBoundaryInstruction = writeCompletedBoundaryInstruction;
var clientRenderScript1Full = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(ReactDOMFizzInstructionSetInlineCodeStrings_1.clientRenderBoundary + ";$RX(\"");
var clientRenderScript1Partial = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("$RX(\"");
var clientRenderScript1A = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\"");
var clientRenderErrorScriptArgInterstitial = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(",");
var clientRenderScriptEnd = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(")</script>");
var clientRenderData1 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<template data-rxi=\"\" data-bid=\"");
var clientRenderData2 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\" data-dgst=\"");
var clientRenderData3 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\" data-msg=\"");
var clientRenderData4 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\" data-stck=\"");
var clientRenderDataEnd = dataElementQuotedEnd;
function writeClientRenderBoundaryInstruction(destination, resumableState, renderState, id, errorDigest, errorMessage, errorComponentStack) {
    var scriptFormat = !react_feature_flags_1.enableFizzExternalRuntime || resumableState.streamingFormat === ScriptStreamingFormat;
    if (scriptFormat) {
        (0, ReactServerStreamConfig_1.writeChunk)(destination, renderState.startInlineScript);
        if ((resumableState.instructions & SentClientRenderFunction) === NothingSent) {
            // The first time we write this, we'll need to include the full implementation.
            resumableState.instructions |= SentClientRenderFunction;
            (0, ReactServerStreamConfig_1.writeChunk)(destination, clientRenderScript1Full);
        }
        else {
            // Future calls can just reuse the same function.
            (0, ReactServerStreamConfig_1.writeChunk)(destination, clientRenderScript1Partial);
        }
    }
    else {
        // <template data-rxi="" data-bid="
        (0, ReactServerStreamConfig_1.writeChunk)(destination, clientRenderData1);
    }
    (0, ReactServerStreamConfig_1.writeChunk)(destination, renderState.boundaryPrefix);
    (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)(id.toString(16)));
    if (scriptFormat) {
        // " needs to be inserted for scripts, since ArgInterstitual does not contain
        // leading or trailing quotes
        (0, ReactServerStreamConfig_1.writeChunk)(destination, clientRenderScript1A);
    }
    if (errorDigest || errorMessage || errorComponentStack) {
        if (scriptFormat) {
            // ,"JSONString"
            (0, ReactServerStreamConfig_1.writeChunk)(destination, clientRenderErrorScriptArgInterstitial);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)(escapeJSStringsForInstructionScripts(errorDigest || "")));
        }
        else {
            // " data-dgst="HTMLString
            (0, ReactServerStreamConfig_1.writeChunk)(destination, clientRenderData2);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(errorDigest || "")));
        }
    }
    if (errorMessage || errorComponentStack) {
        if (scriptFormat) {
            // ,"JSONString"
            (0, ReactServerStreamConfig_1.writeChunk)(destination, clientRenderErrorScriptArgInterstitial);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)(escapeJSStringsForInstructionScripts(errorMessage || "")));
        }
        else {
            // " data-msg="HTMLString
            (0, ReactServerStreamConfig_1.writeChunk)(destination, clientRenderData3);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(errorMessage || "")));
        }
    }
    if (errorComponentStack) {
        // ,"JSONString"
        if (scriptFormat) {
            (0, ReactServerStreamConfig_1.writeChunk)(destination, clientRenderErrorScriptArgInterstitial);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)(escapeJSStringsForInstructionScripts(errorComponentStack)));
        }
        else {
            // " data-stck="HTMLString
            (0, ReactServerStreamConfig_1.writeChunk)(destination, clientRenderData4);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(errorComponentStack)));
        }
    }
    if (scriptFormat) {
        // ></script>
        return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, clientRenderScriptEnd);
    }
    else {
        // "></template>
        return (0, ReactServerStreamConfig_1.writeChunkAndReturn)(destination, clientRenderDataEnd);
    }
}
exports.writeClientRenderBoundaryInstruction = writeClientRenderBoundaryInstruction;
var regexForJSStringsInInstructionScripts = /[<\u2028\u2029]/g;
function escapeJSStringsForInstructionScripts(input) {
    var escaped = JSON.stringify(input);
    return escaped.replace(regexForJSStringsInInstructionScripts, function (match) {
        switch (match) {
            // santizing breaking out of strings and script tags
            case "<":
                return "\\u003c";
            case "\u2028":
                return "\\u2028";
            case "\u2029":
                return "\\u2029";
            default: {
                // not-used: eslint-disable-next-line react-internal/prod-error-codes
                throw new Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
            }
        }
    });
}
var regexForJSStringsInScripts = /[&><\u2028\u2029]/g;
function escapeJSObjectForInstructionScripts(input) {
    var escaped = JSON.stringify(input);
    return escaped.replace(regexForJSStringsInScripts, function (match) {
        switch (match) {
            // santizing breaking out of strings and script tags
            case "&":
                return "\\u0026";
            case ">":
                return "\\u003e";
            case "<":
                return "\\u003c";
            case "\u2028":
                return "\\u2028";
            case "\u2029":
                return "\\u2029";
            default: {
                // not-used: eslint-disable-next-line react-internal/prod-error-codes
                throw new Error("escapeJSObjectForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
            }
        }
    });
}
var lateStyleTagResourceOpen1 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<style media=\"not all\" data-precedence=\"");
var lateStyleTagResourceOpen2 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\" data-href=\"");
var lateStyleTagResourceOpen3 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\">");
var lateStyleTagTemplateClose = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("</style>");
// Tracks whether the boundary currently flushing is flushign style tags or has any
// stylesheet dependencies not flushed in the Preamble.
var currentlyRenderingBoundaryHasStylesToHoist = false;
// Acts as a return value for the forEach execution of style tag flushing.
var destinationHasCapacity = true;
function flushStyleTagsLateForBoundary(styleQueue) {
    var rules = styleQueue.rules;
    var hrefs = styleQueue.hrefs;
    if (__DEV__) {
        if (rules.length > 0 && hrefs.length === 0) {
            console.error("React expected to have at least one href for an a hoistable style but found none. This is a bug in React.");
        }
    }
    var i = 0;
    if (hrefs.length) {
        (0, ReactServerStreamConfig_1.writeChunk)(this, lateStyleTagResourceOpen1);
        (0, ReactServerStreamConfig_1.writeChunk)(this, styleQueue.precedence);
        (0, ReactServerStreamConfig_1.writeChunk)(this, lateStyleTagResourceOpen2);
        for (; i < hrefs.length - 1; i++) {
            (0, ReactServerStreamConfig_1.writeChunk)(this, hrefs[i]);
            (0, ReactServerStreamConfig_1.writeChunk)(this, spaceSeparator);
        }
        (0, ReactServerStreamConfig_1.writeChunk)(this, hrefs[i]);
        (0, ReactServerStreamConfig_1.writeChunk)(this, lateStyleTagResourceOpen3);
        for (i = 0; i < rules.length; i++) {
            (0, ReactServerStreamConfig_1.writeChunk)(this, rules[i]);
        }
        destinationHasCapacity = (0, ReactServerStreamConfig_1.writeChunkAndReturn)(this, lateStyleTagTemplateClose);
        // We wrote style tags for this boundary and we may need to emit a script
        // to hoist them.
        currentlyRenderingBoundaryHasStylesToHoist = true;
        // style resources can flush continuously since more rules may be written into
        // them with new hrefs. Instead of marking it flushed, we simply reset the chunks
        // and hrefs
        rules.length = 0;
        hrefs.length = 0;
    }
}
function hasStylesToHoist(stylesheet) {
    // We need to reveal boundaries with styles whenever a stylesheet it depends on is either
    // not flushed or flushed after the preamble (shell).
    if (stylesheet.state !== PREAMBLE) {
        currentlyRenderingBoundaryHasStylesToHoist = true;
        return true;
    }
    return false;
}
function writeResourcesForBoundary(destination, boundaryResources, renderState) {
    // Reset these on each invocation, they are only safe to read in this function
    currentlyRenderingBoundaryHasStylesToHoist = false;
    destinationHasCapacity = true;
    // Flush style tags for each precedence this boundary depends on
    boundaryResources.styles.forEach(flushStyleTagsLateForBoundary, destination);
    // Determine if this boundary has stylesheets that need to be awaited upon completion
    boundaryResources.stylesheets.forEach(hasStylesToHoist);
    if (currentlyRenderingBoundaryHasStylesToHoist) {
        renderState.stylesToHoist = true;
    }
    return destinationHasCapacity;
}
exports.writeResourcesForBoundary = writeResourcesForBoundary;
function flushResource(resource) {
    for (var i_4 = 0; i_4 < resource.length; i_4++) {
        (0, ReactServerStreamConfig_1.writeChunk)(this, resource[i_4]);
    }
    resource.length = 0;
}
var stylesheetFlushingQueue = [];
function flushStyleInPreamble(stylesheet, key, map) {
    // We still need to encode stylesheet chunks
    // because unlike most Hoistables and Resources we do not eagerly encode
    // them during render. This is because if we flush late we have to send a
    // different encoding and we don't want to encode multiple times
    pushLinkImpl(stylesheetFlushingQueue, stylesheet.props);
    for (var i_5 = 0; i_5 < stylesheetFlushingQueue.length; i_5++) {
        (0, ReactServerStreamConfig_1.writeChunk)(this, stylesheetFlushingQueue[i_5]);
    }
    stylesheetFlushingQueue.length = 0;
    stylesheet.state = PREAMBLE;
}
var styleTagResourceOpen1 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("<style data-precedence=\"");
var styleTagResourceOpen2 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\" data-href=\"");
var spaceSeparator = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(" ");
var styleTagResourceOpen3 = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("\">");
var styleTagResourceClose = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("</style>");
function flushStylesInPreamble(styleQueue, precedence) {
    var hasStylesheets = styleQueue.sheets.size > 0;
    styleQueue.sheets.forEach(flushStyleInPreamble, this);
    styleQueue.sheets.clear();
    var rules = styleQueue.rules;
    var hrefs = styleQueue.hrefs;
    // If we don't emit any stylesheets at this precedence we still need to maintain the precedence
    // order so even if there are no rules for style tags at this precedence we emit an empty style
    // tag with the data-precedence attribute
    if (!hasStylesheets || hrefs.length) {
        (0, ReactServerStreamConfig_1.writeChunk)(this, styleTagResourceOpen1);
        (0, ReactServerStreamConfig_1.writeChunk)(this, styleQueue.precedence);
        var i_6 = 0;
        if (hrefs.length) {
            (0, ReactServerStreamConfig_1.writeChunk)(this, styleTagResourceOpen2);
            for (; i_6 < hrefs.length - 1; i_6++) {
                (0, ReactServerStreamConfig_1.writeChunk)(this, hrefs[i_6]);
                (0, ReactServerStreamConfig_1.writeChunk)(this, spaceSeparator);
            }
            (0, ReactServerStreamConfig_1.writeChunk)(this, hrefs[i_6]);
        }
        (0, ReactServerStreamConfig_1.writeChunk)(this, styleTagResourceOpen3);
        for (i_6 = 0; i_6 < rules.length; i_6++) {
            (0, ReactServerStreamConfig_1.writeChunk)(this, rules[i_6]);
        }
        (0, ReactServerStreamConfig_1.writeChunk)(this, styleTagResourceClose);
        // style resources can flush continuously since more rules may be written into
        // them with new hrefs. Instead of marking it flushed, we simply reset the chunks
        // and hrefs
        rules.length = 0;
        hrefs.length = 0;
    }
}
function preloadLateStyle(stylesheet) {
    if (stylesheet.state === PENDING) {
        stylesheet.state = PRELOADED;
        var preloadProps = preloadAsStylePropsFromProps(stylesheet.props.href, stylesheet.props);
        pushLinkImpl(stylesheetFlushingQueue, preloadProps);
        for (var i_7 = 0; i_7 < stylesheetFlushingQueue.length; i_7++) {
            (0, ReactServerStreamConfig_1.writeChunk)(this, stylesheetFlushingQueue[i_7]);
        }
        stylesheetFlushingQueue.length = 0;
    }
}
function preloadLateStyles(styleQueue) {
    styleQueue.sheets.forEach(preloadLateStyle, this);
    styleQueue.sheets.clear();
}
// We don't bother reporting backpressure at the moment because we expect to
// flush the entire preamble in a single pass. This probably should be modified
// in the future to be backpressure sensitive but that requires a larger refactor
// of the flushing code in Fizz.
function writePreamble(destination, resumableState, renderState, willFlushAllSegments) {
    // This function must be called exactly once on every request
    if (react_feature_flags_1.enableFizzExternalRuntime && !willFlushAllSegments && renderState.externalRuntimeScript) {
        // If the root segment is incomplete due to suspended tasks
        // (e.g. willFlushAllSegments = false) and we are using data
        // streaming format, ensure the external runtime is sent.
        // (User code could choose to send this even earlier by calling
        //  preinit(...), if they know they will suspend).
        var _a = renderState.externalRuntimeScript, src = _a.src, chunks = _a.chunks;
        internalPreinitScript(resumableState, renderState, src, chunks);
    }
    var htmlChunks = renderState.htmlChunks;
    var headChunks = renderState.headChunks;
    var i = 0;
    // Emit open tags before Hoistables and Resources
    if (htmlChunks) {
        // We have an <html> to emit as part of the preamble
        for (i = 0; i < htmlChunks.length; i++) {
            (0, ReactServerStreamConfig_1.writeChunk)(destination, htmlChunks[i]);
        }
        if (headChunks) {
            for (i = 0; i < headChunks.length; i++) {
                (0, ReactServerStreamConfig_1.writeChunk)(destination, headChunks[i]);
            }
        }
        else {
            // We did not render a head but we emitted an <html> so we emit one now
            (0, ReactServerStreamConfig_1.writeChunk)(destination, startChunkForTag("head"));
            (0, ReactServerStreamConfig_1.writeChunk)(destination, endOfStartTag);
        }
    }
    else if (headChunks) {
        // We do not have an <html> but we do have a <head>
        for (i = 0; i < headChunks.length; i++) {
            (0, ReactServerStreamConfig_1.writeChunk)(destination, headChunks[i]);
        }
    }
    // Emit high priority Hoistables
    var charsetChunks = renderState.charsetChunks;
    for (i = 0; i < charsetChunks.length; i++) {
        (0, ReactServerStreamConfig_1.writeChunk)(destination, charsetChunks[i]);
    }
    charsetChunks.length = 0;
    // emit preconnect resources
    renderState.preconnects.forEach(flushResource, destination);
    renderState.preconnects.clear();
    var preconnectChunks = renderState.preconnectChunks;
    for (i = 0; i < preconnectChunks.length; i++) {
        (0, ReactServerStreamConfig_1.writeChunk)(destination, preconnectChunks[i]);
    }
    preconnectChunks.length = 0;
    renderState.fontPreloads.forEach(flushResource, destination);
    renderState.fontPreloads.clear();
    renderState.highImagePreloads.forEach(flushResource, destination);
    renderState.highImagePreloads.clear();
    // Flush unblocked stylesheets by precedence
    renderState.styles.forEach(flushStylesInPreamble, destination);
    var importMapChunks = renderState.importMapChunks;
    for (i = 0; i < importMapChunks.length; i++) {
        (0, ReactServerStreamConfig_1.writeChunk)(destination, importMapChunks[i]);
    }
    importMapChunks.length = 0;
    renderState.bootstrapScripts.forEach(flushResource, destination);
    renderState.scripts.forEach(flushResource, destination);
    renderState.scripts.clear();
    renderState.bulkPreloads.forEach(flushResource, destination);
    renderState.bulkPreloads.clear();
    // Write embedding preloadChunks
    var preloadChunks = renderState.preloadChunks;
    for (i = 0; i < preloadChunks.length; i++) {
        (0, ReactServerStreamConfig_1.writeChunk)(destination, preloadChunks[i]);
    }
    preloadChunks.length = 0;
    // Write embedding hoistableChunks
    var hoistableChunks = renderState.hoistableChunks;
    for (i = 0; i < hoistableChunks.length; i++) {
        (0, ReactServerStreamConfig_1.writeChunk)(destination, hoistableChunks[i]);
    }
    hoistableChunks.length = 0;
    // Flush closing head if necessary
    if (htmlChunks && headChunks === null) {
        // We have an <html> rendered but no <head> rendered. We however inserted
        // a <head> up above so we need to emit the </head> now. This is safe because
        // if the main content contained the </head> it would also have provided a
        // <head>. This means that all the content inside <html> is either <body> or
        // invalid HTML
        (0, ReactServerStreamConfig_1.writeChunk)(destination, endChunkForTag("head"));
    }
}
exports.writePreamble = writePreamble;
// We don't bother reporting backpressure at the moment because we expect to
// flush the entire preamble in a single pass. This probably should be modified
// in the future to be backpressure sensitive but that requires a larger refactor
// of the flushing code in Fizz.
function writeHoistables(destination, resumableState, renderState) {
    var i = 0;
    // Emit high priority Hoistables
    // We omit charsetChunks because we have already sent the shell and if it wasn't
    // already sent it is too late now.
    renderState.preconnects.forEach(flushResource, destination);
    renderState.preconnects.clear();
    var preconnectChunks = renderState.preconnectChunks;
    for (i = 0; i < preconnectChunks.length; i++) {
        (0, ReactServerStreamConfig_1.writeChunk)(destination, preconnectChunks[i]);
    }
    preconnectChunks.length = 0;
    renderState.fontPreloads.forEach(flushResource, destination);
    renderState.fontPreloads.clear();
    renderState.highImagePreloads.forEach(flushResource, destination);
    renderState.highImagePreloads.clear();
    // Preload any stylesheets. these will emit in a render instruction that follows this
    // but we want to kick off preloading as soon as possible
    renderState.styles.forEach(preloadLateStyles, destination);
    // We only hoist importmaps that are configured through createResponse and that will
    // always flush in the preamble. Generally we don't expect people to render them as
    // tags when using React but if you do they are going to be treated like regular inline
    // scripts and flush after other hoistables which is problematic
    // bootstrap scripts should flush above script priority but these can only flush in the preamble
    // so we elide the code here for performance
    renderState.scripts.forEach(flushResource, destination);
    renderState.scripts.clear();
    renderState.bulkPreloads.forEach(flushResource, destination);
    renderState.bulkPreloads.clear();
    // Write embedding preloadChunks
    var preloadChunks = renderState.preloadChunks;
    for (i = 0; i < preloadChunks.length; i++) {
        (0, ReactServerStreamConfig_1.writeChunk)(destination, preloadChunks[i]);
    }
    preloadChunks.length = 0;
    // Write embedding hoistableChunks
    var hoistableChunks = renderState.hoistableChunks;
    for (i = 0; i < hoistableChunks.length; i++) {
        (0, ReactServerStreamConfig_1.writeChunk)(destination, hoistableChunks[i]);
    }
    hoistableChunks.length = 0;
}
exports.writeHoistables = writeHoistables;
function writePostamble(destination, resumableState) {
    if (resumableState.hasBody) {
        (0, ReactServerStreamConfig_1.writeChunk)(destination, endChunkForTag("body"));
    }
    if (resumableState.hasHtml) {
        (0, ReactServerStreamConfig_1.writeChunk)(destination, endChunkForTag("html"));
    }
}
exports.writePostamble = writePostamble;
var arrayFirstOpenBracket = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("[");
var arraySubsequentOpenBracket = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(",[");
var arrayInterstitial = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)(",");
var arrayCloseBracket = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("]");
// This function writes a 2D array of strings to be embedded in javascript.
// E.g.
//  [["JS_escaped_string1", "JS_escaped_string2"]]
function writeStyleResourceDependenciesInJS(destination, boundaryResources) {
    (0, ReactServerStreamConfig_1.writeChunk)(destination, arrayFirstOpenBracket);
    var nextArrayOpenBrackChunk = arrayFirstOpenBracket;
    boundaryResources.stylesheets.forEach(function (resource) {
        if (resource.state === PREAMBLE) { // We can elide this dependency because it was flushed in the shell and
            // should be ready before content is shown on the client
        }
        else if (resource.state === LATE) {
            // We only need to emit the href because this resource flushed in an earlier
            // boundary already which encoded the attributes necessary to construct
            // the resource instance on the client.
            (0, ReactServerStreamConfig_1.writeChunk)(destination, nextArrayOpenBrackChunk);
            writeStyleResourceDependencyHrefOnlyInJS(destination, resource.props.href);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, arrayCloseBracket);
            nextArrayOpenBrackChunk = arraySubsequentOpenBracket;
        }
        else {
            // We need to emit the whole resource for insertion on the client
            (0, ReactServerStreamConfig_1.writeChunk)(destination, nextArrayOpenBrackChunk);
            writeStyleResourceDependencyInJS(destination, resource.props.href, resource.props["data-precedence"], resource.props);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, arrayCloseBracket);
            nextArrayOpenBrackChunk = arraySubsequentOpenBracket;
            resource.state = LATE;
        }
    });
    (0, ReactServerStreamConfig_1.writeChunk)(destination, arrayCloseBracket);
}
/* Helper functions */
function writeStyleResourceDependencyHrefOnlyInJS(destination, href) {
    // We should actually enforce this earlier when the resource is created but for
    // now we make sure we are actually dealing with a string here.
    if (__DEV__) {
        (0, check_string_coercion_1.checkAttributeStringCoercion)(href, "href");
    }
    var coercedHref = "" + href;
    (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)(escapeJSObjectForInstructionScripts(coercedHref)));
}
function writeStyleResourceDependencyInJS(destination, href, precedence, props) {
    // eslint-disable-next-line react-internal/safe-string-coercion
    var coercedHref = (0, sanitizeURL_1.default)("" + href);
    (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)(escapeJSObjectForInstructionScripts(coercedHref)));
    if (__DEV__) {
        (0, check_string_coercion_1.checkAttributeStringCoercion)(precedence, "precedence");
    }
    var coercedPrecedence = "" + precedence;
    (0, ReactServerStreamConfig_1.writeChunk)(destination, arrayInterstitial);
    (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)(escapeJSObjectForInstructionScripts(coercedPrecedence)));
    for (var propKey in props) {
        if (has_own_property_1.default.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
                continue;
            }
            switch (propKey) {
                case "href":
                case "rel":
                case "precedence":
                case "data-precedence": {
                    break;
                }
                case "children":
                case "dangerouslySetInnerHTML":
                    throw new Error("".concat("link", " is a self-closing tag and must neither have `children` nor ") + "use `dangerouslySetInnerHTML`.");
                default:
                    writeStyleResourceAttributeInJS(destination, propKey, propValue);
                    break;
            }
        }
    }
    return null;
}
function writeStyleResourceAttributeInJS(destination, name, value) {
    var attributeName = name.toLowerCase();
    var attributeValue;
    switch (typeof value) {
        case "function":
        case "symbol":
            return;
    }
    switch (name) {
        // Reserved names
        case "innerHTML":
        case "dangerouslySetInnerHTML":
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "style":
            // Ignored
            return;
        // Attribute renames
        case "className": {
            attributeName = "class";
            if (__DEV__) {
                (0, check_string_coercion_1.checkAttributeStringCoercion)(value, attributeName);
            }
            attributeValue = "" + value;
            break;
        }
        // Booleans
        case "hidden": {
            if (value === false) {
                return;
            }
            attributeValue = "";
            break;
        }
        // Santized URLs
        case "src":
        case "href": {
            value = (0, sanitizeURL_1.default)(value);
            if (__DEV__) {
                (0, check_string_coercion_1.checkAttributeStringCoercion)(value, attributeName);
            }
            attributeValue = "" + value;
            break;
        }
        default: {
            if ( // unrecognized event handlers are not SSR'd and we (apparently)
            // use on* as hueristic for these handler props
            name.length > 2 && (name[0] === "o" || name[0] === "O") && (name[1] === "n" || name[1] === "N")) {
                return;
            }
            if (!(0, isAttributeNameSafe_1.default)(name)) {
                return;
            }
            if (__DEV__) {
                (0, check_string_coercion_1.checkAttributeStringCoercion)(value, attributeName);
            }
            attributeValue = "" + value;
        }
    }
    (0, ReactServerStreamConfig_1.writeChunk)(destination, arrayInterstitial);
    (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)(escapeJSObjectForInstructionScripts(attributeName)));
    (0, ReactServerStreamConfig_1.writeChunk)(destination, arrayInterstitial);
    (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)(escapeJSObjectForInstructionScripts(attributeValue)));
}
// This function writes a 2D array of strings to be embedded in an attribute
// value and read with JSON.parse in ReactDOMServerExternalRuntime.js
// E.g.
//  [[&quot;JSON_escaped_string1&quot;, &quot;JSON_escaped_string2&quot;]]
function writeStyleResourceDependenciesInAttr(destination, boundaryResources) {
    (0, ReactServerStreamConfig_1.writeChunk)(destination, arrayFirstOpenBracket);
    var nextArrayOpenBrackChunk = arrayFirstOpenBracket;
    boundaryResources.stylesheets.forEach(function (resource) {
        if (resource.state === PREAMBLE) { // We can elide this dependency because it was flushed in the shell and
            // should be ready before content is shown on the client
        }
        else if (resource.state === LATE) {
            // We only need to emit the href because this resource flushed in an earlier
            // boundary already which encoded the attributes necessary to construct
            // the resource instance on the client.
            (0, ReactServerStreamConfig_1.writeChunk)(destination, nextArrayOpenBrackChunk);
            writeStyleResourceDependencyHrefOnlyInAttr(destination, resource.props.href);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, arrayCloseBracket);
            nextArrayOpenBrackChunk = arraySubsequentOpenBracket;
        }
        else {
            // We need to emit the whole resource for insertion on the client
            (0, ReactServerStreamConfig_1.writeChunk)(destination, nextArrayOpenBrackChunk);
            writeStyleResourceDependencyInAttr(destination, resource.props.href, resource.props["data-precedence"], resource.props);
            (0, ReactServerStreamConfig_1.writeChunk)(destination, arrayCloseBracket);
            nextArrayOpenBrackChunk = arraySubsequentOpenBracket;
            resource.state = LATE;
        }
    });
    (0, ReactServerStreamConfig_1.writeChunk)(destination, arrayCloseBracket);
}
/* Helper functions */
function writeStyleResourceDependencyHrefOnlyInAttr(destination, href) {
    // We should actually enforce this earlier when the resource is created but for
    // now we make sure we are actually dealing with a string here.
    if (__DEV__) {
        (0, check_string_coercion_1.checkAttributeStringCoercion)(href, "href");
    }
    var coercedHref = "" + href;
    (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(JSON.stringify(coercedHref))));
}
function writeStyleResourceDependencyInAttr(destination, href, precedence, props) {
    // eslint-disable-next-line react-internal/safe-string-coercion
    var coercedHref = (0, sanitizeURL_1.default)("" + href);
    (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(JSON.stringify(coercedHref))));
    if (__DEV__) {
        (0, check_string_coercion_1.checkAttributeStringCoercion)(precedence, "precedence");
    }
    var coercedPrecedence = "" + precedence;
    (0, ReactServerStreamConfig_1.writeChunk)(destination, arrayInterstitial);
    (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(JSON.stringify(coercedPrecedence))));
    for (var propKey in props) {
        if (has_own_property_1.default.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
                continue;
            }
            switch (propKey) {
                case "href":
                case "rel":
                case "precedence":
                case "data-precedence": {
                    break;
                }
                case "children":
                case "dangerouslySetInnerHTML":
                    throw new Error("".concat("link", " is a self-closing tag and must neither have `children` nor ") + "use `dangerouslySetInnerHTML`.");
                default:
                    writeStyleResourceAttributeInAttr(destination, propKey, propValue);
                    break;
            }
        }
    }
    return null;
}
function writeStyleResourceAttributeInAttr(destination, name, value) {
    var attributeName = name.toLowerCase();
    var attributeValue;
    switch (typeof value) {
        case "function":
        case "symbol":
            return;
    }
    switch (name) {
        // Reserved names
        case "innerHTML":
        case "dangerouslySetInnerHTML":
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "style":
            // Ignored
            return;
        // Attribute renames
        case "className": {
            attributeName = "class";
            if (__DEV__) {
                (0, check_string_coercion_1.checkAttributeStringCoercion)(value, attributeName);
            }
            attributeValue = "" + value;
            break;
        }
        // Booleans
        case "hidden": {
            if (value === false) {
                return;
            }
            attributeValue = "";
            break;
        }
        // Santized URLs
        case "src":
        case "href": {
            value = (0, sanitizeURL_1.default)(value);
            if (__DEV__) {
                (0, check_string_coercion_1.checkAttributeStringCoercion)(value, attributeName);
            }
            attributeValue = "" + value;
            break;
        }
        default: {
            if ( // unrecognized event handlers are not SSR'd and we (apparently)
            // use on* as hueristic for these handler props
            name.length > 2 && (name[0] === "o" || name[0] === "O") && (name[1] === "n" || name[1] === "N")) {
                return;
            }
            if (!(0, isAttributeNameSafe_1.default)(name)) {
                return;
            }
            if (__DEV__) {
                (0, check_string_coercion_1.checkAttributeStringCoercion)(value, attributeName);
            }
            attributeValue = "" + value;
        }
    }
    (0, ReactServerStreamConfig_1.writeChunk)(destination, arrayInterstitial);
    (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(JSON.stringify(attributeName))));
    (0, ReactServerStreamConfig_1.writeChunk)(destination, arrayInterstitial);
    (0, ReactServerStreamConfig_1.writeChunk)(destination, (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(JSON.stringify(attributeValue))));
}
var PENDING = 0;
var PRELOADED = 1;
var PREAMBLE = 2;
var LATE = 3;
function createBoundaryResources() {
    return {
        styles: new Set(),
        stylesheets: new Set()
    };
}
exports.createBoundaryResources = createBoundaryResources;
function setCurrentlyRenderingBoundaryResourcesTarget(renderState, boundaryResources) {
    renderState.boundaryResources = boundaryResources;
}
exports.setCurrentlyRenderingBoundaryResourcesTarget = setCurrentlyRenderingBoundaryResourcesTarget;
function getResourceKey(href) {
    return href;
}
function getImageResourceKey(href, imageSrcSet, imageSizes) {
    if (imageSrcSet) {
        return imageSrcSet + "\n" + (imageSizes || "");
    }
    return href;
}
function prefetchDNS(href) {
    if (!react_feature_flags_1.enableFloat) {
        return;
    }
    var request = (0, ReactFizzServer_1.resolveRequest)();
    if (!request) {
        // In async contexts we can sometimes resolve resources from AsyncLocalStorage. If we can't we can also
        // possibly get them from the stack if we are not in an async context. Since we were not able to resolve
        // the resources for this call in either case we opt to do nothing. We can consider making this a warning
        // but there may be times where calling a function outside of render is intentional (i.e. to warm up data
        // fetching) and we don't want to warn in those cases.
        return;
    }
    var resumableState = (0, ReactFizzServer_1.getResumableState)(request);
    var renderState = (0, ReactFizzServer_1.getRenderState)(request);
    if (typeof href === "string" && href) {
        var key = getResourceKey(href);
        if (!resumableState.dnsResources.hasOwnProperty(key)) {
            var resource = [];
            resumableState.dnsResources[key] = EXISTS;
            pushLinkImpl(resource, {
                href: href,
                rel: "dns-prefetch"
            });
            renderState.preconnects.add(resource);
        }
        (0, ReactFizzServer_1.flushResources)(request);
    }
}
function preconnect(href, crossOrigin) {
    if (!react_feature_flags_1.enableFloat) {
        return;
    }
    var request = (0, ReactFizzServer_1.resolveRequest)();
    if (!request) {
        // In async contexts we can sometimes resolve resources from AsyncLocalStorage. If we can't we can also
        // possibly get them from the stack if we are not in an async context. Since we were not able to resolve
        // the resources for this call in either case we opt to do nothing. We can consider making this a warning
        // but there may be times where calling a function outside of render is intentional (i.e. to warm up data
        // fetching) and we don't want to warn in those cases.
        return;
    }
    var resumableState = (0, ReactFizzServer_1.getResumableState)(request);
    var renderState = (0, ReactFizzServer_1.getRenderState)(request);
    if (typeof href === "string" && href) {
        var resources = crossOrigin === "use-credentials" ? resumableState.connectResources.credentials : typeof crossOrigin === "string" ? resumableState.connectResources.anonymous : resumableState.connectResources.default;
        var key = getResourceKey(href);
        if (!resources.hasOwnProperty(key)) {
            var resource = [];
            resources[key] = EXISTS;
            pushLinkImpl(resource, {
                rel: "preconnect",
                href: href,
                crossOrigin: crossOrigin
            });
            renderState.preconnects.add(resource);
        }
        (0, ReactFizzServer_1.flushResources)(request);
    }
}
function preload(href, as, options) {
    if (!react_feature_flags_1.enableFloat) {
        return;
    }
    var request = (0, ReactFizzServer_1.resolveRequest)();
    if (!request) {
        // In async contexts we can sometimes resolve resources from AsyncLocalStorage. If we can't we can also
        // possibly get them from the stack if we are not in an async context. Since we were not able to resolve
        // the resources for this call in either case we opt to do nothing. We can consider making this a warning
        // but there may be times where calling a function outside of render is intentional (i.e. to warm up data
        // fetching) and we don't want to warn in those cases.
        return;
    }
    var resumableState = (0, ReactFizzServer_1.getResumableState)(request);
    var renderState = (0, ReactFizzServer_1.getRenderState)(request);
    if (as && href) {
        switch (as) {
            case "image": {
                var imageSrcSet = void 0, imageSizes = void 0, fetchPriority = void 0;
                if (options) {
                    imageSrcSet = options.imageSrcSet;
                    imageSizes = options.imageSizes;
                    fetchPriority = options.fetchPriority;
                }
                var key = getImageResourceKey(href, imageSrcSet, imageSizes);
                if (resumableState.imageResources.hasOwnProperty(key)) {
                    // we can return if we already have this resource
                    return;
                }
                resumableState.imageResources[key] = PRELOAD_NO_CREDS;
                var resource = [];
                pushLinkImpl(resource, Object.assign({
                    rel: "preload",
                    // There is a bug in Safari where imageSrcSet is not respected on preload links
                    // so we omit the href here if we have imageSrcSet b/c safari will load the wrong image.
                    // This harms older browers that do not support imageSrcSet by making their preloads not work
                    // but this population is shrinking fast and is already small so we accept this tradeoff.
                    href: imageSrcSet ? undefined : href,
                    as: as
                }, options));
                if (fetchPriority === "high") {
                    renderState.highImagePreloads.add(resource);
                }
                else {
                    renderState.bulkPreloads.add(resource);
                    // Stash the resource in case we need to promote it to higher priority
                    // when an img tag is rendered
                    renderState.preloads.images.set(key, resource);
                }
                break;
            }
            case "style": {
                var key = getResourceKey(href);
                if (resumableState.styleResources.hasOwnProperty(key)) {
                    // we can return if we already have this resource
                    return;
                }
                var resource = [];
                pushLinkImpl(resource, Object.assign({
                    rel: "preload",
                    href: href,
                    as: as
                }, options));
                resumableState.styleResources[key] = options && (typeof options.crossOrigin === "string" || typeof options.integrity === "string") ? [options.crossOrigin, options.integrity] : PRELOAD_NO_CREDS;
                renderState.preloads.stylesheets.set(key, resource);
                renderState.bulkPreloads.add(resource);
                break;
            }
            case "script": {
                var key = getResourceKey(href);
                if (resumableState.scriptResources.hasOwnProperty(key)) {
                    // we can return if we already have this resource
                    return;
                }
                var resource = [];
                renderState.preloads.scripts.set(key, resource);
                renderState.bulkPreloads.add(resource);
                pushLinkImpl(resource, Object.assign({
                    rel: "preload",
                    href: href,
                    as: as
                }, options));
                resumableState.scriptResources[key] = options && (typeof options.crossOrigin === "string" || typeof options.integrity === "string") ? [options.crossOrigin, options.integrity] : PRELOAD_NO_CREDS;
                break;
            }
            default: {
                var key = getResourceKey(href);
                var hasAsType = resumableState.unknownResources.hasOwnProperty(as);
                var resources = void 0;
                if (hasAsType) {
                    resources = resumableState.unknownResources[as];
                    if (resources.hasOwnProperty(key)) {
                        // we can return if we already have this resource
                        return;
                    }
                }
                else {
                    // Original
                    // resources = ({}: ResumableState['unknownResources']['asType']);
                    resources = {};
                    resumableState.unknownResources[as] = resources;
                }
                var resource = [];
                var props = Object.assign({
                    rel: "preload",
                    href: href,
                    as: as
                }, options);
                switch (as) {
                    case "font":
                        renderState.fontPreloads.add(resource);
                        break;
                    // intentional fall through
                    default:
                        renderState.bulkPreloads.add(resource);
                }
                pushLinkImpl(resource, props);
                resources[key] = PRELOAD_NO_CREDS;
            }
        }
        // If we got this far we created a new resource
        (0, ReactFizzServer_1.flushResources)(request);
    }
}
function preloadModule(href, options) {
    if (!react_feature_flags_1.enableFloat) {
        return;
    }
    var request = (0, ReactFizzServer_1.resolveRequest)();
    if (!request) {
        // In async contexts we can sometimes resolve resources from AsyncLocalStorage. If we can't we can also
        // possibly get them from the stack if we are not in an async context. Since we were not able to resolve
        // the resources for this call in either case we opt to do nothing. We can consider making this a warning
        // but there may be times where calling a function outside of render is intentional (i.e. to warm up data
        // fetching) and we don't want to warn in those cases.
        return;
    }
    var resumableState = (0, ReactFizzServer_1.getResumableState)(request);
    var renderState = (0, ReactFizzServer_1.getRenderState)(request);
    if (href) {
        var key = getResourceKey(href);
        var as = options && typeof options.as === "string" ? options.as : "script";
        var resource = void 0;
        switch (as) {
            case "script": {
                if (resumableState.moduleScriptResources.hasOwnProperty(key)) {
                    // we can return if we already have this resource
                    return;
                }
                resource = [];
                resumableState.moduleScriptResources[key] = options && (typeof options.crossOrigin === "string" || typeof options.integrity === "string") ? [options.crossOrigin, options.integrity] : PRELOAD_NO_CREDS;
                renderState.preloads.moduleScripts.set(key, resource);
                break;
            }
            default: {
                var hasAsType = resumableState.moduleUnknownResources.hasOwnProperty(as);
                var resources = void 0;
                if (hasAsType) {
                    resources = resumableState.unknownResources[as];
                    if (resources.hasOwnProperty(key)) {
                        // we can return if we already have this resource
                        return;
                    }
                }
                else {
                    // Orignal resources = ({}: ResumableState['moduleUnknownResources']['asType']);
                    resources = {};
                    resumableState.moduleUnknownResources[as] = resources;
                }
                resource = [];
                resources[key] = PRELOAD_NO_CREDS;
            }
        }
        pushLinkImpl(resource, Object.assign({
            rel: "modulepreload",
            href: href
        }, options));
        renderState.bulkPreloads.add(resource);
        // If we got this far we created a new resource
        (0, ReactFizzServer_1.flushResources)(request);
    }
}
function preinitStyle(href, precedence, options) {
    if (!react_feature_flags_1.enableFloat) {
        return;
    }
    var request = (0, ReactFizzServer_1.resolveRequest)();
    if (!request) {
        // In async contexts we can sometimes resolve resources from AsyncLocalStorage. If we can't we can also
        // possibly get them from the stack if we are not in an async context. Since we were not able to resolve
        // the resources for this call in either case we opt to do nothing. We can consider making this a warning
        // but there may be times where calling a function outside of render is intentional (i.e. to warm up data
        // fetching) and we don't want to warn in those cases.
        return;
    }
    var resumableState = (0, ReactFizzServer_1.getResumableState)(request);
    var renderState = (0, ReactFizzServer_1.getRenderState)(request);
    if (href) {
        precedence = precedence || "default";
        var key = getResourceKey(href);
        var styleQueue = renderState.styles.get(precedence);
        var hasKey = resumableState.styleResources.hasOwnProperty(key);
        var resourceState = hasKey ? resumableState.styleResources[key] : undefined;
        if (resourceState !== EXISTS) {
            // We are going to create this resource now so it is marked as Exists
            resumableState.styleResources[key] = EXISTS;
            // If this is the first time we've encountered this precedence we need
            // to create a StyleQueue
            if (!styleQueue) {
                styleQueue = {
                    precedence: (0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(precedence)),
                    rules: [],
                    hrefs: [],
                    sheets: new Map()
                };
                renderState.styles.set(precedence, styleQueue);
            }
            var resource = {
                state: PENDING,
                props: Object.assign({
                    rel: "stylesheet",
                    href: href,
                    "data-precedence": precedence
                }, options)
            };
            if (resourceState) {
                // When resourceState is truty it is a Preload state. We cast it for clarity
                var preloadState = resourceState;
                if (preloadState.length === 2) {
                    adoptPreloadCredentials(resource.props, preloadState);
                }
                var preloadResource = renderState.preloads.stylesheets.get(key);
                if (preloadResource && preloadResource.length > 0) {
                    // The Preload for this resource was created in this render pass and has not flushed yet so
                    // we need to clear it to avoid it flushing.
                    preloadResource.length = 0;
                }
                else {
                    // Either the preload resource from this render already flushed in this render pass
                    // or the preload flushed in a prior pass (prerender). In either case we need to mark
                    // this resource as already having been preloaded.
                    resource.state = PRELOADED;
                }
            }
            else { // We don't need to check whether a preloadResource exists in the renderState
                // because if it did exist then the resourceState would also exist and we would
                // have hit the primary if condition above.
            }
            // We add the newly created resource to our StyleQueue and if necessary
            // track the resource with the currently rendering boundary
            styleQueue.sheets.set(key, resource);
            // Notify the request that there are resources to flush even if no work is currently happening
            (0, ReactFizzServer_1.flushResources)(request);
        }
    }
}
function preinitScript(src, options) {
    if (!react_feature_flags_1.enableFloat) {
        return;
    }
    var request = (0, ReactFizzServer_1.resolveRequest)();
    if (!request) {
        // In async contexts we can sometimes resolve resources from AsyncLocalStorage. If we can't we can also
        // possibly get them from the stack if we are not in an async context. Since we were not able to resolve
        // the resources for this call in either case we opt to do nothing. We can consider making this a warning
        // but there may be times where calling a function outside of render is intentional (i.e. to warm up data
        // fetching) and we don't want to warn in those cases.
        return;
    }
    var resumableState = (0, ReactFizzServer_1.getResumableState)(request);
    var renderState = (0, ReactFizzServer_1.getRenderState)(request);
    if (src) {
        var key = getResourceKey(src);
        var hasKey = resumableState.scriptResources.hasOwnProperty(key);
        var resourceState = hasKey ? resumableState.scriptResources[key] : undefined;
        if (resourceState !== EXISTS) {
            // We are going to create this resource now so it is marked as Exists
            resumableState.scriptResources[key] = EXISTS;
            var props = Object.assign({
                src: src,
                async: true
            }, options);
            if (resourceState) {
                // When resourceState is truty it is a Preload state. We cast it for clarity
                var preloadState = resourceState;
                if (preloadState.length === 2) {
                    adoptPreloadCredentials(props, preloadState);
                }
                var preloadResource = renderState.preloads.scripts.get(key);
                if (preloadResource) {
                    // the preload resource exists was created in this render. Now that we have
                    // a script resource which will emit earlier than a preload would if it
                    // hasn't already flushed we prevent it from flushing by zeroing the length
                    preloadResource.length = 0;
                }
            }
            var resource = [];
            // Add to the script flushing queue
            renderState.scripts.add(resource);
            // encode the tag as Chunks
            pushScriptImpl(resource, props);
            // Notify the request that there are resources to flush even if no work is currently happening
            (0, ReactFizzServer_1.flushResources)(request);
        }
        return;
    }
}
function preinitModuleScript(src, options) {
    if (!react_feature_flags_1.enableFloat) {
        return;
    }
    var request = (0, ReactFizzServer_1.resolveRequest)();
    if (!request) {
        // In async contexts we can sometimes resolve resources from AsyncLocalStorage. If we can't we can also
        // possibly get them from the stack if we are not in an async context. Since we were not able to resolve
        // the resources for this call in either case we opt to do nothing. We can consider making this a warning
        // but there may be times where calling a function outside of render is intentional (i.e. to warm up data
        // fetching) and we don't want to warn in those cases.
        return;
    }
    var resumableState = (0, ReactFizzServer_1.getResumableState)(request);
    var renderState = (0, ReactFizzServer_1.getRenderState)(request);
    if (src) {
        var key = getResourceKey(src);
        var hasKey = resumableState.moduleScriptResources.hasOwnProperty(key);
        var resourceState = hasKey ? resumableState.moduleScriptResources[key] : undefined;
        if (resourceState !== EXISTS) {
            // We are going to create this resource now so it is marked as Exists
            resumableState.moduleScriptResources[key] = EXISTS;
            var props = Object.assign({
                src: src,
                type: "module",
                async: true
            }, options);
            if (resourceState) {
                // When resourceState is truty it is a Preload state. We cast it for clarity
                var preloadState = resourceState;
                if (preloadState.length === 2) {
                    adoptPreloadCredentials(props, preloadState);
                }
                var preloadResource = renderState.preloads.moduleScripts.get(key);
                if (preloadResource) {
                    // the preload resource exists was created in this render. Now that we have
                    // a script resource which will emit earlier than a preload would if it
                    // hasn't already flushed we prevent it from flushing by zeroing the length
                    preloadResource.length = 0;
                }
            }
            var resource = [];
            // Add to the script flushing queue
            renderState.scripts.add(resource);
            // encode the tag as Chunks
            pushScriptImpl(resource, props);
            // Notify the request that there are resources to flush even if no work is currently happening
            (0, ReactFizzServer_1.flushResources)(request);
        }
        return;
    }
}
// This function is only safe to call at Request start time since it assumes
// that each module has not already been preloaded. If we find a need to preload
// scripts at any other point in time we will need to check whether the preload
// already exists and not assume it
function preloadBootstrapScriptOrModule(resumableState, renderState, href, props) {
    if (!react_feature_flags_1.enableFloat) {
        return;
    }
    var key = getResourceKey(href);
    if (__DEV__) {
        if (resumableState.scriptResources.hasOwnProperty(key) || resumableState.moduleScriptResources.hasOwnProperty(key)) {
            // This is coded as a React error because it should be impossible for a userspace preload to preempt this call
            // If a userspace preload can preempt it then this assumption is broken and we need to reconsider this strategy
            // rather than instruct the user to not preload their bootstrap scripts themselves
            console.error("Internal React Error: React expected bootstrap script or module with src \"%s\" to not have been preloaded already. please file an issue", href);
        }
    }
    // The href used for bootstrap scripts and bootstrap modules should never be
    // used to preinit the resource. If a script can be preinited then it shouldn't
    // be a bootstrap script/module and if it is a bootstrap script/module then it
    // must not be safe to emit early. To avoid possibly allowing for preinits of
    // bootstrap scripts/modules we occlude these keys.
    resumableState.scriptResources[key] = EXISTS;
    resumableState.moduleScriptResources[key] = EXISTS;
    var resource = [];
    pushLinkImpl(resource, props);
    renderState.bootstrapScripts.add(resource);
}
function internalPreinitScript(resumableState, renderState, src, chunks) {
    var key = getResourceKey(src);
    if (!resumableState.scriptResources.hasOwnProperty(key)) {
        var resource = chunks;
        resumableState.scriptResources[key] = EXISTS;
        renderState.scripts.add(resource);
    }
    return;
}
function preloadAsStylePropsFromProps(href, props) {
    return {
        rel: "preload",
        as: "style",
        href: href,
        crossOrigin: props.crossOrigin,
        fetchPriority: props.fetchPriority,
        integrity: props.integrity,
        media: props.media,
        hrefLang: props.hrefLang,
        referrerPolicy: props.referrerPolicy
    };
}
function stylesheetPropsFromRawProps(rawProps) {
    return __assign(__assign({}, rawProps), { "data-precedence": rawProps.precedence, precedence: null });
}
function adoptPreloadCredentials(target, preloadState) {
    if (target.crossOrigin == null)
        target.crossOrigin = preloadState[0];
    if (target.integrity == null)
        target.integrity = preloadState[1];
}
function hoistStyleQueueDependency(styleQueue) {
    this.styles.add(styleQueue);
}
function hoistStylesheetDependency(stylesheet) {
    this.stylesheets.add(stylesheet);
}
function hoistResources(renderState, source) {
    var currentBoundaryResources = renderState.boundaryResources;
    if (currentBoundaryResources) {
        source.styles.forEach(hoistStyleQueueDependency, currentBoundaryResources);
        source.stylesheets.forEach(hoistStylesheetDependency, currentBoundaryResources);
    }
}
exports.hoistResources = hoistResources;
exports.NotPendingTransition = ReactDOMFormActions_1.NotPending;
