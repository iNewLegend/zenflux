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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIChannelsModule = void 0;
/**
 * This a POC, made during the assignment, comments generated by github copilot.
 */
var commands_manager_1 = require("@zenflux/react-commander/commands-manager");
var api_module_base_ts_1 = require("@zenflux/react-api/src/api-module-base.ts");
var channel_constants_1 = require("@zenflux/app-budget-allocation/src/components/channel/channel-constants");
var utils_1 = require("@zenflux/app-budget-allocation/src/utils");
var APIChannelsModule = /** @class */ (function (_super) {
    __extends(APIChannelsModule, _super);
    function APIChannelsModule(api) {
        var _this = _super.call(this, api) || this;
        _this.channelsItemState = {};
        _this.lastChannelsItemState = {};
        _this.lastChannelsItemStateUpdated = {};
        _this.registerEndpoints();
        _this.initializeAutosaveHandler();
        var dataRescuerCallback = function () {
            console.log("APIChannelsModule: dataRescuerCallback()", {
                autoSaveHandler: _this.autosaveHandler,
                lastChannelsItemState: _this.lastChannelsItemState,
            });
            if (_this.autosaveHandler) {
                // Save immediately when the page is closed.
                _this.autosaveHandler(true);
            }
            if (Object.keys(_this.lastChannelsItemState).length > 0) {
                return false;
            }
            return true;
        };
        window.onbeforeunload = function () {
            var result = dataRescuerCallback();
            if (!result) {
                return "Changes you made may not be saved.";
            }
            return undefined;
        };
        return _this;
    }
    APIChannelsModule.getName = function () {
        return "channels";
    };
    APIChannelsModule.prototype.registerEndpoints = function () {
        this.register("GET", "App/ChannelsList", "v1/channels");
        this.register("GET", "App/ChannelItem", "v1/channels/:key");
        this.register("POST", "App/ChannelItem", "v1/channels/:key");
    };
    APIChannelsModule.prototype.requestHandler = function (component, element, request) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, request];
            });
        });
    };
    APIChannelsModule.prototype.responseHandler = function (component, element, response) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, response.json()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.handleResponseBasedOnElementName(element.getName(), result, component)];
                }
            });
        });
    };
    // Handle the mounting of the component. This involves different handling depending on the component name.
    APIChannelsModule.prototype.onMount = function (component, context) {
        switch (context.componentName) {
            case "App/ChannelsList":
                this.onChannelsListMount(component, context);
                break;
            case "App/ChannelItem":
                this.onChannelItemMount(component, context);
                break;
            default:
                throw new Error("APIChannelsModule: onMount() - Unknown component: ".concat(context.componentName));
        }
    };
    APIChannelsModule.prototype.onUnmount = function (component, context) {
        switch (context.componentName) {
            case "App/ChannelsList":
                this.onChannelsListUnmount(component, context);
                break;
            case "App/ChannelItem":
                this.onChannelItemUnmount(component, context);
                break;
            default:
                throw new Error("APIChannelsModule: onUnmount() - Unknown component: ".concat(context.componentName));
        }
    };
    // Handle the updating of the component. This involves different handling depending on the component name.
    APIChannelsModule.prototype.onUpdate = function (component, context, state) {
        var currentState = state.currentState, prevState = state.prevState;
        switch (context.componentName) {
            case "App/ChannelsList":
                if (currentState.channels !== prevState.channels) {
                    this.onChannelsChanged(prevState.channels, currentState.channels);
                }
                break;
            case "App/ChannelItem":
                this.channelsItemState[state.currentProps.meta.id] = state;
                this.lastChannelsItemState[state.currentProps.meta.id] = state;
                break;
            default:
                throw new Error("APIChannelsModule: onUpdate() - Unknown component: ".concat(context.componentName));
        }
    };
    APIChannelsModule.prototype.initializeAutosaveHandler = function () {
        var _this = this;
        if (!this.autosaveHandler) {
            this.autosaveHandler = function (immediate) {
                if (immediate) {
                    _this.saveChannels();
                    return true;
                }
                else {
                    _this.autoSaveChannels();
                }
                return false;
            };
            setInterval(function () {
                var _a;
                (_a = _this.autosaveHandler) === null || _a === void 0 ? void 0 : _a.call(_this);
            }, 5000);
        }
    };
    // Handle the API response based on the element name. This allows different handling for different types of responses.
    APIChannelsModule.prototype.handleResponseBasedOnElementName = function (elementName, result, component) {
        switch (elementName) {
            case "App/ChannelsList":
                return this.handleChannelsListResponse(result, component);
            case "App/ChannelItem":
                return this.handleChannelItemResponse(result);
            default:
                return result;
        }
    };
    // Handle the response for the channels list. This involves mapping over the result and creating a new object for each item.
    APIChannelsModule.prototype.handleChannelsListResponse = function (result, component) {
        return {
            children: result.map(function (i) {
                var key = i.key;
                delete i.key;
                return {
                    key: key,
                    props: i,
                    type: component.props.children.props.type,
                };
            }),
        };
    };
    // Handle the response for an individual channel item. This involves creating a new object with the key and breaks properties modified.
    APIChannelsModule.prototype.handleChannelItemResponse = function (result) {
        if (result.breaks) {
            result.breaks = result.breaks.map(function (i) { return (__assign(__assign({}, i), { date: new Date(i.date) })); });
        }
        return result;
    };
    // Handle the mounting of the channels list. This involves setting up a timer to auto save channels every 5 seconds.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    APIChannelsModule.prototype.onChannelsListMount = function (component, context) {
        var _this = this;
        var commands = commands_manager_1.default.get("UI/Accordion", true);
        if (!commands)
            return;
        var onSelectionAttached = commands["UI/Accordion/onSelectionAttached"], onSelectionDetached = commands["UI/Accordion/onSelectionDetached"];
        var saveChannelsCallback = function () {
            _this.autoSaveChannels();
        };
        onSelectionAttached.global().globalHook(saveChannelsCallback);
        onSelectionDetached.global().globalHook(saveChannelsCallback);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    APIChannelsModule.prototype.onChannelsListUnmount = function (component, context) {
        // Save immediately when the channels list is unmounted.
        this.saveChannels();
        var commands = commands_manager_1.default.get("UI/Accordion", true);
        if (!commands)
            return;
        var onSelectionAttached = commands["UI/Accordion/onSelectionAttached"], onSelectionDetached = commands["UI/Accordion/onSelectionDetached"];
        onSelectionAttached.global().globalUnhook();
        onSelectionDetached.global().globalUnhook();
    };
    // Handle the mounting of an individual channel item. This involves fetching the channel data from the API and updating the state if necessary.
    APIChannelsModule.prototype.onChannelItemMount = function (component, context) {
        return __awaiter(this, void 0, void 0, function () {
            var key, apiData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = context.props.meta.id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.fetchAPIGetChannel(key)];
                    case 2:
                        apiData = _a.sent();
                        // Set current for next code execution.
                        this.channelsItemState[key] = {
                            currentProps: context.props,
                            currentState: context.getState(),
                        };
                        if (context.isMounted() && this.shouldUpdateStateFromRemote(apiData, key, context)) {
                            this.updateStateFromRemote(apiData, context);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.warn("An error occurred while fetching API data, the state will not be updated, this area considered to be safe", error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    APIChannelsModule.prototype.onChannelItemUnmount = function (component, context) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                // If state is the same as the last known state, then it is safe to remove it.
                if (Object.values(this.lastChannelsItemStateUpdated).find(function (l) { return l === context.getState(); })) {
                    delete this.lastChannelsItemState[context.props.meta.id];
                    delete this.lastChannelsItemStateUpdated[context.props.meta.id];
                    return [2 /*return*/];
                }
                (_a = this.autosaveHandler) === null || _a === void 0 ? void 0 : _a.call(this, true);
                return [2 /*return*/];
            });
        });
    };
    // Handle when the channels change. This involves comparing the previous and current channels and updating the meta data if necessary.
    APIChannelsModule.prototype.onChannelsChanged = function (prevChannels, currentChannels) {
        for (var i = 0; i < currentChannels.length; i++) {
            if (!prevChannels[i] || !currentChannels[i])
                continue;
            if (prevChannels[i].props.meta !== currentChannels[i].props.meta) {
                this.onChannelsMetaDataChanged(currentChannels[i].props.meta.id, currentChannels[i].props.meta, prevChannels[i].props.meta);
            }
        }
        var prevKeys = prevChannels.map(function (channel) { return channel.props.meta.id; });
        var currentKeys = currentChannels.map(function (channel) { return channel.props.meta.id; });
        var addedKeys = currentKeys.filter(function (key) { return !prevKeys.includes(key); });
        var _loop_1 = function (key) {
            var newChannel = currentChannels.find(function (channel) { return channel.props.meta.id === key; });
            if (newChannel && newChannel.props && newChannel.props.meta) {
                this_1.onChannelAdded(newChannel);
            }
        };
        var this_1 = this;
        for (var _i = 0, addedKeys_1 = addedKeys; _i < addedKeys_1.length; _i++) {
            var key = addedKeys_1[_i];
            _loop_1(key);
        }
        if (addedKeys.length > 0) {
            return;
        }
        var removedKeys = prevKeys.filter(function (key) { return !currentKeys.includes(key); });
        for (var _a = 0, removedKeys_1 = removedKeys; _a < removedKeys_1.length; _a++) {
            var key = removedKeys_1[_a];
            this.onChannelRemoved(key);
        }
        if (removedKeys.length > 0) {
            return;
        }
    };
    APIChannelsModule.prototype.onChannelAdded = function (newChannel) {
        // Send a POST request to the API to create the new channel
        this.api.fetch("POST", "v1/channels/:key", {
            key: newChannel.props.meta.id,
            meta: newChannel.props.meta,
        }, function (r) { return r.json(); });
    };
    APIChannelsModule.prototype.onChannelRemoved = function (key) {
        var _this = this;
        this.api.fetch("DELETE", "v1/channels/".concat(key), {}, function (r) { return r.json(); }).then(function () {
            delete _this.channelsItemState[key];
            // Safe removed.
            delete _this.lastChannelsItemState[key];
        });
    };
    // Handle when the meta data of a channel changes. This involves sending a POST request to the API with the new meta data.
    APIChannelsModule.prototype.onChannelsMetaDataChanged = function (key, currentMeta, _prevMeta) {
        var _a, _b, _c, _d;
        if ((_b = (_a = this.channelsItemState[key]) === null || _a === void 0 ? void 0 : _a.currentState) === null || _b === void 0 ? void 0 : _b.meta) {
            this.channelsItemState[key].currentState.meta = currentMeta;
        }
        if ((_d = (_c = this.lastChannelsItemState[key]) === null || _c === void 0 ? void 0 : _c.currentState) === null || _d === void 0 ? void 0 : _d.meta) {
            this.lastChannelsItemState[key].currentState.meta = currentMeta;
        }
        this.api.fetch("POST", "v1/channels/:key", { key: key, meta: currentMeta }, function (r) { return r.json(); });
    };
    APIChannelsModule.prototype.autoSaveChannels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.autosaveDebounceTimer) {
                    clearTimeout(this.autosaveDebounceTimer);
                }
                // This will ensure that the channels are saved once per x requests during the debounce period.
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.autosaveDebounceTimer = setTimeout(function () {
                            _this.saveChannels();
                            resolve(true);
                        }, 800);
                    })];
            });
        });
    };
    // Save the channels. This involves finding all the channel item contexts and sending a POST request to the API with the state of each channel.
    APIChannelsModule.prototype.saveChannels = function () {
        var _this = this;
        var _a;
        var lastKnownStates = Object.values(this.lastChannelsItemState);
        if (!lastKnownStates.length)
            return;
        try {
            console.log("APIChannelsModule: saveChannels()");
            lastKnownStates.forEach(function (state) {
                var key = (state.props || state.currentProps).meta.id;
                var stateToSave = (0, utils_1.pickEnforcedKeys)(__assign(__assign({}, state.currentProps), state.currentState), channel_constants_1.CHANNEL_LIST_STATE_DATA_WITH_META);
                console.log("APIChannelsModule: saveChannels() - stateToSave", stateToSave);
                _this.api.fetch("POST", "v1/channels/:key", __assign({ key: key }, stateToSave), function (_r) {
                    _this.lastChannelsItemStateUpdated[key] = stateToSave;
                    delete _this.lastChannelsItemState[key];
                });
            });
        }
        catch (error) {
            (_a = this.autosaveHandler) === null || _a === void 0 ? void 0 : _a.call(this);
        }
    };
    // Update the state with the data from the API.
    APIChannelsModule.prototype.updateStateFromRemote = function (apiData, context) {
        console.log("%c APIChannelsModule: updateStateFromRemote()", "font-weight:bold;", apiData);
        if (apiData.breaks) {
            apiData.breaks = apiData.breaks.map(function (i) { return (__assign(__assign({}, i), { date: new Date(i.date) })); });
        }
        context.setState(apiData);
    };
    // Determine whether the state should be updated. This involves comparing the current state with the data from the API.
    APIChannelsModule.prototype.shouldUpdateStateFromRemote = function (apiData, key, context) {
        var currentItemState = this.channelsItemState[key];
        // If the current item state is not available, then you cannot update the state.
        if (!currentItemState.currentProps)
            return false;
        var vdom = (0, utils_1.pickEnforcedKeys)(__assign(__assign({}, currentItemState.currentProps), context.getState()), channel_constants_1.CHANNEL_LIST_STATE_DATA_WITH_META);
        var api = (0, utils_1.pickEnforcedKeys)(apiData, channel_constants_1.CHANNEL_LIST_STATE_DATA_WITH_META);
        return JSON.stringify(vdom) !== JSON.stringify(api);
    };
    // Fetch the channel data from the API.
    APIChannelsModule.prototype.fetchAPIGetChannel = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.fetch("GET", "v1/channels/".concat(key), {}, function (res) { return res.json(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return APIChannelsModule;
}(api_module_base_ts_1.APIModuleBase));
exports.APIChannelsModule = APIChannelsModule;
