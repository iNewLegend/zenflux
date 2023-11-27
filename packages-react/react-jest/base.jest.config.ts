import type { Config } from "@jest/types";

const config: Config.InitialProjectOptions = {
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

export default config;
