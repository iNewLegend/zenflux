import type { IZConfig } from "@zenflux/cli";

const config: IZConfig = {
    format: [ "es", "cjs" ],

    extensions: [ ".ts" ],

    inputPath: "src/index.mock.ts",

    outputName: "@zenflux/react-scheduler",
    outputFileName: "zenflux-react-scheduler.mock",

    inputDtsPath: "dist/src/index.mock.d.ts",
    outputDtsPath: "dist/zenflux-react-scheduler.mock.d.ts",
};

export default config;
