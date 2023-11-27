import * as process from "node:process";

import type { IZConfig } from "@zenflux/cli";

const config: IZConfig = {
    format: [ "es", "cjs" ],

    extensions: [ ".ts", ".tsx" ],

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

export default config;
