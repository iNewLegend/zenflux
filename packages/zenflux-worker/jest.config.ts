import type { Config } from "@jest/types";

const config: Config.InitialProjectOptions = {
    testRegex: "(/test/.*\\.spec\\.ts)$",

    extensionsToTreatAsEsm: ['.ts', '.tsx'],

    cache: ! process.argv.includes( "--ci" ),
};

export default config;
