"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@zenflux/core");
var internal = require("./commands/internal");
var restful = require("./commands/restful");
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Controller.getName = function () {
        return "Catalog/Controller";
    };
    Controller.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
    };
    Controller.prototype.getInternal = function () {
        return internal;
    };
    Controller.prototype.getRestful = function () {
        return restful;
    };
    return Controller;
}(core_1.default.bases.ControllerBase));
exports.default = Controller;
