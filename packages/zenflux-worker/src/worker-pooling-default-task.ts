import util from "util";

import { ConsoleThreadSend } from "@zenflux/cli/src/console/console-thread-send";
import { ConsoleManager } from "@zenflux/cli/src/managers/console-manager";

import { ensureInWorker } from "@zenflux/worker/utils";

import type { DThreadHostInterface } from "@zenflux/worker/definitions";

export function workerDefaultTask( args: any[], host: DThreadHostInterface ) {
    ensureInWorker();

    // Hook console logs to thread messages.
    ConsoleManager.setInstance( new ConsoleThreadSend( host ) );

    ConsoleManager.$.verbose( () => [ "Worker started.", util.inspect( { args, host } ) ] );
}
