/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 */
import { availableParallelism } from "node:os";

import { fileURLToPath } from "node:url";

import * as path from "path";

import { zCreateResolvablePromise } from "@zenflux/utils/src/promise";

import { ConsoleManager } from "@zenflux/cli/src/managers/console-manager";

import { ConsoleThreadReceive } from "@zenflux/cli/src/console/console-thread-receive";

import { zCreateWorker , zWorkerGetCount } from "@zenflux/worker";

import { WorkerRunner } from "@zenflux/worker/worker-runner";

import type { WorkerTaskUnit } from "@zenflux/worker/worker-runner";

import type { WorkerServer } from "@zenflux/worker/src/worker-server";

import type { DWorkerTaskInQueue, DWorkerTaskWithWorkPath } from "@zenflux/worker/definitions";

const currentDirPath = path.dirname( fileURLToPath( import.meta.url ) );

export class WorkerPool {
    private initPromise = zCreateResolvablePromise();

    private workers: WorkerServer[] = [];

    private taskQueue: Record<string, DWorkerTaskInQueue[]> = {};

    public constructor( private poolSize = availableParallelism() ) {
        this.initialize().then( () => this.initPromise.resolve() );
    }

    private async initialize() {
        for ( let i = 0 ; i < this.poolSize ; i++ ) {
            this.taskQueue[ i.toString() ] = [];

            const worker = await zCreateWorker( {
                name: "z-polling-worker",
                display: "Polling worker",
                workFunction: "workerDefaultTask",
                workFilePath: path.join( currentDirPath, "worker-pooling-default-task.ts" ),
                workArgs: [
                    new Date(),
                ],
            } );

            ConsoleThreadReceive.connect( worker, ConsoleManager.$ );

            this.workers.push( worker );
        }

        ConsoleManager.$.log( "Initialized worker pool." );
    }

    public awaitInitialization() {
        return this.initPromise.promise;
    }

    public verbose() {
        ConsoleManager.$.verbose( () => `Active workers: ${ zWorkerGetCount() }` );

        // Print id and state of all workers
        this.workers.forEach( ( worker, index ) => {
            ConsoleManager.$.verbose(  () =>`Worker ${ index } is in state: ${ worker.getState() }` );
        } );
    }

    public run() {
        const task = async ( unit: WorkerTaskUnit ) => {
            await this.initPromise.promise;

            const result = await Promise.allSettled( this.workers.map( async worker => {
                    try {
                        await worker.run();

                        unit.succeed( worker.getId() );

                        return worker.getId();
                    } catch ( e ) {
                        const error = new Error( `Worker with id: \`${ worker.getId() }\` failed to run` );

                        error.cause = e;

                        unit.failed( error );

                        return e;
                    }
                } )
            );

            // If all workers failed then throw an error.
            if ( unit.isAllUnitsFailed() ) {
                throw new Error(
                    `All workers failed to run:\n${ unit.getErrors().map( e => "  " + e.stack ).join( "\n" ) }`
                );
            }

            return result;
        };

        return new WorkerRunner( task );
    }

    public addTask( task: DWorkerTaskWithWorkPath ) {
        this.initPromise.promise.then( () => {
            // If one of the workers is free, use it.
            for ( const worker of this.workers ) {
                if ( worker.isIdle() ) {
                    worker.addTask( task );
                }
            }

            this.queueTaskToLeastLoadedWorker( task );
        } );
    }

    public async terminateAll() {
        for ( const worker of this.workers ) {
            await worker.terminate();
        }
    }

    public hasWork() {
        // If all the workers not alive then no work todo.
        if ( this.workers.every( worker => ! worker.isAlive() ) ) {
            return false;
        }

        // If all workers are not idle then there is work to do.
        if ( this.workers.some( worker => ! worker.isIdle() ) ) {
            return true;
        }

        // If all workers tasks are "done" then there is no work todo.
        if ( this.workers.every( worker => this.taskQueue[ worker.getId() ].every( task => task.status === "done" ) ) ) {
            // Remove the tasks from the queue.
            for ( const worker of this.workers ) {
                this.taskQueue[ worker.getId() ] = [];
            }

            return false;
        }

        return true;
    }

    private queueTaskToLeastLoadedWorker( task: DWorkerTaskWithWorkPath ) {
        let leastLoadedWorkerId: string | null = null;
        let leastTasksCount = Infinity;

        // Find the worker with the smallest queue
        for ( const [ workerId, taskQueue ] of Object.entries( this.taskQueue ) ) {
            if ( taskQueue.length < leastTasksCount ) {
                leastTasksCount = taskQueue.length;
                leastLoadedWorkerId = workerId;
            }
        }

        // Add task to the queue of the worker with the smallest queue
        if ( leastLoadedWorkerId !== null ) {
            this.taskQueue[ leastLoadedWorkerId ].push( {
                ... task,
                status: "queued",
            } );
        }

        const worker = this.workers[ parseInt( leastLoadedWorkerId ) ];

        // Wait for worker to be idle.
        worker.awaitRunning().catch().then( () => {
            // Get first task with the status "queued".
            const taskIndex = Object.values( this.taskQueue[ leastLoadedWorkerId ] )
                .findIndex( task => task.status === "queued" );

            if ( -1 === taskIndex ) {
                return;
            }

            const task = this.taskQueue[ leastLoadedWorkerId ][ taskIndex ];

            // Mark task as running.
            task.status = "running";

            const taskId = worker.addTask( task! );

            // Add task.
            // TODO: Create removing of old tasks.
            worker.waitForTaskComplete( taskId ).finally( () => {
                // Remove task from the queue.
                this.taskQueue[ leastLoadedWorkerId ][ taskIndex ].status = "done";
            });
        } );
    }

}
