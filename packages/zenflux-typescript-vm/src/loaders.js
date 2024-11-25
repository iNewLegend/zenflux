/**
 * @author Leonid Vinikov <leonidvinikov@gmail.com>
 * TODO: Add switch to disable caching, should there be caching at all?
 */
import { isAbsolute } from "node:path";

import fs from "node:fs";
import util from "node:util";
import vm from "node:vm";

import { zCreateResolvablePromise } from "@zenflux/utils/src/promise";

import { checksum, verbose } from "./utils.js";
import { ErrorWithMeta } from "@zenflux/utils/src/error";


/**
 * TODO: Move to `zenflux/utils`.
 * Parses a single stack trace line into an object with the function name and source.
 * @param {string} stackTraceLine - A single line from a stack trace.
 * @returns {{function: string, source: string} | null} The parsed stack trace information, or null if the format is invalid.
 */
function parseStackTraceLine(stackTraceLine) {
    const regex = /^\s*at\s+(.*)\s+\((.*)\)$/;
    const match = stackTraceLine.trim().match(regex);

    if (match) {
        const [, functionName, source] = match;
        return { function: functionName, source: source };
    }

    return null;
}

/**
 * Parses a full stack trace into an array of objects with function names and sources.
 * @param {string} stackTrace - The full stack trace as a string.
 * @returns {Array<{function: string, source: string}>} The array of parsed stack trace information.
 */
function parseStackTrace(stackTrace) {
    return stackTrace
        .split('\n')
        .map(parseStackTraceLine)
        .filter(item => item !== null)
        .reverse()
}

export class Loaders {
    /**
     * @param {zVm} vm
     */
    constructor( vm ) {
        this.vm = vm;

        this.moduleRefererCache = new Map();
        this.moduleCache = new Map();
        this.modulePrepareCache = new Map();

        this.moduleProviders = new Map();

        this.vm.providers.forEach( provider => {
            if ( ! provider.type ) {
                return;
            }

            // If already registered, error
            if ( this.moduleProviders.has( provider.type ) ) {
                throw new Error( `Provider with name: ${ util.inspect( provider.name ) } cannot be registered, type: ${ util.inspect( provider.type ) } is already registered` );
            }

            // Register provider
            this.moduleProviders.set( provider.type, provider );
        } );
    }

    /**
     * @param {string} path
     * @param {zVmModuleType} type
     * @param {vm.Module} referencingModule
     * @param {vm.ModuleLinker} linkerCallback
     * @param {vm.ModuleLinker} [dynamicLinkerCallback]
     *
     * @return {Promise<vm.Module|vm.SyntheticModule>}
     */
    async loadModule( path, type, referencingModule, linkerCallback, dynamicLinkerCallback = linkerCallback ) {
        // TODO: Enable options for all moduleProviders, currently its fine.
        /**
         * @type {zVmModuleLocalTextSourceOptions}
         */
        const options = {
            referencingModule
        };

        if ( "esm" === type ) {
            options.moduleLinkerCallback = linkerCallback;
            options.moduleImportDynamically = dynamicLinkerCallback;
        }

        const capture = {};
        Error.captureStackTrace( capture );

        return this.loadModuleWithOptions( path, type, options ).catch( err => {
            const deepStack = [];

            if ( err.referencingModule?.identifier ) {
                deepStack.push( err.referencingModule?.identifier )
            }

            deepStack.push(
                ...parseStackTrace( capture.stack ).map( item => `${ item.source } function: ${ item.function }` ));

            const meta = {
                config: this.vm.config.paths,
                deepStack
            }

          if ( err.message ) {
              throw new ErrorWithMeta( "Error in @zenflux/typescript-vm, While loading module: `" + path + '`', meta, err );
            }

            throw new ErrorWithMeta( "Error in @zenflux/typescript-vm, While loading module: `" + err.modulePath + '` by `' + err.referencingModule?.identifier + '`', meta );
        } );
    }

    /**
     * @param {string} path
     * @param {zVmModuleType} type
     * @param {zVmModuleLocalTextSourceOptions} [options]
     *
     * @return {Promise<vm.Module|vm.SyntheticModule>}
     */
    async loadModuleWithOptions( path, type, options ) {
        const { cache = true } = options;

        let module;

        const id = this.getModuleId( path, type, options );

        if ( cache ) {
            /**
             * TODO: Find better solution for this
             *
             * Trying to get from cache if possible, some modules won't get synthesis till their dependencies are loaded
             * and if they depend one a module that depends on initial load module (circular dependency), it will cause a new module synthesis.
             */
            module = await this.getFromCache( id, path, type );

            if ( module ) {
                return module;
            }
        }

        this.setPrepareCache( id, path, type );

        const provider = this.moduleProviders.get( type );

        try {
            module = await provider.load( path );
        } catch ( err ) {
            if ( err.message ) {
                const deepStack = err.meta?.deepStack || [];

                deepStack.push( ...[
                    import.meta.url,
                    ( "file://" + options.referencingModule?.identifier ) || "",
                ] );

                err = new ErrorWithMeta( "Error in @zenflux/typescript-vm, While loading module: " + path, {
                    ...err.meta || {},
                    config: this.vm.config.paths,
                    deepStack
                }, err );
            }

            return Promise.reject( err );
        }

        switch ( type ) {
            case "node":
                module = await this.sanitizeModule( module, path, {
                    moduleType: "node",
                } );
                break;

            case "json":
                module = await this.sanitizeModule( module, path, {
                    moduleType: "json",
                } );
                break;

            case "esm":
                /**
                 * @type {zVmModuleEvaluateOptions}
                 */
                const evalOptions = {
                    moduleType: "esm",
                };

                if ( options ) {
                    evalOptions.moduleLocalTextSourceOptions = options;
                }

                module = await this.sanitizeModule( module, path, evalOptions );
                break;

            default:
                throw new Error( `Invalid module type: ${ util.inspect( type ) }` );
        }

        this.setToCache( id, path, type, module );

        return module;
    }

    /**
     * @param {zVmModuleSource} module
     * @param {string} path
     * @param {zVmModuleEvaluateOptions} options
     *h
     * @return {Promise<zVmModule>}
     */
    async sanitizeModule( module, path, options ) {
        const vmModule = await this.evaluateModule( module, path, options );

        if ( options.moduleLocalTextSourceOptions?.moduleLinkerCallback ) {
            await this.linkModule( vmModule, options );
        }

        return vmModule;
    }

    /**
     * @param {zVmModuleSource} module
     * @param {string} path
     * @param {zVmModuleEvaluateOptions} options
     *
     * @return {Promise<zVmModule>}
     */
    async evaluateModule( module, path, options = {} ) {
        let vmModule;

        const moduleOptions = {
            identifier: path,
            context: options.context ?? this.vm.sandbox.context,
        };

        switch ( options.moduleType ) {
            case 'node':
                const exportNames = Object.keys( module );

                /**
                 * @this {vm.SyntheticModule}
                 */
                const evaluateExportsAll = function () {
                    exportNames.forEach( key =>
                        this.setExport( key, module[ key ] )
                    );
                };

                vmModule = new vm.SyntheticModule(
                    exportNames,
                    evaluateExportsAll,
                    moduleOptions
                );
                break;

            case "json":
                /**
                 * @this {vm.SyntheticModule}
                 */
                const evaluateExportsDefault = function () {
                    this.setExport( "default", module );
                };

                vmModule = new vm.SyntheticModule(
                    [ "default" ],
                    evaluateExportsDefault,
                    moduleOptions
                );

                break;

            // should be source-module
            case "esm":
                /**
                 * @type {vm.SourceTextModuleOptions}
                 */
                const sourceModuleOptions = moduleOptions;

                if ( options.moduleLocalTextSourceOptions ) {
                    const {
                        moduleImportMeta,
                        moduleImportDynamically,
                    } = options.moduleLocalTextSourceOptions;

                    if ( moduleImportMeta ) {
                        sourceModuleOptions.initializeImportMeta = moduleImportMeta
                    }

                    if ( moduleImportDynamically ) {
                        sourceModuleOptions.importModuleDynamically = moduleImportDynamically;
                    }
                }

                if ( ! sourceModuleOptions.initializeImportMeta ) {
                    sourceModuleOptions.initializeImportMeta = ( meta, module ) => {
                        meta.url = path.startsWith( "file://" ) ? path : "file://" + path;

                        const referer = options.moduleLocalTextSourceOptions?.referencingModule?.identifier;

                        if ( referer ) {
                            meta.refererUrl = referer.startsWith( "file://" ) ? referer : "file://" + referer;

                            this.moduleRefererCache.set( meta.url, meta.refererUrl );
                        }
                    };
                }

                this.vm.config.moduleTransformers.forEach( transformer => {
                    const result = transformer( module, path, sourceModuleOptions );

                    if ( result ) {
                        module = result.code;
                    }
                } );

                vmModule = new vm.SourceTextModule( module, sourceModuleOptions );
                break;

            default:
                throw new Error( `Invalid exportType: ${ util.inspect( options.moduleType ) }` );
        }

        return vmModule;
    }

    /**
     * @param {zVmModule} vmModule
     * @param {zVmModuleEvaluateOptions} options
     */
    async linkModule( vmModule, options ) {
        const moduleLinkerCallback = options.moduleLocalTextSourceOptions?.moduleLinkerCallback || ( () => {
            throw new Error( "Invalid module specification" );
        } );

        await vmModule.link( moduleLinkerCallback );
        await vmModule.evaluate( this.vm.config.vmModuleEvaluateOptions );

        return vmModule;
    }

    /**
     * @param {string} id
     * @param {string} path
     * @param {zVmModuleType} type
     * @param {import("vm").Module} module
     */
    setToCache( id, path, type, module ) {
        if ( ! ( module instanceof vm.Module ) ) {
            throw new Error( `Module path: ${ util.inspect( path ) }, id: ${ util.inspect( id ) } type: ${ util.inspect( type ) } is not a module` );
        }

        if ( this.moduleCache.has( id ) ) {
            verbose( "loaders", "setToCache", () => `cache id: ${ util.inspect( id ) } path: ${ util.inspect( path ) } type: ${ util.inspect( type ) } is already set` );
            return;
        }

        verbose( "loaders", "setToCache", () => `caching: ${ util.inspect( path ) } id: ${ util.inspect( id ) } type: ${ util.inspect( type ) }` );

        this.moduleCache.set( id, {
            path,
            type,
            module,
        } );

        if ( this.modulePrepareCache.has( id ) ) {
            verbose( "loaders", "setToCache", () => `resolving prepare cache id: ${ util.inspect( id ) }` );

            this.modulePrepareCache.get( id ).promise.resolve( module );
        }
    }

    /**
     * @param {string} id
     * @param {string} path
     * @param {zVmModuleType} type
     */
    setPrepareCache( id, path, type ) {
        if ( this.modulePrepareCache.has( id ) ) {
            return;
        }

        verbose( "loaders", "setPrepareCache", () => `setting prepare cache id: ${ util.inspect( id ) }` );

        this.modulePrepareCache.set( id, {
            promise: zCreateResolvablePromise(),
            prepare: true,
        } )
    }

    /**
     * @param {string} id
     * @param {string} path
     * @param {zVmModuleType} type
     * @param {zVmModuleEvaluateOptions["moduleType"]} type
     *
     * @return {Promise<import("vm").Module>}
     */
    async getFromCache( id, path, type ) {
        let result = undefined;

        if ( this.modulePrepareCache.has( id ) ) {
            verbose( "loaders", "getFromCache", () => `waiting for prepare: ${ util.inspect( path ) } id: ${ util.inspect( id ) } type: ${ util.inspect( type ) }` );

            await this.modulePrepareCache.get( id ).promise.await;

            verbose( "loaders", "getFromCache", () => `prepare released: ${ util.inspect( path ) } id: ${ util.inspect( id ) } type: ${ util.inspect( type ) }` );
        }

        // Check if the module is already cached
        if ( this.moduleCache.has( id ) ) {
            result = this.moduleCache.get( id );

            if ( result.type !== type ) {
                throw new Error( `Module path: ${ util.inspect( path ) } is already cached with different type: ${ util.inspect( result.type ) } !== ${ util.inspect( type ) }` );
            }

            if ( result.path !== path ) {
                verbose( "loaders", "getFromCache", () => `receiving: ${ util.inspect( result.path ) } !== ${ util.inspect( path ) } module is already cached with different path` );
            }

            verbose( "loaders", "getFromCache", () => `receiving: ${ util.inspect( result.path ) } from cache` );

            result = result.module;
        }

        return result;
    }

    /**
     * Calculates the module ID using the given path and type.
     *
     * @param {string} path - The path of the file or module.
     * @param {string} type - The type of the module.
     * @param {zVmModuleLocalTextSourceOptions} options
     *
     * @return {string} The calculated module ID.
     */
    getModuleId( path, type, options ) {
        let factor = "node" === type && ! isAbsolute( path ) ?
            path : fs.readFileSync( path );

        // To generate new import.meta
        if ( "esm" === type && this.moduleRefererCache.has( "file://" + path ) ) {
            factor += checksum( this.moduleRefererCache.get( "file://" + path ) );
        }

        return checksum( factor );
    }
}
