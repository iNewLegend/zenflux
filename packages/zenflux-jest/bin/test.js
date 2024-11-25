// test.js
import MagicString from "magic-string";
import { diff } from "jest-diff";

function organizeImportsAndMocks(input) {
    const magicString = new MagicString(input);
    const length = input.length;

    let i = 0;
    let jestGlobalsImport = '';
    let jestMockCalls = [];
    let otherCode = [];

    // Step 1: Scan the input and gather information
    while (i < length) {
        // Detect comments
        if (input.startsWith('//', i)) {
            const newlineIndex = input.indexOf('\n', i);
            otherCode.push(input.slice(i, newlineIndex + 1));
            i = newlineIndex !== -1 ? newlineIndex + 1 : length;
        } else if (input.startsWith('/*', i)) {
            const endCommentIndex = input.indexOf('*/', i);
            otherCode.push(input.slice(i, endCommentIndex + 2));
            i = endCommentIndex !== -1 ? endCommentIndex + 2 : length;
        }
        // Detect imports
        else if (input.startsWith('import ', i)) {
            const newlineIndex = input.indexOf('\n', i);
            const importStatement = input.slice(i, newlineIndex);

            // Check for Jest globals import
            if (importStatement.includes('@jest/globals')) {
                jestGlobalsImport = importStatement;
            } else {
                otherCode.push(importStatement + '\n'); // Keep other imports
            }
            i = newlineIndex !== -1 ? newlineIndex + 1 : length;
        }
        // Detect jest.mock calls
        else if (input.startsWith('jest.mock', i)) {
            const newlineIndex = input.indexOf('\n', i);
            jestMockCalls.push(input.slice(i, newlineIndex + 1));
            i = newlineIndex + 1;
        }
        // Keep other code blocks in place
        else {
            const newlineIndex = input.indexOf('\n', i);
            otherCode.push(input.slice(i, newlineIndex + 1));
            i = newlineIndex !== -1 ? newlineIndex + 1 : length;
        }
    }

    // Step 2: Create the output with organized structure
    let output = '';
    if (jestGlobalsImport) {
        output += jestGlobalsImport + '\n'; // Add Jest globals at the top
    }

    // Step 3: Insert all `jest.mock` calls
    if (jestMockCalls.length > 0) {
        output += jestMockCalls.join(''); // Add all jest.mock calls
    }

    // Step 4: Reinsert preserved comments and other code
    output += otherCode.join(''); // Append comments and remaining code

    return output;
}

const input = `
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

// // import fs from "node:fs";
// //
// //
// // import { WorkerServer } from "@zenflux/worker/worker-server";
// // } );
`;

const output = organizeImportsAndMocks( input );

const desiredOutput = `
// var exports;
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
// debugger
jest.mock( 'node:fs' );

import * as _fs from 'node:fs';

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

// // import fs from "node:fs";
// //
// //
// // import { WorkerServer } from "@zenflux/worker/worker-server";
// // } );
`

const theDiff = diff( desiredOutput, output, {
    expand: false,
} )

console.log(theDiff)

console.log("The output is:")
console.log(output)
