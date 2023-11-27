export default function getActiveElement( doc?: Document | null | undefined ): Element | null | undefined {
    doc = doc || ( typeof document !== "undefined" ? document : undefined );

    if ( typeof doc === "undefined" ) {
        return null;
    }

    try {
        return doc.activeElement || doc.body;
    } catch ( e ) {
        return doc.body;
    }
}
