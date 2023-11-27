import ZenCore from "@zenflux/core";

export class Index extends ZenCore.commandBases.CommandRestful {
    static getName() {
        return "Catalog/Restful/Index";
    }

    getEndpoint() {
        return "catalog";
    }
}
