/**
 * Fix for node20
 *
 * Object: null prototype] {
 *   [Symbol(nodejs.util.inspect.custom)]: [Function: [nodejs.util.inspect.custom]]
 * }
 */
if ( process.version.startsWith( "v20" ) ) {
    setUncaughtExceptionCaptureCallback( console.error )
}
