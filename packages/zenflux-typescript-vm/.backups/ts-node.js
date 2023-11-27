import fs from "node:fs";

import tsNodeModule from 'ts-node';

export default class TsNode {
    /**
     * @param {string} tsConfigPath
     * @param {import("ts-node").RegisterOptions["readFile"]} tsConfigReadCallback
     */
    constructor( tsConfigPath, tsConfigReadCallback ) {
        /**
         * @type {import("ts-node").RegisterOptions}
         */
        const registerOptions = {
            project: tsConfigPath,

            files: true,

            transpileOnly: true,

            require: [
                "ts-node/register",
            ],

            readFile: ( path ) => {
                tsConfigReadCallback( path );

                return fs.readFileSync( path, "utf8" );
            }
        };

        const service = tsNodeModule.register( registerOptions ),
            esmHooks = tsNodeModule.createEsmHooks( service );

        this.service = service;
        this.hooks = {
            esm: esmHooks,
        };
    }
}

export { TsNode };
