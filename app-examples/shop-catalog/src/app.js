"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@zenflux/core");
require("@zenflux/logging");
var zenflux_config_1 = require("./zenflux-config");
var controller_ts_1 = require("./api/catalog/controller.ts");
require("./assets/css/index.css");
var navbar_1 = require("./ui/layout/navbar/navbar");
var sidebar_1 = require("./ui/layout/sidebar/sidebar");
var pages_tsx_1 = require("./pages/pages.tsx");
// It maybe caused by import + global, maybe only when current file is re-compiling?
try {
    core_1.default.initialize(zenflux_config_1.default);
    core_1.default.managers.controllers.register(new controller_ts_1.default);
}
catch (e) {
    // Determine how to handle this error
    console.warn(e);
}
setTimeout(function () {
    core_1.default.managers.internal.run("Catalog/Internal/Start");
});
function App() {
    return (<>
            <header>
                <navbar_1.default />
            </header>

            <sidebar_1.default />

            <section className="main">
                <pages_tsx_1.default />
            </section>
        </>);
}
exports.default = App;
