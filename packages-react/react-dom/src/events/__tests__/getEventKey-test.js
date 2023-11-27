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
var React;
var ReactDOM;
describe('getEventKey', function () {
    var container;
    beforeEach(function () {
        React = require('react');
        ReactDOM = require('react-dom');
        // The container has to be attached for events to fire.
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    afterEach(function () {
        document.body.removeChild(container);
        container = null;
    });
    describe('when key is implemented in a browser', function () {
        describe('when key is not normalized', function () {
            it('returns a normalized value', function () {
                var key = null;
                var Comp = /** @class */ (function (_super) {
                    __extends(Comp, _super);
                    function Comp() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Comp.prototype.render = function () {
                        return <input onKeyDown={function (e) { return key = e.key; }}/>;
                    };
                    return Comp;
                }(React.Component));
                ReactDOM.render(<Comp />, container);
                var nativeEvent = new KeyboardEvent('keydown', {
                    key: 'Del',
                    bubbles: true,
                    cancelable: true
                });
                container.firstChild.dispatchEvent(nativeEvent);
                expect(key).toBe('Delete');
            });
        });
        describe('when key is normalized', function () {
            it('returns a key', function () {
                var key = null;
                var Comp = /** @class */ (function (_super) {
                    __extends(Comp, _super);
                    function Comp() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Comp.prototype.render = function () {
                        return <input onKeyDown={function (e) { return key = e.key; }}/>;
                    };
                    return Comp;
                }(React.Component));
                ReactDOM.render(<Comp />, container);
                var nativeEvent = new KeyboardEvent('keydown', {
                    key: 'f',
                    bubbles: true,
                    cancelable: true
                });
                container.firstChild.dispatchEvent(nativeEvent);
                expect(key).toBe('f');
            });
        });
    });
    describe('when key is not implemented in a browser', function () {
        describe('when event type is keypress', function () {
            describe('when charCode is 13', function () {
                it('returns "Enter"', function () {
                    var key = null;
                    var Comp = /** @class */ (function (_super) {
                        __extends(Comp, _super);
                        function Comp() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        Comp.prototype.render = function () {
                            return <input onKeyPress={function (e) { return key = e.key; }}/>;
                        };
                        return Comp;
                    }(React.Component));
                    ReactDOM.render(<Comp />, container);
                    var nativeEvent = new KeyboardEvent('keypress', {
                        charCode: 13,
                        bubbles: true,
                        cancelable: true
                    });
                    container.firstChild.dispatchEvent(nativeEvent);
                    expect(key).toBe('Enter');
                });
            });
            describe('when charCode is not 13', function () {
                it('returns a string from a charCode', function () {
                    var key = null;
                    var Comp = /** @class */ (function (_super) {
                        __extends(Comp, _super);
                        function Comp() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        Comp.prototype.render = function () {
                            return <input onKeyPress={function (e) { return key = e.key; }}/>;
                        };
                        return Comp;
                    }(React.Component));
                    ReactDOM.render(<Comp />, container);
                    var nativeEvent = new KeyboardEvent('keypress', {
                        charCode: 65,
                        bubbles: true,
                        cancelable: true
                    });
                    container.firstChild.dispatchEvent(nativeEvent);
                    expect(key).toBe('A');
                });
            });
        });
        describe('when event type is keydown or keyup', function () {
            describe('when keyCode is recognized', function () {
                it('returns a translated key', function () {
                    var key = null;
                    var Comp = /** @class */ (function (_super) {
                        __extends(Comp, _super);
                        function Comp() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        Comp.prototype.render = function () {
                            return <input onKeyDown={function (e) { return key = e.key; }}/>;
                        };
                        return Comp;
                    }(React.Component));
                    ReactDOM.render(<Comp />, container);
                    var nativeEvent = new KeyboardEvent('keydown', {
                        keyCode: 45,
                        bubbles: true,
                        cancelable: true
                    });
                    container.firstChild.dispatchEvent(nativeEvent);
                    expect(key).toBe('Insert');
                });
            });
            describe('when keyCode is not recognized', function () {
                it('returns Unidentified', function () {
                    var key = null;
                    var Comp = /** @class */ (function (_super) {
                        __extends(Comp, _super);
                        function Comp() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        Comp.prototype.render = function () {
                            return <input onKeyDown={function (e) { return key = e.key; }}/>;
                        };
                        return Comp;
                    }(React.Component));
                    ReactDOM.render(<Comp />, container);
                    var nativeEvent = new KeyboardEvent('keydown', {
                        keyCode: 1337,
                        bubbles: true,
                        cancelable: true
                    });
                    container.firstChild.dispatchEvent(nativeEvent);
                    expect(key).toBe('Unidentified');
                });
            });
        });
    });
});
