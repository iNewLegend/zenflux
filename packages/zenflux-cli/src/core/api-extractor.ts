/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 */
import process from "node:process";
import util from "node:util";
import fs from "node:fs";
import path from "node:path";

import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";

import { ConsoleManager } from "@zenflux/cli/src/managers/console-manager";

export function zApiExporter( projectPath: string, inputPath: string, outputPath: string, activeConsole = ConsoleManager.$ ) {
    const logDiagnosticsFile = process.env.NODE_ENV === "development" ?
        path.resolve( projectPath, `log/api-extractor-diagnostics.${ path.basename( inputPath ) }.log` ) : undefined;

    // TODO, Make it configurable
    if ( logDiagnosticsFile ) {
        const logFolder = path.dirname( logDiagnosticsFile );

        // Ensure folder exists
        if ( ! fs.existsSync( logFolder ) ) {
            fs.mkdirSync( logFolder, { recursive: true } );
        }
    }

    activeConsole.verbose( () => [ zApiExporter.name, util.inspect( {
        projectPath,
        inputPath,
        outputPath,
    } ) ] );

    const extractorConfig: ExtractorConfig = ExtractorConfig.prepare( {
        configObject: {
            projectFolder: projectPath,
            mainEntryPointFilePath: inputPath,
            bundledPackages: [],
            compiler: {
                tsconfigFilePath: "<projectFolder>/tsconfig.api-extractor.json",
            },
            dtsRollup: {
                enabled: true,
                untrimmedFilePath: outputPath,
            }
        },
        configObjectFullPath: undefined,
        packageJsonFullPath: projectPath + "/package.json",
    } );

    if ( logDiagnosticsFile && fs.existsSync( logDiagnosticsFile ) ) {
        activeConsole.verbose( () => [ zApiExporter.name, `Removing old diagnostics file: ${ logDiagnosticsFile }` ] );
        fs.unlinkSync( logDiagnosticsFile );
    }

    const devDiagnostics: string[] = [];

    // Invoke API Extractor
    const result = Extractor.invoke( extractorConfig, {
        localBuild: true,
        showDiagnostics: process.env.NODE_ENV === "development",

        messageCallback( message ) {
            let handled = true;

            if ( logDiagnosticsFile ) {
                devDiagnostics.push( message.text );
            } else {
                switch ( message.logLevel ) {
                    case "error":
                        activeConsole.error( message.text );
                        break;
                    case "warning":
                        activeConsole.warn( `${ zApiExporter.name }`, "warning", message.text );
                        break;
                    case "verbose":
                        activeConsole.verbose( () => [ zApiExporter.name, message.text ] );
                        break;

                    case "info":
                        activeConsole.info( `${ zApiExporter.name }`, "info", message.text );
                        break;

                    default:
                        handled = false;
                };
            }

            // By default, API Extractor sends its messages to the console, this flag tells api-extractor to not log to console.
            message.handled = handled;
        }
    } );

    if ( logDiagnosticsFile ) {
        fs.writeFileSync( logDiagnosticsFile, devDiagnostics.join( "\n" ) );

        activeConsole.log( "Api-Extractor", "diagnostics file is created: ", `'${ logDiagnosticsFile }'` );
    }

    return result;
}
