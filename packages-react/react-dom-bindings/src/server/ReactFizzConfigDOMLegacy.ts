import { stringToChunk, stringToPrecomputedChunk } from "react-server/src/ReactServerStreamConfig";

import { NotPending } from "../shared/ReactDOMFormActions";

import {
    createRenderState as createRenderStateImpl,
    pushSegmentFinale as pushSegmentFinaleImpl,
    pushTextInstance as pushTextInstanceImpl,
    writeEndClientRenderedSuspenseBoundary as writeEndClientRenderedSuspenseBoundaryImpl,
    writeEndCompletedSuspenseBoundary as writeEndCompletedSuspenseBoundaryImpl,
    writeStartClientRenderedSuspenseBoundary as writeStartClientRenderedSuspenseBoundaryImpl,
    writeStartCompletedSuspenseBoundary as writeStartCompletedSuspenseBoundaryImpl
} from "@zenflux/react-dom-bindings/src/server/ReactFizzConfigDOM";

import escapeTextForBrowser from "@zenflux/react-dom-bindings/src/server/escapeTextForBrowser";

import type {
    BoundaryResources,
    Resource,
    ResumableState,
    StyleQueue
} from "@zenflux/react-dom-bindings/src/server/ReactFizzConfigDOM";
import type { FormStatus } from "../shared/ReactDOMFormActions";
import type { Chunk, Destination, PrecomputedChunk } from "react-server/src/ReactServerStreamConfig";

export const isPrimaryRenderer = false;
export type RenderState = {
    // Keep this in sync with ReactFizzConfigDOM
    placeholderPrefix: PrecomputedChunk;
    segmentPrefix: PrecomputedChunk;
    boundaryPrefix: PrecomputedChunk;
    startInlineScript: PrecomputedChunk;
    htmlChunks: null | Array<Chunk | PrecomputedChunk>;
    headChunks: null | Array<Chunk | PrecomputedChunk>;
    externalRuntimeScript: null | any;
    bootstrapChunks: Array<Chunk | PrecomputedChunk>;
    charsetChunks: Array<Chunk | PrecomputedChunk>;
    preconnectChunks: Array<Chunk | PrecomputedChunk>;
    importMapChunks: Array<Chunk | PrecomputedChunk>;
    preloadChunks: Array<Chunk | PrecomputedChunk>;
    hoistableChunks: Array<Chunk | PrecomputedChunk>;
    preconnects: Set<Resource>;
    fontPreloads: Set<Resource>;
    highImagePreloads: Set<Resource>;
    // usedImagePreloads: Set<Resource>,
    styles: Map<string, StyleQueue>;
    bootstrapScripts: Set<Resource>;
    scripts: Set<Resource>;
    bulkPreloads: Set<Resource>;
    preloads: {
        images: Map<string, Resource>;
        stylesheets: Map<string, Resource>;
        scripts: Map<string, Resource>;
        moduleScripts: Map<string, Resource>;
    };
    boundaryResources: BoundaryResources | null | undefined;
    stylesToHoist: boolean;
    // This is an extra field for the legacy renderer
    generateStaticMarkup: boolean;
};

export function createRenderState( resumableState: ResumableState, generateStaticMarkup: boolean ): RenderState {
    const renderState = createRenderStateImpl( resumableState, undefined, undefined, undefined, undefined, undefined, undefined );
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
        generateStaticMarkup
    };
}

// this chunk is empty on purpose because we do not want to emit the DOCTYPE in legacy mode
export const doctypeChunk: PrecomputedChunk = stringToPrecomputedChunk( "" );
export type { ResumableState, BoundaryResources, FormatContext } from "@zenflux/react-dom-bindings/src/server/ReactFizzConfigDOM";
export {
    getChildFormatContext,
    makeId,
    pushStartInstance,
    pushEndInstance,
    pushStartCompletedSuspenseBoundary,
    pushEndCompletedSuspenseBoundary,
    pushFormStateMarkerIsMatching,
    pushFormStateMarkerIsNotMatching,
    writeStartSegment,
    writeEndSegment,
    writeCompletedSegmentInstruction,
    writeCompletedBoundaryInstruction,
    writeClientRenderBoundaryInstruction,
    writeStartPendingSuspenseBoundary,
    writeEndPendingSuspenseBoundary,
    writeResourcesForBoundary,
    writePlaceholder,
    writeCompletedRoot,
    createRootFormatContext,
    createResumableState,
    createBoundaryResources,
    writePreamble,
    writeHoistables,
    writePostamble,
    hoistResources,
    setCurrentlyRenderingBoundaryResourcesTarget,
    prepareHostDispatcher,
    resetResumableState
} from "@zenflux/react-dom-bindings/src/server/ReactFizzConfigDOM";

export function pushTextInstance( target: Array<Chunk | PrecomputedChunk>, text: string, renderState: RenderState, textEmbedded: boolean ): boolean {
    if ( renderState.generateStaticMarkup ) {
        target.push( stringToChunk( escapeTextForBrowser( text ) ) );
        return false;
    } else {
        return pushTextInstanceImpl( target, text, renderState, textEmbedded );
    }
}

export function pushSegmentFinale( target: Array<Chunk | PrecomputedChunk>, renderState: RenderState, lastPushedText: boolean, textEmbedded: boolean ): void {
    if ( renderState.generateStaticMarkup ) {
        return;
    } else {
        return pushSegmentFinaleImpl( target, renderState, lastPushedText, textEmbedded );
    }
}

export function writeStartCompletedSuspenseBoundary( destination: Destination, renderState: RenderState ): boolean {
    if ( renderState.generateStaticMarkup ) {
        // A completed boundary is done and doesn't need a representation in the HTML
        // if we're not going to be hydrating it.
        return true;
    }

    return writeStartCompletedSuspenseBoundaryImpl( destination, renderState );
}

export function writeStartClientRenderedSuspenseBoundary( destination: Destination, renderState: RenderState, // flushing these error arguments are not currently supported in this legacy streaming format.
                                                          errorDigest: string | null | undefined, errorMessage: string | null | undefined, errorComponentStack: string | null | undefined ): boolean {
    if ( renderState.generateStaticMarkup ) {
        // A client rendered boundary is done and doesn't need a representation in the HTML
        // since we'll never hydrate it. This is arguably an error in static generation.
        return true;
    }

    return writeStartClientRenderedSuspenseBoundaryImpl( destination, renderState, errorDigest, errorMessage, errorComponentStack );
}

export function writeEndCompletedSuspenseBoundary( destination: Destination, renderState: RenderState ): boolean {
    if ( renderState.generateStaticMarkup ) {
        return true;
    }

    return writeEndCompletedSuspenseBoundaryImpl( destination, renderState );
}

export function writeEndClientRenderedSuspenseBoundary( destination: Destination, renderState: RenderState ): boolean {
    if ( renderState.generateStaticMarkup ) {
        return true;
    }

    return writeEndClientRenderedSuspenseBoundaryImpl( destination, renderState );
}

export type TransitionStatus = FormStatus;
export const NotPendingTransition: TransitionStatus = NotPending;
