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
describe('EnterLeaveEventPlugin', function () {
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
    it('should set onMouseLeave relatedTarget properly in iframe', function () {
        var iframe = document.createElement('iframe');
        container.appendChild(iframe);
        var iframeDocument = iframe.contentDocument;
        iframeDocument.write('<!DOCTYPE html><html><head></head><body><div></div></body></html>');
        iframeDocument.close();
        var leaveEvents = [];
        var node = ReactDOM.render(<div onMouseLeave={function (e) {
                e.persist();
                leaveEvents.push(e);
            }}/>, iframeDocument.body.getElementsByTagName('div')[0]);
        node.dispatchEvent(new MouseEvent('mouseout', {
            bubbles: true,
            cancelable: true,
            relatedTarget: iframe.contentWindow
        }));
        expect(leaveEvents.length).toBe(1);
        expect(leaveEvents[0].target).toBe(node);
        expect(leaveEvents[0].relatedTarget).toBe(iframe.contentWindow);
    });
    it('should set onMouseEnter relatedTarget properly in iframe', function () {
        var iframe = document.createElement('iframe');
        container.appendChild(iframe);
        var iframeDocument = iframe.contentDocument;
        iframeDocument.write('<!DOCTYPE html><html><head></head><body><div></div></body></html>');
        iframeDocument.close();
        var enterEvents = [];
        var node = ReactDOM.render(<div onMouseEnter={function (e) {
                e.persist();
                enterEvents.push(e);
            }}/>, iframeDocument.body.getElementsByTagName('div')[0]);
        node.dispatchEvent(new MouseEvent('mouseover', {
            bubbles: true,
            cancelable: true,
            relatedTarget: null
        }));
        expect(enterEvents.length).toBe(1);
        expect(enterEvents[0].target).toBe(node);
        expect(enterEvents[0].relatedTarget).toBe(iframe.contentWindow);
    });
    // Regression test for https://github.com/facebook/react/issues/10906.
    it('should find the common parent after updates', function () {
        var parentEnterCalls = 0;
        var childEnterCalls = 0;
        var parent = null;
        var Parent = /** @class */ (function (_super) {
            __extends(Parent, _super);
            function Parent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Parent.prototype.render = function () {
                return <div onMouseEnter={function () { return parentEnterCalls++; }} ref={function (node) { return parent = node; }}>
                    {this.props.showChild && <div onMouseEnter={function () { return childEnterCalls++; }}/>}
                </div>;
            };
            return Parent;
        }(React.Component));
        ReactDOM.render(<Parent />, container);
        // The issue only reproduced on insertion during the first update.
        ReactDOM.render(<Parent showChild={true}/>, container);
        // Enter from parent into the child.
        parent.dispatchEvent(new MouseEvent('mouseout', {
            bubbles: true,
            cancelable: true,
            relatedTarget: parent.firstChild
        }));
        // Entering a child should fire on the child, not on the parent.
        expect(childEnterCalls).toBe(1);
        expect(parentEnterCalls).toBe(0);
    });
    // Test for https://github.com/facebook/react/issues/16763.
    it('should call mouseEnter once from sibling rendered inside a rendered component', function (done) {
        var mockFn = jest.fn();
        var Parent = /** @class */ (function (_super) {
            __extends(Parent, _super);
            function Parent(props) {
                var _this = _super.call(this, props) || this;
                _this.parentEl = React.createRef();
                return _this;
            }
            Parent.prototype.componentDidMount = function () {
                ReactDOM.render(<MouseEnterDetect />, this.parentEl.current);
            };
            Parent.prototype.render = function () {
                return <div ref={this.parentEl}/>;
            };
            return Parent;
        }(React.Component));
        var MouseEnterDetect = /** @class */ (function (_super) {
            __extends(MouseEnterDetect, _super);
            function MouseEnterDetect(props) {
                var _this = _super.call(this, props) || this;
                _this.firstEl = React.createRef();
                _this.siblingEl = React.createRef();
                return _this;
            }
            MouseEnterDetect.prototype.componentDidMount = function () {
                this.siblingEl.current.dispatchEvent(new MouseEvent('mouseout', {
                    bubbles: true,
                    cancelable: true,
                    relatedTarget: this.firstEl.current
                }));
                expect(mockFn.mock.calls.length).toBe(1);
                done();
            };
            MouseEnterDetect.prototype.render = function () {
                return <React.Fragment>
                    <div ref={this.firstEl} onMouseEnter={mockFn}/>
                    <div ref={this.siblingEl}/>
                </React.Fragment>;
            };
            return MouseEnterDetect;
        }(React.Component));
        ReactDOM.render(<Parent />, container);
    });
    it('should call mouseEnter when pressing a non tracked React node', function (done) {
        var mockFn = jest.fn();
        var Parent = /** @class */ (function (_super) {
            __extends(Parent, _super);
            function Parent(props) {
                var _this = _super.call(this, props) || this;
                _this.parentEl = React.createRef();
                return _this;
            }
            Parent.prototype.componentDidMount = function () {
                ReactDOM.render(<MouseEnterDetect />, this.parentEl.current);
            };
            Parent.prototype.render = function () {
                return <div ref={this.parentEl}/>;
            };
            return Parent;
        }(React.Component));
        var MouseEnterDetect = /** @class */ (function (_super) {
            __extends(MouseEnterDetect, _super);
            function MouseEnterDetect(props) {
                var _this = _super.call(this, props) || this;
                _this.divRef = React.createRef();
                _this.siblingEl = React.createRef();
                return _this;
            }
            MouseEnterDetect.prototype.componentDidMount = function () {
                var attachedNode = document.createElement('div');
                this.divRef.current.appendChild(attachedNode);
                attachedNode.dispatchEvent(new MouseEvent('mouseout', {
                    bubbles: true,
                    cancelable: true,
                    relatedTarget: this.siblingEl.current
                }));
                expect(mockFn.mock.calls.length).toBe(1);
                done();
            };
            MouseEnterDetect.prototype.render = function () {
                return <div ref={this.divRef}>
                    <div ref={this.siblingEl} onMouseEnter={mockFn}/>
                </div>;
            };
            return MouseEnterDetect;
        }(React.Component));
        ReactDOM.render(<Parent />, container);
    });
    it('should work with portals outside of the root that has onMouseLeave', function () {
        var divRef = React.createRef();
        var onMouseLeave = jest.fn();
        function Component() {
            return <div onMouseLeave={onMouseLeave}>
                {ReactDOM.createPortal(<div ref={divRef}/>, document.body)}
            </div>;
        }
        ReactDOM.render(<Component />, container);
        // Leave from the portal div
        divRef.current.dispatchEvent(new MouseEvent('mouseout', {
            bubbles: true,
            cancelable: true,
            relatedTarget: document.body
        }));
        expect(onMouseLeave).toHaveBeenCalledTimes(1);
    });
    it('should work with portals that have onMouseEnter outside of the root ', function () {
        var divRef = React.createRef();
        var otherDivRef = React.createRef();
        var onMouseEnter = jest.fn();
        function Component() {
            return <div ref={divRef}>
                {ReactDOM.createPortal(<div ref={otherDivRef} onMouseEnter={onMouseEnter}/>, document.body)}
            </div>;
        }
        ReactDOM.render(<Component />, container);
        // Leave from the portal div
        divRef.current.dispatchEvent(new MouseEvent('mouseout', {
            bubbles: true,
            cancelable: true,
            relatedTarget: otherDivRef.current
        }));
        expect(onMouseEnter).toHaveBeenCalledTimes(1);
    });
});
