"use strict";
// noinspection ES6PreferShortImport
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@zenflux/core");
var shared = {
    initZenCore: function () {
        core_1.default.initialize({});
    },
    destroyZenCore: function () {
        core_1.default.destroy();
    }
};
exports.default = shared;
