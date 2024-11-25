import { measureMemory } from "node:vm";

import util from "node:util";

export default function() {
    const argIndex = process.argv.findIndex( a => a === "--zvm-memory-verbose" );

    if  ( argIndex !== -1 ) {
        let mode = process.argv[ argIndex + 1 ];

        switch( mode ) {
            case "isolated": {
                mode = "summary"
            }
                break;

            default:
            case "total":
                mode = "detailed";
                break;
        }

        const printMemoryUsage = () =>{
            /**
             * @typedef {ReturnType<typeof import("node:vm").measureMemory>} ResultPromise
             */
            measureMemory( {
                mode,
                execution: "eager"
            } ).then( ( result ) => {
                /**
                 * @type {Awaited<ResultPromise>}
                 */
                const usage = result;

                // Convert to MB.
                const formated  = {
                    estimate: ( Math.round( usage.total.jsMemoryEstimate / 1024 / 1024 * 100 ) / 100  ) + "MB",
                    low: ( Math.round( usage.total.jsMemoryRange[ 0 ] / 1024 / 1024 * 100 ) / 100  ) + "MB",
                    high: ( Math.round( usage.total.jsMemoryRange[ 1 ] / 1024 / 1024 * 100 ) / 100  ) + "MB",
                };

                console.log( "--zvm-memory-verbose with mode:", mode, util.inspect( formated ) );
            } );
        };

        printMemoryUsage();

        setInterval( printMemoryUsage, mode === "summary" ? 10000 : 1000 );
    }
}
