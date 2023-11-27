import ZenCore from "@zenflux/core";

export class Start extends ZenCore.commandBases.CommandInternal {
    static getName() {
        return "Catalog/Internal/Start";
    }

    protected async apply() {
        // Get the catalog data from the server
        const catalog = await ZenCore.managers.restful.get( "Catalog/Restful/Index", {} );

        // Set the catalog data in the store
        await ZenCore.managers.internal.run( "Catalog/Internal/Set", catalog );
    }
}
