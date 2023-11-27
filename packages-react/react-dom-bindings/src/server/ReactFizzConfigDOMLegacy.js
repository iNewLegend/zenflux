"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotPendingTransition = exports.writeEndClientRenderedSuspenseBoundary = exports.writeEndCompletedSuspenseBoundary = exports.writeStartClientRenderedSuspenseBoundary = exports.writeStartCompletedSuspenseBoundary = exports.pushSegmentFinale = exports.pushTextInstance = exports.resetResumableState = exports.prepareHostDispatcher = exports.setCurrentlyRenderingBoundaryResourcesTarget = exports.hoistResources = exports.writePostamble = exports.writeHoistables = exports.writePreamble = exports.createBoundaryResources = exports.createResumableState = exports.createRootFormatContext = exports.writeCompletedRoot = exports.writePlaceholder = exports.writeResourcesForBoundary = exports.writeEndPendingSuspenseBoundary = exports.writeStartPendingSuspenseBoundary = exports.writeClientRenderBoundaryInstruction = exports.writeCompletedBoundaryInstruction = exports.writeCompletedSegmentInstruction = exports.writeEndSegment = exports.writeStartSegment = exports.pushFormStateMarkerIsNotMatching = exports.pushFormStateMarkerIsMatching = exports.pushEndCompletedSuspenseBoundary = exports.pushStartCompletedSuspenseBoundary = exports.pushEndInstance = exports.pushStartInstance = exports.makeId = exports.getChildFormatContext = exports.doctypeChunk = exports.createRenderState = exports.isPrimaryRenderer = void 0;
var ReactServerStreamConfig_1 = require("react-server/src/ReactServerStreamConfig");
var ReactDOMFormActions_1 = require("../shared/ReactDOMFormActions");
var ReactFizzConfigDOM_1 = require("@zenflux/react-dom-bindings/src/server/ReactFizzConfigDOM");
var escapeTextForBrowser_1 = require("@zenflux/react-dom-bindings/src/server/escapeTextForBrowser");
exports.isPrimaryRenderer = false;
function createRenderState(resumableState, generateStaticMarkup) {
    var renderState = (0, ReactFizzConfigDOM_1.createRenderState)(resumableState, undefined, undefined, undefined, undefined, undefined, undefined);
    return {
        // Keep this in sync with ReactFizzConfigDOM
        placeholderPrefix: renderState.placeholderPrefix,
        segmentPrefix: renderState.segmentPrefix,
        boundaryPrefix: renderState.boundaryPrefix,
        startInlineScript: renderState.startInlineScript,
        htmlChunks: renderState.htmlChunks,
        headChunks: renderState.headChunks,
        externalRuntimeScript: renderState.externalRuntimeScript,
        bootstrapChunks: renderState.bootstrapChunks,
        charsetChunks: renderState.charsetChunks,
        preconnectChunks: renderState.preconnectChunks,
        importMapChunks: renderState.importMapChunks,
        preloadChunks: renderState.preloadChunks,
        hoistableChunks: renderState.hoistableChunks,
        preconnects: renderState.preconnects,
        fontPreloads: renderState.fontPreloads,
        highImagePreloads: renderState.highImagePreloads,
        // usedImagePreloads: renderState.usedImagePreloads,
        styles: renderState.styles,
        bootstrapScripts: renderState.bootstrapScripts,
        scripts: renderState.scripts,
        bulkPreloads: renderState.bulkPreloads,
        preloads: renderState.preloads,
        boundaryResources: renderState.boundaryResources,
        stylesToHoist: renderState.stylesToHoist,
        // This is an extra field for the legacy renderer
        generateStaticMarkup: generateStaticMarkup
    };
}
exports.createRenderState = createRenderState;
// this chunk is empty on purpose because we do not want to emit the DOCTYPE in legacy mode
exports.doctypeChunk = (0, ReactServerStreamConfig_1.stringToPrecomputedChunk)("");
var ReactFizzConfigDOM_2 = require("@zenflux/react-dom-bindings/src/server/ReactFizzConfigDOM");
Object.defineProperty(exports, "getChildFormatContext", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.getChildFormatContext; } });
Object.defineProperty(exports, "makeId", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.makeId; } });
Object.defineProperty(exports, "pushStartInstance", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.pushStartInstance; } });
Object.defineProperty(exports, "pushEndInstance", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.pushEndInstance; } });
Object.defineProperty(exports, "pushStartCompletedSuspenseBoundary", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.pushStartCompletedSuspenseBoundary; } });
Object.defineProperty(exports, "pushEndCompletedSuspenseBoundary", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.pushEndCompletedSuspenseBoundary; } });
Object.defineProperty(exports, "pushFormStateMarkerIsMatching", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.pushFormStateMarkerIsMatching; } });
Object.defineProperty(exports, "pushFormStateMarkerIsNotMatching", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.pushFormStateMarkerIsNotMatching; } });
Object.defineProperty(exports, "writeStartSegment", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.writeStartSegment; } });
Object.defineProperty(exports, "writeEndSegment", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.writeEndSegment; } });
Object.defineProperty(exports, "writeCompletedSegmentInstruction", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.writeCompletedSegmentInstruction; } });
Object.defineProperty(exports, "writeCompletedBoundaryInstruction", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.writeCompletedBoundaryInstruction; } });
Object.defineProperty(exports, "writeClientRenderBoundaryInstruction", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.writeClientRenderBoundaryInstruction; } });
Object.defineProperty(exports, "writeStartPendingSuspenseBoundary", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.writeStartPendingSuspenseBoundary; } });
Object.defineProperty(exports, "writeEndPendingSuspenseBoundary", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.writeEndPendingSuspenseBoundary; } });
Object.defineProperty(exports, "writeResourcesForBoundary", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.writeResourcesForBoundary; } });
Object.defineProperty(exports, "writePlaceholder", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.writePlaceholder; } });
Object.defineProperty(exports, "writeCompletedRoot", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.writeCompletedRoot; } });
Object.defineProperty(exports, "createRootFormatContext", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.createRootFormatContext; } });
Object.defineProperty(exports, "createResumableState", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.createResumableState; } });
Object.defineProperty(exports, "createBoundaryResources", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.createBoundaryResources; } });
Object.defineProperty(exports, "writePreamble", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.writePreamble; } });
Object.defineProperty(exports, "writeHoistables", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.writeHoistables; } });
Object.defineProperty(exports, "writePostamble", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.writePostamble; } });
Object.defineProperty(exports, "hoistResources", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.hoistResources; } });
Object.defineProperty(exports, "setCurrentlyRenderingBoundaryResourcesTarget", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.setCurrentlyRenderingBoundaryResourcesTarget; } });
Object.defineProperty(exports, "prepareHostDispatcher", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.prepareHostDispatcher; } });
Object.defineProperty(exports, "resetResumableState", { enumerable: true, get: function () { return ReactFizzConfigDOM_2.resetResumableState; } });
function pushTextInstance(target, text, renderState, textEmbedded) {
    if (renderState.generateStaticMarkup) {
        target.push((0, ReactServerStreamConfig_1.stringToChunk)((0, escapeTextForBrowser_1.default)(text)));
        return false;
    }
    else {
        return (0, ReactFizzConfigDOM_1.pushTextInstance)(target, text, renderState, textEmbedded);
    }
}
exports.pushTextInstance = pushTextInstance;
function pushSegmentFinale(target, renderState, lastPushedText, textEmbedded) {
    if (renderState.generateStaticMarkup) {
        return;
    }
    else {
        return (0, ReactFizzConfigDOM_1.pushSegmentFinale)(target, renderState, lastPushedText, textEmbedded);
    }
}
exports.pushSegmentFinale = pushSegmentFinale;
function writeStartCompletedSuspenseBoundary(destination, renderState) {
    if (renderState.generateStaticMarkup) {
        // A completed boundary is done and doesn't need a representation in the HTML
        // if we're not going to be hydrating it.
        return true;
    }
    return (0, ReactFizzConfigDOM_1.writeStartCompletedSuspenseBoundary)(destination, renderState);
}
exports.writeStartCompletedSuspenseBoundary = writeStartCompletedSuspenseBoundary;
function writeStartClientRenderedSuspenseBoundary(destination, renderState, // flushing these error arguments are not currently supported in this legacy streaming format.
errorDigest, errorMessage, errorComponentStack) {
    if (renderState.generateStaticMarkup) {
        // A client rendered boundary is done and doesn't need a representation in the HTML
        // since we'll never hydrate it. This is arguably an error in static generation.
        return true;
    }
    return (0, ReactFizzConfigDOM_1.writeStartClientRenderedSuspenseBoundary)(destination, renderState, errorDigest, errorMessage, errorComponentStack);
}
exports.writeStartClientRenderedSuspenseBoundary = writeStartClientRenderedSuspenseBoundary;
function writeEndCompletedSuspenseBoundary(destination, renderState) {
    if (renderState.generateStaticMarkup) {
        return true;
    }
    return (0, ReactFizzConfigDOM_1.writeEndCompletedSuspenseBoundary)(destination, renderState);
}
exports.writeEndCompletedSuspenseBoundary = writeEndCompletedSuspenseBoundary;
function writeEndClientRenderedSuspenseBoundary(destination, renderState) {
    if (renderState.generateStaticMarkup) {
        return true;
    }
    return (0, ReactFizzConfigDOM_1.writeEndClientRenderedSuspenseBoundary)(destination, renderState);
}
exports.writeEndClientRenderedSuspenseBoundary = writeEndClientRenderedSuspenseBoundary;
exports.NotPendingTransition = ReactDOMFormActions_1.NotPending;
