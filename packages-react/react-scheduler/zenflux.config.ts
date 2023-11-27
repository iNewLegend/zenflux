import type { IZConfig } from "@zenflux/cli";

const config: IZConfig = {
    format: [ "es", "cjs" ],

    extensions: [ ".ts" ],

    inputPath: "src/index.ts",

    outputName: "@zenflux/react-scheduler",
    outputFileName: "zenflux-react-scheduler",

    inputDtsPath: "dist/src/index.d.ts",
    outputDtsPath: "dist/zenflux-react-scheduler.d.ts",
};

export default config;
