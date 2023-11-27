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
exports.Toggle = void 0;
var core_1 = require("@zenflux/core");
var redux_1 = require("@zenflux/redux");
var Toggle = /** @class */ (function (_super) {
    __extends(Toggle, _super);
    function Toggle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Toggle.getName = function () {
        return "Layout/Sidebar/Commands/Toggle";
    };
    Toggle.prototype.apply = function () {
        var controller = core_1.default.managers.controllers.get("Layout/Sidebar/Controller");
        // Toggle the sidebar.
        redux_1.default.store.getStore().dispatch(controller.getSlice().actions.toggle());
    };
    return Toggle;
}(core_1.default.commandBases.CommandPublic));
exports.Toggle = Toggle;
