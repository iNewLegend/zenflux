import ZenCore from "@zenflux/core";

import { catalogSubject, ICatalogResponse } from "../../model.ts";

export class Set extends ZenCore.commandBases.CommandInternal {
    static getName() {
        return "Catalog/Internal/Set";
    }

    protected async apply( args: ICatalogResponse ) {
        catalogSubject.next( {
            ...catalogSubject.getValue(),
            ...args,
        } );
    }
}
