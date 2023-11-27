import ZenCore from "@zenflux/core";

import * as internal from "./commands/internal";
import * as restful from "./commands/restful";

export default class Controller extends ZenCore.bases.ControllerBase {
    public static getName() {
        return "Catalog/Controller";
    }

    protected initialize() {
        super.initialize();
    }

    protected getInternal() {
        return internal;
    }

    protected getRestful() {
        return restful;
    }
}
