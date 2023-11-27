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
describe('SyntheticClipboardEvent', function () {
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
    describe('ClipboardEvent interface', function () {
        describe('clipboardData', function () {
            describe('when event has clipboardData', function () {
                it("returns event's clipboardData", function () {
                    var expectedCount = 0;
                    // Mock clipboardData since jsdom implementation doesn't have a constructor
                    var clipboardData = {
                        dropEffect: null,
                        effectAllowed: null,
                        files: null,
                        items: null,
                        types: null
                    };
                    var eventHandler = function (event) {
                        expect(event.clipboardData).toBe(clipboardData);
                        expectedCount++;
                    };
                    var div = ReactDOM.render(<div onCopy={eventHandler} onCut={eventHandler} onPaste={eventHandler}/>, container);
                    var event;
                    event = document.createEvent('Event');
                    event.initEvent('copy', true, true);
                    event.clipboardData = clipboardData;
                    div.dispatchEvent(event);
                    event = document.createEvent('Event');
                    event.initEvent('cut', true, true);
                    event.clipboardData = clipboardData;
                    div.dispatchEvent(event);
                    event = document.createEvent('Event');
                    event.initEvent('paste', true, true);
                    event.clipboardData = clipboardData;
                    div.dispatchEvent(event);
                    expect(expectedCount).toBe(3);
                });
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
            var div = ReactDOM.render(<div onCopy={eventHandler} onCut={eventHandler} onPaste={eventHandler}/>, container);
            var event;
            event = document.createEvent('Event');
            event.initEvent('copy', true, true);
            div.dispatchEvent(event);
            event = document.createEvent('Event');
            event.initEvent('cut', true, true);
            div.dispatchEvent(event);
            event = document.createEvent('Event');
            event.initEvent('paste', true, true);
            div.dispatchEvent(event);
            expect(expectedCount).toBe(3);
        });
    });
});
