/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */
'use strict';
var React;
var ReactDOM;
describe('SyntheticKeyboardEvent', function () {
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
    describe('KeyboardEvent interface', function () {
        describe('charCode', function () {
            describe('when event is `keypress`', function () {
                describe('when charCode is present in nativeEvent', function () {
                    it('when charCode is 0 and keyCode is 13, returns 13', function () {
                        var charCode = null;
                        var node = ReactDOM.render(<input onKeyPress={function (e) {
                                charCode = e.charCode;
                            }}/>, container);
                        node.dispatchEvent(new KeyboardEvent('keypress', {
                            charCode: 0,
                            keyCode: 13,
                            bubbles: true,
                            cancelable: true
                        }));
                        expect(charCode).toBe(13);
                    });
                    it('when charCode is 32 or bigger and keyCode is missing, returns charCode', function () {
                        var charCode = null;
                        var node = ReactDOM.render(<input onKeyPress={function (e) {
                                charCode = e.charCode;
                            }}/>, container);
                        node.dispatchEvent(new KeyboardEvent('keypress', {
                            charCode: 32,
                            bubbles: true,
                            cancelable: true
                        }));
                        expect(charCode).toBe(32);
                    });
                    it('when charCode is 13 and keyCode is missing, returns charCode', function () {
                        var charCode = null;
                        var node = ReactDOM.render(<input onKeyPress={function (e) {
                                charCode = e.charCode;
                            }}/>, container);
                        node.dispatchEvent(new KeyboardEvent('keypress', {
                            charCode: 13,
                            bubbles: true,
                            cancelable: true
                        }));
                        expect(charCode).toBe(13);
                    });
                    // Firefox creates a keypress event for function keys too. This removes
                    // the unwanted keypress events. Enter is however both printable and
                    // non-printable. One would expect Tab to be as well (but it isn't).
                    it('when charCode is smaller than 32 but is not 13, and keyCode is missing, ignores keypress', function () {
                        var called = false;
                        var node = ReactDOM.render(<input onKeyPress={function () {
                                called = true;
                            }}/>, container);
                        node.dispatchEvent(new KeyboardEvent('keypress', {
                            charCode: 31,
                            bubbles: true,
                            cancelable: true
                        }));
                        expect(called).toBe(false);
                    });
                    it('when charCode is 10, returns 13', function () {
                        var charCode = null;
                        var node = ReactDOM.render(<input onKeyPress={function (e) {
                                charCode = e.charCode;
                            }}/>, container);
                        node.dispatchEvent(new KeyboardEvent('keypress', {
                            charCode: 10,
                            bubbles: true,
                            cancelable: true
                        }));
                        expect(charCode).toBe(13);
                    });
                    it('when charCode is 10 and ctrl is pressed, returns 13', function () {
                        var charCode = null;
                        var node = ReactDOM.render(<input onKeyPress={function (e) {
                                charCode = e.charCode;
                            }}/>, container);
                        node.dispatchEvent(new KeyboardEvent('keypress', {
                            charCode: 10,
                            ctrlKey: true,
                            bubbles: true,
                            cancelable: true
                        }));
                        expect(charCode).toBe(13);
                    });
                });
                // TODO: this seems IE8 specific.
                // We can probably remove this normalization.
                describe('when charCode is not present in nativeEvent', function () {
                    var charCodeDescriptor;
                    beforeEach(function () {
                        charCodeDescriptor = Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, 'charCode');
                        delete KeyboardEvent.prototype.charCode;
                    });
                    afterEach(function () {
                        // Don't forget to restore for other tests.
                        Object.defineProperty(KeyboardEvent.prototype, 'charCode', charCodeDescriptor);
                        charCodeDescriptor = null;
                    });
                    it('when keyCode is 32 or bigger, returns keyCode', function () {
                        var charCode = null;
                        var node = ReactDOM.render(<input onKeyPress={function (e) {
                                charCode = e.charCode;
                            }}/>, container);
                        node.dispatchEvent(new KeyboardEvent('keypress', {
                            keyCode: 32,
                            bubbles: true,
                            cancelable: true
                        }));
                        expect(charCode).toBe(32);
                    });
                    it('when keyCode is 13, returns 13', function () {
                        var charCode = null;
                        var node = ReactDOM.render(<input onKeyPress={function (e) {
                                charCode = e.charCode;
                            }}/>, container);
                        node.dispatchEvent(new KeyboardEvent('keypress', {
                            keyCode: 13,
                            bubbles: true,
                            cancelable: true
                        }));
                        expect(charCode).toBe(13);
                    });
                    it('when keyCode is smaller than 32 and is not 13, ignores keypress', function () {
                        var called = false;
                        var node = ReactDOM.render(<input onKeyPress={function (e) {
                                called = true;
                            }}/>, container);
                        node.dispatchEvent(new KeyboardEvent('keypress', {
                            keyCode: 31,
                            bubbles: true,
                            cancelable: true
                        }));
                        expect(called).toBe(false);
                    });
                });
            });
            describe('when event is not `keypress`', function () {
                it('returns 0', function () {
                    var charCodeDown = null;
                    var charCodeUp = null;
                    var node = ReactDOM.render(<input onKeyDown={function (e) {
                            charCodeDown = e.charCode;
                        }} onKeyUp={function (e) {
                            charCodeUp = e.charCode;
                        }}/>, container);
                    node.dispatchEvent(new KeyboardEvent('keydown', {
                        key: 'Del',
                        bubbles: true,
                        cancelable: true
                    }));
                    node.dispatchEvent(new KeyboardEvent('keyup', {
                        key: 'Del',
                        bubbles: true,
                        cancelable: true
                    }));
                    expect(charCodeDown).toBe(0);
                    expect(charCodeUp).toBe(0);
                });
            });
            it('when charCode is smaller than 32 but is not 13, and keyCode is missing, charCode is 0', function () {
                var charCode = null;
                var node = ReactDOM.render(<input onKeyDown={function (e) {
                        charCode = e.charCode;
                    }}/>, container);
                node.dispatchEvent(new KeyboardEvent('keydown', {
                    charCode: 31,
                    bubbles: true,
                    cancelable: true
                }));
                expect(charCode).toBe(0);
            });
        });
        describe('keyCode', function () {
            describe('when event is `keydown` or `keyup`', function () {
                it('returns a passed keyCode', function () {
                    var keyCodeDown = null;
                    var keyCodeUp = null;
                    var node = ReactDOM.render(<input onKeyDown={function (e) {
                            keyCodeDown = e.keyCode;
                        }} onKeyUp={function (e) {
                            keyCodeUp = e.keyCode;
                        }}/>, container);
                    node.dispatchEvent(new KeyboardEvent('keydown', {
                        keyCode: 40,
                        bubbles: true,
                        cancelable: true
                    }));
                    node.dispatchEvent(new KeyboardEvent('keyup', {
                        keyCode: 40,
                        bubbles: true,
                        cancelable: true
                    }));
                    expect(keyCodeDown).toBe(40);
                    expect(keyCodeUp).toBe(40);
                });
            });
            describe('when event is `keypress`', function () {
                it('returns 0', function () {
                    var keyCode = null;
                    var node = ReactDOM.render(<input onKeyPress={function (e) {
                            keyCode = e.keyCode;
                        }}/>, container);
                    node.dispatchEvent(new KeyboardEvent('keypress', {
                        charCode: 65,
                        bubbles: true,
                        cancelable: true
                    }));
                    expect(keyCode).toBe(0);
                });
            });
        });
        describe('which', function () {
            describe('when event is `keypress`', function () {
                it('is consistent with `charCode`', function () {
                    var calls = 0;
                    var node = ReactDOM.render(<input onKeyPress={function (e) {
                            expect(e.which).toBe(e.charCode);
                            calls++;
                        }}/>, container);
                    // Try different combinations from other tests.
                    node.dispatchEvent(new KeyboardEvent('keypress', {
                        charCode: 0,
                        keyCode: 13,
                        bubbles: true,
                        cancelable: true
                    }));
                    node.dispatchEvent(new KeyboardEvent('keypress', {
                        charCode: 32,
                        bubbles: true,
                        cancelable: true
                    }));
                    node.dispatchEvent(new KeyboardEvent('keypress', {
                        charCode: 13,
                        bubbles: true,
                        cancelable: true
                    }));
                    expect(calls).toBe(3);
                });
            });
            describe('when event is `keydown` or `keyup`', function () {
                it('is consistent with `keyCode`', function () {
                    var calls = 0;
                    var node = ReactDOM.render(<input onKeyDown={function (e) {
                            expect(e.which).toBe(e.keyCode);
                            calls++;
                        }} onKeyUp={function (e) {
                            expect(e.which).toBe(e.keyCode);
                            calls++;
                        }}/>, container);
                    node.dispatchEvent(new KeyboardEvent('keydown', {
                        key: 'Del',
                        bubbles: true,
                        cancelable: true
                    }));
                    node.dispatchEvent(new KeyboardEvent('keydown', {
                        charCode: 31,
                        bubbles: true,
                        cancelable: true
                    }));
                    node.dispatchEvent(new KeyboardEvent('keydown', {
                        keyCode: 40,
                        bubbles: true,
                        cancelable: true
                    }));
                    node.dispatchEvent(new KeyboardEvent('keyup', {
                        key: 'Del',
                        bubbles: true,
                        cancelable: true
                    }));
                    node.dispatchEvent(new KeyboardEvent('keyup', {
                        keyCode: 40,
                        bubbles: true,
                        cancelable: true
                    }));
                    expect(calls).toBe(5);
                });
            });
        });
        describe('code', function () {
            it('returns code on `keydown`, `keyup` and `keypress`', function () {
                var codeDown = null;
                var codeUp = null;
                var codePress = null;
                var node = ReactDOM.render(<input onKeyDown={function (e) {
                        codeDown = e.code;
                    }} onKeyUp={function (e) {
                        codeUp = e.code;
                    }} onKeyPress={function (e) {
                        codePress = e.code;
                    }}/>, container);
                node.dispatchEvent(new KeyboardEvent('keydown', {
                    code: 'KeyQ',
                    bubbles: true,
                    cancelable: true
                }));
                node.dispatchEvent(new KeyboardEvent('keyup', {
                    code: 'KeyQ',
                    bubbles: true,
                    cancelable: true
                }));
                node.dispatchEvent(new KeyboardEvent('keypress', {
                    code: 'KeyQ',
                    charCode: 113,
                    bubbles: true,
                    cancelable: true
                }));
                expect(codeDown).toBe('KeyQ');
                expect(codeUp).toBe('KeyQ');
                expect(codePress).toBe('KeyQ');
            });
        });
    });
    describe('EventInterface', function () {
        it('is able to `preventDefault` and `stopPropagation`', function () {
            var expectedCount = 0;
            var eventHandler = function (event) {
                expect(event.isDefaultPrevented()).toBe(false);
                event.preventDefault();
                expect(event.isDefaultPrevented()).toBe(true);
                expect(event.isPropagationStopped()).toBe(false);
                event.stopPropagation();
                expect(event.isPropagationStopped()).toBe(true);
                expectedCount++;
            };
            var div = ReactDOM.render(<div onKeyDown={eventHandler} onKeyUp={eventHandler} onKeyPress={eventHandler}/>, container);
            div.dispatchEvent(new KeyboardEvent('keydown', {
                keyCode: 40,
                bubbles: true,
                cancelable: true
            }));
            div.dispatchEvent(new KeyboardEvent('keyup', {
                keyCode: 40,
                bubbles: true,
                cancelable: true
            }));
            div.dispatchEvent(new KeyboardEvent('keypress', {
                charCode: 40,
                keyCode: 40,
                bubbles: true,
                cancelable: true
            }));
            expect(expectedCount).toBe(3);
        });
    });
});
