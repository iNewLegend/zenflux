"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    transform: {
        ".*": "<rootDir>/../react-jest/jsx-transform.js"
    },
    setupFiles: [
        "<rootDir>/../react-jest/setup-react-env.js",
    ],
    setupFilesAfterEnv: [
        "<rootDir>/../react-jest/setup-react-tests.js",
    ],
    modulePaths: [
        "<rootDir>/../../node_modules",
    ],
};
exports.default = config;
