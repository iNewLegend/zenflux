#!/usr/bin/env node --unhandled-rejections=strict --experimental-vm-modules --trace-uncaught --trace-exit
import toolkit from "../../dist/index.cjs";

await toolkit.default();
