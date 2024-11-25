// var exports;
import * as _fs from 'node:fs';
// debugger
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock( 'node:fs' );

// describe( "WorkerServer", () => {
//    it( "should work", async () => {
//        expect( 1 ).toBe( 1 );
//    });
// });
// const fs = _fs as jest.Mocked<typeof _fs>; // Get type-safe mocked 'fs'
//
// //
// const bas = jest.mock('fs'); // Mock the entire 'fs' module
//         fs.readFileSync.mockReturnValue('test');
//
// //
const fs = _fs as jest.Mocked<typeof _fs>; // Get type-safe mocked 'fs'

describe( 'simple', () => {
    beforeEach( () => {
        // Clear any mock call history before each test
        fs.readFileSync.mockClear();
    } );

    it( 'should work', () => {
        // Mock the return value of 'readFileSync'
        fs.readFileSync.mockReturnValue( 'test' );

        // Call the mocked function
        const result = fs.readFileSync( 'fakePath' );

        // Validate the result
        expect( result ).toBe( 'test' );

        // Verify the function was called the correct number of times
        expect( fs.readFileSync ).toHaveBeenCalledTimes( 1 );
        // Verify the function was called with correct arguments
        expect( fs.readFileSync ).toHaveBeenCalledWith( 'fakePath' );
    } );
} );
// // import fs from "node:fs";
// //
// //
// // import { WorkerServer } from "@zenflux/worker/worker-server";
// //
// // describe( "WorkerServer", () => {
// //
// //     describe( "initialize", () => {
// //         it( "should throw if @z-runner is not found", async () => {
// //             jest.spyOn( fs, "existsSync" ).mockReturnValue( false );
// //             // Arrange.
// //             process.env.Z_RUN_TARGET = "target";
// //
// //             const a = fs.existsSync("/");
// //
// //             const workerServer = new WorkerServer( "name", "id", "display", () => {
// //             }, "workPath", [] );
// //
// //             await expect( workerServer.initialize() ).rejects.toThrowError( "@z-runner not found in PATHs" );
// //         } );
// //     } );
// // } );
//
// // import process from "node:process";
// // import { Worker } from "node:worker_threads";
// //
// // import { beforeEach, expect, jest, describe, it } from "@jest/globals";
// //
// // import { WorkerServer } from "@zenflux/worker/worker-server";
// //
// // import type path from "path";
// //
// // import * as nodeFs from "node:fs";
// //
// // import type {
// //     DZCatchSynthetic,
// //     DZFinallySynthetic,
// //     DZThenSynthetic,
// //     zCreateResolvablePromise
// // } from "@zenflux/utils/src/promise";
// //
// // // jest.mock( "path" );
// // // jest.mock( "@zenflux/typescript-vm" );
// // // jest.mock( "@zenflux/runner" );
// //
// // jest.mock( "node:worker_threads" );
// // jest.mock( "fs" );
// //
// // const fs = jest.mocked( nodeFs );
// //
// // describe( "WorkerServer", () => {
// //     const mockPath = "mockPath";
// //     const mockRunnerPath = "mockRunnerPath";
// //     const mockExecutablePath = "mockExecutablePath";
// //
// //     const zCreateResolvablePromiseMock = jest.fn<typeof zCreateResolvablePromise>();
// //
// //     const NodeWorkerMock: jest.Mocked<typeof Worker> = jest.mocked( Worker );
// //
// //     const fsExistsSyncMock = jest.fn<typeof fs.existsSync>();
// //
// //     const pathResolveMock = jest.fn<typeof path.resolve>(),
// //         pathJoinMock = jest.fn<typeof path.join>(),
// //         pathDirnameMock = jest.fn<typeof path.dirname>();
// //
// //     beforeEach( () => {
// //         zCreateResolvablePromiseMock.mockReturnValue( {
// //             await: Promise.resolve(),
// //             isPending: true,
// //             isFulfilled: false,
// //             resolve: jest.fn(),
// //             reject: jest.fn(),
// //             then: jest.fn<DZThenSynthetic>(),
// //             catch: jest.fn<DZCatchSynthetic>(),
// //             finally: jest.fn<DZFinallySynthetic>(),
// //             promise: undefined,
// //             isRejected: false,
// //         } );
// //
// //         const mockOn = jest.fn() as jest.Mocked<{
// //             ( event: "error", listener: ( err: Error ) => void ): jest.MockedObject<Worker>;
// //             ( event: "exit", listener: ( exitCode: number ) => void ): jest.MockedObject<Worker>;
// //             ( event: "message", listener: ( value: any ) => void ): jest.MockedObject<Worker>;
// //             ( event: "messageerror", listener: ( error: Error ) => void ): jest.MockedObject<Worker>;
// //             ( event: "online", listener: () => void ): jest.MockedObject<Worker>;
// //             ( event: string | symbol, listener: ( ... args: any[] ) => void ): jest.MockedObject<Worker>;
// //         }>;
// //
// //         const mockOnce = jest.fn() as jest.Mocked<{
// //             ( event: "error", listener: ( err: Error ) => void ): jest.MockedObject<Worker>;
// //             ( event: "exit", listener: ( exitCode: number ) => void ): jest.MockedObject<Worker>;
// //             ( event: "message", listener: ( value: any ) => void ): jest.MockedObject<Worker>;
// //             ( event: "messageerror", listener: ( error: Error ) => void ): jest.MockedObject<Worker>;
// //             ( event: "online", listener: () => void ): jest.MockedObject<Worker>;
// //             ( event: string | symbol, listener: ( ... args: any[] ) => void ): jest.MockedObject<Worker>;
// //         }>;
// //
// //         const mockOff = jest.fn() as jest.Mocked<{
// //             ( event: "error", listener: ( err: Error ) => void ): jest.MockedObject<Worker>;
// //             ( event: "exit", listener: ( exitCode: number ) => void ): jest.MockedObject<Worker>;
// //             ( event: "message", listener: ( value: any ) => void ): jest.MockedObject<Worker>;
// //             ( event: "messageerror", listener: ( error: Error ) => void ): jest.MockedObject<Worker>;
// //             ( event: "online", listener: () => void ): jest.MockedObject<Worker>;
// //             ( event: string | symbol, listener: ( ... args: any[] ) => void ): jest.MockedObject<Worker>;
// //         }>;
// //
// //         const mockEventListener = jest.fn() as jest.Mocked<{
// //             ( event: "error", listener: ( err: Error ) => void ): jest.MockedObject<Worker>;
// //             ( event: "exit", listener: ( exitCode: number ) => void ): jest.MockedObject<Worker>;
// //             ( event: "message", listener: ( value: any ) => void ): jest.MockedObject<Worker>;
// //             ( event: "messageerror", listener: ( error: Error ) => void ): jest.MockedObject<Worker>;
// //             ( event: "online", listener: () => void ): jest.MockedObject<Worker>;
// //             ( event: string | symbol, listener: ( ... args: any[] ) => void ): jest.MockedObject<Worker>;
// //         }>;
// //
// //         const mockPrependListener = jest.fn() as jest.Mocked<{
// //             ( event: "close", listener: () => void ): jest.MockedObject<Worker>;
// //             ( event: "message", listener: ( value: any ) => void ): jest.MockedObject<Worker>;
// //             ( event: "messageerror", listener: ( error: Error ) => void ): jest.MockedObject<Worker>;
// //             ( event: string | symbol, listener: ( ... args: any[] ) => void ): jest.MockedObject<Worker>;
// //         }>;
// //
// //         const mockPrependOnceListener = jest.fn() as jest.Mocked<{
// //             ( event: "close", listener: () => void ): jest.MockedObject<Worker>;
// //             ( event: "message", listener: ( value: any ) => void ): jest.MockedObject<Worker>;
// //             ( event: "messageerror", listener: ( error: Error ) => void ): jest.MockedObject<Worker>;
// //             ( event: string | symbol, listener: ( ... args: any[] ) => void ): jest.MockedObject<Worker>;
// //         }>;
// //
// //         const mockRemoveListener = jest.fn() as jest.Mocked<{
// //             ( event: "close", listener: () => void ): jest.MockedObject<Worker>;
// //             ( event: "message", listener: ( value: any ) => void ): jest.MockedObject<Worker>;
// //             ( event: "messageerror", listener: ( error: Error ) => void ): jest.MockedObject<Worker>;
// //             ( event: string | symbol, listener: ( ... args: any[] ) => void ): jest.MockedObject<Worker>;
// //         }>;
// //
// //         // NodeWorkerMock.mockImplementation( () => ( {
// //         //     on: mockOn,
// //         //     off: mockOff,
// //         //     once: mockOnce,
// //         //
// //         //     addListener: mockEventListener,
// //         //     prependListener: mockPrependListener,
// //         //     prependOnceListener: mockPrependOnceListener,
// //         //     removeListener: mockRemoveListener,
// //         //
// //         //     removeAllListeners: jest.fn() as any,
// //         //     setMaxListeners: jest.fn() as any,
// //         //
// //         //     rawListeners: jest.fn(),
// //         //     listenerCount: jest.fn(),
// //         //
// //         //     eventNames: jest.mocked( NodeWorkerMock.prototype.eventNames ),
// //         //
// //         //     getMaxListeners: jest.fn(),
// //         //     listeners: jest.fn(),
// //         //
// //         //     terminate: jest.fn(),
// //         //     stdin: jest.fn() as unknown as jest.MockedObject<Worker["stdin"]>,
// //         //     stdout: jest.fn() as unknown as jest.MockedObject<Worker["stdout"]>,
// //         //     stderr: jest.fn() as unknown as jest.MockedObject<Worker["stderr"]>,
// //         //     getHeapSnapshot: jest.fn(),
// //         //     emit: jest.fn(),
// //         //     threadId: 1,
// //         //     performance: jest.fn() as any,
// //         //     postMessage: jest.fn(),
// //         //     ref: jest.fn(),
// //         //     unref: jest.fn(),
// //         //     addEventListener: jest.fn(),
// //         //     removeEventListener: jest.fn(),
// //         //     dispatchEvent: jest.fn()
// //         // } ) );
// //
// //         fsExistsSyncMock.mockReturnValue( true );
// //
// //         pathJoinMock.mockReturnValue( mockPath );
// //         pathResolveMock.mockReturnValue( mockRunnerPath );
// //         pathDirnameMock.mockReturnValue( mockExecutablePath );
// //     } );
// //
// //     describe( "initialize", () => {
// //         it( "should throw if @z-runner is not found", async () => {
// //             // Arrange.
// //             process.env.Z_RUN_TARGET = "target";
// //
// //             fs.existsSync.mockReturnValue( false );
// //
// //             const workerServer = new WorkerServer( "name", "id", "display", () => {
// //             }, "workPath", [] );
// //
// //             await expect( workerServer.initialize() ).rejects.toThrowError( "@z-runner not found in PATHs" );
// //         } );
// //
// //         it( "should resolve createPromise on initialization", async () => {
// //             const workerServer = new WorkerServer( "name", "id", "display", () => {
// //             }, "workPath", [] );
// //             await workerServer.initialize();
// //
// //             expect( workerServer.createPromise.resolve ).toHaveBeenCalled();
// //         } );
// //     } );
// //
// //     describe( "run", () => {
// //         it( "should change state to running and send run message", async () => {
// //             const workerServer = new WorkerServer( "name", "id", "display", () => {
// //             }, "workPath", [] );
// //             await workerServer.initialize();
// //             await workerServer.run();
// //
// //             expect( workerServer.getState() ).toBe( "running" );
// //             expect( NodeWorkerMock.prototype.postMessage ).toHaveBeenCalledWith( JSON.stringify( { type: "run" } ) );
// //         } );
// //
// //         it( "should handle runPromise rejection", async () => {
// //             zCreateResolvablePromiseMock.mockReturnValueOnce( {
// //                 await: jest.fn( () => {
// //                     throw new Error( "Error" );
// //                 } ),
// //                 isPending: true,
// //                 isFulfilled: false,
// //                 resolve: jest.fn(),
// //                 reject: jest.fn(),
// //                 finally: jest.fn(),
// //             } );
// //
// //             const workerServer = new WorkerServer( "name", "id", "display", () => {
// //             }, "workPath", [] );
// //             await expect( workerServer.run() ).rejects.toThrowError();
// //         } );
// //     } );
// //
// //     describe( "terminate", () => {
// //         it( "should send terminate message and resolve exitPromise", async () => {
// //             const workerServer = new WorkerServer( "name", "id", "display", () => {
// //             }, "workPath", [] );
// //             await workerServer.initialize();
// //             await workerServer.run();
// //             await workerServer.terminate();
// //
// //             expect( NodeWorkerMock.prototype.postMessage ).toHaveBeenCalledWith( "terminate" );
// //             expect( workerServer.exitPromise.await ).toBeDefined();
// //         } );
// //     } );
// //
// //     describe( "addTask", () => {
// //         it( "should add task and return unique task id", () => {
// //             const workerServer = new WorkerServer( "name", "id", "display", () => {
// //             }, "workPath", [] );
// //             const task = { workFunction: "work", workArgs: [ "arg" ], workFilePath: "path", __uniqueId: "" };
// //             const uniqueId = workerServer.addTask( task );
// //
// //             expect( uniqueId ).toMatch( /work:arg:/ );
// //             const [ call ] = NodeWorkerMock.prototype.postMessage.mock.calls;
// //             const sentMessage = JSON.parse( call[ 0 ] );
// //             expect( sentMessage.type ).toBe( "add-task" );
// //             expect( sentMessage.task.__uniqueId ).toBe( uniqueId );
// //         } );
// //     } );
// //
// //     describe( "isAlive", () => {
// //         it( "should return true if state is not error or terminated", () => {
// //             const workerServer = new WorkerServer( "name", "id", "display", () => {
// //             }, "workPath", [] );
// //             expect( workerServer.isAlive() ).toBe( false );
// //             workerServer.run();
// //             expect( workerServer.isAlive() ).toBe( true );
// //         } );
// //     } );
// // } );
