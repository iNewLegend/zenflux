/**
 * @author Leonid Vinikov <leonidvinikov@gmail.com>
 */
import util from "node:util";
import path from "node:path";
import process from "node:process";

import { fileURLToPath, pathToFileURL } from "node:url";

import { parentPort, Worker, workerData } from "node:worker_threads";

import { rollup } from "rollup";

import { zRollupGetPluginArgs, zRollupGetPlugins } from "@zenflux/cli/src/core/rollup";

import { console } from "@zenflux/cli/src/modules/console";

import type { OutputOptions, RollupOptions } from "rollup";

import type { IZConfigInternal } from "@zenflux/cli/src/definitions/config";
import type { TZFormatType } from "@zenflux/cli/src/definitions/zenflux";

type TZBuildOptions = {
    silent?: boolean;
    thread?: number,
    config: IZConfigInternal
}

const workers = new Map<number, Worker>();

async function rollupBuildInternal( config: RollupOptions, options: TZBuildOptions ) {
    const output = config.output as OutputOptions;

    if ( ! output ) {
        throw new Error( "Rollup output not found." );
    }

    const bundle = await rollup( config ),
        startTime = Date.now(),
        file = output.file ?? output.entryFileNames;

    options.silent || console.log( `Writing - Start ${ util.inspect( output.format ) } bundle to ${ util.inspect( file ) }` );

    await bundle.write( output );

    options.silent || console.log( `Writing - Done ${ util.inspect( output.format ) } bundle of ${ util.inspect( file ) } in ${ util.inspect( Date.now() - startTime ) + "ms" }` );

    options.config.onBuiltFormat?.( output.format as TZFormatType );
}

async function zRollupBuildInWorker( rollupOptions: RollupOptions[], options: TZBuildOptions ) {
    // Since worker do not need to load it, it can't be in top level.
    const { zGlobalPathsGet } = ( await import( "@zenflux/cli/src/core/global" ) );

    // Plugins cannot be transferred to worker threads, since they are "live" objects/function etc...
    rollupOptions.forEach( ( o ) => {
        delete o.plugins;
    } );

    // Await for the worker to finish.
    return new Promise( ( resolve ) => {
        // Run zenflux `tsnode-vm` in the worker thread.
        if ( ! workers.has( options.thread as number ) ) {
            console.verbose( () => `Thread\t${ options.thread }\tStart\t${ util.inspect( options.config.outputName ) }` );

            const worker = new Worker( pathToFileURL( zGlobalPathsGet().cli ), {
                argv: process.argv,
                workerData: {
                    zCliWorkPath: fileURLToPath( import.meta.url ),

                    rollupOptions: rollupOptions,

                    options
                },
            } );

            workers.set( options.thread as number, worker );
        }

        const worker = workers.get( options.thread as number ) as Worker;

        worker.once( "message", ( message ) => {
            // const messageSegments = message.split( "-" );

            switch ( message ) {
                case "done":
                    resolve( undefined );
                    break;

                default:
                    if ( message.__ERROR_WORKER_INTERNAL__ ) {
                        const newError = new Error();

                        newError.stack = message.error.stack;
                        newError.message = message.error.message;

                        throw newError;
                    }

                    throw new Error( `Unknown message: ${ message }` );
            }
        } );

        worker.postMessage( "run" );
    } );
}

function zRollupCreateBuildWorker() {
    if ( ! workerData.options.thread && 0 !== workerData.options.thread ) {
        throw new Error( "Thread options not found." );
    }

    const id = workerData.options.thread,
        rollupOptions: RollupOptions[] = ! Array.isArray( workerData.rollupOptions ) ? [ workerData.rollupOptions ] : workerData.rollupOptions,
        buildOptions = workerData.options as TZBuildOptions,
        config = buildOptions.config;

    const linkedRollupOptions = rollupOptions.map( ( rollupOptions ) => {
        const output = rollupOptions.output as OutputOptions;

        const pluginsArgs = zRollupGetPluginArgs(
            config.extensions as string[],
            output.format as TZFormatType,
            !! output.sourcemap,
            config.moduleForwarding
        );

        rollupOptions.plugins = zRollupGetPlugins(
            pluginsArgs,
            path.dirname( config.path ),
        );

        return rollupOptions;
    } );

    // Waiting for the parent to send a message.
    parentPort?.on( "message", async ( message ) => {
        switch ( message ) {
            case "run":
                const buildRequest = async () => {
                    console.verbose( () => `Thread\t${ id }\tRun\t${ util.inspect( config.outputName ) }` );

                    return Promise.all( linkedRollupOptions.map( async ( singleRollupOptions ) => {
                        const output = singleRollupOptions.output as OutputOptions;

                        console.log( `Thread\t${ id }\tBuild\t${ util.inspect( config.outputName ) } format ${ util.inspect( output.format ) } bundle to ${ util.inspect( output.file ?? output.entryFileNames ) }` );

                        await rollupBuildInternal( singleRollupOptions, workerData.options );

                        console.verbose( () => `Thread\t${ id }\tReady\t${ util.inspect( config.outputName ) } format ${ util.inspect( output.format ) } bundle of ${ util.inspect( output.file ?? output.entryFileNames ) }` );
                    } ) );
                };

                await buildRequest().catch( ( error ) => {
                    parentPort?.postMessage( {
                        __ERROR_WORKER_INTERNAL__: true,
                        error: error,
                    } );
                } );

                console.verbose( () => `Thread\t${ id }\tDone\t${ util.inspect( config.outputName ) }` );

                // Ensuring that console.log is flushed.
                setTimeout( () => {
                    parentPort?.postMessage( "done" );
                } );

                break;

            default:
                throw new Error( `Unknown message: ${ message }` );
        }
    } );
}

export async function zRollupBuild( rollupOptions: RollupOptions[] | RollupOptions, options: TZBuildOptions ) {
    if ( ! Array.isArray( rollupOptions ) ) {
        rollupOptions = [ rollupOptions ];
    }

    let buildPromise;

    // No threads.
    if ( ! options.thread && 0 !== options.thread ) {
        buildPromise = Promise.all(
            rollupOptions.map( ( rollupOptions ) => rollupBuildInternal( rollupOptions, options ) )
        );
    } else {
        buildPromise = zRollupBuildInWorker( rollupOptions, options );
    }

    buildPromise.then( () => {
        options.config.onBuilt?.();
    } );

    return buildPromise;
}

if ( workerData?.zCliWorkPath ) {
    zRollupCreateBuildWorker();
}