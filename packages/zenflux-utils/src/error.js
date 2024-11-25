import * as util from "node:util";

// Util.inspect options to ensure the formatting matches your desired output
const inspectOptions = {
    depth: null,
    maxArrayLength: null,
    breakLength: 80, // Adjust according to your needs
    compact: false,
    sorted: true,
};

/**
 * Generates a new error instance with additional metadata and optional cause.
 *
 * @param {string} message - The error message to be associated with the error.
 * @param {Object} meta - Additional metadata to include in the error.
 * @param {Error} [cause] - An optional error that caused this error.
 *
 * @return {Error} A new error instance encapsulating the message, metadata, and optionally a cause.
 */
class ErrorWithMeta extends Error {
    meta = {};

    constructor( message, meta, cause = undefined ) {
        if ( meta.deepStack ) {
            // Remove duplicated items.
            meta.deepStack = new Set( meta.deepStack )
                .values()
                .toArray()
                // If item not starting with "file://" then add it to the item stack.
                .map( ( item ) => {
                    return item.startsWith( "file://" ) ? item : `file://${ item }`;
                } );
        }

        // Formatted metadata
        let formattedMeta = util.inspect( meta, inspectOptions );

        // Add spaces to each new line in the metadata string
        formattedMeta = formattedMeta.split( '\n' ).map( ( line, index ) => {
            return index === 0 ? line : '    ' + line;
        } ).join( '\n' );

        super( `${ message }, meta:\x1b[0m -> ${ formattedMeta }`, cause ?? { cause } );

        this.meta = meta;

        // Some error may come from another context, so we need to add the stack trace.
        if ( cause?.stack ) {
            if ( ! ( cause instanceof Error ) ) {
                this.stack += `\nCaused by: ${ cause.stack }`;
            } else if ( ! this.cause ) {
                this.cause = cause;
            }
        }
    }
}

export { ErrorWithMeta };
