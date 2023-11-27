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
exports.Get = void 0;
var core_1 = require("@zenflux/core");
var Get = /** @class */ (function (_super) {
    __extends(Get, _super);
    function Get() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Get.getName = function () {
        return "Catalog/Restful/Get";
    };
    Get.prototype.getEndpoint = function () {
        return "catalog/get/{ids}";
    };
    return Get;
}(core_1.default.commandBases.CommandRestful));
exports.Get = Get;
