import type { IZConfig } from "@zenflux/cli";

const config: IZConfig = {
    format: [ "es" ],

    extensions: [ ".ts" ],

    inputPath: "src/index.ts",

    outputName: "@zenflux/shop-catalog-api",
    outputFileName: "shop-catalog-api",

    inputDtsPath: "dist/src/index.d.ts",
    outputDtsPath: "dist/shop-catalog-api.d.ts",

    external: [
        "@zenflux/core",
    ],
};

export default config;
