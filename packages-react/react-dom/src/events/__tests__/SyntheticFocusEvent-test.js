/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';
describe('SyntheticFocusEvent', function () {
    var React;
    var ReactDOM;
    var container;
    beforeEach(function () {
        jest.resetModules();
        React = require('react');
        ReactDOM = require('react-dom');
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    afterEach(function () {
        document.body.removeChild(container);
        container = null;
    });
    test('onFocus events have the focus type', function () {
        var log = [];
        ReactDOM.render(<button onFocus={function (event) { return log.push("onFocus: ".concat(event.type)); }} onFocusCapture={function (event) { return log.push("onFocusCapture: ".concat(event.type)); }}/>, container);
        var button = container.querySelector('button');
        button.dispatchEvent(new FocusEvent('focusin', {
            bubbles: true,
            cancelable: false
        }));
        expect(log).toEqual(['onFocusCapture: focus', 'onFocus: focus']);
    });
    test('onBlur events have the blur type', function () {
        var log = [];
        ReactDOM.render(<button onBlur={function (event) { return log.push("onBlur: ".concat(event.type)); }} onBlurCapture={function (event) { return log.push("onBlurCapture: ".concat(event.type)); }}/>, container);
        var button = container.querySelector('button');
        button.dispatchEvent(new FocusEvent('focusout', {
            bubbles: true,
            cancelable: false
        }));
        expect(log).toEqual(['onBlurCapture: blur', 'onBlur: blur']);
    });
});
