import type { IZConfig } from "@zenflux/cli";

const config: IZConfig = {
    format: [ "cjs" ],

    extensions: [ ".ts" ],

    inputPath: "src/index.ts",

    outputName: "@zenflux/react-test-renderer",
    outputFileName: "zenflux-react-test-renderer",

    external: [
        "@zenflux/react-x-env",
        "@zenflux/react-x-env/internals",
        "@zenflux/react-x-env/hooks",
        "@zenflux/react-scheduler",
        "@zenflux/react-scheduler/mock",
        "@zenflux/react-reconciler",
    ],

    moduleForwarding: {
        "@zenflux/react-test-renderer": {
            "@zenflux/react-scheduler": "@zenflux/react-scheduler/mock",
        },
    },

    enableCustomLoader: true,
};

export default config;
