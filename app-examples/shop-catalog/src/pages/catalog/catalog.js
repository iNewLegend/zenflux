"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spinner_tsx_1 = require("../../ui/spinner/spinner.tsx");
var catalog_tsx_1 = require("../../ui/catalog/catalog.tsx");
function default_1() {
    var items = [];
    if (!items.length) {
        return <spinner_tsx_1.default color={"red"}/>;
    }
    return (<div className="container">
            <catalog_tsx_1.default />
        </div>);
}
exports.default = default_1;
