"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./spinner.css");
function Spinner(_a) {
    var _b = _a.color, color = _b === void 0 ? "lightskyblue" : _b;
    return (<div className="spinner" style={{ borderTopColor: color }}></div>);
}
exports.default = Spinner;
