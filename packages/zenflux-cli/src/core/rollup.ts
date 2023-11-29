/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 */
import path from "node:path";
import process from "node:process";

import nodeResolve from "@rollup/plugin-node-resolve";

import zRollupCjsAsyncWrapPlugin
    from "@zenflux/cli/src/core/rollup-plugins/rollup-cjs-async-wrap/rollup-cjs-async-wrap-plugin";
import zRollupCustomLoaderPlugin
    from "@zenflux/cli/src/core/rollup-plugins/rollup-custom-loader/rollup-custom-loader-plugin";

import zRollupSwcPlugin from "@zenflux/cli/src/core/rollup-plugins/rollup-swc/rollup-swc-plugin";

import { zTSConfigRead } from "@zenflux/cli/src/core/typescript";

import packageJSON from "@zenflux/cli/package.json";

import type { OutputOptions, OutputPlugin, Plugin, RollupOptions } from "rollup";

import type { IOutputArgs, IPluginArgs } from "@zenflux/cli/src/definitions/rollup";
import type { TZConfigInternalArgs } from "@zenflux/cli/src/definitions/config";
import type { TZFormatType } from "@zenflux/cli/src/definitions/zenflux";

/**
 * Function zRollupGetPlugins(): This function returns an array of Rollup plugins based on the provided arguments.
 */
export const zRollupGetPlugins = ( args: IPluginArgs, projectPath: string ): OutputPlugin[] => {
    const { extensions, format } = args;

    const plugins: Plugin[] = [];

    plugins.push( nodeResolve( { extensions } ) );

    if ( ! args.tsConfig ) {
        args.tsConfig = zTSConfigRead( format as TZFormatType, projectPath );
    }

    plugins.push( zRollupSwcPlugin( args as Required<IPluginArgs> ) );

    plugins.push( zRollupCustomLoaderPlugin( args ) );

    if ( "cjs" === format ) {
        // Depends on `transpiler` plugin
        plugins.push( zRollupCjsAsyncWrapPlugin( args ) );
    }

    return plugins;
};

/**
 * Function zRollupGetOutput(): Generates an OutputOptions object based on the provided arguments.
 * It configures the output format, file path, and other options for the Rollup output.
 */
export const zRollupGetOutput = ( args: IOutputArgs, projectPath: string ): OutputOptions => {
    const {
        format,
        outputName,
        outputFileName
    } = args;

    const tsConfig = zTSConfigRead( format as TZFormatType, projectPath );

    const outDir = `${ tsConfig.options.outDir || projectPath + "/dist" }`;

    const result: OutputOptions = {
        dir: outDir,
        entryFileNames: `${ outputFileName }.${ format }`,
        chunkFileNames: `${ outputFileName }-[name].${ format }`,

        sourcemap: tsConfig.options.sourceMap,

        format,

        indent: false,
        exports: "named",

        banner: "" +
            "/**\n" +
            ` * Bundled with love using the help of ${ packageJSON.name } toolkit v${ packageJSON.version }\n` +
            ` * Bundle name: ${ outputName } fileName: ${ outputFileName }, built at ${ new Date() }\n` +
            " */\n",

    };

    if ( outputName ) {
        result.name = outputName;
    }

    return result;
};

/**
 * Function zRollupGetConfig(): This function generates a Rollup configuration object based on the provided arguments.
 * It assembles the input, output, and plugin configurations for Rollup.
 */
export const zRollupGetConfig = ( args: TZConfigInternalArgs, projectPath: string ): RollupOptions => {
    const {
        extensions,
        external,
        format,
        inputPath,
        outputFileName,
        outputName,
    } = args;

    const result: RollupOptions = {
        input: path.isAbsolute( inputPath ) ? inputPath : path.resolve( projectPath, inputPath ),
        external,
    };

    const outputArgs: IOutputArgs = {
        format,
        outputName,
        outputFileName
    };

    if ( outputName ) {
        outputArgs.outputName = outputName;
    }

    result.output = zRollupGetOutput( outputArgs, projectPath );

    const pluginsArgs: IPluginArgs = {
        extensions: extensions,
        format: format,
        moduleForwarding: args.moduleForwarding,
        sourcemap: !! result.output.sourcemap,

        minify: "development" !== process.env.NODE_ENV,
    };

    result.plugins = zRollupGetPlugins( pluginsArgs, projectPath );

    return result;
};
