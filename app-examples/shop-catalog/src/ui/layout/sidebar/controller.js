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
exports.SidebarController = void 0;
var redux_1 = require("@zenflux/redux");
var commands = require("./commands/");
var SidebarController = /** @class */ (function (_super) {
    __extends(SidebarController, _super);
    function SidebarController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SidebarController.getName = function () {
        return "Layout/Sidebar/Controller";
    };
    SidebarController.prototype.getCommands = function () {
        return commands;
    };
    SidebarController.prototype.getSliceInitialState = function () {
        return {
            status: false,
        };
    };
    SidebarController.prototype.getReducers = function () {
        return {
            activate: function (state) {
                state.status = true;
            },
            deactivate: function (state) {
                state.status = false;
            },
            toggle: function (state) {
                state.status = !state.status;
            }
        };
    };
    SidebarController.prototype.getState = function () {
        return _super.prototype.getState.call(this);
    };
    SidebarController.prototype.getSlice = function () {
        return _super.prototype.getSlice.call(this);
    };
    return SidebarController;
}(redux_1.default.core.Controller));
exports.SidebarController = SidebarController;
exports.default = SidebarController;
