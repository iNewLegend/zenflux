import path from "node:path";
import util from "node:util";

const MODULE_NOT_FOUND_ERROR = "Module not found:";

/**
 * Generates a module not found Error
 * @param {string} modulePath
 * @param {import("node:vm").Module} referencingModule
 * @returns {Error}
 */
function generateModuleNotFound( modulePath, referencingModule ) {
    return new Error(
        `${ MODULE_NOT_FOUND_ERROR } ${ util.inspect( modulePath ) } referer ${ util.inspect( "file://" + referencingModule.identifier ) }`
    );
}

/**
 * @param {Object} result
 * @returns {Object} Contains the `type` and `newModulePath` properties.
 */
function resolveModuleTypeAndPath( result ) {
    const ext = path.extname( result.resolvedPath );
    switch ( result.provider.name ) {
        case "node":
            return resolveNodeModule( ext, result );
        case "workspace":
        case "relative":
        case "ts-paths":
        case "tsnode-esm":
        case "swc":
            return {
                type: ext === ".json" ? "json" : "esm",
                newModulePath: result.resolvedPath
            };
        default:
            throw new Error( `Unknown provider: ${ util.inspect( result.provider.name ) }`, { cause: result } );
    }
}

/**
 * Handles node module type and path resolution
 * @param {string} ext The file extension
 * @param {Object} result The result object
 * @returns {Object} Contains the `type` and `newModulePath` properties.
 */
function resolveNodeModule( ext, result ) {
    if ( ext === ".json" ) {
        return { type: "json", newModulePath: result.resolvedPath };
    } else if ( ext === ".ts" ) {
        return { type: "esm", newModulePath: result.resolvedPath };
    } else {
        return { type: "node", newModulePath: result.modulePath };
    }
}

/**
 * @param {string} entrypointPath
 * @param {Loaders} loaders
 * @param {Resolvers} resolvers
 */
export function auto( entrypointPath, loaders, resolvers ) {
    // Defer to next tick to allow all providers to load.
    return new Promise( ( resolve, reject ) => {
        setTimeout( () => {
            const linkModule = async ( modulePath, referencingModule ) => {
                const result = await resolvers.try( modulePath, referencingModule ).resolve();

                if ( result.provider ) {
                    const { type, newModulePath } = resolveModuleTypeAndPath( result );

                    return loaders.loadModule( newModulePath, type, referencingModule, linkModule );
                }

                throw generateModuleNotFound( modulePath, referencingModule );
            };

            loaders.loadModule( entrypointPath, "esm", null, linkModule )
                .then( resolve )
                .catch( reject );
        } );
    } );
}
