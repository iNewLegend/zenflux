"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var process = require("node:process");
var config = {
    format: ["es", "cjs"],
    extensions: [".ts", ".tsx"],
    inputPath: "src/index.ts",
    outputName: "@zenflux/react-reconciler",
    outputFileName: "zenflux-react-reconciler",
    inputDtsPath: process.env.NODE_ENV === "development" ? "dist/packages-react/zenflux-react-reconciler/src/index.d.ts" : "dist/src/index.d.ts",
    outputDtsPath: "dist/zenflux-react-reconciler.d.ts",
    external: [
        "react",
        "@zenflux/react-x-env",
        "@zenflux/react-x-env/internals",
        "@zenflux/react-scheduler"
    ],
};
exports.default = config;
