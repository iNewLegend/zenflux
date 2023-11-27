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
var React;
var ReactDOM;
var ReactDOMClient;
var Scheduler;
var act;
var waitForAll;
var waitForDiscrete;
var assertLog;
var setUntrackedChecked = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'checked').set;
var setUntrackedValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
var setUntrackedTextareaValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
describe('ChangeEventPlugin', function () {
    var container;
    beforeEach(function () {
        jest.resetModules();
        // TODO pull this into helper method, reduce repetition.
        // mock the browser APIs which are used in schedule:
        // - calling 'window.postMessage' should actually fire postmessage handlers
        var originalAddEventListener = global.addEventListener;
        var postMessageCallback;
        global.addEventListener = function (eventName, callback, useCapture) {
            if (eventName === 'message') {
                postMessageCallback = callback;
            }
            else {
                originalAddEventListener(eventName, callback, useCapture);
            }
        };
        global.postMessage = function (messageKey, targetOrigin) {
            var postMessageEvent = {
                source: window,
                data: messageKey
            };
            if (postMessageCallback) {
                postMessageCallback(postMessageEvent);
            }
        };
        React = require('react');
        ReactDOM = require('react-dom');
        ReactDOMClient = require('react-dom/client');
        act = require('internal-test-utils').act;
        Scheduler = require('scheduler');
        var InternalTestUtils = require('internal-test-utils');
        waitForAll = InternalTestUtils.waitForAll;
        waitForDiscrete = InternalTestUtils.waitForDiscrete;
        assertLog = InternalTestUtils.assertLog;
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    afterEach(function () {
        document.body.removeChild(container);
        container = null;
    });
    // We try to avoid firing "duplicate" React change events.
    // However, to tell which events are "duplicates" and should be ignored,
    // we are tracking the "current" input value, and only respect events
    // that occur after it changes. In most of these tests, we verify that we
    // keep track of the "current" value and only fire events when it changes.
    // See https://github.com/facebook/react/pull/5746.
    it('should consider initial text value to be current', function () {
        var called = 0;
        function cb(e) {
            called++;
            expect(e.type).toBe('change');
        }
        var node = ReactDOM.render(<input type="text" onChange={cb} defaultValue="foo"/>, container);
        node.dispatchEvent(new Event('input', {
            bubbles: true,
            cancelable: true
        }));
        node.dispatchEvent(new Event('change', {
            bubbles: true,
            cancelable: true
        }));
        // There should be no React change events because the value stayed the same.
        expect(called).toBe(0);
    });
    it('should consider initial text value to be current (capture)', function () {
        var called = 0;
        function cb(e) {
            called++;
            expect(e.type).toBe('change');
        }
        var node = ReactDOM.render(<input type="text" onChangeCapture={cb} defaultValue="foo"/>, container);
        node.dispatchEvent(new Event('input', {
            bubbles: true,
            cancelable: true
        }));
        node.dispatchEvent(new Event('change', {
            bubbles: true,
            cancelable: true
        }));
        // There should be no React change events because the value stayed the same.
        expect(called).toBe(0);
    });
    it('should not invoke a change event for textarea same value', function () {
        var called = 0;
        function cb(e) {
            called++;
            expect(e.type).toBe('change');
        }
        var node = ReactDOM.render(<textarea onChange={cb} defaultValue="initial"/>, container);
        node.dispatchEvent(new Event('input', {
            bubbles: true,
            cancelable: true
        }));
        node.dispatchEvent(new Event('change', {
            bubbles: true,
            cancelable: true
        }));
        // There should be no React change events because the value stayed the same.
        expect(called).toBe(0);
    });
    it('should not invoke a change event for textarea same value (capture)', function () {
        var called = 0;
        function cb(e) {
            called++;
            expect(e.type).toBe('change');
        }
        var node = ReactDOM.render(<textarea onChangeCapture={cb} defaultValue="initial"/>, container);
        node.dispatchEvent(new Event('input', {
            bubbles: true,
            cancelable: true
        }));
        node.dispatchEvent(new Event('change', {
            bubbles: true,
            cancelable: true
        }));
        // There should be no React change events because the value stayed the same.
        expect(called).toBe(0);
    });
    it('should consider initial checkbox checked=true to be current', function () {
        var called = 0;
        function cb(e) {
            called++;
            expect(e.type).toBe('change');
        }
        var node = ReactDOM.render(<input type="checkbox" onChange={cb} defaultChecked={true}/>, container);
        // Secretly, set `checked` to false, so that dispatching the `click` will
        // make it `true` again. Thus, at the time of the event, React should not
        // consider it a change from the initial `true` value.
        setUntrackedChecked.call(node, false);
        node.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true
        }));
        // There should be no React change events because the value stayed the same.
        expect(called).toBe(0);
    });
    it('should consider initial checkbox checked=false to be current', function () {
        var called = 0;
        function cb(e) {
            called++;
            expect(e.type).toBe('change');
        }
        var node = ReactDOM.render(<input type="checkbox" onChange={cb} defaultChecked={false}/>, container);
        // Secretly, set `checked` to true, so that dispatching the `click` will
        // make it `false` again. Thus, at the time of the event, React should not
        // consider it a change from the initial `false` value.
        setUntrackedChecked.call(node, true);
        node.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true
        }));
        // There should be no React change events because the value stayed the same.
        expect(called).toBe(0);
    });
    it('should fire change for checkbox input', function () {
        var called = 0;
        function cb(e) {
            called++;
            expect(e.type).toBe('change');
        }
        var node = ReactDOM.render(<input type="checkbox" onChange={cb}/>, container);
        expect(node.checked).toBe(false);
        node.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true
        }));
        // Note: unlike with text input events, dispatching `click` actually
        // toggles the checkbox and updates its `checked` value.
        expect(node.checked).toBe(true);
        expect(called).toBe(1);
        expect(node.checked).toBe(true);
        node.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true
        }));
        expect(node.checked).toBe(false);
        expect(called).toBe(2);
    });
    it('should not fire change setting the value programmatically', function () {
        var called = 0;
        function cb(e) {
            called++;
            expect(e.type).toBe('change');
        }
        var input = ReactDOM.render(<input type="text" defaultValue="foo" onChange={cb}/>, container);
        // Set it programmatically.
        input.value = 'bar';
        // Even if a DOM input event fires, React sees that the real input value now
        // ('bar') is the same as the "current" one we already recorded.
        input.dispatchEvent(new Event('input', {
            bubbles: true,
            cancelable: true
        }));
        expect(input.value).toBe('bar');
        // In this case we don't expect to get a React event.
        expect(called).toBe(0);
        // However, we can simulate user typing by calling the underlying setter.
        setUntrackedValue.call(input, 'foo');
        // Now, when the event fires, the real input value ('foo') differs from the
        // "current" one we previously recorded ('bar').
        input.dispatchEvent(new Event('input', {
            bubbles: true,
            cancelable: true
        }));
        expect(input.value).toBe('foo');
        // In this case React should fire an event for it.
        expect(called).toBe(1);
        // Verify again that extra events without real changes are ignored.
        input.dispatchEvent(new Event('input', {
            bubbles: true,
            cancelable: true
        }));
        expect(called).toBe(1);
    });
    it('should not distinguish equal string and number values', function () {
        var called = 0;
        function cb(e) {
            called++;
            expect(e.type).toBe('change');
        }
        var input = ReactDOM.render(<input type="text" defaultValue="42" onChange={cb}/>, container);
        // When we set `value` as a property, React updates the "current" value
        // that it tracks internally. The "current" value is later used to determine
        // whether a change event is a duplicate or not.
        // Even though we set value to a number, we still shouldn't get a change
        // event because as a string, it's equal to the initial value ('42').
        input.value = 42;
        input.dispatchEvent(new Event('input', {
            bubbles: true,
            cancelable: true
        }));
        expect(input.value).toBe('42');
        expect(called).toBe(0);
    });
    // See a similar input test above for a detailed description of why.
    it('should not fire change when setting checked programmatically', function () {
        var called = 0;
        function cb(e) {
            called++;
            expect(e.type).toBe('change');
        }
        var input = ReactDOM.render(<input type="checkbox" onChange={cb} defaultChecked={false}/>, container);
        // Set the value, updating the "current" value that React tracks to true.
        input.checked = true;
        // Under the hood, uncheck the box so that the click will "check" it again.
        setUntrackedChecked.call(input, false);
        input.click();
        expect(input.checked).toBe(true);
        // We don't expect a React event because at the time of the click, the real
        // checked value (true) was the same as the last recorded "current" value
        // (also true).
        expect(called).toBe(0);
        // However, simulating a normal click should fire a React event because the
        // real value (false) would have changed from the last tracked value (true).
        input.click();
        expect(called).toBe(1);
    });
    it('should unmount', function () {
        var input = ReactDOM.render(<input />, container);
        ReactDOM.unmountComponentAtNode(container);
    });
    it('should only fire change for checked radio button once', function () {
        var called = 0;
        function cb(e) {
            called++;
            expect(e.type).toBe('change');
        }
        var input = ReactDOM.render(<input type="radio" onChange={cb}/>, container);
        setUntrackedChecked.call(input, true);
        input.dispatchEvent(new Event('click', {
            bubbles: true,
            cancelable: true
        }));
        input.dispatchEvent(new Event('click', {
            bubbles: true,
            cancelable: true
        }));
        expect(called).toBe(1);
    });
    it('should track radio button cousins in a group', function () {
        var called1 = 0;
        var called2 = 0;
        function cb1(e) {
            called1++;
            expect(e.type).toBe('change');
        }
        function cb2(e) {
            called2++;
            expect(e.type).toBe('change');
        }
        var div = ReactDOM.render(<div>
            <input type="radio" name="group" onChange={cb1}/>
            <input type="radio" name="group" onChange={cb2}/>
        </div>, container);
        var option1 = div.childNodes[0];
        var option2 = div.childNodes[1];
        // Select first option.
        option1.click();
        expect(called1).toBe(1);
        expect(called2).toBe(0);
        // Select second option.
        option2.click();
        expect(called1).toBe(1);
        expect(called2).toBe(1);
        // Select the first option.
        // It should receive the React change event again.
        option1.click();
        expect(called1).toBe(2);
        expect(called2).toBe(1);
    });
    it('should deduplicate input value change events', function () {
        var called = 0;
        function cb(e) {
            called++;
            expect(e.type).toBe('change');
        }
        var input;
        ['text', 'number', 'range'].forEach(function (type) {
            called = 0;
            input = ReactDOM.render(<input type={type} onChange={cb}/>, container);
            // Should be ignored (no change):
            input.dispatchEvent(new Event('change', {
                bubbles: true,
                cancelable: true
            }));
            setUntrackedValue.call(input, '42');
            input.dispatchEvent(new Event('change', {
                bubbles: true,
                cancelable: true
            }));
            // Should be ignored (no change):
            input.dispatchEvent(new Event('change', {
                bubbles: true,
                cancelable: true
            }));
            expect(called).toBe(1);
            ReactDOM.unmountComponentAtNode(container);
            called = 0;
            input = ReactDOM.render(<input type={type} onChange={cb}/>, container);
            // Should be ignored (no change):
            input.dispatchEvent(new Event('input', {
                bubbles: true,
                cancelable: true
            }));
            setUntrackedValue.call(input, '42');
            input.dispatchEvent(new Event('input', {
                bubbles: true,
                cancelable: true
            }));
            // Should be ignored (no change):
            input.dispatchEvent(new Event('input', {
                bubbles: true,
                cancelable: true
            }));
            expect(called).toBe(1);
            ReactDOM.unmountComponentAtNode(container);
            called = 0;
            input = ReactDOM.render(<input type={type} onChange={cb}/>, container);
            // Should be ignored (no change):
            input.dispatchEvent(new Event('change', {
                bubbles: true,
                cancelable: true
            }));
            setUntrackedValue.call(input, '42');
            input.dispatchEvent(new Event('input', {
                bubbles: true,
                cancelable: true
            }));
            // Should be ignored (no change):
            input.dispatchEvent(new Event('change', {
                bubbles: true,
                cancelable: true
            }));
            expect(called).toBe(1);
            ReactDOM.unmountComponentAtNode(container);
        });
    });
    it('should listen for both change and input events when supported', function () {
        var called = 0;
        function cb(e) {
            called++;
            expect(e.type).toBe('change');
        }
        var input = ReactDOM.render(<input type="range" onChange={cb}/>, container);
        setUntrackedValue.call(input, 10);
        input.dispatchEvent(new Event('input', {
            bubbles: true,
            cancelable: true
        }));
        setUntrackedValue.call(input, 20);
        input.dispatchEvent(new Event('change', {
            bubbles: true,
            cancelable: true
        }));
        expect(called).toBe(2);
    });
    it('should only fire events when the value changes for range inputs', function () {
        var called = 0;
        function cb(e) {
            called++;
            expect(e.type).toBe('change');
        }
        var input = ReactDOM.render(<input type="range" onChange={cb}/>, container);
        setUntrackedValue.call(input, '40');
        input.dispatchEvent(new Event('input', {
            bubbles: true,
            cancelable: true
        }));
        input.dispatchEvent(new Event('change', {
            bubbles: true,
            cancelable: true
        }));
        setUntrackedValue.call(input, 'foo');
        input.dispatchEvent(new Event('input', {
            bubbles: true,
            cancelable: true
        }));
        input.dispatchEvent(new Event('change', {
            bubbles: true,
            cancelable: true
        }));
        expect(called).toBe(2);
    });
    it('does not crash for nodes with custom value property', function () {
        var originalCreateElement;
        // https://github.com/facebook/react/issues/10196
        try {
            originalCreateElement = document.createElement;
            document.createElement = function () {
                var node = originalCreateElement.apply(this, arguments);
                Object.defineProperty(node, 'value', {
                    get: function () {
                    },
                    set: function () {
                    }
                });
                return node;
            };
            var div = document.createElement('div');
            // Mount
            var node = ReactDOM.render(<input type="text"/>, div);
            // Update
            ReactDOM.render(<input type="text"/>, div);
            // Change
            node.dispatchEvent(new Event('change', {
                bubbles: true,
                cancelable: true
            }));
            // Unmount
            ReactDOM.unmountComponentAtNode(div);
        }
        finally {
            document.createElement = originalCreateElement;
        }
    });
    describe('concurrent mode', function () {
        it('text input', function () { return __awaiter(void 0, void 0, void 0, function () {
            var root, input, ControlledInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        root = ReactDOMClient.createRoot(container);
                        ControlledInput = /** @class */ (function (_super) {
                            __extends(ControlledInput, _super);
                            function ControlledInput() {
                                var _this = _super !== null && _super.apply(this, arguments) || this;
                                _this.state = {
                                    value: 'initial'
                                };
                                _this.onChange = function (event) { return _this.setState({
                                    value: event.target.value
                                }); };
                                return _this;
                            }
                            ControlledInput.prototype.render = function () {
                                Scheduler.log("render: ".concat(this.state.value));
                                var controlledValue = this.state.value === 'changed' ? 'changed [!]' : this.state.value;
                                return <input ref={function (el) { return input = el; }} type="text" value={controlledValue} onChange={this.onChange}/>;
                            };
                            return ControlledInput;
                        }(React.Component));
                        root.render(<ControlledInput />);
                        // Should not have flushed yet.
                        assertLog([]);
                        expect(input).toBe(undefined);
                        // Flush callbacks.
                        return [4 /*yield*/, waitForAll(['render: initial'])];
                    case 1:
                        // Flush callbacks.
                        _a.sent();
                        expect(input.value).toBe('initial');
                        // Trigger a change event.
                        setUntrackedValue.call(input, 'changed');
                        input.dispatchEvent(new Event('input', {
                            bubbles: true,
                            cancelable: true
                        }));
                        // Change should synchronously flush
                        assertLog(['render: changed']);
                        // Value should be the controlled value, not the original one
                        expect(input.value).toBe('changed [!]');
                        return [2 /*return*/];
                }
            });
        }); });
        it('checkbox input', function () { return __awaiter(void 0, void 0, void 0, function () {
            var root, input, ControlledInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        root = ReactDOMClient.createRoot(container);
                        ControlledInput = /** @class */ (function (_super) {
                            __extends(ControlledInput, _super);
                            function ControlledInput() {
                                var _this = _super !== null && _super.apply(this, arguments) || this;
                                _this.state = {
                                    checked: false
                                };
                                _this.onChange = function (event) {
                                    _this.setState({
                                        checked: event.target.checked
                                    });
                                };
                                return _this;
                            }
                            ControlledInput.prototype.render = function () {
                                Scheduler.log("render: ".concat(this.state.checked));
                                var controlledValue = this.props.reverse ? !this.state.checked : this.state.checked;
                                return <input ref={function (el) { return input = el; }} type="checkbox" checked={controlledValue} onChange={this.onChange}/>;
                            };
                            return ControlledInput;
                        }(React.Component));
                        root.render(<ControlledInput reverse={false}/>);
                        // Should not have flushed yet.
                        assertLog([]);
                        expect(input).toBe(undefined);
                        // Flush callbacks.
                        return [4 /*yield*/, waitForAll(['render: false'])];
                    case 1:
                        // Flush callbacks.
                        _a.sent();
                        expect(input.checked).toBe(false);
                        // Trigger a change event.
                        input.dispatchEvent(new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true
                        }));
                        // Change should synchronously flush
                        assertLog(['render: true']);
                        expect(input.checked).toBe(true);
                        // Now let's make sure we're using the controlled value.
                        root.render(<ControlledInput reverse={true}/>);
                        return [4 /*yield*/, waitForAll(['render: true'])];
                    case 2:
                        _a.sent();
                        // Trigger another change event.
                        input.dispatchEvent(new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true
                        }));
                        // Change should synchronously flush
                        assertLog(['render: true']);
                        expect(input.checked).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('textarea', function () { return __awaiter(void 0, void 0, void 0, function () {
            var root, textarea, ControlledTextarea;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        root = ReactDOMClient.createRoot(container);
                        ControlledTextarea = /** @class */ (function (_super) {
                            __extends(ControlledTextarea, _super);
                            function ControlledTextarea() {
                                var _this = _super !== null && _super.apply(this, arguments) || this;
                                _this.state = {
                                    value: 'initial'
                                };
                                _this.onChange = function (event) { return _this.setState({
                                    value: event.target.value
                                }); };
                                return _this;
                            }
                            ControlledTextarea.prototype.render = function () {
                                Scheduler.log("render: ".concat(this.state.value));
                                var controlledValue = this.state.value === 'changed' ? 'changed [!]' : this.state.value;
                                return <textarea ref={function (el) { return textarea = el; }} type="text" value={controlledValue} onChange={this.onChange}/>;
                            };
                            return ControlledTextarea;
                        }(React.Component));
                        root.render(<ControlledTextarea />);
                        // Should not have flushed yet.
                        assertLog([]);
                        expect(textarea).toBe(undefined);
                        // Flush callbacks.
                        return [4 /*yield*/, waitForAll(['render: initial'])];
                    case 1:
                        // Flush callbacks.
                        _a.sent();
                        expect(textarea.value).toBe('initial');
                        // Trigger a change event.
                        setUntrackedTextareaValue.call(textarea, 'changed');
                        textarea.dispatchEvent(new Event('input', {
                            bubbles: true,
                            cancelable: true
                        }));
                        // Change should synchronously flush
                        assertLog(['render: changed']);
                        // Value should be the controlled value, not the original one
                        expect(textarea.value).toBe('changed [!]');
                        return [2 /*return*/];
                }
            });
        }); });
        it('parent of input', function () { return __awaiter(void 0, void 0, void 0, function () {
            var root, input, ControlledInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        root = ReactDOMClient.createRoot(container);
                        ControlledInput = /** @class */ (function (_super) {
                            __extends(ControlledInput, _super);
                            function ControlledInput() {
                                var _this = _super !== null && _super.apply(this, arguments) || this;
                                _this.state = {
                                    value: 'initial'
                                };
                                _this.onChange = function (event) { return _this.setState({
                                    value: event.target.value
                                }); };
                                return _this;
                            }
                            ControlledInput.prototype.render = function () {
                                Scheduler.log("render: ".concat(this.state.value));
                                var controlledValue = this.state.value === 'changed' ? 'changed [!]' : this.state.value;
                                return <div onChange={this.onChange}>
                        <input ref={function (el) { return input = el; }} type="text" value={controlledValue} onChange={function () {
                                    }}/>
                    </div>;
                            };
                            return ControlledInput;
                        }(React.Component));
                        root.render(<ControlledInput />);
                        // Should not have flushed yet.
                        assertLog([]);
                        expect(input).toBe(undefined);
                        // Flush callbacks.
                        return [4 /*yield*/, waitForAll(['render: initial'])];
                    case 1:
                        // Flush callbacks.
                        _a.sent();
                        expect(input.value).toBe('initial');
                        // Trigger a change event.
                        setUntrackedValue.call(input, 'changed');
                        input.dispatchEvent(new Event('input', {
                            bubbles: true,
                            cancelable: true
                        }));
                        // Change should synchronously flush
                        assertLog(['render: changed']);
                        // Value should be the controlled value, not the original one
                        expect(input.value).toBe('changed [!]');
                        return [2 /*return*/];
                }
            });
        }); });
        it('is sync for non-input events', function () { return __awaiter(void 0, void 0, void 0, function () {
            var root, input, ControlledInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        root = ReactDOMClient.createRoot(container);
                        ControlledInput = /** @class */ (function (_super) {
                            __extends(ControlledInput, _super);
                            function ControlledInput() {
                                var _this = _super !== null && _super.apply(this, arguments) || this;
                                _this.state = {
                                    value: 'initial'
                                };
                                _this.onChange = function (event) { return _this.setState({
                                    value: event.target.value
                                }); };
                                _this.reset = function () {
                                    _this.setState({
                                        value: ''
                                    });
                                };
                                return _this;
                            }
                            ControlledInput.prototype.render = function () {
                                Scheduler.log("render: ".concat(this.state.value));
                                var controlledValue = this.state.value === 'changed' ? 'changed [!]' : this.state.value;
                                return <input ref={function (el) { return input = el; }} type="text" value={controlledValue} onChange={this.onChange} onClick={this.reset}/>;
                            };
                            return ControlledInput;
                        }(React.Component));
                        root.render(<ControlledInput />);
                        // Should not have flushed yet.
                        assertLog([]);
                        expect(input).toBe(undefined);
                        // Flush callbacks.
                        return [4 /*yield*/, waitForAll(['render: initial'])];
                    case 1:
                        // Flush callbacks.
                        _a.sent();
                        expect(input.value).toBe('initial');
                        // Trigger a click event
                        input.dispatchEvent(new Event('click', {
                            bubbles: true,
                            cancelable: true
                        }));
                        // Flush microtask queue.
                        return [4 /*yield*/, waitForDiscrete(['render: '])];
                    case 2:
                        // Flush microtask queue.
                        _a.sent();
                        expect(input.value).toBe('');
                        return [2 /*return*/];
                }
            });
        }); });
        it('mouse enter/leave should be user-blocking but not discrete', function () { return __awaiter(void 0, void 0, void 0, function () {
            function Foo() {
                var _a = useState(false), isHover = _a[0], setHover = _a[1];
                return <div ref={target} onMouseEnter={function () { return setHover(true); }} onMouseLeave={function () { return setHover(false); }}>
                    {isHover ? 'hovered' : 'not hovered'}
                </div>;
            }
            var useState, root, target;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        useState = React.useState;
                        root = ReactDOMClient.createRoot(container);
                        target = React.createRef(null);
                        return [4 /*yield*/, act(function () {
                                root.render(<Foo />);
                            })];
                    case 1:
                        _a.sent();
                        expect(container.textContent).toEqual('not hovered');
                        return [4 /*yield*/, act(function () {
                                var mouseOverEvent = document.createEvent('MouseEvents');
                                mouseOverEvent.initEvent('mouseover', true, true);
                                target.current.dispatchEvent(mouseOverEvent);
                                // Flush discrete updates
                                ReactDOM.flushSync();
                                // Since mouse enter/leave is not discrete, should not have updated yet
                                expect(container.textContent).toEqual('not hovered');
                            })];
                    case 2:
                        _a.sent();
                        expect(container.textContent).toEqual('hovered');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
