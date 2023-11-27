"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getActiveElement(doc) {
    doc = doc || (typeof document !== "undefined" ? document : undefined);
    if (typeof doc === "undefined") {
        return null;
    }
    try {
        return doc.activeElement || doc.body;
    }
    catch (e) {
        return doc.body;
    }
}
exports.default = getActiveElement;