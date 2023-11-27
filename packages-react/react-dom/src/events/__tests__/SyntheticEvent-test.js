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
describe('SyntheticEvent', function () {
    var container;
    beforeEach(function () {
        React = require('react');
        ReactDOM = require('react-dom');
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    afterEach(function () {
        document.body.removeChild(container);
        container = null;
    });
    it('should be able to `preventDefault`', function () {
        var expectedCount = 0;
        var eventHandler = function (syntheticEvent) {
            expect(syntheticEvent.isDefaultPrevented()).toBe(false);
            syntheticEvent.preventDefault();
            expect(syntheticEvent.isDefaultPrevented()).toBe(true);
            expect(syntheticEvent.defaultPrevented).toBe(true);
            expectedCount++;
        };
        var node = ReactDOM.render(<div onClick={eventHandler}/>, container);
        var event = document.createEvent('Event');
        event.initEvent('click', true, true);
        node.dispatchEvent(event);
        expect(expectedCount).toBe(1);
    });
    it('should be prevented if nativeEvent is prevented', function () {
        var expectedCount = 0;
        var eventHandler = function (syntheticEvent) {
            expect(syntheticEvent.isDefaultPrevented()).toBe(true);
            expectedCount++;
        };
        var node = ReactDOM.render(<div onClick={eventHandler}/>, container);
        var event;
        event = document.createEvent('Event');
        event.initEvent('click', true, true);
        event.preventDefault();
        node.dispatchEvent(event);
        event = document.createEvent('Event');
        event.initEvent('click', true, true);
        // Emulate IE8
        Object.defineProperty(event, 'defaultPrevented', {
            get: function () {
            }
        });
        Object.defineProperty(event, 'returnValue', {
            get: function () {
                return false;
            }
        });
        node.dispatchEvent(event);
        expect(expectedCount).toBe(2);
    });
    it('should be able to `stopPropagation`', function () {
        var expectedCount = 0;
        var eventHandler = function (syntheticEvent) {
            expect(syntheticEvent.isPropagationStopped()).toBe(false);
            syntheticEvent.stopPropagation();
            expect(syntheticEvent.isPropagationStopped()).toBe(true);
            expectedCount++;
        };
        var node = ReactDOM.render(<div onClick={eventHandler}/>, container);
        var event = document.createEvent('Event');
        event.initEvent('click', true, true);
        node.dispatchEvent(event);
        expect(expectedCount).toBe(1);
    });
});
