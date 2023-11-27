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
describe('SyntheticMouseEvent', function () {
    var container;
    beforeEach(function () {
        jest.resetModules();
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
    it('should only use values from movementX/Y when event type is mousemove', function () {
        var events = [];
        var onMouseMove = function (event) {
            events.push(event.movementX);
        };
        var onMouseDown = function (event) {
            events.push(event.movementX);
        };
        var node = ReactDOM.render(<div onMouseMove={onMouseMove} onMouseDown={onMouseDown}/>, container);
        var event = new MouseEvent('mousemove', {
            relatedTarget: null,
            bubbles: true,
            screenX: 2,
            screenY: 2
        });
        node.dispatchEvent(event);
        event = new MouseEvent('mousemove', {
            relatedTarget: null,
            bubbles: true,
            screenX: 8,
            screenY: 8
        });
        node.dispatchEvent(event);
        // Now trigger a mousedown event to see if movementX has changed back to 0
        event = new MouseEvent('mousedown', {
            relatedTarget: null,
            bubbles: true,
            screenX: 25,
            screenY: 65
        });
        node.dispatchEvent(event);
        expect(events.length).toBe(3);
        expect(events[0]).toBe(0);
        expect(events[1]).toBe(6);
        expect(events[2]).toBe(0); // mousedown event should have movementX at 0
    });
    it('should correctly calculate movementX/Y for capture phase', function () {
        var events = [];
        var onMouseMove = function (event) {
            events.push(['move', false, event.movementX, event.movementY]);
        };
        var onMouseMoveCapture = function (event) {
            events.push(['move', true, event.movementX, event.movementY]);
        };
        var onMouseDown = function (event) {
            events.push(['down', false, event.movementX, event.movementY]);
        };
        var onMouseDownCapture = function (event) {
            events.push(['down', true, event.movementX, event.movementY]);
        };
        var node = ReactDOM.render(<div onMouseMove={onMouseMove} onMouseMoveCapture={onMouseMoveCapture} onMouseDown={onMouseDown} onMouseDownCapture={onMouseDownCapture}/>, container);
        var event = new MouseEvent('mousemove', {
            relatedTarget: null,
            bubbles: true,
            screenX: 2,
            screenY: 2
        });
        node.dispatchEvent(event);
        event = new MouseEvent('mousemove', {
            relatedTarget: null,
            bubbles: true,
            screenX: 8,
            screenY: 9
        });
        node.dispatchEvent(event);
        // Now trigger a mousedown event to see if movementX has changed back to 0
        event = new MouseEvent('mousedown', {
            relatedTarget: null,
            bubbles: true,
            screenX: 25,
            screenY: 65
        });
        node.dispatchEvent(event);
        expect(events).toEqual([['move', true, 0, 0], ['move', false, 0, 0], ['move', true, 6, 7], ['move', false, 6, 7], ['down', true, 0, 0], ['down', false, 0, 0]]);
    });
});
