"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFastHash = exports.closeWithError = exports.byteLengthOfBinaryChunk = exports.byteLengthOfChunk = exports.clonePrecomputedChunk = exports.typedArrayToBinaryChunk = exports.stringToPrecomputedChunk = exports.stringToChunk = exports.close = exports.completeWriting = exports.writeChunkAndReturn = exports.writeChunk = exports.beginWriting = exports.flushBuffered = exports.scheduleWork = void 0;
opaque;
opaque;
opaque;
function scheduleWork(callback) {
    callback();
}
exports.scheduleWork = scheduleWork;
function flushBuffered(destination) {
}
exports.flushBuffered = flushBuffered;
function beginWriting(destination) {
}
exports.beginWriting = beginWriting;
function writeChunk(destination, chunk) {
    writeChunkAndReturn(destination, chunk);
}
exports.writeChunk = writeChunk;
function writeChunkAndReturn(destination, chunk) {
    return destination.push(chunk);
}
exports.writeChunkAndReturn = writeChunkAndReturn;
function completeWriting(destination) {
}
exports.completeWriting = completeWriting;
function close(destination) {
    destination.push(null);
}
exports.close = close;
function stringToChunk(content) {
    return content;
}
exports.stringToChunk = stringToChunk;
function stringToPrecomputedChunk(content) {
    return content;
}
exports.stringToPrecomputedChunk = stringToPrecomputedChunk;
function typedArrayToBinaryChunk(content) {
    throw new Error('Not implemented.');
}
exports.typedArrayToBinaryChunk = typedArrayToBinaryChunk;
function clonePrecomputedChunk(chunk) {
    return chunk;
}
exports.clonePrecomputedChunk = clonePrecomputedChunk;
function byteLengthOfChunk(chunk) {
    throw new Error('Not implemented.');
}
exports.byteLengthOfChunk = byteLengthOfChunk;
function byteLengthOfBinaryChunk(chunk) {
    throw new Error('Not implemented.');
}
exports.byteLengthOfBinaryChunk = byteLengthOfBinaryChunk;
function closeWithError(destination, error) {
    // $FlowFixMe[incompatible-call]: This is an Error object or the destination accepts other types.
    destination.destroy(error);
}
exports.closeWithError = closeWithError;
var createFastHashJS_1 = require("react-server/src/createFastHashJS");
Object.defineProperty(exports, "createFastHash", { enumerable: true, get: function () { return createFastHashJS_1.createFastHashJS; } });
