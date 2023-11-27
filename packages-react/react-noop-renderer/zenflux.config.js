"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    format: ["cjs"],
    extensions: [".ts"],
    inputPath: "src/index.ts",
    outputName: "@zenflux/react-noop-renderer",
    outputFileName: "zenflux-react-noop-renderer",
    external: [
        "react",
        "@zenflux/react-x-env",
        "@zenflux/react-x-env/internals",
        "@zenflux/react-reconciler",
        "@zenflux/react-scheduler",
        "@zenflux/react-scheduler/mock",
    ],
    moduleForwarding: {
        "@zenflux/react-reconciler": {
            "@zenflux/react-scheduler": "@zenflux/react-scheduler/mock",
        },
        "@zenflux/react-noop-renderer": {
            "@zenflux/react-scheduler": "@zenflux/react-scheduler/mock",
        }
    }
};
exports.default = config;
