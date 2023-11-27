/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */
'use strict';
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
describe('SimpleEventPlugin', function () {
    var _this = this;
    var React;
    var ReactDOM;
    var ReactDOMClient;
    var Scheduler;
    var act;
    var onClick;
    var container;
    var assertLog;
    var waitForAll;
    function expectClickThru(element) {
        element.click();
        expect(onClick).toHaveBeenCalledTimes(1);
    }
    function expectNoClickThru(element) {
        element.click();
        expect(onClick).toHaveBeenCalledTimes(0);
    }
    function mounted(element) {
        container = document.createElement('div');
        document.body.appendChild(container);
        element = ReactDOM.render(element, container);
        return element;
    }
    beforeEach(function () {
        jest.resetModules();
        React = require('react');
        ReactDOM = require('react-dom');
        ReactDOMClient = require('react-dom/client');
        Scheduler = require('scheduler');
        var InternalTestUtils = require('internal-test-utils');
        assertLog = InternalTestUtils.assertLog;
        waitForAll = InternalTestUtils.waitForAll;
        onClick = jest.fn();
    });
    afterEach(function () {
        if (container && document.body.contains(container)) {
            document.body.removeChild(container);
            container = null;
        }
    });
    it('A non-interactive tags click when disabled', function () {
        var element = <div onClick={onClick}/>;
        expectClickThru(mounted(element));
    });
    it('A non-interactive tags clicks bubble when disabled', function () {
        var element = mounted(<div onClick={onClick}>
            <div />
        </div>);
        var child = element.firstChild;
        child.click();
        expect(onClick).toHaveBeenCalledTimes(1);
    });
    it('does not register a click when clicking a child of a disabled element', function () {
        var element = mounted(<button onClick={onClick} disabled={true}>
            <span />
        </button>);
        var child = element.querySelector('span');
        child.click();
        expect(onClick).toHaveBeenCalledTimes(0);
    });
    it('triggers click events for children of disabled elements', function () {
        var element = mounted(<button disabled={true}>
            <span onClick={onClick}/>
        </button>);
        var child = element.querySelector('span');
        child.click();
        expect(onClick).toHaveBeenCalledTimes(1);
    });
    it('triggers parent captured click events when target is a child of a disabled elements', function () {
        var element = mounted(<div onClickCapture={onClick}>
            <button disabled={true}>
                <span />
            </button>
        </div>);
        var child = element.querySelector('span');
        child.click();
        expect(onClick).toHaveBeenCalledTimes(1);
    });
    it('triggers captured click events for children of disabled elements', function () {
        var element = mounted(<button disabled={true}>
            <span onClickCapture={onClick}/>
        </button>);
        var child = element.querySelector('span');
        child.click();
        expect(onClick).toHaveBeenCalledTimes(1);
    });
    ['button', 'input', 'select', 'textarea'].forEach(function (tagName) {
        describe(tagName, function () {
            it('should forward clicks when it starts out not disabled', function () {
                var element = React.createElement(tagName, {
                    onClick: onClick
                });
                expectClickThru(mounted(element));
            });
            it('should not forward clicks when it starts out disabled', function () {
                var element = React.createElement(tagName, {
                    onClick: onClick,
                    disabled: true
                });
                expectNoClickThru(mounted(element));
            });
            it('should forward clicks when it becomes not disabled', function () {
                container = document.createElement('div');
                document.body.appendChild(container);
                var element = ReactDOM.render(React.createElement(tagName, {
                    onClick: onClick,
                    disabled: true
                }), container);
                element = ReactDOM.render(React.createElement(tagName, {
                    onClick: onClick
                }), container);
                expectClickThru(element);
            });
            it('should not forward clicks when it becomes disabled', function () {
                container = document.createElement('div');
                document.body.appendChild(container);
                var element = ReactDOM.render(React.createElement(tagName, {
                    onClick: onClick
                }), container);
                element = ReactDOM.render(React.createElement(tagName, {
                    onClick: onClick,
                    disabled: true
                }), container);
                expectNoClickThru(element);
            });
            it('should work correctly if the listener is changed', function () {
                container = document.createElement('div');
                document.body.appendChild(container);
                var element = ReactDOM.render(React.createElement(tagName, {
                    onClick: onClick,
                    disabled: true
                }), container);
                element = ReactDOM.render(React.createElement(tagName, {
                    onClick: onClick,
                    disabled: false
                }), container);
                expectClickThru(element);
            });
        });
    });
    it('batches updates that occur as a result of a nested event dispatch', function () {
        container = document.createElement('div');
        document.body.appendChild(container);
        var button;
        var Button = /** @class */ (function (_super) {
            __extends(Button, _super);
            function Button() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.state = {
                    count: 0
                };
                _this.increment = function () { return _this.setState(function (state) { return ({
                    count: state.count + 1
                }); }); };
                return _this;
            }
            Button.prototype.componentDidUpdate = function () {
                Scheduler.log("didUpdate - Count: ".concat(this.state.count));
            };
            Button.prototype.render = function () {
                var _this = this;
                return <button ref={function (el) { return button = el; }} onFocus={this.increment} onClick={function () {
                        // The focus call synchronously dispatches a nested event. All of
                        // the updates in this handler should be batched together.
                        _this.increment();
                        button.focus();
                        _this.increment();
                    }}>
                    Count: {this.state.count}
                </button>;
            };
            return Button;
        }(React.Component));
        function click() {
            button.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            }));
        }
        ReactDOM.render(<Button />, container);
        expect(button.textContent).toEqual('Count: 0');
        assertLog([]);
        click();
        // There should be exactly one update.
        assertLog(['didUpdate - Count: 3']);
        expect(button.textContent).toEqual('Count: 3');
    });
    describe('interactive events, in concurrent mode', function () {
        beforeEach(function () {
            jest.resetModules();
            React = require('react');
            ReactDOM = require('react-dom');
            ReactDOMClient = require('react-dom/client');
            Scheduler = require('scheduler');
            var InternalTestUtils = require('internal-test-utils');
            assertLog = InternalTestUtils.assertLog;
            waitForAll = InternalTestUtils.waitForAll;
            act = require('internal-test-utils').act;
        });
        it('flushes pending interactive work before exiting event handler', function () { return __awaiter(_this, void 0, void 0, function () {
            function click() {
                var event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                });
                Object.defineProperty(event, 'timeStamp', {
                    value: 0
                });
                button.dispatchEvent(event);
            }
            var root, button, Button;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = document.createElement('div');
                        root = ReactDOMClient.createRoot(container);
                        document.body.appendChild(container);
                        Button = /** @class */ (function (_super) {
                            __extends(Button, _super);
                            function Button() {
                                var _this = _super !== null && _super.apply(this, arguments) || this;
                                _this.state = {
                                    disabled: false
                                };
                                _this.onClick = function () {
                                    // Perform some side-effect
                                    Scheduler.log('Side-effect');
                                    // Disable the button
                                    _this.setState({
                                        disabled: true
                                    });
                                };
                                return _this;
                            }
                            Button.prototype.render = function () {
                                Scheduler.log("render button: ".concat(this.state.disabled ? 'disabled' : 'enabled'));
                                return <button ref={function (el) { return button = el; }} // Handler is removed after the first click
                                 onClick={this.state.disabled ? null : this.onClick}/>;
                            };
                            return Button;
                        }(React.Component));
                        root.render(<Button />);
                        // Should not have flushed yet because it's async
                        assertLog([]);
                        expect(button).toBe(undefined);
                        // Flush async work
                        return [4 /*yield*/, waitForAll(['render button: enabled'])];
                    case 1:
                        // Flush async work
                        _a.sent();
                        // Click the button to trigger the side-effect
                        return [4 /*yield*/, act(function () { return click(); })];
                    case 2:
                        // Click the button to trigger the side-effect
                        _a.sent();
                        assertLog([
                            'Side-effect', // The component re-rendered synchronously, even in concurrent mode.
                            'render button: disabled'
                        ]);
                        // Click the button again
                        click();
                        assertLog([ // The event handler was removed from the button, so there's no effect.
                        ]);
                        // The handler should not fire again no matter how many times we
                        // click the handler.
                        click();
                        click();
                        click();
                        click();
                        click();
                        return [4 /*yield*/, waitForAll([])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // NOTE: This test was written for the old behavior of discrete updates,
        // where they would be async, but flushed early if another discrete update
        // was dispatched.
        it('end result of many interactive updates is deterministic', function () { return __awaiter(_this, void 0, void 0, function () {
            function click() {
                var event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                });
                Object.defineProperty(event, 'timeStamp', {
                    value: 0
                });
                button.dispatchEvent(event);
            }
            var root, button, Button;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = document.createElement('div');
                        root = ReactDOMClient.createRoot(container);
                        document.body.appendChild(container);
                        Button = /** @class */ (function (_super) {
                            __extends(Button, _super);
                            function Button() {
                                var _this = _super !== null && _super.apply(this, arguments) || this;
                                _this.state = {
                                    count: 0
                                };
                                return _this;
                            }
                            Button.prototype.render = function () {
                                var _this = this;
                                return <button ref={function (el) { return button = el; }} onClick={function () {
                                        return _this.setState({
                                            count: _this.state.count + 1
                                        });
                                    }}>
                        Count: {this.state.count}
                    </button>;
                            };
                            return Button;
                        }(React.Component));
                        root.render(<Button />);
                        // Should not have flushed yet because it's async
                        expect(button).toBe(undefined);
                        // Flush async work
                        return [4 /*yield*/, waitForAll([])];
                    case 1:
                        // Flush async work
                        _a.sent();
                        expect(button.textContent).toEqual('Count: 0');
                        // Click the button a single time
                        return [4 /*yield*/, act(function () { return click(); })];
                    case 2:
                        // Click the button a single time
                        _a.sent();
                        // The counter should update synchronously, even in concurrent mode.
                        expect(button.textContent).toEqual('Count: 1');
                        // Click the button many more times
                        return [4 /*yield*/, act(function () { return click(); })];
                    case 3:
                        // Click the button many more times
                        _a.sent();
                        return [4 /*yield*/, act(function () { return click(); })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, act(function () { return click(); })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, act(function () { return click(); })];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, act(function () { return click(); })];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, act(function () { return click(); })];
                    case 8:
                        _a.sent();
                        // Flush the remaining work
                        return [4 /*yield*/, waitForAll([])];
                    case 9:
                        // Flush the remaining work
                        _a.sent();
                        // The counter should equal the total number of clicks
                        expect(button.textContent).toEqual('Count: 7');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('iOS bubbling click fix', function () {
        // See http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
        it('does not add a local click to interactive elements', function () {
            container = document.createElement('div');
            ReactDOM.render(<button onClick={onClick}/>, container);
            var node = container.firstChild;
            node.dispatchEvent(new MouseEvent('click'));
            expect(onClick).toHaveBeenCalledTimes(0);
        });
        it('adds a local click listener to non-interactive elements', function () {
            container = document.createElement('div');
            ReactDOM.render(<div onClick={onClick}/>, container);
            var node = container.firstChild;
            node.dispatchEvent(new MouseEvent('click'));
            expect(onClick).toHaveBeenCalledTimes(0);
        });
        it('registers passive handlers for events affected by the intervention', function () {
            container = document.createElement('div');
            var passiveEvents = [];
            var nativeAddEventListener = container.addEventListener;
            container.addEventListener = function (type, fn, options) {
                if (options !== null && typeof options === 'object') {
                    if (options.passive) {
                        passiveEvents.push(type);
                    }
                }
                return nativeAddEventListener.apply(this, arguments);
            };
            ReactDOM.render(<div />, container);
            expect(passiveEvents).toEqual(['touchstart', 'touchstart', 'touchmove', 'touchmove', 'wheel', 'wheel']);
        });
    });
});
