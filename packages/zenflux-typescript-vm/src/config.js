import util from "node:util";

import { zCreateResolvablePromise } from "@zenflux/utils/src/promise";

import { verbose } from "./utils.js";

const defineConfigPromise = zCreateResolvablePromise();

export const externalConfig = {
    /**
     * Enable support for resolving workspace packages, eg: `@company/package`,
     * it will read "workspace" field from `package.json`.
     *
     * @type {string}
     */
    workspacePath: "",

    projectPath: "./",
    entrypointPath: "src/index.ts",
    nodeModulesPath: "../node_modules",

    tsConfigPath: "./tsconfig.json",
    tsConfigVerbose: ( path ) => {
        verbose( "typescript-vm", "readConfig", () => `reading: ${ util.inspect( path ) }` );
    },

    /**
     * @type {import("node:vm").Context}
     */
    vmContext: {},

    /**
     * @type {import("node:vm").CreateContextOptions}
     */
    vmContextOptions: {},

    /**
     * @type {import("node:vm").ModuleEvaluateOptions}
     */
    vmModuleEvaluateOptions: {},

    /**
     * @type {"swc"|"ts-node"}

     * @default {"swc"}
     */
    useCompiler: "swc",

    /**
     * @type {Array<(path:string,code:string,options:vm.SourceTextModuleOptions) => { source: import("MagicString").default, transformerId: string} | undefiend>}
     */
    moduleTransformers: [],

    /**
     * Extensions to use when resolving modules, without a leading dot.
     */
    extensions: [ ".ts", ".tsx", ".js", ".jsx", ".json" ],
};

/**
 * @param {typeof externalConfig} config
 */
function validateConfig( config ) {
    const haveValidCompiler = [ "swc", "ts-node" ].includes( config.useCompiler );

    if ( ! haveValidCompiler ) {
        throw new Error( `useCompiler must be one of: ${ util.inspect( [ "swc", "ts-node" ] ) }, got: ${ util.inspect( config.useCompiler ) }` );
    }
}

/**
 * @param {typeof externalConfig} config
 */
export function defineConfig( config ) {
    Object.assign( externalConfig, config );

    validateConfig( externalConfig );

    defineConfigPromise.resolve();
};

export async function waitForConfig() {
    await defineConfigPromise.promise;
}
