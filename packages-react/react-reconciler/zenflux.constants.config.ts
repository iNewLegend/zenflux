import * as process from "node:process";

import type { IZConfig } from "@zenflux/cli";

const config: IZConfig = {
    format: [ "es", "cjs" ],

    extensions: [ ".ts" ],

    inputPath: "src/constants.ts",

    outputName: "@zenflux/react-reconciler-constants",
    outputFileName: "zenflux-react-reconciler.constants",

    inputDtsPath: process.env.NODE_ENV === "development" ? "dist/packages-react/zenflux-react-reconciler/src/constants.d.ts" : "dist/src/constants.d.ts",
    outputDtsPath: "dist/zenflux-react-reconciler.constants.d.ts",

    external: [
        "react",
        "@zenflux/react-x-env",
        "@zenflux/react-x-env/internals",
        "@zenflux/react-scheduler"
    ],
};

export default config;
