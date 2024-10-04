```typescript
import { fileURLToPath } from "node:url";
import util from "node:util";

import * as worker_threads from "worker_threads";

import { WorkerPool } from "@zenflux/worker/worker-pool";

import { ConsoleManager } from "@zenflux/cli/src/managers/console-manager";

import type { DThreadHostInterface, DWorkerTaskWithWorkPath } from "@zenflux/worker/definitions";

const currentFilePath = fileURLToPath( import.meta.url );

export async function exampleTask1( arg1: string, arg2: string, host: DThreadHostInterface ) {
    const result = `Task 1 completed with args: ${ arg1 }, ${ arg2 }`;
    host.sendLog( result );
    return result;
}

export async function exampleTask2( arg1: number, arg2: number, host: DThreadHostInterface ) {
    const result = arg1 + arg2;
    host.sendLog( `Task 2 calculating sum: ${ arg1 } + ${ arg2 } = ${ result }` );
    return result;
}

const tasks: DWorkerTaskWithWorkPath[] = [
    { workFunction: exampleTask1, workArgs: [ "Hello", "World" ], workFilePath: currentFilePath },
    { workFunction: exampleTask2, workArgs: [ 5, 10 ], workFilePath: currentFilePath },
    { workFunction: exampleTask1, workArgs: [ "Foo", "Bar" ], workFilePath: currentFilePath },
    { workFunction: exampleTask2, workArgs: [ 20, 30 ], workFilePath: currentFilePath },
];

if ( worker_threads.isMainThread ) {
    // Initialize the worker pool with 4 workers
    const pool = new WorkerPool( 2 );

    // Add some tasks to the pool
    Promise.all( tasks.map( task => pool.addTask( task ) ) );
    // Add a small delay to ensure all tasks are processed
    // You might want to use a more sophisticated mechanism to wait for all tasks to finish
    // await new Promise( resolve => setTimeout( resolve, 5000 ) );
    //
    // // Terminate all workers
    // await pool.terminateAll();

    // pool.ensureWorkers().catch( e => ConsoleManager.$.error( e ) );

    do {
            pool.verbose();

            await pool.run()
                .failed( e => ConsoleManager.$.error( util.inspect( e ) ) )
                .succeeded( workerId => ConsoleManager.$.verbose( () => `Worker ${ workerId } completed successfully.` ) );

            pool.verbose();
    } while ( pool.hasWork() );

    // Option 2
    // await pool.awaitInitialization();
    //
    // while ( pool.hasWork() ) {
    //     pool.printInfo();
    //
    //     await pool.run()
    //         .allFailed( e => ConsoleManager.$.error( "ALL Failed:", util.inspect( e ) ) )
    //         .failed( e => ConsoleManager.$.error( util.inspect( e ) ) )
    //         .succeeded( workerId => ConsoleManager.$.log( `Worker ${ workerId } completed successfully.` ) );
    //
    //     pool.printInfo();
    // }

    await pool.terminateAll();

    pool.verbose();

    //
    // await new Promise( resolve => setTimeout( resolve, 5000 ) );
    //
    // ConsoleManager.$.log( "All tasks have been processed and workers are terminated." );
}

```
