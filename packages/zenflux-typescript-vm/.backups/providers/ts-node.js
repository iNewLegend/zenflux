import fs from "node:fs";
import { fileURLToPath } from "node:url";

import tsNodeModule from "ts-node";

import { ProviderBase } from "./provider-base.js";

export class TsNode extends ProviderBase {
    /**
     * @type {import("ts-node").RegisterOptions}
     */
    registerOptions;

    /**
     * @type {import("ts-node").Service}
     */
    service;

    /**
     * @type {import("ts-node").NodeLoaderHooksAPI2}
     */
    hooks;

    static getType() {
        return "ts-node";
    }

    /**
     * @param {object} args
     * @param {string} args.tsConfigPath
     * @param {import("ts-node").RegisterOptions["readFile"]} args.tsConfigReadCallback
     */
    constructor( args ) {
        super( args );

        /**
         * @type {import("ts-node").RegisterOptions}
         */
        this.registerOptions = {
            project: args.tsConfigPath,

            files: true,

            transpileOnly: true,

            require: [
                "ts-node/register",
            ],

            readFile: ( path ) => {
                args.tsConfigReadCallback( path );

                return fs.readFileSync( path, "utf8" );
            }
        };
    }

    initialize( args ) {
        this.service = tsNodeModule.register( this.registerOptions );
        this.hooks = tsNodeModule.createEsmHooks( this.service );;
    }

    async load( path, options ) {
        const url = path.startsWith( "file://" ) ? path : "file://" + path;

        /**
         * @type {import("ts-node").NodeLoaderHooksFormat}
         */
        const format = "module";

        /**
         * @type {import("ts-node").NodeLoaderHooksAPI2.LoadHook}
         */
        const defaultLoad = async ( url, context, defaultLoad ) => {
            const path = fileURLToPath( url );

            return {
                format,
                source: fs.readFileSync( path, "utf8" ),
            }
        };

        const module = await this.hooks.load( url, { format }, defaultLoad );

        /**
         * @type {zVmModuleEvaluateOptions}
         */
        const evalOptions = {
            moduleType: "tsnode-esm",
        };

        if ( options ) {
            evalOptions.moduleLocalTextSourceOptions = options;
        }

        return this.sanitizeModule( module, url, evalOptions );
    }

    async resolve( modulePath, referencingModule, middleware ): never {
        const type = this.type;

        middleware( { modulePath, referencingModule, type } );

        if ( ! modulePath.startsWith( "file://" ) && ! modulePath.startsWith( "/" ) ) {
            return false;
        }

        const promise = this.vm.tsNode.hooks.esm
            .resolve( modulePath, { parentURL: referencingModule.identifier, }, undefined )
            .then( ( resolved ) => {
                middleware( { resolvedPath: resolved.url, modulePath, referencingModule, type} );

                return resolved.url;
            } )
            .catch( ( e ) => {
                const match = e.message.match( /Cannot find (module|package) '(.*)' imported from/ ),
                    url = match[ 2 ];

                middleware( { resolvedPath: url, modulePath, referencingModule, type } );
            } );

        return ( await promise )?.url ?? null;
    }
}
