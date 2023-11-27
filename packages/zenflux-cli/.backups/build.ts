import util from "node:util";

import { fileURLToPath, pathToFileURL } from "node:url";

import { parentPort, Worker, workerData } from "node:worker_threads";

import path from "node:path";
import process from "node:process";
import ts from "typescript";

import type { OutputOptions, RollupOptions } from "rollup";
import { rollup } from "rollup";

import babel from "@babel/core";

import { zRollupGetPluginArgs, zRollupGetPlugins } from "@z-cli/core/rollup";

import { console } from "@zenflux/cli/src/modules/console";

import type { IZConfigInternal } from "@z-cli/definitions/config";
import type { TZFormatType } from "@z-cli/definitions/zenflux";

type TBuildWorkOptions = {
    config: IZConfigInternal
}

type TBuildOptions = {
    silent?: boolean;
    thread?: TBuildWorkOptions | null,
}

const DEFAULT_BUILD_OPTIONS: Required<TBuildOptions> = {
    silent: false,
    thread: null,
};

async function rollupBuildInternal( config: RollupOptions, options: TBuildOptions ) {
    const rollupTsPlugin = ( config.plugins as any[] ).find( i => i.name === "typescript" );

    delete rollupTsPlugin.options;

    const output = config.output as OutputOptions;

    if ( ! output ) {
        throw new Error( "Rollup output not found." );
    }

    const bundle = await rollup( config ),
        startTime = Date.now(),
        file = output.file ?? output.entryFileNames;

    options.silent || console.log( `Writing - Start ${ util.inspect( output.format ) } bundle to ${ util.inspect( file ) }` );

    await bundle.write( output );

    options.silent || console.log( `Writing - Done ${ util.inspect( output.format ) } bundle to ${ util.inspect( file ) } in ${ util.inspect( Date.now() - startTime ) + "ms" }` );
}

export async function zRollupBuild( rollupOptions: RollupOptions, options: TBuildOptions = DEFAULT_BUILD_OPTIONS ) {
    if ( null === options.thread ) {
        return rollupBuildInternal( rollupOptions, options );
    }

    const rollupTsPlugin = ( rollupOptions.plugins as any[] ).find( i => i.name === "typescript" );

    const tsOptions = rollupTsPlugin.options;

    // Plugins cannot be transferred to worker threads, since they are functions.

    // Since worker do not need to load it.
    const { zGlobalPathsGet } = ( await import( "@z-cli/core/global" ) );

    function transform( obj: any, key: string ) {
        let plainCode = obj.toString();

        try {
            // Add missing function keyword.
            if ( ! plainCode.startsWith( "function" ) && ! plainCode.startsWith( "class" ) ) {
                plainCode = "function " + plainCode;
            }

            // Add random name for anonymous classes.
            else if ( plainCode.startsWith( "class extends" ) ) {
                plainCode = plainCode.replace( "class extends", "class _ANON_" + Math.random().toString( 36 ).substr( 2 ) + " extends" );
            } else if ( plainCode.startsWith( "class {" ) ) {
                plainCode = plainCode.replace( "class {", "class _ANON_" + Math.random().toString( 36 ).substr( 2 ) + " {" );
            }

            // If function does not have a name
            if ( plainCode.startsWith( "function (" ) ) {
                plainCode = `(${obj.toString()})`;
            }

            // Add missing semicolon.
            if ( ! plainCode.endsWith( ";" ) ) {
                plainCode += ";";
            }

            return babel.transformSync( plainCode, {
                filename: obj.name + ".js",
                presets: [
                    [
                        "@babel/preset-env",
                        {
                            bugfixes: true,
                        }
                    ]
                ],
            } )?.code;
        } catch ( e ) {
            debugger;
        }
    }

    const tsShadow = { ... ts };

    function stringifyFunctions( obj ) {
        // Check if the current object is an object
        if ( typeof obj === "object" && obj !== null ) {

            // Create a new object with the same prototype as the original
            const newObj = Object.create( Object.getPrototypeOf( obj ) );

            // Iterate over the properties of the original object
            for ( const key in obj ) {
                const keyCopy = JSON.parse( JSON.stringify( key ) );

                if ( obj.hasOwnProperty( key ) ) {
                    // If the property is a function, convert it to a string
                    if ( typeof obj[ key ] === "function" ) {
                        newObj[ key ] = transform( obj[ key ], key );
                    } else if ( typeof obj[ key ] === "object" ) {
                        if ( tsShadow[ key ] ) {
                            newObj[ key ] = "$ts." + key;
                        } else {
                            // If the property is an object, recursively stringify its functions
                            newObj[ key ] = stringifyFunctions( obj[ key ] );
                        }
                    } else {
                        // Copy other non-function properties
                        newObj[ key ] = obj[ key ];
                    }
                }
            }

            return newObj;
        }

        // If the object is not an object, return it as is
        return obj;
    }

    const tsOptionsRaw = stringifyFunctions( tsOptions );

    delete rollupOptions.plugins;

    const worker = new Worker( pathToFileURL( zGlobalPathsGet().cli ), {
        argv: process.argv,
        workerData: {
            zCliWorkPath: fileURLToPath( import.meta.url ),
            rollupOptions: rollupOptions,
            options,
            tsOptions: tsOptionsRaw
        },
    } );

    // Await for the worker to finish.
    return new Promise( ( resolve ) => {
        worker.on( "message", ( message ) => {
            if ( "done" === message ) {
                resolve( void 0 );
            }
        } );
    } );
}

if ( workerData?.zCliWorkPath ) {
    const rollupOptions: RollupOptions = workerData.rollupOptions,
        options: TBuildOptions = workerData.options,
        output = rollupOptions.output as OutputOptions,
        config = options.thread?.config;

    const tsShadow = { ... ts };

    if ( ! config ) {
        throw new Error( "Config not found." );
    }

    const pluginsArgs = zRollupGetPluginArgs(
        config.extensions as string[],
        output.format as TZFormatType,
        !! output.sourcemap,
        config.moduleForwarding
    );

    function parseFunctions( obj ) {
        // Check if the current object is an object
        if ( typeof obj === "object" && obj !== null ) {
            // Create a new object with the same prototype as the original
            const newObj = Object.create( Object.getPrototypeOf( obj ) );

            // Iterate over the properties of the original object
            for ( const key in obj ) {
                if ( obj.hasOwnProperty( key ) ) {
                    // If the property is a string and looks like a function, convert it back to a function
                    if ( typeof obj[ key ] === "string" && obj[ key ].startsWith( "class " ) ) {
                        newObj[ key ] = parseClass( obj[ key ] );
                    } else if ( "string" === typeof obj[ key ] && obj[ key ].startsWith( "$ts." ) ) {
                        newObj[ key ] = tsShadow[ obj[ key ].substr( 4 ) ];
                    } else if ( typeof obj[ key ] === "object" ) {
                        // If the property is an object, recursively parse its functions
                        newObj[ key ] = parseFunctions( obj[ key ] );
                    }  else {
                        // Copy other non-string properties
                        newObj[ key ] = obj[ key ];
                    }
                }
            }

            return newObj;
        }

        // If the object is not an object, return it as is
        return obj;
    }

    const classes = {} as any;

    function parseClass( classString ) {
        // Use the Function constructor to create a function from the string
        try {
            const class_ = eval( "__CLASS__ = " + classString
                .replace( "class _", "class " )
                .replace( " extends", " extends classes." )
            );

            classes[ class_.name ] = class_;

        } catch ( e ) {
            return classString;
        }
    }

    const tsOptions = parseFunctions( workerData.tsOptions );

    tsOptions.typescript.readConfigFile = () => {
        return { config: tsOptions.typescript };
    };

    tsOptions.typescript.parseJsonConfigFileContent = () => {
        return tsOptions.typescript;
    }

    try {
        rollupOptions.plugins = zRollupGetPlugins( pluginsArgs, path.dirname( config.path ), tsOptions );
    } catch ( e ) {
        console.error( e );
        process.exit( 1 );
    }

    rollupBuildInternal( rollupOptions, options ).then( () => {
        parentPort?.postMessage( "done" );
    } ).catch( ( error ) => {
        console.error( error );
        process.exit( 1 );
    } );
}
