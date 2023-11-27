"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var catalog_1 = require("./catalog/catalog");
var checkout_1 = require("./checkout/checkout");
var spinner_1 = require("../ui/spinner/spinner");
function getCurrent() {
    // ZenCore.routes.getCurrent('pages') returns the current route
    var current = (1 === 1) ? "Catalog" : "Checkout";
    switch (current) {
        case "Catalog":
            return <catalog_1.default />;
        case "Checkout":
            return <checkout_1.default />;
        // Favor suspense over loading
        default:
            return <spinner_1.default />;
    }
}
function Pages() {
    return (<div className="page">
            {getCurrent()}
        </div>);
}
exports.default = Pages;
