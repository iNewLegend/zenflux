export class ProviderBase {
    /**
     * @type {zVmModuleType}
     */
    type;

    static getType() {
        throw new Error( "Not implemented" );
    }

    constructor( args ) {
        this.args = args;
        this.type = this.constructor.getType();

        setTimeout( () => {
            this.initialize( args );
        } )
    }

    initialize() {}

    /**
     * @param {string} modulePath
     * @param {import("node:vm").Module} referencingModule
     * @param {zVmResolverMiddlewareCallback} middleware
     */
    async resolve( modulePath, referencingModule, middleware ) {
        throw new Error( "Not implemented" );
    }

    /**
     * @param {string} path
     * @param {zVmModuleLocalTextSourceOptions} [options]
     *
     * @return {zVmModule}
     */
    async load( path, options ) {
        throw new Error( "Not implemented" );
    }
}
