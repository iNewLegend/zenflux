import ZenCore from "@zenflux/core";

export class Get extends ZenCore.commandBases.CommandRestful {
    static getName() {
        return "Catalog/Restful/Get";
    }

    getEndpoint() {
        return "catalog/get/{ids}";
    }
}
