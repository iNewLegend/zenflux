// noinspection ES6PreferShortImport

import ZenFlux from "@zenflux/core";

import type { interfaces } from "@zenflux/core";

const shared = {
    initZenCore: function() {
        ZenFlux.initialize( {} as interfaces.IAPIConfig );
    },

    destroyZenCore: function() {
        ZenFlux.destroy();
    }
};

export default shared;
