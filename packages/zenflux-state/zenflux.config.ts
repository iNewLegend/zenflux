import type { IZConfig } from "@zenflux/cli";

const config: IZConfig = {
    format: [ "es" ],
    extensions: [ ".ts" ],
    inputPath: "src/index.ts",
    outputName: "@zenflux/state",
    outputFileName: "zenflux-state",
    external: [
        "@zenflux/core",
    ],
};

export default config;
