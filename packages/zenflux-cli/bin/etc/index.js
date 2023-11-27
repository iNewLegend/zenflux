#!/usr/bin/env node
import path from "path";

import { fileURLToPath } from "url";

import * as child_process from "child_process";

const currentDir = path.dirname( fileURLToPath( import.meta.url ) );

if ( process.argv.includes( "--cjs" ) ) {
    // Exec `tsnode-vm.js` via process with arguments
    child_process.execSync( [
        path.resolve( currentDir, "cjs.js" ),
        ...process.argv.slice( 2 ),
    ].join( " " ), { stdio: 'inherit' } );
} else {
    // Exec `tsnode-vm.js` via process with arguments
    child_process.execSync( [
        path.resolve( currentDir, "tsnode-vm.js" ),
        ...process.argv.slice( 2 ),
    ].join( " " ), { stdio: 'inherit' } );
}
