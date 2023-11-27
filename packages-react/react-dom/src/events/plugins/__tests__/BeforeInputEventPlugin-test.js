/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */
'use strict';
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var React;
var ReactDOM;
describe('BeforeInputEventPlugin', function () {
    var container;
    function loadReactDOM(envSimulator) {
        jest.resetModules();
        if (envSimulator) {
            envSimulator();
        }
        return require('react-dom');
    }
    function simulateIE11() {
        document.documentMode = 11;
        window.CompositionEvent = {};
    }
    function simulateWebkit() {
        window.CompositionEvent = {};
        window.TextEvent = {};
    }
    function simulateComposition() {
        window.CompositionEvent = {};
    }
    function simulateNoComposition() {
    }
    function simulateEvent(elem, type, data) {
        var event = new Event(type, {
            bubbles: true
        });
        Object.assign(event, data);
        elem.dispatchEvent(event);
    }
    function simulateKeyboardEvent(elem, type, data) {
        var char = data.char, value = data.value, rest = __rest(data, ["char", "value"]);
        var event = new KeyboardEvent(type, __assign({ bubbles: true }, rest));
        if (char) {
            event.char = char;
        }
        if (value) {
            elem.value = value;
        }
        elem.dispatchEvent(event);
    }
    function simulatePaste(elem) {
        var pasteEvent = new Event('paste', {
            bubbles: true
        });
        pasteEvent.clipboardData = {
            dropEffect: null,
            effectAllowed: null,
            files: null,
            items: null,
            types: null
        };
        elem.dispatchEvent(pasteEvent);
    }
    beforeEach(function () {
        React = require('react');
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    afterEach(function () {
        delete document.documentMode;
        delete window.CompositionEvent;
        delete window.TextEvent;
        delete window.opera;
        document.body.removeChild(container);
        container = null;
    });
    function keyCode(char) {
        return char.charCodeAt(0);
    }
    var scenarios = [{
            eventSimulator: simulateEvent,
            eventSimulatorArgs: ['compositionstart', {
                    detail: {
                        data: 'test'
                    },
                    data: 'test'
                }]
        }, {
            eventSimulator: simulateEvent,
            eventSimulatorArgs: ['compositionupdate', {
                    detail: {
                        data: 'test string'
                    },
                    data: 'test string'
                }]
        }, {
            eventSimulator: simulateEvent,
            eventSimulatorArgs: ['compositionend', {
                    detail: {
                        data: 'test string 3'
                    },
                    data: 'test string 3'
                }]
        }, {
            eventSimulator: simulateEvent,
            eventSimulatorArgs: ['textInput', {
                    data: 'abcß'
                }]
        }, {
            eventSimulator: simulateKeyboardEvent,
            eventSimulatorArgs: ['keypress', {
                    which: keyCode('a')
                }]
        }, {
            eventSimulator: simulateKeyboardEvent,
            eventSimulatorArgs: ['keypress', {
                    which: keyCode(' ')
                }, ' ']
        }, {
            eventSimulator: simulateEvent,
            eventSimulatorArgs: ['textInput', {
                    data: ' '
                }]
        }, {
            eventSimulator: simulateKeyboardEvent,
            eventSimulatorArgs: ['keypress', {
                    which: keyCode('a'),
                    ctrlKey: true
                }]
        }, {
            eventSimulator: simulateKeyboardEvent,
            eventSimulatorArgs: ['keypress', {
                    which: keyCode('b'),
                    altKey: true
                }]
        }, {
            eventSimulator: simulateKeyboardEvent,
            eventSimulatorArgs: ['keypress', {
                    which: keyCode('c'),
                    altKey: true,
                    ctrlKey: true
                }]
        }, {
            eventSimulator: simulateKeyboardEvent,
            eventSimulatorArgs: ['keypress', {
                    which: keyCode('X'),
                    char: '\uD83D\uDE0A'
                }]
        }, {
            eventSimulator: simulateEvent,
            eventSimulatorArgs: ['textInput', {
                    data: '\uD83D\uDE0A'
                }]
        }, {
            eventSimulator: simulateKeyboardEvent,
            eventSimulatorArgs: ['keydown', {
                    keyCode: 229,
                    value: 'foo'
                }]
        }, {
            eventSimulator: simulateKeyboardEvent,
            eventSimulatorArgs: ['keydown', {
                    keyCode: 9,
                    value: 'foobar'
                }]
        }, {
            eventSimulator: simulateKeyboardEvent,
            eventSimulatorArgs: ['keydown', {
                    keyCode: 229,
                    value: 'foofoo'
                }]
        }, {
            eventSimulator: simulateKeyboardEvent,
            eventSimulatorArgs: ['keyup', {
                    keyCode: 9,
                    value: 'fooBARfoo'
                }]
        }, {
            eventSimulator: simulateKeyboardEvent,
            eventSimulatorArgs: ['keydown', {
                    keyCode: 229,
                    value: 'foofoo'
                }]
        }, {
            eventSimulator: simulateKeyboardEvent,
            eventSimulatorArgs: ['keypress', {
                    keyCode: 60,
                    value: 'Barfoofoo'
                }]
        }, {
            eventSimulator: simulatePaste,
            eventSimulatorArgs: []
        }];
    var environments = [{
            emulator: simulateWebkit,
            assertions: [{
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, compositionStartEvent = _a.compositionStartEvent, spyOnBeforeInput = _a.spyOnBeforeInput, spyOnCompositionStart = _a.spyOnCompositionStart;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                        expect(spyOnCompositionStart).toHaveBeenCalledTimes(1);
                        expect(compositionStartEvent.type).toBe('compositionstart');
                        expect(compositionStartEvent.data).toBe('test');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, compositionUpdateEvent = _a.compositionUpdateEvent, spyOnBeforeInput = _a.spyOnBeforeInput, spyOnCompositionUpdate = _a.spyOnCompositionUpdate;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                        expect(spyOnCompositionUpdate).toHaveBeenCalledTimes(1);
                        expect(compositionUpdateEvent.type).toBe('compositionupdate');
                        expect(compositionUpdateEvent.data).toBe('test string');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(1);
                        expect(beforeInputEvent.nativeEvent.type).toBe('compositionend');
                        expect(beforeInputEvent.type).toBe('beforeinput');
                        expect(beforeInputEvent.data).toBe('test string 3');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(1);
                        expect(beforeInputEvent.nativeEvent.type).toBe('textInput');
                        expect(beforeInputEvent.type).toBe('beforeinput');
                        expect(beforeInputEvent.data).toBe('abcß');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(1);
                        expect(beforeInputEvent.nativeEvent.type).toBe('keypress');
                        expect(beforeInputEvent.type).toBe('beforeinput');
                        expect(beforeInputEvent.data).toBe(' ');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(1);
                        expect(beforeInputEvent.nativeEvent.type).toBe('textInput');
                        expect(beforeInputEvent.type).toBe('beforeinput');
                        expect(beforeInputEvent.data).toBe('\uD83D\uDE0A');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }]
        }, {
            emulator: simulateIE11,
            assertions: [{
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(1);
                        expect(beforeInputEvent.nativeEvent.type).toBe('keypress');
                        expect(beforeInputEvent.type).toBe('beforeinput');
                        expect(beforeInputEvent.data).toBe('a');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(1);
                        expect(beforeInputEvent.nativeEvent.type).toBe('keypress');
                        expect(beforeInputEvent.type).toBe('beforeinput');
                        expect(beforeInputEvent.data).toBe(' ');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(1);
                        expect(beforeInputEvent.nativeEvent.type).toBe('keypress');
                        expect(beforeInputEvent.type).toBe('beforeinput');
                        expect(beforeInputEvent.data).toBe('c');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(1);
                        expect(beforeInputEvent.nativeEvent.type).toBe('keypress');
                        expect(beforeInputEvent.type).toBe('beforeinput');
                        expect(beforeInputEvent.data).toBe('\uD83D\uDE0A');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }]
        }, {
            emulator: simulateNoComposition,
            assertions: [{
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(1);
                        expect(beforeInputEvent.nativeEvent.type).toBe('keypress');
                        expect(beforeInputEvent.type).toBe('beforeinput');
                        expect(beforeInputEvent.data).toBe('a');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(1);
                        expect(beforeInputEvent.nativeEvent.type).toBe('keypress');
                        expect(beforeInputEvent.type).toBe('beforeinput');
                        expect(beforeInputEvent.data).toBe(' ');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(1);
                        expect(beforeInputEvent.nativeEvent.type).toBe('keypress');
                        expect(beforeInputEvent.type).toBe('beforeinput');
                        expect(beforeInputEvent.data).toBe('c');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(1);
                        expect(beforeInputEvent.nativeEvent.type).toBe('keypress');
                        expect(beforeInputEvent.type).toBe('beforeinput');
                        expect(beforeInputEvent.data).toBe('\uD83D\uDE0A');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(1);
                        expect(beforeInputEvent.nativeEvent.type).toBe('keydown');
                        expect(beforeInputEvent.type).toBe('beforeinput');
                        expect(beforeInputEvent.data).toBe('bar');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(1);
                        expect(beforeInputEvent.nativeEvent.type).toBe('keyup');
                        expect(beforeInputEvent.type).toBe('beforeinput');
                        expect(beforeInputEvent.data).toBe('BAR');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(1);
                        expect(beforeInputEvent.nativeEvent.type).toBe('keypress');
                        expect(beforeInputEvent.type).toBe('beforeinput');
                        expect(beforeInputEvent.data).toBe('Bar');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }]
        }, {
            emulator: simulateComposition,
            assertions: [{
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(1);
                        expect(beforeInputEvent.nativeEvent.type).toBe('compositionend');
                        expect(beforeInputEvent.type).toBe('beforeinput');
                        expect(beforeInputEvent.data).toBe('test string 3');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(1);
                        expect(beforeInputEvent.nativeEvent.type).toBe('keypress');
                        expect(beforeInputEvent.type).toBe('beforeinput');
                        expect(beforeInputEvent.data).toBe('a');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(1);
                        expect(beforeInputEvent.nativeEvent.type).toBe('keypress');
                        expect(beforeInputEvent.type).toBe('beforeinput');
                        expect(beforeInputEvent.data).toBe(' ');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(1);
                        expect(beforeInputEvent.nativeEvent.type).toBe('keypress');
                        expect(beforeInputEvent.type).toBe('beforeinput');
                        expect(beforeInputEvent.data).toBe('c');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(1);
                        expect(beforeInputEvent.nativeEvent.type).toBe('keypress');
                        expect(beforeInputEvent.type).toBe('beforeinput');
                        expect(beforeInputEvent.data).toBe('\uD83D\uDE0A');
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }, {
                    run: function (_a) {
                        var beforeInputEvent = _a.beforeInputEvent, spyOnBeforeInput = _a.spyOnBeforeInput;
                        expect(spyOnBeforeInput).toHaveBeenCalledTimes(0);
                        expect(beforeInputEvent).toBeNull();
                    }
                }]
        }];
    var testInputComponent = function (env, scenes) {
        var beforeInputEvent;
        var compositionStartEvent;
        var compositionUpdateEvent;
        var spyOnBeforeInput;
        var spyOnCompositionStart;
        var spyOnCompositionUpdate;
        ReactDOM = loadReactDOM(env.emulator);
        var node = ReactDOM.render(<input type="text" onBeforeInput={function (e) {
                spyOnBeforeInput();
                beforeInputEvent = e;
            }} onCompositionStart={function (e) {
                spyOnCompositionStart();
                compositionStartEvent = e;
            }} onCompositionUpdate={function (e) {
                spyOnCompositionUpdate();
                compositionUpdateEvent = e;
            }}/>, container);
        scenes.forEach(function (s, id) {
            beforeInputEvent = null;
            compositionStartEvent = null;
            compositionUpdateEvent = null;
            spyOnBeforeInput = jest.fn();
            spyOnCompositionStart = jest.fn();
            spyOnCompositionUpdate = jest.fn();
            s.eventSimulator.apply(null, __spreadArray([node], s.eventSimulatorArgs, true));
            env.assertions[id].run({
                beforeInputEvent: beforeInputEvent,
                compositionStartEvent: compositionStartEvent,
                compositionUpdateEvent: compositionUpdateEvent,
                spyOnBeforeInput: spyOnBeforeInput,
                spyOnCompositionStart: spyOnCompositionStart,
                spyOnCompositionUpdate: spyOnCompositionUpdate
            });
        });
    };
    var testContentEditableComponent = function (env, scenes) {
        var beforeInputEvent;
        var compositionStartEvent;
        var compositionUpdateEvent;
        var spyOnBeforeInput;
        var spyOnCompositionStart;
        var spyOnCompositionUpdate;
        ReactDOM = loadReactDOM(env.emulator);
        var node = ReactDOM.render(<div contentEditable={true} onBeforeInput={function (e) {
                spyOnBeforeInput();
                beforeInputEvent = e;
            }} onCompositionStart={function (e) {
                spyOnCompositionStart();
                compositionStartEvent = e;
            }} onCompositionUpdate={function (e) {
                spyOnCompositionUpdate();
                compositionUpdateEvent = e;
            }}/>, container);
        scenes.forEach(function (s, id) {
            beforeInputEvent = null;
            compositionStartEvent = null;
            compositionUpdateEvent = null;
            spyOnBeforeInput = jest.fn();
            spyOnCompositionStart = jest.fn();
            spyOnCompositionUpdate = jest.fn();
            s.eventSimulator.apply(null, __spreadArray([node], s.eventSimulatorArgs, true));
            env.assertions[id].run({
                beforeInputEvent: beforeInputEvent,
                compositionStartEvent: compositionStartEvent,
                compositionUpdateEvent: compositionUpdateEvent,
                spyOnBeforeInput: spyOnBeforeInput,
                spyOnCompositionStart: spyOnCompositionStart,
                spyOnCompositionUpdate: spyOnCompositionUpdate
            });
        });
    };
    it('should extract onBeforeInput when simulating in Webkit on input[type=text]', function () {
        testInputComponent(environments[0], scenarios);
    });
    it('should extract onBeforeInput when simulating in Webkit on contenteditable', function () {
        testContentEditableComponent(environments[0], scenarios);
    });
    it('should extract onBeforeInput when simulating in IE11 on input[type=text]', function () {
        testInputComponent(environments[1], scenarios);
    });
    it('should extract onBeforeInput when simulating in IE11 on contenteditable', function () {
        testContentEditableComponent(environments[1], scenarios);
    });
    it('should extract onBeforeInput when simulating in env with no CompositionEvent on input[type=text]', function () {
        testInputComponent(environments[2], scenarios);
    });
    // in an environment using composition fallback onBeforeInput will not work
    // as expected on a contenteditable as keydown and keyup events are translated
    // to keypress events
    it('should extract onBeforeInput when simulating in env with only CompositionEvent on input[type=text]', function () {
        testInputComponent(environments[3], scenarios);
    });
    it('should extract onBeforeInput when simulating in env with only CompositionEvent on contenteditable', function () {
        testContentEditableComponent(environments[3], scenarios);
    });
});
