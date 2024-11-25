#!/usr/bin/env -S node --unhandled-rejections=strict --experimental-vm-modules --trace-uncaught --no-warnings --experimental-import-meta-resolve --loader @zenflux/jest/loader
import path from "node:path";
import fs from "node:fs";

import MagicString from "magic-string";

import { fileURLToPath } from "node:url";

import { Loaders, Resolvers, vm } from "@zenflux/typescript-vm";


import module from "node:module";
import _ from 'lodash';

import { createContext } from "node:vm"
import JestRuntime from "jest-runtime";
import { ErrorWithMeta } from "@zenflux/utils/src/error";

const currentFilePath = fileURLToPath( import.meta.url ),
    currentDirPath = path.dirname( currentFilePath ),
    isInNodeModules = currentDirPath.includes( "node_modules" ),
    currentWorkspacePackageJsonPath =
        path.resolve( currentDirPath, "../../", ( isInNodeModules ? "../../package.json" : "../package.json" ) );

function isZenWorkspace() {
    if ( fs.existsSync( currentWorkspacePackageJsonPath ) ) {
        const packageJson = JSON.parse( fs.readFileSync( currentWorkspacePackageJsonPath, "utf-8" ) );

        if ( packageJson.name === "@zenflux/zenflux" )
            return true;
    }
}

// For better error stack trace, since we are using vm.
Error.stackTraceLimit = Infinity;

// const require = module.createRequire( import.meta.url );
//
// const runtime = require( "jest-runtime" ).default;
//
// var Module = require('module');
// var assert = require('assert');
//
// (function() {
//     var origRequire = Module.prototype.require;
//     var _require = function(context, path) {
//         return origRequire.call(context, path);
//     };
//
//     var main = require.main;
//
//     Module.prototype.require = function(path) {
//         assert( typeof path === 'string', 'path must be a string' );
//         assert( path, 'missing path' );
//
//         if ( path.includes( "@jest/globals" ) ) {
//             debugger
//             process.exit(0)
//     }
//
//         if (path.slice(0, 2) === ':/') {
//             return _require(main, "./" + path.slice(2));
//         }
//
//         return _require(this, path);
//     };
// })();
// // const bb = new runtime()
//
// process.env.cwd = ""
//
//
// var jest;
const vmContext = _.cloneDeep( {
    global,
    process,
    // require: function ( modulePath ) {
    //     const require = module.createRequire( import.meta.url );
    //
    //     debugger;
    //     return require( modulePath );
    // },
    setTimeout,
} );

function organizeImportsAndMocks( input ) {
    const length = input.length;

    let i = 0;
    let jestGlobalsImport = '';
    let jestMockCalls = [];
    let otherCode = [];

    // Step 1: Scan the input and gather information
    while ( i < length ) {
        // Detect comments
        if ( input.startsWith( '//', i ) ) {
            const newlineIndex = input.indexOf( '\n', i );
            otherCode.push( input.slice( i, newlineIndex + 1 ) );
            i = newlineIndex !== -1 ? newlineIndex + 1 : length;
        } else if ( input.startsWith( '/*', i ) ) {
            const endCommentIndex = input.indexOf( '*/', i );
            otherCode.push( input.slice( i, endCommentIndex + 2 ) );
            i = endCommentIndex !== -1 ? endCommentIndex + 2 : length;
        }
        // Detect imports
        else if ( input.startsWith( 'import ', i ) ) {
            const newlineIndex = input.indexOf( '\n', i );
            const importStatement = input.slice( i, newlineIndex );

            // Check for Jest globals import
            if ( importStatement.includes( '@jest/globals' ) ) {
                jestGlobalsImport = importStatement;
            } else {
                otherCode.push( importStatement + '\n' ); // Keep other imports
            }
            i = newlineIndex !== -1 ? newlineIndex + 1 : length;
        }
        // Detect jest.mock calls
        else if ( input.startsWith( 'jest.mock', i ) ) {
            const newlineIndex = input.indexOf( '\n', i );
            jestMockCalls.push( input.slice( i, newlineIndex + 1 ) );
            i = newlineIndex + 1;
        }
        // Keep other code blocks in place
        else {
            const newlineIndex = input.indexOf( '\n', i );
            otherCode.push( input.slice( i, newlineIndex + 1 ) );
            i = newlineIndex !== -1 ? newlineIndex + 1 : length;
        }
    }

    // Step 2: Create the output with organized structure
    let output = '';
    if ( jestGlobalsImport ) {
        output += jestGlobalsImport + '\n'; // Add Jest globals at the top
    }

    // Step 3: Insert all `jest.mock` calls
    if ( jestMockCalls.length > 0 ) {
        output += jestMockCalls.join( '' ); // Add all jest.mock calls
    }

    // Step 4: Reinsert preserved comments and other code
    output += otherCode.join( '' ); // Append comments and remaining code

    return output;
}


/**
 * @type {typeof import("@zenflux/typescript-vm/src/config.js").externalConfig}
 */
const config = {
    projectPath: path.resolve( currentDirPath, "../" ),

    nodeModulesPath: process.env[ "npm_package_json" ] ?
        path.dirname( process.env[ "npm_package_json" ] ) : path.resolve(
            path.dirname( currentWorkspacePackageJsonPath ), "node_modules" ),

    tsConfigPath: path.resolve( currentDirPath, "../tsconfig.json" ),

    vmContext,

    extensions: [ ".ts", ".json" ],

    useSwc: true,

    useTsNode: false,

    moduleTransformers: [ ( code, path, options ) => {
        // If have `@jest/globals` move `jest.mock` move them all to the top of the file.
        if ( code.includes( "@jest/globals" ) ) {
            const newCode = organizeImportsAndMocks( code );

            return {
                transformerId: "z-jest-transformer",

                code: newCode,
            }
        }
    } ]
};


if ( isZenWorkspace() ) {
    config.workspacePath = path.dirname( currentWorkspacePackageJsonPath );
}

vm.defineConfig( config );

vm.tap( async ( vm ) => {
    const resolvers = new Resolvers( vm ),
        loaders = new Loaders( vm );

    const importModuleOrig = JestRuntime.default.prototype.unstable_importModule,
        requireModuleOrig = JestRuntime.default.prototype.requireModule;

    const vmContexts = {};

    JestRuntime.default.prototype.unstable_importModule = async function ( modulePath, b ) {
        try {
            const runtimeInstance = this;

            const linker = async function linker( modulePath, referencingModule ) {
                if ( "@jest/globals" === modulePath ) {
                    const context = createContext( vm.sandbox.context )

                    vmContexts[ referencingModule.identifier ] = context;

                    return runtimeInstance.getGlobalsForEsm( modulePath, context );
                }

                const result = await resolvers.try( modulePath, referencingModule ).resolve();

                const context = vmContexts[ referencingModule.identifier ] || createContext( vm.sandbox.context )

                return new Promise( async ( resolve, reject ) => {
                    const module = loaders.loadModuleWithOptions( result.resolvedPath, result.provider.type, {
                        cache: false,
                        referencingModule: null,
                        moduleImportDynamically: linker,
                        // moduleLinkerCallback: linker,
                    } );
                    //
                    // module = await loaders.sanitizeModule( module, modulePath, {
                    //     moduleType: result.provider.type,
                    //     context,
                    // } );

                    setTimeout( async () =>{
                        resolve( module );
                    }, 1000 )
                })
            }

            return loaders.loadModuleWithOptions( modulePath, "esm", {
                cache: false,
                referencingModule: null,
                moduleImportDynamically: linker,
                moduleLinkerCallback: linker,
            } );

            // return loaders.loadModule( modulePath, "esm", null, linker );
        } catch ( err ) {
            if ( err.message && ! ( err instanceof ErrorWithMeta ) ) {
                const deepStack = err.meta?.deepStack || [];

                deepStack.push( import.meta.url );

                err = new ErrorWithMeta( `Error in @zenflux/jest, While running \`${ modulePath }\` script`, {
                    ...err.meta || {},
                    config: vm.config.paths,
                    deepStack
                }, err );
            }

            throw err;
        }
    };

    await vm.auto( vm.config.paths.project + "/src/index.ts", loaders, resolvers ).catch( ( err ) => {
        if ( err.message ) {
            const deepStack = err.meta?.deepStack || [];

            deepStack.push( import.meta.url );

            err = new ErrorWithMeta( `Error in @zenflux/runner, While running ${ vm.config.paths.project + "/src/index.ts" } script`, {
                ...err.meta || {},
                config: vm.config.paths,
                deepStack
            }, err );
        }

        throw err;
    } );
} );
