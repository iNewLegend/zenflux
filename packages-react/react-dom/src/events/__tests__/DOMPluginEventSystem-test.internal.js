/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */
'use strict';
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
Object.defineProperty(exports, "__esModule", { value: true });
var dom_event_testing_library_1 = require("dom-event-testing-library");
var React;
var ReactFeatureFlags;
var ReactDOM;
var ReactDOMClient;
var ReactDOMServer;
var Scheduler;
var act;
var waitForAll;
var waitFor;
function dispatchEvent(element, type) {
    var event = document.createEvent('Event');
    event.initEvent(type, true, true);
    element.dispatchEvent(event);
}
function dispatchClickEvent(element) {
    dispatchEvent(element, 'click');
}
var eventListenersToClear = [];
function startNativeEventListenerClearDown() {
    var nativeWindowEventListener = window.addEventListener;
    window.addEventListener = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        eventListenersToClear.push({
            target: window,
            params: params
        });
        return nativeWindowEventListener.apply(this, params);
    };
    var nativeDocumentEventListener = document.addEventListener;
    document.addEventListener = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        eventListenersToClear.push({
            target: document,
            params: params
        });
        return nativeDocumentEventListener.apply(this, params);
    };
}
function endNativeEventListenerClearDown() {
    eventListenersToClear.forEach(function (_a) {
        var target = _a.target, params = _a.params;
        target.removeEventListener.apply(target, params);
    });
}
describe('DOMPluginEventSystem', function () {
    var container;
    function withEnableLegacyFBSupport(enableLegacyFBSupport) {
        var _this = this;
        describe('enableLegacyFBSupport ' + (enableLegacyFBSupport ? 'enabled' : 'disabled'), function () {
            beforeAll(function () {
                // These tests are run twice, once with legacyFBSupport enabled and once disabled.
                // The document needs to be cleaned up a bit before the second pass otherwise it is
                // operating in a non pristine environment
                document.removeChild(document.documentElement);
                document.appendChild(document.createElement('html'));
                document.documentElement.appendChild(document.createElement('head'));
                document.documentElement.appendChild(document.createElement('body'));
            });
            beforeEach(function () {
                jest.resetModules();
                ReactFeatureFlags = require('shared/ReactFeatureFlags');
                ReactFeatureFlags.enableLegacyFBSupport = enableLegacyFBSupport;
                React = require('react');
                ReactDOM = require('react-dom');
                ReactDOMClient = require('react-dom/client');
                Scheduler = require('scheduler');
                ReactDOMServer = require('react-dom/server');
                var InternalTestUtils = require('internal-test-utils');
                waitForAll = InternalTestUtils.waitForAll;
                waitFor = InternalTestUtils.waitFor;
                act = InternalTestUtils.act;
                container = document.createElement('div');
                document.body.appendChild(container);
                startNativeEventListenerClearDown();
            });
            afterEach(function () {
                document.body.removeChild(container);
                container = null;
                endNativeEventListenerClearDown();
            });
            it('does not pool events', function () {
                var buttonRef = React.createRef();
                var log = [];
                var onClick = jest.fn(function (e) { return log.push(e); });
                function Test() {
                    return <button ref={buttonRef} onClick={onClick}/>;
                }
                ReactDOM.render(<Test />, container);
                var buttonElement = buttonRef.current;
                dispatchClickEvent(buttonElement);
                expect(onClick).toHaveBeenCalledTimes(1);
                dispatchClickEvent(buttonElement);
                expect(onClick).toHaveBeenCalledTimes(2);
                expect(log[0]).not.toBe(log[1]);
                expect(log[0].type).toBe('click');
                expect(log[1].type).toBe('click');
            });
            it('handle propagation of click events', function () {
                var buttonRef = React.createRef();
                var divRef = React.createRef();
                var log = [];
                var onClick = jest.fn(function (e) { return log.push(['bubble', e.currentTarget]); });
                var onClickCapture = jest.fn(function (e) { return log.push(['capture', e.currentTarget]); });
                function Test() {
                    return <button ref={buttonRef} onClick={onClick} onClickCapture={onClickCapture}>
                        <div ref={divRef} onClick={onClick} onClickCapture={onClickCapture}>
                            Click me!
                        </div>
                    </button>;
                }
                ReactDOM.render(<Test />, container);
                var buttonElement = buttonRef.current;
                dispatchClickEvent(buttonElement);
                expect(onClick).toHaveBeenCalledTimes(1);
                expect(onClickCapture).toHaveBeenCalledTimes(1);
                expect(log[0]).toEqual(['capture', buttonElement]);
                expect(log[1]).toEqual(['bubble', buttonElement]);
                var divElement = divRef.current;
                dispatchClickEvent(divElement);
                expect(onClick).toHaveBeenCalledTimes(3);
                expect(onClickCapture).toHaveBeenCalledTimes(3);
                expect(log[2]).toEqual(['capture', buttonElement]);
                expect(log[3]).toEqual(['capture', divElement]);
                expect(log[4]).toEqual(['bubble', divElement]);
                expect(log[5]).toEqual(['bubble', buttonElement]);
            });
            it('handle propagation of click events combined with sync clicks', function () {
                var buttonRef = React.createRef();
                var clicks = 0;
                function Test() {
                    var inputRef = React.useRef(null);
                    return <div>
                        <button ref={buttonRef} onClick={function () {
                            // Sync click
                            inputRef.current.click();
                        }}/>
                        <input ref={inputRef} onClick={function () {
                            clicks++;
                        }}/>
                    </div>;
                }
                ReactDOM.render(<Test />, container);
                var buttonElement = buttonRef.current;
                dispatchClickEvent(buttonElement);
                expect(clicks).toBe(1);
            });
            it('handle propagation of click events between roots', function () {
                var buttonRef = React.createRef();
                var divRef = React.createRef();
                var childRef = React.createRef();
                var log = [];
                var onClick = jest.fn(function (e) { return log.push(['bubble', e.currentTarget]); });
                var onClickCapture = jest.fn(function (e) { return log.push(['capture', e.currentTarget]); });
                function Child() {
                    return <div ref={divRef} onClick={onClick} onClickCapture={onClickCapture}>
                        Click me!
                    </div>;
                }
                function Parent() {
                    return <button ref={buttonRef} onClick={onClick} onClickCapture={onClickCapture}>
                        <div ref={childRef}/>
                    </button>;
                }
                ReactDOM.render(<Parent />, container);
                ReactDOM.render(<Child />, childRef.current);
                var buttonElement = buttonRef.current;
                dispatchClickEvent(buttonElement);
                expect(onClick).toHaveBeenCalledTimes(1);
                expect(onClickCapture).toHaveBeenCalledTimes(1);
                expect(log[0]).toEqual(['capture', buttonElement]);
                expect(log[1]).toEqual(['bubble', buttonElement]);
                var divElement = divRef.current;
                dispatchClickEvent(divElement);
                expect(onClick).toHaveBeenCalledTimes(3);
                expect(onClickCapture).toHaveBeenCalledTimes(3);
                expect(log[2]).toEqual(['capture', buttonElement]);
                expect(log[3]).toEqual(['capture', divElement]);
                expect(log[4]).toEqual(['bubble', divElement]);
                expect(log[5]).toEqual(['bubble', buttonElement]);
            });
            it('handle propagation of click events between disjointed roots', function () {
                var buttonRef = React.createRef();
                var divRef = React.createRef();
                var log = [];
                var onClick = jest.fn(function (e) { return log.push(['bubble', e.currentTarget]); });
                var onClickCapture = jest.fn(function (e) { return log.push(['capture', e.currentTarget]); });
                function Child() {
                    return <div ref={divRef} onClick={onClick} onClickCapture={onClickCapture}>
                        Click me!
                    </div>;
                }
                function Parent() {
                    return <button ref={buttonRef} onClick={onClick} onClickCapture={onClickCapture}/>;
                }
                var disjointedNode = document.createElement('div');
                ReactDOM.render(<Parent />, container);
                buttonRef.current.appendChild(disjointedNode);
                ReactDOM.render(<Child />, disjointedNode);
                var buttonElement = buttonRef.current;
                dispatchClickEvent(buttonElement);
                expect(onClick).toHaveBeenCalledTimes(1);
                expect(onClickCapture).toHaveBeenCalledTimes(1);
                expect(log[0]).toEqual(['capture', buttonElement]);
                expect(log[1]).toEqual(['bubble', buttonElement]);
                var divElement = divRef.current;
                dispatchClickEvent(divElement);
                expect(onClick).toHaveBeenCalledTimes(3);
                expect(onClickCapture).toHaveBeenCalledTimes(3);
                expect(log[2]).toEqual(['capture', buttonElement]);
                expect(log[3]).toEqual(['capture', divElement]);
                expect(log[4]).toEqual(['bubble', divElement]);
                expect(log[5]).toEqual(['bubble', buttonElement]);
            });
            it('handle propagation of click events between disjointed roots #2', function () {
                var buttonRef = React.createRef();
                var button2Ref = React.createRef();
                var divRef = React.createRef();
                var spanRef = React.createRef();
                var log = [];
                var onClick = jest.fn(function (e) { return log.push(['bubble', e.currentTarget]); });
                var onClickCapture = jest.fn(function (e) { return log.push(['capture', e.currentTarget]); });
                function Child() {
                    return <div ref={divRef} onClick={onClick} onClickCapture={onClickCapture}>
                        Click me!
                    </div>;
                }
                function Parent() {
                    return <button ref={button2Ref} onClick={onClick} onClickCapture={onClickCapture}/>;
                }
                function GrandParent() {
                    return <button ref={buttonRef} onClick={onClick} onClickCapture={onClickCapture}>
                        <span ref={spanRef}/>
                    </button>;
                }
                // We make a wrapper with an inner container that we
                // render to. So it looks like <div><span></span></div>
                // We then render to all three:
                // - container
                // - parentContainer
                // - childContainer
                var parentContainer = document.createElement('div');
                var childContainer = document.createElement('div');
                ReactDOM.render(<GrandParent />, container);
                ReactDOM.render(<Parent />, parentContainer);
                ReactDOM.render(<Child />, childContainer);
                parentContainer.appendChild(childContainer);
                spanRef.current.appendChild(parentContainer);
                // Inside <GrandParent />
                var buttonElement = buttonRef.current;
                dispatchClickEvent(buttonElement);
                expect(onClick).toHaveBeenCalledTimes(1);
                expect(onClickCapture).toHaveBeenCalledTimes(1);
                expect(log[0]).toEqual(['capture', buttonElement]);
                expect(log[1]).toEqual(['bubble', buttonElement]);
                // Inside <Child />
                var divElement = divRef.current;
                dispatchClickEvent(divElement);
                expect(onClick).toHaveBeenCalledTimes(3);
                expect(onClickCapture).toHaveBeenCalledTimes(3);
                expect(log[2]).toEqual(['capture', buttonElement]);
                expect(log[3]).toEqual(['capture', divElement]);
                expect(log[4]).toEqual(['bubble', divElement]);
                expect(log[5]).toEqual(['bubble', buttonElement]);
                // Inside <Parent />
                var buttonElement2 = button2Ref.current;
                dispatchClickEvent(buttonElement2);
                expect(onClick).toHaveBeenCalledTimes(5);
                expect(onClickCapture).toHaveBeenCalledTimes(5);
                expect(log[6]).toEqual(['capture', buttonElement]);
                expect(log[7]).toEqual(['capture', buttonElement2]);
                expect(log[8]).toEqual(['bubble', buttonElement2]);
                expect(log[9]).toEqual(['bubble', buttonElement]);
            });
            it('handle propagation of click events between disjointed comment roots', function () {
                var buttonRef = React.createRef();
                var divRef = React.createRef();
                var log = [];
                var onClick = jest.fn(function (e) { return log.push(['bubble', e.currentTarget]); });
                var onClickCapture = jest.fn(function (e) { return log.push(['capture', e.currentTarget]); });
                function Child() {
                    return <div ref={divRef} onClick={onClick} onClickCapture={onClickCapture}>
                        Click me!
                    </div>;
                }
                function Parent() {
                    return <button ref={buttonRef} onClick={onClick} onClickCapture={onClickCapture}/>;
                }
                // We use a comment node here, then mount to it
                var disjointedNode = document.createComment(' react-mount-point-unstable ');
                ReactDOM.render(<Parent />, container);
                buttonRef.current.appendChild(disjointedNode);
                ReactDOM.render(<Child />, disjointedNode);
                var buttonElement = buttonRef.current;
                dispatchClickEvent(buttonElement);
                expect(onClick).toHaveBeenCalledTimes(1);
                expect(onClickCapture).toHaveBeenCalledTimes(1);
                expect(log[0]).toEqual(['capture', buttonElement]);
                expect(log[1]).toEqual(['bubble', buttonElement]);
                var divElement = divRef.current;
                dispatchClickEvent(divElement);
                expect(onClick).toHaveBeenCalledTimes(3);
                expect(onClickCapture).toHaveBeenCalledTimes(3);
                expect(log[2]).toEqual(['capture', buttonElement]);
                expect(log[3]).toEqual(['capture', divElement]);
                expect(log[4]).toEqual(['bubble', divElement]);
                expect(log[5]).toEqual(['bubble', buttonElement]);
            });
            it('handle propagation of click events between disjointed comment roots #2', function () {
                var buttonRef = React.createRef();
                var divRef = React.createRef();
                var spanRef = React.createRef();
                var log = [];
                var onClick = jest.fn(function (e) { return log.push(['bubble', e.currentTarget]); });
                var onClickCapture = jest.fn(function (e) { return log.push(['capture', e.currentTarget]); });
                function Child() {
                    return <div ref={divRef} onClick={onClick} onClickCapture={onClickCapture}>
                        Click me!
                    </div>;
                }
                function Parent() {
                    return <button ref={buttonRef} onClick={onClick} onClickCapture={onClickCapture}>
                        <span ref={spanRef}/>
                    </button>;
                }
                // We use a comment node here, then mount to it
                var disjointedNode = document.createComment(' react-mount-point-unstable ');
                ReactDOM.render(<Parent />, container);
                spanRef.current.appendChild(disjointedNode);
                ReactDOM.render(<Child />, disjointedNode);
                var buttonElement = buttonRef.current;
                dispatchClickEvent(buttonElement);
                expect(onClick).toHaveBeenCalledTimes(1);
                expect(onClickCapture).toHaveBeenCalledTimes(1);
                expect(log[0]).toEqual(['capture', buttonElement]);
                expect(log[1]).toEqual(['bubble', buttonElement]);
                var divElement = divRef.current;
                dispatchClickEvent(divElement);
                expect(onClick).toHaveBeenCalledTimes(3);
                expect(onClickCapture).toHaveBeenCalledTimes(3);
                expect(log[2]).toEqual(['capture', buttonElement]);
                expect(log[3]).toEqual(['capture', divElement]);
                expect(log[4]).toEqual(['bubble', divElement]);
                expect(log[5]).toEqual(['bubble', buttonElement]);
            });
            it('handle propagation of click events between portals', function () {
                var buttonRef = React.createRef();
                var divRef = React.createRef();
                var log = [];
                var onClick = jest.fn(function (e) { return log.push(['bubble', e.currentTarget]); });
                var onClickCapture = jest.fn(function (e) { return log.push(['capture', e.currentTarget]); });
                var portalElement = document.createElement('div');
                document.body.appendChild(portalElement);
                function Child() {
                    return <div ref={divRef} onClick={onClick} onClickCapture={onClickCapture}>
                        Click me!
                    </div>;
                }
                function Parent() {
                    return <button ref={buttonRef} onClick={onClick} onClickCapture={onClickCapture}>
                        {ReactDOM.createPortal(<Child />, portalElement)}
                    </button>;
                }
                ReactDOM.render(<Parent />, container);
                var buttonElement = buttonRef.current;
                dispatchClickEvent(buttonElement);
                expect(onClick).toHaveBeenCalledTimes(1);
                expect(onClickCapture).toHaveBeenCalledTimes(1);
                expect(log[0]).toEqual(['capture', buttonElement]);
                expect(log[1]).toEqual(['bubble', buttonElement]);
                var divElement = divRef.current;
                dispatchClickEvent(divElement);
                expect(onClick).toHaveBeenCalledTimes(3);
                expect(onClickCapture).toHaveBeenCalledTimes(3);
                expect(log[2]).toEqual(['capture', buttonElement]);
                expect(log[3]).toEqual(['capture', divElement]);
                expect(log[4]).toEqual(['bubble', divElement]);
                expect(log[5]).toEqual(['bubble', buttonElement]);
                document.body.removeChild(portalElement);
            });
            it('handle click events on document.body portals', function () {
                var log = [];
                function Child(_a) {
                    var label = _a.label;
                    return <div onClick={function () { return log.push(label); }}>{label}</div>;
                }
                function Parent() {
                    return <>
                        {ReactDOM.createPortal(<Child label={'first'}/>, document.body)}
                        {ReactDOM.createPortal(<Child label={'second'}/>, document.body)}
                    </>;
                }
                ReactDOM.render(<Parent />, container);
                var second = document.body.lastChild;
                expect(second.textContent).toEqual('second');
                dispatchClickEvent(second);
                expect(log).toEqual(['second']);
                var first = second.previousSibling;
                expect(first.textContent).toEqual('first');
                dispatchClickEvent(first);
                expect(log).toEqual(['second', 'first']);
            });
            it('does not invoke an event on a parent tree when a subtree is dehydrated', function () { return __awaiter(_this, void 0, void 0, function () {
                function Parent() {
                    return <div onClick={function () { return clicks++; }} ref={childSlotRef}/>;
                }
                function Child(_a) {
                    var text = _a.text;
                    if (suspend) {
                        throw promise;
                    }
                    else {
                        return <a>Click me</a>;
                    }
                }
                function App() {
                    // The root is a Suspense boundary.
                    return <React.Suspense fallback="Loading...">
                        <Child />
                    </React.Suspense>;
                }
                var suspend, resolve, promise, clicks, childSlotRef, finalHTML, parentContainer, childContainer, parentRoot, a;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            suspend = false;
                            promise = new Promise(function (resolvePromise) { return resolve = resolvePromise; });
                            clicks = 0;
                            childSlotRef = React.createRef();
                            suspend = false;
                            finalHTML = ReactDOMServer.renderToString(<App />);
                            parentContainer = document.createElement('div');
                            childContainer = document.createElement('div');
                            // We need this to be in the document since we'll dispatch events on it.
                            document.body.appendChild(parentContainer);
                            parentRoot = ReactDOMClient.createRoot(parentContainer);
                            return [4 /*yield*/, act(function () {
                                    parentRoot.render(<Parent />);
                                })];
                        case 1:
                            _a.sent();
                            childSlotRef.current.appendChild(childContainer);
                            childContainer.innerHTML = finalHTML;
                            a = childContainer.getElementsByTagName('a')[0];
                            suspend = true;
                            // Hydrate asynchronously.
                            return [4 /*yield*/, act(function () {
                                    ReactDOMClient.hydrateRoot(childContainer, <App />);
                                })];
                        case 2:
                            // Hydrate asynchronously.
                            _a.sent();
                            // The Suspense boundary is not yet hydrated.
                            return [4 /*yield*/, act(function () {
                                    a.click();
                                })];
                        case 3:
                            // The Suspense boundary is not yet hydrated.
                            _a.sent();
                            expect(clicks).toBe(0);
                            // Resolving the promise so that rendering can complete.
                            return [4 /*yield*/, act(function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                suspend = false;
                                                resolve();
                                                return [4 /*yield*/, promise];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 4:
                            // Resolving the promise so that rendering can complete.
                            _a.sent();
                            // We're now full hydrated.
                            expect(clicks).toBe(0);
                            document.body.removeChild(parentContainer);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('handle click events on dynamic portals', function () { return __awaiter(_this, void 0, void 0, function () {
                function Parent() {
                    var ref = React.useRef(null);
                    var _a = React.useState(null), portal = _a[0], setPortal = _a[1];
                    React.useEffect(function () {
                        setPortal(ReactDOM.createPortal(<span onClick={function () { return log.push('child'); }} id="child"/>, ref.current));
                    }, []);
                    return <div ref={ref} onClick={function () { return log.push('parent'); }} id="parent">
                        {portal}
                    </div>;
                }
                var log, parent, child;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            log = [];
                            return [4 /*yield*/, act(function () {
                                    ReactDOM.render(<Parent />, container);
                                })];
                        case 1:
                            _a.sent();
                            parent = container.lastChild;
                            expect(parent.id).toEqual('parent');
                            return [4 /*yield*/, act(function () {
                                    dispatchClickEvent(parent);
                                })];
                        case 2:
                            _a.sent();
                            expect(log).toEqual(['parent']);
                            child = parent.lastChild;
                            expect(child.id).toEqual('child');
                            return [4 /*yield*/, act(function () {
                                    dispatchClickEvent(child);
                                })];
                        case 3:
                            _a.sent();
                            // we add both 'child' and 'parent' due to bubbling
                            expect(log).toEqual(['parent', 'child', 'parent']);
                            return [2 /*return*/];
                    }
                });
            }); });
            // Slight alteration to the last test, to catch
            // a subtle difference in traversal.
            it('handle click events on dynamic portals #2', function () { return __awaiter(_this, void 0, void 0, function () {
                function Parent() {
                    var ref = React.useRef(null);
                    var _a = React.useState(null), portal = _a[0], setPortal = _a[1];
                    React.useEffect(function () {
                        setPortal(ReactDOM.createPortal(<span onClick={function () { return log.push('child'); }} id="child"/>, ref.current));
                    }, []);
                    return <div ref={ref} onClick={function () { return log.push('parent'); }} id="parent">
                        <div>{portal}</div>
                    </div>;
                }
                var log, parent, child;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            log = [];
                            return [4 /*yield*/, act(function () {
                                    ReactDOM.render(<Parent />, container);
                                })];
                        case 1:
                            _a.sent();
                            parent = container.lastChild;
                            expect(parent.id).toEqual('parent');
                            return [4 /*yield*/, act(function () {
                                    dispatchClickEvent(parent);
                                })];
                        case 2:
                            _a.sent();
                            expect(log).toEqual(['parent']);
                            child = parent.lastChild;
                            expect(child.id).toEqual('child');
                            return [4 /*yield*/, act(function () {
                                    dispatchClickEvent(child);
                                })];
                        case 3:
                            _a.sent();
                            // we add both 'child' and 'parent' due to bubbling
                            expect(log).toEqual(['parent', 'child', 'parent']);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('native stopPropagation on click events between portals', function () {
                var buttonRef = React.createRef();
                var divRef = React.createRef();
                var middleDivRef = React.createRef();
                var log = [];
                var onClick = jest.fn(function (e) { return log.push(['bubble', e.currentTarget]); });
                var onClickCapture = jest.fn(function (e) { return log.push(['capture', e.currentTarget]); });
                var portalElement = document.createElement('div');
                document.body.appendChild(portalElement);
                function Child() {
                    return <div ref={middleDivRef}>
                        <div ref={divRef} onClick={onClick} onClickCapture={onClickCapture}>
                            Click me!
                        </div>
                    </div>;
                }
                function Parent() {
                    React.useLayoutEffect(function () {
                        // This should prevent the portalElement listeners from
                        // capturing the events in the bubble phase.
                        middleDivRef.current.addEventListener('click', function (e) {
                            e.stopPropagation();
                        });
                    });
                    return <button ref={buttonRef} onClick={onClick} onClickCapture={onClickCapture}>
                        {ReactDOM.createPortal(<Child />, portalElement)}
                    </button>;
                }
                ReactDOM.render(<Parent />, container);
                var buttonElement = buttonRef.current;
                dispatchClickEvent(buttonElement);
                expect(onClick).toHaveBeenCalledTimes(1);
                expect(onClickCapture).toHaveBeenCalledTimes(1);
                expect(log[0]).toEqual(['capture', buttonElement]);
                expect(log[1]).toEqual(['bubble', buttonElement]);
                var divElement = divRef.current;
                dispatchClickEvent(divElement);
                expect(onClick).toHaveBeenCalledTimes(1);
                expect(onClickCapture).toHaveBeenCalledTimes(3);
                document.body.removeChild(portalElement);
            });
            it('handle propagation of focus events', function () {
                var buttonRef = React.createRef();
                var divRef = React.createRef();
                var log = [];
                var onFocus = jest.fn(function (e) { return log.push(['bubble', e.currentTarget]); });
                var onFocusCapture = jest.fn(function (e) { return log.push(['capture', e.currentTarget]); });
                function Test() {
                    return <button ref={buttonRef} onFocus={onFocus} onFocusCapture={onFocusCapture}>
                        <div ref={divRef} onFocus={onFocus} onFocusCapture={onFocusCapture} tabIndex={0}>
                            Click me!
                        </div>
                    </button>;
                }
                ReactDOM.render(<Test />, container);
                var buttonElement = buttonRef.current;
                buttonElement.focus();
                expect(onFocus).toHaveBeenCalledTimes(1);
                expect(onFocusCapture).toHaveBeenCalledTimes(1);
                expect(log[0]).toEqual(['capture', buttonElement]);
                expect(log[1]).toEqual(['bubble', buttonElement]);
                var divElement = divRef.current;
                divElement.focus();
                expect(onFocus).toHaveBeenCalledTimes(3);
                expect(onFocusCapture).toHaveBeenCalledTimes(3);
                expect(log[2]).toEqual(['capture', buttonElement]);
                expect(log[3]).toEqual(['capture', divElement]);
                expect(log[4]).toEqual(['bubble', divElement]);
                expect(log[5]).toEqual(['bubble', buttonElement]);
            });
            it('handle propagation of focus events between roots', function () {
                var buttonRef = React.createRef();
                var divRef = React.createRef();
                var childRef = React.createRef();
                var log = [];
                var onFocus = jest.fn(function (e) { return log.push(['bubble', e.currentTarget]); });
                var onFocusCapture = jest.fn(function (e) { return log.push(['capture', e.currentTarget]); });
                function Child() {
                    return <div ref={divRef} onFocus={onFocus} onFocusCapture={onFocusCapture} tabIndex={0}>
                        Click me!
                    </div>;
                }
                function Parent() {
                    return <button ref={buttonRef} onFocus={onFocus} onFocusCapture={onFocusCapture}>
                        <div ref={childRef}/>
                    </button>;
                }
                ReactDOM.render(<Parent />, container);
                ReactDOM.render(<Child />, childRef.current);
                var buttonElement = buttonRef.current;
                buttonElement.focus();
                expect(onFocus).toHaveBeenCalledTimes(1);
                expect(onFocusCapture).toHaveBeenCalledTimes(1);
                expect(log[0]).toEqual(['capture', buttonElement]);
                expect(log[1]).toEqual(['bubble', buttonElement]);
                var divElement = divRef.current;
                divElement.focus();
                expect(onFocus).toHaveBeenCalledTimes(3);
                expect(onFocusCapture).toHaveBeenCalledTimes(3);
                expect(log[2]).toEqual(['capture', buttonElement]);
                expect(log[3]).toEqual(['capture', divElement]);
                expect(log[4]).toEqual(['bubble', divElement]);
                expect(log[5]).toEqual(['bubble', buttonElement]);
            });
            it('handle propagation of focus events between portals', function () {
                var buttonRef = React.createRef();
                var divRef = React.createRef();
                var log = [];
                var onFocus = jest.fn(function (e) { return log.push(['bubble', e.currentTarget]); });
                var onFocusCapture = jest.fn(function (e) { return log.push(['capture', e.currentTarget]); });
                var portalElement = document.createElement('div');
                document.body.appendChild(portalElement);
                function Child() {
                    return <div ref={divRef} onFocus={onFocus} onFocusCapture={onFocusCapture} tabIndex={0}>
                        Click me!
                    </div>;
                }
                function Parent() {
                    return <button ref={buttonRef} onFocus={onFocus} onFocusCapture={onFocusCapture}>
                        {ReactDOM.createPortal(<Child />, portalElement)}
                    </button>;
                }
                ReactDOM.render(<Parent />, container);
                var buttonElement = buttonRef.current;
                buttonElement.focus();
                expect(onFocus).toHaveBeenCalledTimes(1);
                expect(onFocusCapture).toHaveBeenCalledTimes(1);
                expect(log[0]).toEqual(['capture', buttonElement]);
                expect(log[1]).toEqual(['bubble', buttonElement]);
                var divElement = divRef.current;
                divElement.focus();
                expect(onFocus).toHaveBeenCalledTimes(3);
                expect(onFocusCapture).toHaveBeenCalledTimes(3);
                expect(log[2]).toEqual(['capture', buttonElement]);
                expect(log[3]).toEqual(['capture', divElement]);
                expect(log[4]).toEqual(['bubble', divElement]);
                expect(log[5]).toEqual(['bubble', buttonElement]);
                document.body.removeChild(portalElement);
            });
            it('native stopPropagation on focus events between portals', function () {
                var buttonRef = React.createRef();
                var divRef = React.createRef();
                var middleDivRef = React.createRef();
                var log = [];
                var onFocus = jest.fn(function (e) { return log.push(['bubble', e.currentTarget]); });
                var onFocusCapture = jest.fn(function (e) { return log.push(['capture', e.currentTarget]); });
                var portalElement = document.createElement('div');
                document.body.appendChild(portalElement);
                function Child() {
                    return <div ref={middleDivRef}>
                        <div ref={divRef} onFocus={onFocus} onFocusCapture={onFocusCapture} tabIndex={0}>
                            Click me!
                        </div>
                    </div>;
                }
                function Parent() {
                    React.useLayoutEffect(function () {
                        // This should prevent the portalElement listeners from
                        // capturing the events in the bubble phase.
                        middleDivRef.current.addEventListener('focusin', function (e) {
                            e.stopPropagation();
                        });
                    });
                    return <button ref={buttonRef} onFocus={onFocus} onFocusCapture={onFocusCapture}>
                        {ReactDOM.createPortal(<Child />, portalElement)}
                    </button>;
                }
                ReactDOM.render(<Parent />, container);
                var buttonElement = buttonRef.current;
                buttonElement.focus();
                expect(onFocus).toHaveBeenCalledTimes(1);
                expect(onFocusCapture).toHaveBeenCalledTimes(1);
                expect(log[0]).toEqual(['capture', buttonElement]);
                expect(log[1]).toEqual(['bubble', buttonElement]);
                var divElement = divRef.current;
                divElement.focus();
                expect(onFocus).toHaveBeenCalledTimes(1);
                expect(onFocusCapture).toHaveBeenCalledTimes(3);
                document.body.removeChild(portalElement);
            });
            it('handle propagation of enter and leave events between portals', function () {
                var buttonRef = React.createRef();
                var divRef = React.createRef();
                var log = [];
                var onMouseEnter = jest.fn(function (e) { return log.push(e.currentTarget); });
                var onMouseLeave = jest.fn(function (e) { return log.push(e.currentTarget); });
                var portalElement = document.createElement('div');
                document.body.appendChild(portalElement);
                function Child() {
                    return <div ref={divRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}/>;
                }
                function Parent() {
                    return <button ref={buttonRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                        {ReactDOM.createPortal(<Child />, portalElement)}
                    </button>;
                }
                ReactDOM.render(<Parent />, container);
                var buttonElement = buttonRef.current;
                buttonElement.dispatchEvent(new MouseEvent('mouseover', {
                    bubbles: true,
                    cancelable: true,
                    relatedTarget: null
                }));
                expect(onMouseEnter).toHaveBeenCalledTimes(1);
                expect(onMouseLeave).toHaveBeenCalledTimes(0);
                expect(log[0]).toEqual(buttonElement);
                var divElement = divRef.current;
                buttonElement.dispatchEvent(new MouseEvent('mouseout', {
                    bubbles: true,
                    cancelable: true,
                    relatedTarget: divElement
                }));
                divElement.dispatchEvent(new MouseEvent('mouseover', {
                    bubbles: true,
                    cancelable: true,
                    relatedTarget: buttonElement
                }));
                expect(onMouseEnter).toHaveBeenCalledTimes(2);
                expect(onMouseLeave).toHaveBeenCalledTimes(0);
                expect(log[1]).toEqual(divElement);
                document.body.removeChild(portalElement);
            });
            it('handle propagation of enter and leave events between portals #2', function () {
                var buttonRef = React.createRef();
                var divRef = React.createRef();
                var portalRef = React.createRef();
                var log = [];
                var onMouseEnter = jest.fn(function (e) { return log.push(e.currentTarget); });
                var onMouseLeave = jest.fn(function (e) { return log.push(e.currentTarget); });
                function Child() {
                    return <div ref={divRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}/>;
                }
                function Parent() {
                    var _a = React.useState(null), portal = _a[0], setPortal = _a[1];
                    React.useLayoutEffect(function () {
                        setPortal(ReactDOM.createPortal(<Child />, portalRef.current));
                    }, []);
                    return <button ref={buttonRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                        <div ref={portalRef}>{portal}</div>
                    </button>;
                }
                ReactDOM.render(<Parent />, container);
                var buttonElement = buttonRef.current;
                buttonElement.dispatchEvent(new MouseEvent('mouseover', {
                    bubbles: true,
                    cancelable: true,
                    relatedTarget: null
                }));
                expect(onMouseEnter).toHaveBeenCalledTimes(1);
                expect(onMouseLeave).toHaveBeenCalledTimes(0);
                expect(log[0]).toEqual(buttonElement);
                var divElement = divRef.current;
                buttonElement.dispatchEvent(new MouseEvent('mouseout', {
                    bubbles: true,
                    cancelable: true,
                    relatedTarget: divElement
                }));
                divElement.dispatchEvent(new MouseEvent('mouseover', {
                    bubbles: true,
                    cancelable: true,
                    relatedTarget: buttonElement
                }));
                expect(onMouseEnter).toHaveBeenCalledTimes(2);
                expect(onMouseLeave).toHaveBeenCalledTimes(0);
                expect(log[1]).toEqual(divElement);
            });
            it('should preserve bubble/capture order between roots and nested portals', function () {
                var targetRef = React.createRef();
                var log = [];
                var onClickRoot = jest.fn(function (e) { return log.push('bubble root'); });
                var onClickCaptureRoot = jest.fn(function (e) { return log.push('capture root'); });
                var onClickPortal = jest.fn(function (e) { return log.push('bubble portal'); });
                var onClickCapturePortal = jest.fn(function (e) { return log.push('capture portal'); });
                function Portal() {
                    return <div onClick={onClickPortal} onClickCapture={onClickCapturePortal} ref={targetRef}>
                        Click me!
                    </div>;
                }
                var portalContainer = document.createElement('div');
                var shouldStopPropagation = false;
                portalContainer.addEventListener('click', function (e) {
                    if (shouldStopPropagation) {
                        e.stopPropagation();
                    }
                }, false);
                function Root() {
                    var portalTargetRef = React.useRef(null);
                    React.useLayoutEffect(function () {
                        portalTargetRef.current.appendChild(portalContainer);
                    });
                    return <div onClick={onClickRoot} onClickCapture={onClickCaptureRoot}>
                        <div ref={portalTargetRef}/>
                        {ReactDOM.createPortal(<Portal />, portalContainer)}
                    </div>;
                }
                ReactDOM.render(<Root />, container);
                var divElement = targetRef.current;
                dispatchClickEvent(divElement);
                expect(log).toEqual(['capture root', 'capture portal', 'bubble portal', 'bubble root']);
                log = [];
                shouldStopPropagation = true;
                dispatchClickEvent(divElement);
                if (enableLegacyFBSupport) {
                    // We aren't using roots with legacyFBSupport, we put clicks on the document, so we exbit the previous
                    // behavior.
                    expect(log).toEqual(['capture root', 'capture portal']);
                }
                else {
                    expect(log).toEqual([
                        'capture root', 'capture portal', 'bubble portal', 'bubble root'
                    ]);
                }
            });
            describe('ReactDOM.createEventHandle', function () {
                beforeEach(function () {
                    jest.resetModules();
                    ReactFeatureFlags = require('shared/ReactFeatureFlags');
                    ReactFeatureFlags.enableLegacyFBSupport = enableLegacyFBSupport;
                    ReactFeatureFlags.enableCreateEventHandleAPI = true;
                    React = require('react');
                    ReactDOM = require('react-dom');
                    ReactDOMClient = require('react-dom/client');
                    Scheduler = require('scheduler');
                    ReactDOMServer = require('react-dom/server');
                    act = require('internal-test-utils').act;
                    var InternalTestUtils = require('internal-test-utils');
                    waitForAll = InternalTestUtils.waitForAll;
                    waitFor = InternalTestUtils.waitFor;
                });
                // @gate www
                it('can render correctly with the ReactDOMServer', function () {
                    var clickEvent = jest.fn();
                    var setClick = ReactDOM.unstable_createEventHandle('click');
                    function Test() {
                        var divRef = React.useRef(null);
                        React.useEffect(function () {
                            return setClick(divRef.current, clickEvent);
                        });
                        return <div ref={divRef}>Hello world</div>;
                    }
                    var output = ReactDOMServer.renderToString(<Test />);
                    expect(output).toBe("<div>Hello world</div>");
                });
                // @gate www
                it('can render correctly with the ReactDOMServer hydration', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Test() {
                        React.useEffect(function () {
                            return setClick(spanRef.current, clickEvent);
                        });
                        return <div>
                            <span ref={spanRef}>Hello world</span>
                        </div>;
                    }
                    var clickEvent, spanRef, setClick, output;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                clickEvent = jest.fn();
                                spanRef = React.createRef();
                                setClick = ReactDOM.unstable_createEventHandle('click');
                                output = ReactDOMServer.renderToString(<Test />);
                                expect(output).toBe("<div><span>Hello world</span></div>");
                                container.innerHTML = output;
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.hydrate(<Test />, container);
                                    })];
                            case 1:
                                _a.sent();
                                dispatchClickEvent(spanRef.current);
                                expect(clickEvent).toHaveBeenCalledTimes(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('should correctly work for a basic "click" listener', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Test() {
                        React.useEffect(function () {
                            return setClick(buttonRef.current, clickEvent);
                        });
                        return <button ref={buttonRef}>
                            <div ref={divRef}>Click me!</div>
                        </button>;
                    }
                    function Test2(_a) {
                        var clickEvent2 = _a.clickEvent2;
                        React.useEffect(function () {
                            return setClick2(buttonRef.current, clickEvent2);
                        });
                        return <button ref={buttonRef}>
                            <div ref={divRef}>Click me!</div>
                        </button>;
                    }
                    var log, clickEvent, divRef, buttonRef, setClick, divElement, buttonElement, setClick2, clickEvent2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                log = [];
                                clickEvent = jest.fn(function (event) {
                                    log.push({
                                        eventPhase: event.eventPhase,
                                        type: event.type,
                                        currentTarget: event.currentTarget,
                                        target: event.target
                                    });
                                });
                                divRef = React.createRef();
                                buttonRef = React.createRef();
                                setClick = ReactDOM.unstable_createEventHandle('click');
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test />, container);
                                    })];
                            case 1:
                                _a.sent();
                                expect(container.innerHTML).toBe('<button><div>Click me!</div></button>');
                                divElement = divRef.current;
                                dispatchClickEvent(divElement);
                                expect(log).toEqual([{
                                        eventPhase: 3,
                                        type: 'click',
                                        currentTarget: buttonRef.current,
                                        target: divRef.current
                                    }]);
                                expect(clickEvent).toBeCalledTimes(1);
                                // Unmounting the container and clicking should not work
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(null, container);
                                    })];
                            case 2:
                                // Unmounting the container and clicking should not work
                                _a.sent();
                                dispatchClickEvent(divElement);
                                expect(clickEvent).toBeCalledTimes(1);
                                // Re-rendering the container and clicking should work
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test />, container);
                                    })];
                            case 3:
                                // Re-rendering the container and clicking should work
                                _a.sent();
                                divElement = divRef.current;
                                dispatchClickEvent(divElement);
                                expect(clickEvent).toBeCalledTimes(2);
                                log = [];
                                buttonElement = buttonRef.current;
                                dispatchClickEvent(buttonElement);
                                expect(log).toEqual([{
                                        eventPhase: 3,
                                        type: 'click',
                                        currentTarget: buttonRef.current,
                                        target: buttonRef.current
                                    }]);
                                setClick2 = ReactDOM.unstable_createEventHandle('click');
                                clickEvent2 = jest.fn();
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test2 clickEvent2={clickEvent2}/>, container);
                                    })];
                            case 4:
                                _a.sent();
                                divElement = divRef.current;
                                dispatchClickEvent(divElement);
                                expect(clickEvent2).toBeCalledTimes(1);
                                // Reset the function we pass in, so it's different
                                clickEvent2 = jest.fn();
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test2 clickEvent2={clickEvent2}/>, container);
                                    })];
                            case 5:
                                _a.sent();
                                divElement = divRef.current;
                                dispatchClickEvent(divElement);
                                expect(clickEvent2).toBeCalledTimes(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('should correctly work for setting and clearing a basic "click" listener', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Test(_a) {
                        var off = _a.off;
                        React.useEffect(function () {
                            var clear = setClick(buttonRef.current, clickEvent);
                            if (off) {
                                clear();
                            }
                            return clear;
                        });
                        return <button ref={buttonRef}>
                            <div ref={divRef}>Click me!</div>
                        </button>;
                    }
                    var clickEvent, divRef, buttonRef, setClick, divElement;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                clickEvent = jest.fn();
                                divRef = React.createRef();
                                buttonRef = React.createRef();
                                setClick = ReactDOM.unstable_createEventHandle('click');
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test off={false}/>, container);
                                    })];
                            case 1:
                                _a.sent();
                                divElement = divRef.current;
                                dispatchClickEvent(divElement);
                                expect(clickEvent).toBeCalledTimes(1);
                                // The listener should get unmounted
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test off={true}/>, container);
                                    })];
                            case 2:
                                // The listener should get unmounted
                                _a.sent();
                                clickEvent.mockClear();
                                divElement = divRef.current;
                                dispatchClickEvent(divElement);
                                expect(clickEvent).toBeCalledTimes(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('should handle the target being a text node', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Test() {
                        React.useEffect(function () {
                            return setClick(buttonRef.current, clickEvent);
                        });
                        return <button ref={buttonRef}>Click me!</button>;
                    }
                    var clickEvent, buttonRef, setClick, textNode;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                clickEvent = jest.fn();
                                buttonRef = React.createRef();
                                setClick = ReactDOM.unstable_createEventHandle('click');
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test />, container);
                                    })];
                            case 1:
                                _a.sent();
                                textNode = buttonRef.current.firstChild;
                                dispatchClickEvent(textNode);
                                expect(clickEvent).toBeCalledTimes(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('handle propagation of click events', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Test() {
                        React.useEffect(function () {
                            var clearClick1 = setClick(buttonRef.current, onClick);
                            var clearCaptureClick1 = setCaptureClick(buttonRef.current, onClickCapture);
                            var clearClick2 = setClick(divRef.current, onClick);
                            var clearCaptureClick2 = setCaptureClick(divRef.current, onClickCapture);
                            return function () {
                                clearClick1();
                                clearCaptureClick1();
                                clearClick2();
                                clearCaptureClick2();
                            };
                        });
                        return <button ref={buttonRef}>
                            <div ref={divRef}>Click me!</div>
                        </button>;
                    }
                    var buttonRef, divRef, log, onClick, onClickCapture, setClick, setCaptureClick, buttonElement, divElement;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                buttonRef = React.createRef();
                                divRef = React.createRef();
                                log = [];
                                onClick = jest.fn(function (e) { return log.push(['bubble', e.currentTarget]); });
                                onClickCapture = jest.fn(function (e) { return log.push(['capture', e.currentTarget]); });
                                setClick = ReactDOM.unstable_createEventHandle('click');
                                setCaptureClick = ReactDOM.unstable_createEventHandle('click', {
                                    capture: true
                                });
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test />, container);
                                    })];
                            case 1:
                                _a.sent();
                                buttonElement = buttonRef.current;
                                dispatchClickEvent(buttonElement);
                                expect(onClick).toHaveBeenCalledTimes(1);
                                expect(onClickCapture).toHaveBeenCalledTimes(1);
                                expect(log[0]).toEqual(['capture', buttonElement]);
                                expect(log[1]).toEqual(['bubble', buttonElement]);
                                log.length = 0;
                                onClick.mockClear();
                                onClickCapture.mockClear();
                                divElement = divRef.current;
                                dispatchClickEvent(divElement);
                                expect(onClick).toHaveBeenCalledTimes(2);
                                expect(onClickCapture).toHaveBeenCalledTimes(2);
                                expect(log[0]).toEqual(['capture', buttonElement]);
                                expect(log[1]).toEqual(['capture', divElement]);
                                expect(log[2]).toEqual(['bubble', divElement]);
                                expect(log[3]).toEqual(['bubble', buttonElement]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('handle propagation of click events mixed with onClick events', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Test() {
                        React.useEffect(function () {
                            setClick(buttonRef.current, onClick);
                            setClickCapture(buttonRef.current, onClickCapture);
                            return function () {
                                setClick();
                                setClickCapture();
                            };
                        });
                        return <button ref={buttonRef}>
                            <div ref={divRef} onClick={onClick} onClickCapture={onClickCapture}>
                                Click me!
                            </div>
                        </button>;
                    }
                    var buttonRef, divRef, log, onClick, onClickCapture, setClick, setClickCapture, buttonElement, divElement;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                buttonRef = React.createRef();
                                divRef = React.createRef();
                                log = [];
                                onClick = jest.fn(function (e) { return log.push(['bubble', e.currentTarget]); });
                                onClickCapture = jest.fn(function (e) { return log.push(['capture', e.currentTarget]); });
                                setClick = ReactDOM.unstable_createEventHandle('click');
                                setClickCapture = ReactDOM.unstable_createEventHandle('click', {
                                    capture: true
                                });
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test />, container);
                                    })];
                            case 1:
                                _a.sent();
                                buttonElement = buttonRef.current;
                                dispatchClickEvent(buttonElement);
                                expect(onClick).toHaveBeenCalledTimes(1);
                                expect(onClickCapture).toHaveBeenCalledTimes(1);
                                expect(log[0]).toEqual(['capture', buttonElement]);
                                expect(log[1]).toEqual(['bubble', buttonElement]);
                                divElement = divRef.current;
                                dispatchClickEvent(divElement);
                                expect(onClick).toHaveBeenCalledTimes(3);
                                expect(onClickCapture).toHaveBeenCalledTimes(3);
                                expect(log[2]).toEqual(['capture', buttonElement]);
                                expect(log[3]).toEqual(['capture', divElement]);
                                expect(log[4]).toEqual(['bubble', divElement]);
                                expect(log[5]).toEqual(['bubble', buttonElement]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('should correctly work for a basic "click" listener on the outer target', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Test() {
                        React.useEffect(function () {
                            return setClick(divRef.current, clickEvent);
                        });
                        return <button ref={buttonRef}>
                            <div ref={divRef}>Click me!</div>
                        </button>;
                    }
                    var log, clickEvent, divRef, buttonRef, setClick, divElement, buttonElement;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                log = [];
                                clickEvent = jest.fn(function (event) {
                                    log.push({
                                        eventPhase: event.eventPhase,
                                        type: event.type,
                                        currentTarget: event.currentTarget,
                                        target: event.target
                                    });
                                });
                                divRef = React.createRef();
                                buttonRef = React.createRef();
                                setClick = ReactDOM.unstable_createEventHandle('click');
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test />, container);
                                    })];
                            case 1:
                                _a.sent();
                                expect(container.innerHTML).toBe('<button><div>Click me!</div></button>');
                                divElement = divRef.current;
                                dispatchClickEvent(divElement);
                                expect(log).toEqual([{
                                        eventPhase: 3,
                                        type: 'click',
                                        currentTarget: divRef.current,
                                        target: divRef.current
                                    }]);
                                // Unmounting the container and clicking should not work
                                ReactDOM.render(null, container);
                                dispatchClickEvent(divElement);
                                expect(clickEvent).toBeCalledTimes(1);
                                // Re-rendering the container and clicking should work
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test />, container);
                                    })];
                            case 2:
                                // Re-rendering the container and clicking should work
                                _a.sent();
                                divElement = divRef.current;
                                dispatchClickEvent(divElement);
                                expect(clickEvent).toBeCalledTimes(2);
                                buttonElement = buttonRef.current;
                                dispatchClickEvent(buttonElement);
                                expect(clickEvent).toBeCalledTimes(2);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('should correctly handle many nested target listeners', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Test() {
                        React.useEffect(function () {
                            var clearClick1 = setClick1(buttonRef.current, targetListener1);
                            var clearClick2 = setClick2(buttonRef.current, targetListener2);
                            var clearClick3 = setClick3(buttonRef.current, targetListener3);
                            var clearClick4 = setClick4(buttonRef.current, targetListener4);
                            return function () {
                                clearClick1();
                                clearClick2();
                                clearClick3();
                                clearClick4();
                            };
                        });
                        return <button ref={buttonRef}>Click me!</button>;
                    }
                    function Test2() {
                        React.useEffect(function () {
                            var clearClick1 = setClick1(buttonRef.current, targetListener1);
                            var clearClick2 = setClick2(buttonRef.current, targetListener2);
                            var clearClick3 = setClick3(buttonRef.current, targetListener3);
                            var clearClick4 = setClick4(buttonRef.current, targetListener4);
                            return function () {
                                clearClick1();
                                clearClick2();
                                clearClick3();
                                clearClick4();
                            };
                        });
                        return <button ref={buttonRef}>Click me!</button>;
                    }
                    var buttonRef, targetListener1, targetListener2, targetListener3, targetListener4, setClick1, setClick2, setClick3, setClick4, buttonElement;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                buttonRef = React.createRef();
                                targetListener1 = jest.fn();
                                targetListener2 = jest.fn();
                                targetListener3 = jest.fn();
                                targetListener4 = jest.fn();
                                setClick1 = ReactDOM.unstable_createEventHandle('click', {
                                    capture: true
                                });
                                setClick2 = ReactDOM.unstable_createEventHandle('click', {
                                    capture: true
                                });
                                setClick3 = ReactDOM.unstable_createEventHandle('click');
                                setClick4 = ReactDOM.unstable_createEventHandle('click');
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test />, container);
                                    })];
                            case 1:
                                _a.sent();
                                buttonElement = buttonRef.current;
                                dispatchClickEvent(buttonElement);
                                expect(targetListener1).toHaveBeenCalledTimes(1);
                                expect(targetListener2).toHaveBeenCalledTimes(1);
                                expect(targetListener3).toHaveBeenCalledTimes(1);
                                expect(targetListener4).toHaveBeenCalledTimes(1);
                                setClick1 = ReactDOM.unstable_createEventHandle('click');
                                setClick2 = ReactDOM.unstable_createEventHandle('click');
                                setClick3 = ReactDOM.unstable_createEventHandle('click');
                                setClick4 = ReactDOM.unstable_createEventHandle('click');
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test2 />, container);
                                    })];
                            case 2:
                                _a.sent();
                                buttonElement = buttonRef.current;
                                dispatchClickEvent(buttonElement);
                                expect(targetListener1).toHaveBeenCalledTimes(2);
                                expect(targetListener2).toHaveBeenCalledTimes(2);
                                expect(targetListener3).toHaveBeenCalledTimes(2);
                                expect(targetListener4).toHaveBeenCalledTimes(2);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('should correctly handle stopPropagation correctly for target events', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Test() {
                        React.useEffect(function () {
                            var clearClick1 = setClick1(buttonRef.current, clickEvent);
                            var clearClick2 = setClick2(divRef.current, function (e) {
                                e.stopPropagation();
                            });
                            return function () {
                                clearClick1();
                                clearClick2();
                            };
                        });
                        return <button ref={buttonRef}>
                            <div ref={divRef}>Click me!</div>
                        </button>;
                    }
                    var buttonRef, divRef, clickEvent, setClick1, setClick2, divElement;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                buttonRef = React.createRef();
                                divRef = React.createRef();
                                clickEvent = jest.fn();
                                setClick1 = ReactDOM.unstable_createEventHandle('click', {
                                    bind: buttonRef
                                });
                                setClick2 = ReactDOM.unstable_createEventHandle('click');
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test />, container);
                                    })];
                            case 1:
                                _a.sent();
                                divElement = divRef.current;
                                dispatchClickEvent(divElement);
                                expect(clickEvent).toHaveBeenCalledTimes(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('should correctly handle stopPropagation correctly for many target events', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Test() {
                        React.useEffect(function () {
                            var clearClick1 = setClick1(buttonRef.current, targetListener1);
                            var clearClick2 = setClick2(buttonRef.current, targetListener2);
                            var clearClick3 = setClick3(buttonRef.current, targetListener3);
                            var clearClick4 = setClick4(buttonRef.current, targetListener4);
                            return function () {
                                clearClick1();
                                clearClick2();
                                clearClick3();
                                clearClick4();
                            };
                        });
                        return <button ref={buttonRef}>Click me!</button>;
                    }
                    var buttonRef, targetListener1, targetListener2, targetListener3, targetListener4, setClick1, setClick2, setClick3, setClick4, buttonElement;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                buttonRef = React.createRef();
                                targetListener1 = jest.fn(function (e) { return e.stopPropagation(); });
                                targetListener2 = jest.fn(function (e) { return e.stopPropagation(); });
                                targetListener3 = jest.fn(function (e) { return e.stopPropagation(); });
                                targetListener4 = jest.fn(function (e) { return e.stopPropagation(); });
                                setClick1 = ReactDOM.unstable_createEventHandle('click');
                                setClick2 = ReactDOM.unstable_createEventHandle('click');
                                setClick3 = ReactDOM.unstable_createEventHandle('click');
                                setClick4 = ReactDOM.unstable_createEventHandle('click');
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test />, container);
                                    })];
                            case 1:
                                _a.sent();
                                buttonElement = buttonRef.current;
                                dispatchClickEvent(buttonElement);
                                expect(targetListener1).toHaveBeenCalledTimes(1);
                                expect(targetListener2).toHaveBeenCalledTimes(1);
                                expect(targetListener3).toHaveBeenCalledTimes(1);
                                expect(targetListener4).toHaveBeenCalledTimes(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('should correctly handle stopPropagation for mixed capture/bubbling target listeners', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Test() {
                        React.useEffect(function () {
                            var clearClick1 = setClick1(buttonRef.current, targetListener1);
                            var clearClick2 = setClick2(buttonRef.current, targetListener2);
                            var clearClick3 = setClick3(buttonRef.current, targetListener3);
                            var clearClick4 = setClick4(buttonRef.current, targetListener4);
                            return function () {
                                clearClick1();
                                clearClick2();
                                clearClick3();
                                clearClick4();
                            };
                        });
                        return <button ref={buttonRef}>Click me!</button>;
                    }
                    var buttonRef, targetListener1, targetListener2, targetListener3, targetListener4, setClick1, setClick2, setClick3, setClick4, buttonElement;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                buttonRef = React.createRef();
                                targetListener1 = jest.fn(function (e) { return e.stopPropagation(); });
                                targetListener2 = jest.fn(function (e) { return e.stopPropagation(); });
                                targetListener3 = jest.fn(function (e) { return e.stopPropagation(); });
                                targetListener4 = jest.fn(function (e) { return e.stopPropagation(); });
                                setClick1 = ReactDOM.unstable_createEventHandle('click', {
                                    capture: true
                                });
                                setClick2 = ReactDOM.unstable_createEventHandle('click', {
                                    capture: true
                                });
                                setClick3 = ReactDOM.unstable_createEventHandle('click');
                                setClick4 = ReactDOM.unstable_createEventHandle('click');
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test />, container);
                                    })];
                            case 1:
                                _a.sent();
                                buttonElement = buttonRef.current;
                                dispatchClickEvent(buttonElement);
                                expect(targetListener1).toHaveBeenCalledTimes(1);
                                expect(targetListener2).toHaveBeenCalledTimes(1);
                                expect(targetListener3).toHaveBeenCalledTimes(0);
                                expect(targetListener4).toHaveBeenCalledTimes(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('should work with concurrent mode updates', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Test(_a) {
                        var counter = _a.counter;
                        React.useLayoutEffect(function () {
                            return setClick1(ref.current, function () {
                                log.push({
                                    counter: counter
                                });
                            });
                        });
                        Scheduler.log('Test');
                        return <button ref={ref}>Press me</button>;
                    }
                    var log, ref, setClick1, root;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                log = [];
                                ref = React.createRef();
                                setClick1 = ReactDOM.unstable_createEventHandle('click');
                                root = ReactDOMClient.createRoot(container);
                                root.render(<Test counter={0}/>);
                                return [4 /*yield*/, waitForAll(['Test'])];
                            case 1:
                                _a.sent();
                                // Click the button
                                dispatchClickEvent(ref.current);
                                expect(log).toEqual([{
                                        counter: 0
                                    }]);
                                // Clear log
                                log.length = 0;
                                // Increase counter
                                React.startTransition(function () {
                                    root.render(<Test counter={1}/>);
                                });
                                // Yield before committing
                                return [4 /*yield*/, waitFor(['Test'])];
                            case 2:
                                // Yield before committing
                                _a.sent();
                                // Click the button again
                                dispatchClickEvent(ref.current);
                                expect(log).toEqual([{
                                        counter: 0
                                    }]);
                                // Clear log
                                log.length = 0;
                                // Commit
                                return [4 /*yield*/, waitForAll([])];
                            case 3:
                                // Commit
                                _a.sent();
                                dispatchClickEvent(ref.current);
                                expect(log).toEqual([{
                                        counter: 1
                                    }]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('should correctly work for a basic "click" window listener', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Test() {
                        React.useEffect(function () {
                            return setClick1(window, clickEvent);
                        });
                        return <button>Click anything!</button>;
                    }
                    var log, clickEvent, setClick1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                log = [];
                                clickEvent = jest.fn(function (event) {
                                    log.push({
                                        eventPhase: event.eventPhase,
                                        type: event.type,
                                        currentTarget: event.currentTarget,
                                        target: event.target
                                    });
                                });
                                setClick1 = ReactDOM.unstable_createEventHandle('click');
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test />, container);
                                    })];
                            case 1:
                                _a.sent();
                                expect(container.innerHTML).toBe('<button>Click anything!</button>');
                                // Clicking outside the button should trigger the event callback
                                dispatchClickEvent(document.body);
                                expect(log[0]).toEqual({
                                    eventPhase: 3,
                                    type: 'click',
                                    currentTarget: window,
                                    target: document.body
                                });
                                // Unmounting the container and clicking should not work
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(null, container);
                                    })];
                            case 2:
                                // Unmounting the container and clicking should not work
                                _a.sent();
                                dispatchClickEvent(document.body);
                                expect(clickEvent).toBeCalledTimes(1);
                                // Re-rendering and clicking the body should work again
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test />, container);
                                    })];
                            case 3:
                                // Re-rendering and clicking the body should work again
                                _a.sent();
                                dispatchClickEvent(document.body);
                                expect(clickEvent).toBeCalledTimes(2);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('handle propagation of click events on the window', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Test() {
                        React.useEffect(function () {
                            var clearClick1 = setClick(window, onClick);
                            var clearClickCapture1 = setClickCapture(window, onClickCapture);
                            var clearClick2 = setClick(buttonRef.current, onClick);
                            var clearClickCapture2 = setClickCapture(buttonRef.current, onClickCapture);
                            var clearClick3 = setClick(divRef.current, onClick);
                            var clearClickCapture3 = setClickCapture(divRef.current, onClickCapture);
                            return function () {
                                clearClick1();
                                clearClickCapture1();
                                clearClick2();
                                clearClickCapture2();
                                clearClick3();
                                clearClickCapture3();
                            };
                        });
                        return <button ref={buttonRef}>
                            <div ref={divRef}>Click me!</div>
                        </button>;
                    }
                    var buttonRef, divRef, log, onClick, onClickCapture, setClick, setClickCapture, buttonElement, divElement;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                buttonRef = React.createRef();
                                divRef = React.createRef();
                                log = [];
                                onClick = jest.fn(function (e) { return log.push(['bubble', e.currentTarget]); });
                                onClickCapture = jest.fn(function (e) { return log.push(['capture', e.currentTarget]); });
                                setClick = ReactDOM.unstable_createEventHandle('click');
                                setClickCapture = ReactDOM.unstable_createEventHandle('click', {
                                    capture: true
                                });
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test />, container);
                                    })];
                            case 1:
                                _a.sent();
                                buttonElement = buttonRef.current;
                                dispatchClickEvent(buttonElement);
                                expect(onClick).toHaveBeenCalledTimes(2);
                                expect(onClickCapture).toHaveBeenCalledTimes(2);
                                expect(log[0]).toEqual(['capture', window]);
                                expect(log[1]).toEqual(['capture', buttonElement]);
                                expect(log[2]).toEqual(['bubble', buttonElement]);
                                expect(log[3]).toEqual(['bubble', window]);
                                log.length = 0;
                                onClick.mockClear();
                                onClickCapture.mockClear();
                                divElement = divRef.current;
                                dispatchClickEvent(divElement);
                                expect(onClick).toHaveBeenCalledTimes(3);
                                expect(onClickCapture).toHaveBeenCalledTimes(3);
                                expect(log[0]).toEqual(['capture', window]);
                                expect(log[1]).toEqual(['capture', buttonElement]);
                                expect(log[2]).toEqual(['capture', divElement]);
                                expect(log[3]).toEqual(['bubble', divElement]);
                                expect(log[4]).toEqual(['bubble', buttonElement]);
                                expect(log[5]).toEqual(['bubble', window]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('should correctly handle stopPropagation for mixed listeners', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Test() {
                        React.useEffect(function () {
                            var clearClick1 = setClick1(window, rootListener1);
                            var clearClick2 = setClick2(buttonRef.current, targetListener1);
                            var clearClick3 = setClick3(window, rootListener2);
                            var clearClick4 = setClick4(buttonRef.current, targetListener2);
                            return function () {
                                clearClick1();
                                clearClick2();
                                clearClick3();
                                clearClick4();
                            };
                        });
                        return <button ref={buttonRef}>Click me!</button>;
                    }
                    var buttonRef, rootListener1, rootListener2, targetListener1, targetListener2, setClick1, setClick2, setClick3, setClick4, buttonElement;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                buttonRef = React.createRef();
                                rootListener1 = jest.fn(function (e) { return e.stopPropagation(); });
                                rootListener2 = jest.fn();
                                targetListener1 = jest.fn();
                                targetListener2 = jest.fn();
                                setClick1 = ReactDOM.unstable_createEventHandle('click', {
                                    capture: true
                                });
                                setClick2 = ReactDOM.unstable_createEventHandle('click', {
                                    capture: true
                                });
                                setClick3 = ReactDOM.unstable_createEventHandle('click');
                                setClick4 = ReactDOM.unstable_createEventHandle('click');
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test />, container);
                                    })];
                            case 1:
                                _a.sent();
                                buttonElement = buttonRef.current;
                                dispatchClickEvent(buttonElement);
                                expect(rootListener1).toHaveBeenCalledTimes(1);
                                expect(targetListener1).toHaveBeenCalledTimes(0);
                                expect(targetListener2).toHaveBeenCalledTimes(0);
                                expect(rootListener2).toHaveBeenCalledTimes(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('should correctly handle stopPropagation for delegated listeners', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Test() {
                        React.useEffect(function () {
                            var clearClick1 = setClick1(window, rootListener1);
                            var clearClick2 = setClick2(window, rootListener2);
                            var clearClick3 = setClick3(window, rootListener3);
                            var clearClick4 = setClick4(window, rootListener4);
                            return function () {
                                clearClick1();
                                clearClick2();
                                clearClick3();
                                clearClick4();
                            };
                        });
                        return <button ref={buttonRef}>Click me!</button>;
                    }
                    var buttonRef, rootListener1, rootListener2, rootListener3, rootListener4, setClick1, setClick2, setClick3, setClick4, buttonElement;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                buttonRef = React.createRef();
                                rootListener1 = jest.fn(function (e) { return e.stopPropagation(); });
                                rootListener2 = jest.fn();
                                rootListener3 = jest.fn(function (e) { return e.stopPropagation(); });
                                rootListener4 = jest.fn();
                                setClick1 = ReactDOM.unstable_createEventHandle('click', {
                                    capture: true
                                });
                                setClick2 = ReactDOM.unstable_createEventHandle('click', {
                                    capture: true
                                });
                                setClick3 = ReactDOM.unstable_createEventHandle('click');
                                setClick4 = ReactDOM.unstable_createEventHandle('click');
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test />, container);
                                    })];
                            case 1:
                                _a.sent();
                                buttonElement = buttonRef.current;
                                dispatchClickEvent(buttonElement);
                                expect(rootListener1).toHaveBeenCalledTimes(1);
                                expect(rootListener2).toHaveBeenCalledTimes(1);
                                expect(rootListener3).toHaveBeenCalledTimes(0);
                                expect(rootListener4).toHaveBeenCalledTimes(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('handle propagation of click events on the window and document', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Test() {
                        React.useEffect(function () {
                            var clearClick1 = setClick(window, onClick);
                            var clearClickCapture1 = setClickCapture(window, onClickCapture);
                            var clearClick2 = setClick(document, onClick);
                            var clearClickCapture2 = setClickCapture(document, onClickCapture);
                            var clearClick3 = setClick(buttonRef.current, onClick);
                            var clearClickCapture3 = setClickCapture(buttonRef.current, onClickCapture);
                            var clearClick4 = setClick(divRef.current, onClick);
                            var clearClickCapture4 = setClickCapture(divRef.current, onClickCapture);
                            return function () {
                                clearClick1();
                                clearClickCapture1();
                                clearClick2();
                                clearClickCapture2();
                                clearClick3();
                                clearClickCapture3();
                                clearClick4();
                                clearClickCapture4();
                            };
                        });
                        return <button ref={buttonRef}>
                            <div ref={divRef}>Click me!</div>
                        </button>;
                    }
                    var buttonRef, divRef, log, onClick, onClickCapture, setClick, setClickCapture, buttonElement, divElement;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                buttonRef = React.createRef();
                                divRef = React.createRef();
                                log = [];
                                onClick = jest.fn(function (e) { return log.push(['bubble', e.currentTarget]); });
                                onClickCapture = jest.fn(function (e) { return log.push(['capture', e.currentTarget]); });
                                setClick = ReactDOM.unstable_createEventHandle('click');
                                setClickCapture = ReactDOM.unstable_createEventHandle('click', {
                                    capture: true
                                });
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Test />, container);
                                    })];
                            case 1:
                                _a.sent();
                                buttonElement = buttonRef.current;
                                dispatchClickEvent(buttonElement);
                                expect(onClick).toHaveBeenCalledTimes(3);
                                expect(onClickCapture).toHaveBeenCalledTimes(3);
                                if (enableLegacyFBSupport) {
                                    expect(log[0]).toEqual(['capture', window]);
                                    expect(log[1]).toEqual(['capture', document]);
                                    expect(log[2]).toEqual(['capture', buttonElement]);
                                    expect(log[3]).toEqual(['bubble', document]);
                                    expect(log[4]).toEqual(['bubble', buttonElement]);
                                    expect(log[5]).toEqual(['bubble', window]);
                                }
                                else {
                                    expect(log[0]).toEqual(['capture', window]);
                                    expect(log[1]).toEqual(['capture', document]);
                                    expect(log[2]).toEqual(['capture', buttonElement]);
                                    expect(log[3]).toEqual(['bubble', buttonElement]);
                                    expect(log[4]).toEqual(['bubble', document]);
                                    expect(log[5]).toEqual(['bubble', window]);
                                }
                                log.length = 0;
                                onClick.mockClear();
                                onClickCapture.mockClear();
                                divElement = divRef.current;
                                dispatchClickEvent(divElement);
                                expect(onClick).toHaveBeenCalledTimes(4);
                                expect(onClickCapture).toHaveBeenCalledTimes(4);
                                if (enableLegacyFBSupport) {
                                    expect(log[0]).toEqual(['capture', window]);
                                    expect(log[1]).toEqual(['capture', document]);
                                    expect(log[2]).toEqual(['capture', buttonElement]);
                                    expect(log[3]).toEqual(['capture', divElement]);
                                    expect(log[4]).toEqual(['bubble', document]);
                                    expect(log[5]).toEqual(['bubble', divElement]);
                                    expect(log[6]).toEqual(['bubble', buttonElement]);
                                    expect(log[7]).toEqual(['bubble', window]);
                                }
                                else {
                                    expect(log[0]).toEqual(['capture', window]);
                                    expect(log[1]).toEqual(['capture', document]);
                                    expect(log[2]).toEqual(['capture', buttonElement]);
                                    expect(log[3]).toEqual(['capture', divElement]);
                                    expect(log[4]).toEqual(['bubble', divElement]);
                                    expect(log[5]).toEqual(['bubble', buttonElement]);
                                    expect(log[6]).toEqual(['bubble', document]);
                                    expect(log[7]).toEqual(['bubble', window]);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('does not support custom user events', function () {
                    // With eager listeners, supporting custom events via this API doesn't make sense
                    // because we can't know a full list of them ahead of time. Let's check we throw
                    // since otherwise we'd end up with inconsistent behavior, like no portal bubbling.
                    expect(function () {
                        ReactDOM.unstable_createEventHandle('custom-event');
                    }).toThrow('Cannot call unstable_createEventHandle with "custom-event", as it is not an event known to React.');
                });
                // @gate www
                it('beforeblur and afterblur are called after a focused element is unmounted', function () { return __awaiter(_this, void 0, void 0, function () {
                    var log, onAfterBlur, onBeforeBlur, innerRef, innerRef2, setAfterBlurHandle, setBeforeBlurHandle, Component, inner, target;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                log = [];
                                onAfterBlur = jest.fn(function (e) {
                                    e.persist();
                                    log.push(e.type);
                                });
                                onBeforeBlur = jest.fn(function (e) { return log.push(e.type); });
                                innerRef = React.createRef();
                                innerRef2 = React.createRef();
                                setAfterBlurHandle = ReactDOM.unstable_createEventHandle('afterblur');
                                setBeforeBlurHandle = ReactDOM.unstable_createEventHandle('beforeblur');
                                Component = function (_a) {
                                    var show = _a.show;
                                    var ref = React.useRef(null);
                                    React.useEffect(function () {
                                        var clear1 = setAfterBlurHandle(document, onAfterBlur);
                                        var clear2 = setBeforeBlurHandle(ref.current, onBeforeBlur);
                                        return function () {
                                            clear1();
                                            clear2();
                                        };
                                    });
                                    return <div ref={ref}>
                            {show && <input ref={innerRef}/>}
                            <div ref={innerRef2}/>
                        </div>;
                                };
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Component show={true}/>, container);
                                    })];
                            case 1:
                                _a.sent();
                                inner = innerRef.current;
                                target = (0, dom_event_testing_library_1.createEventTarget)(inner);
                                target.focus();
                                expect(onBeforeBlur).toHaveBeenCalledTimes(0);
                                expect(onAfterBlur).toHaveBeenCalledTimes(0);
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Component show={false}/>, container);
                                    })];
                            case 2:
                                _a.sent();
                                expect(onBeforeBlur).toHaveBeenCalledTimes(1);
                                expect(onAfterBlur).toHaveBeenCalledTimes(1);
                                expect(onAfterBlur).toHaveBeenCalledWith(expect.objectContaining({
                                    relatedTarget: inner
                                }));
                                expect(log).toEqual(['beforeblur', 'afterblur']);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('beforeblur and afterblur are called after a nested focused element is unmounted', function () { return __awaiter(_this, void 0, void 0, function () {
                    var log, onAfterBlur, onBeforeBlur, innerRef, innerRef2, setAfterBlurHandle, setBeforeBlurHandle, Component, inner, target;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                log = [];
                                onAfterBlur = jest.fn(function (e) {
                                    e.persist();
                                    log.push(e.type);
                                });
                                onBeforeBlur = jest.fn(function (e) { return log.push(e.type); });
                                innerRef = React.createRef();
                                innerRef2 = React.createRef();
                                setAfterBlurHandle = ReactDOM.unstable_createEventHandle('afterblur');
                                setBeforeBlurHandle = ReactDOM.unstable_createEventHandle('beforeblur');
                                Component = function (_a) {
                                    var show = _a.show;
                                    var ref = React.useRef(null);
                                    React.useEffect(function () {
                                        var clear1 = setAfterBlurHandle(document, onAfterBlur);
                                        var clear2 = setBeforeBlurHandle(ref.current, onBeforeBlur);
                                        return function () {
                                            clear1();
                                            clear2();
                                        };
                                    });
                                    return <div ref={ref}>
                            {show && <div>
                                <input ref={innerRef}/>
                            </div>}
                            <div ref={innerRef2}/>
                        </div>;
                                };
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Component show={true}/>, container);
                                    })];
                            case 1:
                                _a.sent();
                                inner = innerRef.current;
                                target = (0, dom_event_testing_library_1.createEventTarget)(inner);
                                target.focus();
                                expect(onBeforeBlur).toHaveBeenCalledTimes(0);
                                expect(onAfterBlur).toHaveBeenCalledTimes(0);
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Component show={false}/>, container);
                                    })];
                            case 2:
                                _a.sent();
                                expect(onBeforeBlur).toHaveBeenCalledTimes(1);
                                expect(onAfterBlur).toHaveBeenCalledTimes(1);
                                expect(onAfterBlur).toHaveBeenCalledWith(expect.objectContaining({
                                    relatedTarget: inner
                                }));
                                expect(log).toEqual(['beforeblur', 'afterblur']);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('beforeblur should skip handlers from a deleted subtree after the focused element is unmounted', function () { return __awaiter(_this, void 0, void 0, function () {
                    var onBeforeBlur, innerRef, innerRef2, setBeforeBlurHandle, ref2, Component, inner, target;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                onBeforeBlur = jest.fn();
                                innerRef = React.createRef();
                                innerRef2 = React.createRef();
                                setBeforeBlurHandle = ReactDOM.unstable_createEventHandle('beforeblur');
                                ref2 = React.createRef();
                                Component = function (_a) {
                                    var show = _a.show;
                                    var ref = React.useRef(null);
                                    React.useEffect(function () {
                                        var clear1 = setBeforeBlurHandle(ref.current, onBeforeBlur);
                                        var clear2;
                                        if (ref2.current) {
                                            clear2 = setBeforeBlurHandle(ref2.current, onBeforeBlur);
                                        }
                                        return function () {
                                            clear1();
                                            if (clear2) {
                                                clear2();
                                            }
                                        };
                                    });
                                    return <div ref={ref}>
                            {show && <div ref={ref2}>
                                <input ref={innerRef}/>
                            </div>}
                            <div ref={innerRef2}/>
                        </div>;
                                };
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Component show={true}/>, container);
                                    })];
                            case 1:
                                _a.sent();
                                inner = innerRef.current;
                                target = (0, dom_event_testing_library_1.createEventTarget)(inner);
                                target.focus();
                                expect(onBeforeBlur).toHaveBeenCalledTimes(0);
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Component show={false}/>, container);
                                    })];
                            case 2:
                                _a.sent();
                                expect(onBeforeBlur).toHaveBeenCalledTimes(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('beforeblur and afterblur are called after a focused element is suspended', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Child() {
                        if (suspend) {
                            throw promise;
                        }
                        else {
                            return <input ref={innerRef}/>;
                        }
                    }
                    var log, onAfterBlur, onBeforeBlur, innerRef, Suspense, suspend, resolve, promise, setAfterBlurHandle, setBeforeBlurHandle, Component, container2, root, inner, target;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                log = [];
                                onAfterBlur = jest.fn(function (e) {
                                    e.persist();
                                    log.push(e.type);
                                });
                                onBeforeBlur = jest.fn(function (e) { return log.push(e.type); });
                                innerRef = React.createRef();
                                Suspense = React.Suspense;
                                suspend = false;
                                promise = new Promise(function (resolvePromise) { return resolve = resolvePromise; });
                                setAfterBlurHandle = ReactDOM.unstable_createEventHandle('afterblur');
                                setBeforeBlurHandle = ReactDOM.unstable_createEventHandle('beforeblur');
                                Component = function () {
                                    var ref = React.useRef(null);
                                    React.useEffect(function () {
                                        var clear1 = setAfterBlurHandle(document, onAfterBlur);
                                        var clear2 = setBeforeBlurHandle(ref.current, onBeforeBlur);
                                        return function () {
                                            clear1();
                                            clear2();
                                        };
                                    });
                                    return <div ref={ref}>
                            <Suspense fallback="Loading...">
                                <Child />
                            </Suspense>
                        </div>;
                                };
                                container2 = document.createElement('div');
                                document.body.appendChild(container2);
                                root = ReactDOMClient.createRoot(container2);
                                return [4 /*yield*/, act(function () {
                                        root.render(<Component />);
                                    })];
                            case 1:
                                _a.sent();
                                jest.runAllTimers();
                                inner = innerRef.current;
                                target = (0, dom_event_testing_library_1.createEventTarget)(inner);
                                target.focus();
                                expect(onBeforeBlur).toHaveBeenCalledTimes(0);
                                expect(onAfterBlur).toHaveBeenCalledTimes(0);
                                suspend = true;
                                return [4 /*yield*/, act(function () {
                                        root.render(<Component />);
                                    })];
                            case 2:
                                _a.sent();
                                jest.runAllTimers();
                                expect(onBeforeBlur).toHaveBeenCalledTimes(1);
                                expect(onAfterBlur).toHaveBeenCalledTimes(1);
                                expect(onAfterBlur).toHaveBeenCalledWith(expect.objectContaining({
                                    relatedTarget: inner
                                }));
                                resolve();
                                expect(log).toEqual(['beforeblur', 'afterblur']);
                                document.body.removeChild(container2);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('beforeblur should skip handlers from a deleted subtree after the focused element is suspended', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Child() {
                        if (suspend) {
                            throw promise;
                        }
                        else {
                            return <input ref={innerRef}/>;
                        }
                    }
                    var onBeforeBlur, innerRef, innerRef2, setBeforeBlurHandle, ref2, Suspense, suspend, resolve, promise, Component, container2, root, inner, target;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                onBeforeBlur = jest.fn();
                                innerRef = React.createRef();
                                innerRef2 = React.createRef();
                                setBeforeBlurHandle = ReactDOM.unstable_createEventHandle('beforeblur');
                                ref2 = React.createRef();
                                Suspense = React.Suspense;
                                suspend = false;
                                promise = new Promise(function (resolvePromise) { return resolve = resolvePromise; });
                                Component = function () {
                                    var ref = React.useRef(null);
                                    React.useEffect(function () {
                                        var clear1 = setBeforeBlurHandle(ref.current, onBeforeBlur);
                                        var clear2;
                                        if (ref2.current) {
                                            clear2 = setBeforeBlurHandle(ref2.current, onBeforeBlur);
                                        }
                                        return function () {
                                            clear1();
                                            if (clear2) {
                                                clear2();
                                            }
                                        };
                                    });
                                    return <div ref={ref}>
                            <Suspense fallback="Loading...">
                                <div ref={ref2}>
                                    <Child />
                                </div>
                            </Suspense>
                            <div ref={innerRef2}/>
                        </div>;
                                };
                                container2 = document.createElement('div');
                                document.body.appendChild(container2);
                                root = ReactDOMClient.createRoot(container2);
                                return [4 /*yield*/, act(function () {
                                        root.render(<Component />);
                                    })];
                            case 1:
                                _a.sent();
                                jest.runAllTimers();
                                inner = innerRef.current;
                                target = (0, dom_event_testing_library_1.createEventTarget)(inner);
                                target.focus();
                                expect(onBeforeBlur).toHaveBeenCalledTimes(0);
                                suspend = true;
                                return [4 /*yield*/, act(function () {
                                        root.render(<Component />);
                                    })];
                            case 2:
                                _a.sent();
                                jest.runAllTimers();
                                expect(onBeforeBlur).toHaveBeenCalledTimes(1);
                                resolve();
                                document.body.removeChild(container2);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('regression: does not fire beforeblur/afterblur if target is already hidden', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Child() {
                        if (suspend) {
                            throw fakePromise;
                        }
                        return <input ref={innerRef}/>;
                    }
                    var Suspense, suspend, fakePromise, setBeforeBlurHandle, innerRef, Component, container2, root, inner, target;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                Suspense = React.Suspense;
                                suspend = false;
                                fakePromise = {
                                    then: function () {
                                    }
                                };
                                setBeforeBlurHandle = ReactDOM.unstable_createEventHandle('beforeblur');
                                innerRef = React.createRef();
                                Component = function () {
                                    var ref = React.useRef(null);
                                    var _a = React.useState(0), setState = _a[1];
                                    React.useEffect(function () {
                                        return setBeforeBlurHandle(ref.current, function () {
                                            // In the regression case, this would trigger an update, then
                                            // the resulting render would trigger another blur event,
                                            // which would trigger an update again, and on and on in an
                                            // infinite loop.
                                            setState(function (n) { return n + 1; });
                                        });
                                    }, []);
                                    return <div ref={ref}>
                            <Suspense fallback="Loading...">
                                <Child />
                            </Suspense>
                        </div>;
                                };
                                container2 = document.createElement('div');
                                document.body.appendChild(container2);
                                root = ReactDOMClient.createRoot(container2);
                                return [4 /*yield*/, act(function () {
                                        root.render(<Component />);
                                    })];
                            case 1:
                                _a.sent();
                                inner = innerRef.current;
                                target = (0, dom_event_testing_library_1.createEventTarget)(inner);
                                target.focus();
                                // Suspend. This hides the input node, causing it to lose focus.
                                suspend = true;
                                return [4 /*yield*/, act(function () {
                                        root.render(<Component />);
                                    })];
                            case 2:
                                _a.sent();
                                document.body.removeChild(container2);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('handle propagation of click events between disjointed comment roots', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Child() {
                        React.useEffect(function () {
                            var click1 = setClick(divRef.current, onClick);
                            var click2 = setClickCapture(divRef.current, onClickCapture);
                            return function () {
                                click1();
                                click2();
                            };
                        });
                        return <div ref={divRef}>Click me!</div>;
                    }
                    function Parent() {
                        React.useEffect(function () {
                            var click1 = setClick(buttonRef.current, onClick);
                            var click2 = setClickCapture(buttonRef.current, onClickCapture);
                            return function () {
                                click1();
                                click2();
                            };
                        });
                        return <button ref={buttonRef}/>;
                    }
                    var buttonRef, divRef, log, setClick, setClickCapture, onClick, onClickCapture, disjointedNode, buttonElement, divElement;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                buttonRef = React.createRef();
                                divRef = React.createRef();
                                log = [];
                                setClick = ReactDOM.unstable_createEventHandle('click');
                                setClickCapture = ReactDOM.unstable_createEventHandle('click', {
                                    capture: true
                                });
                                onClick = jest.fn(function (e) { return log.push(['bubble', e.currentTarget]); });
                                onClickCapture = jest.fn(function (e) { return log.push(['capture', e.currentTarget]); });
                                disjointedNode = document.createComment(' react-mount-point-unstable ');
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Parent />, container);
                                    })];
                            case 1:
                                _a.sent();
                                buttonRef.current.appendChild(disjointedNode);
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Child />, disjointedNode);
                                    })];
                            case 2:
                                _a.sent();
                                buttonElement = buttonRef.current;
                                dispatchClickEvent(buttonElement);
                                expect(onClick).toHaveBeenCalledTimes(1);
                                expect(onClickCapture).toHaveBeenCalledTimes(1);
                                expect(log[0]).toEqual(['capture', buttonElement]);
                                expect(log[1]).toEqual(['bubble', buttonElement]);
                                divElement = divRef.current;
                                dispatchClickEvent(divElement);
                                expect(onClick).toHaveBeenCalledTimes(3);
                                expect(onClickCapture).toHaveBeenCalledTimes(3);
                                expect(log[2]).toEqual(['capture', buttonElement]);
                                expect(log[3]).toEqual(['capture', divElement]);
                                expect(log[4]).toEqual(['bubble', divElement]);
                                expect(log[5]).toEqual(['bubble', buttonElement]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // @gate www
                it('propagates known createEventHandle events through portals without inner listeners', function () { return __awaiter(_this, void 0, void 0, function () {
                    function Child() {
                        return <div ref={divRef}>Click me!</div>;
                    }
                    function Parent() {
                        React.useEffect(function () {
                            var clear1 = setClick(buttonRef.current, onClick);
                            var clear2 = setClickCapture(buttonRef.current, onClickCapture);
                            return function () {
                                clear1();
                                clear2();
                            };
                        });
                        return <button ref={buttonRef}>
                            {ReactDOM.createPortal(<Child />, portalElement)}
                        </button>;
                    }
                    var buttonRef, divRef, log, onClick, onClickCapture, setClick, setClickCapture, portalElement, divElement, buttonElement;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                buttonRef = React.createRef();
                                divRef = React.createRef();
                                log = [];
                                onClick = jest.fn(function (e) { return log.push(['bubble', e.currentTarget]); });
                                onClickCapture = jest.fn(function (e) { return log.push(['capture', e.currentTarget]); });
                                setClick = ReactDOM.unstable_createEventHandle('click');
                                setClickCapture = ReactDOM.unstable_createEventHandle('click', {
                                    capture: true
                                });
                                portalElement = document.createElement('div');
                                document.body.appendChild(portalElement);
                                return [4 /*yield*/, act(function () {
                                        ReactDOM.render(<Parent />, container);
                                    })];
                            case 1:
                                _a.sent();
                                divElement = divRef.current;
                                buttonElement = buttonRef.current;
                                dispatchClickEvent(divElement);
                                expect(onClick).toHaveBeenCalledTimes(1);
                                expect(onClickCapture).toHaveBeenCalledTimes(1);
                                expect(log[0]).toEqual(['capture', buttonElement]);
                                expect(log[1]).toEqual(['bubble', buttonElement]);
                                document.body.removeChild(portalElement);
                                return [2 /*return*/];
                        }
                    });
                }); });
                describe('Compatibility with Scopes API', function () {
                    beforeEach(function () {
                        jest.resetModules();
                        ReactFeatureFlags = require('shared/ReactFeatureFlags');
                        ReactFeatureFlags.enableCreateEventHandleAPI = true;
                        ReactFeatureFlags.enableScopeAPI = true;
                        React = require('react');
                        ReactDOM = require('react-dom');
                        ReactDOMClient = require('react-dom/client');
                        Scheduler = require('scheduler');
                        ReactDOMServer = require('react-dom/server');
                        act = require('internal-test-utils').act;
                    });
                    // @gate www
                    it('handle propagation of click events on a scope', function () { return __awaiter(_this, void 0, void 0, function () {
                        function Test() {
                            var scopeRef = React.useRef(null);
                            React.useEffect(function () {
                                var clear1 = setClick(scopeRef.current, onClick);
                                var clear2 = setClickCapture(scopeRef.current, onClickCapture);
                                return function () {
                                    clear1();
                                    clear2();
                                };
                            });
                            return <TestScope ref={scopeRef}>
                                <button ref={buttonRef}/>
                            </TestScope>;
                        }
                        var buttonRef, log, onClick, onClickCapture, TestScope, setClick, setClickCapture, buttonElement;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    buttonRef = React.createRef();
                                    log = [];
                                    onClick = jest.fn(function (e) { return log.push(['bubble', e.currentTarget]); });
                                    onClickCapture = jest.fn(function (e) { return log.push(['capture', e.currentTarget]); });
                                    TestScope = React.unstable_Scope;
                                    setClick = ReactDOM.unstable_createEventHandle('click');
                                    setClickCapture = ReactDOM.unstable_createEventHandle('click', {
                                        capture: true
                                    });
                                    return [4 /*yield*/, act(function () {
                                            ReactDOM.render(<Test />, container);
                                        })];
                                case 1:
                                    _a.sent();
                                    buttonElement = buttonRef.current;
                                    dispatchClickEvent(buttonElement);
                                    expect(onClick).toHaveBeenCalledTimes(1);
                                    expect(onClickCapture).toHaveBeenCalledTimes(1);
                                    expect(log).toEqual([['capture', buttonElement], ['bubble', buttonElement]]);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    // @gate www
                    it('handle mixed propagation of click events on a scope', function () { return __awaiter(_this, void 0, void 0, function () {
                        function Test() {
                            var scopeRef = React.useRef(null);
                            React.useEffect(function () {
                                var clear1 = setClick(scopeRef.current, onClick);
                                var clear2 = setClickCapture(scopeRef.current, onClickCapture);
                                var clear3 = setClick(buttonRef.current, onClick);
                                var clear4 = setClickCapture(buttonRef.current, onClickCapture);
                                return function () {
                                    clear1();
                                    clear2();
                                    clear3();
                                    clear4();
                                };
                            });
                            return <TestScope ref={scopeRef}>
                                <button ref={buttonRef}>
                                    <div ref={divRef} onClick={onClick} onClickCapture={onClickCapture}>
                                        Click me!
                                    </div>
                                </button>
                            </TestScope>;
                        }
                        var buttonRef, divRef, log, onClick, onClickCapture, TestScope, setClick, setClickCapture, buttonElement, divElement;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    buttonRef = React.createRef();
                                    divRef = React.createRef();
                                    log = [];
                                    onClick = jest.fn(function (e) { return log.push(['bubble', e.currentTarget]); });
                                    onClickCapture = jest.fn(function (e) { return log.push(['capture', e.currentTarget]); });
                                    TestScope = React.unstable_Scope;
                                    setClick = ReactDOM.unstable_createEventHandle('click');
                                    setClickCapture = ReactDOM.unstable_createEventHandle('click', {
                                        capture: true
                                    });
                                    return [4 /*yield*/, act(function () {
                                            ReactDOM.render(<Test />, container);
                                        })];
                                case 1:
                                    _a.sent();
                                    buttonElement = buttonRef.current;
                                    dispatchClickEvent(buttonElement);
                                    expect(onClick).toHaveBeenCalledTimes(2);
                                    expect(onClickCapture).toHaveBeenCalledTimes(2);
                                    expect(log).toEqual([['capture', buttonElement], ['capture', buttonElement], ['bubble', buttonElement], ['bubble', buttonElement]]);
                                    log.length = 0;
                                    onClick.mockClear();
                                    onClickCapture.mockClear();
                                    divElement = divRef.current;
                                    dispatchClickEvent(divElement);
                                    expect(onClick).toHaveBeenCalledTimes(3);
                                    expect(onClickCapture).toHaveBeenCalledTimes(3);
                                    expect(log).toEqual([['capture', buttonElement], ['capture', buttonElement], ['capture', divElement], ['bubble', divElement], ['bubble', buttonElement], ['bubble', buttonElement]]);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    // @gate www
                    it('should not handle the target being a dangling text node within a scope', function () { return __awaiter(_this, void 0, void 0, function () {
                        function Test() {
                            var scopeRef = React.useRef(null);
                            React.useEffect(function () {
                                return setClick(scopeRef.current, clickEvent);
                            });
                            return <button ref={buttonRef}>
                                <TestScope ref={scopeRef}>Click me!</TestScope>
                            </button>;
                        }
                        var clickEvent, buttonRef, TestScope, setClick, textNode;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    clickEvent = jest.fn();
                                    buttonRef = React.createRef();
                                    TestScope = React.unstable_Scope;
                                    setClick = ReactDOM.unstable_createEventHandle('click');
                                    return [4 /*yield*/, act(function () {
                                            ReactDOM.render(<Test />, container);
                                        })];
                                case 1:
                                    _a.sent();
                                    textNode = buttonRef.current.firstChild;
                                    dispatchClickEvent(textNode);
                                    // This should not work, as the target instance will be the
                                    // <button>, which is actually outside the scope.
                                    expect(clickEvent).toBeCalledTimes(0);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    // @gate www
                    it('handle stopPropagation (inner) correctly between scopes', function () { return __awaiter(_this, void 0, void 0, function () {
                        function Test() {
                            var scopeRef = React.useRef(null);
                            var scope2Ref = React.useRef(null);
                            React.useEffect(function () {
                                var clear1 = setClick(scopeRef.current, outerOnClick);
                                var clear2 = setClick(scope2Ref.current, innerOnClick);
                                return function () {
                                    clear1();
                                    clear2();
                                };
                            });
                            return <TestScope ref={scopeRef}>
                                <TestScope2 ref={scope2Ref}>
                                    <button ref={buttonRef}/>
                                </TestScope2>
                            </TestScope>;
                        }
                        var buttonRef, outerOnClick, innerOnClick, TestScope, TestScope2, setClick, buttonElement;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    buttonRef = React.createRef();
                                    outerOnClick = jest.fn();
                                    innerOnClick = jest.fn(function (e) { return e.stopPropagation(); });
                                    TestScope = React.unstable_Scope;
                                    TestScope2 = React.unstable_Scope;
                                    setClick = ReactDOM.unstable_createEventHandle('click');
                                    return [4 /*yield*/, act(function () {
                                            ReactDOM.render(<Test />, container);
                                        })];
                                case 1:
                                    _a.sent();
                                    buttonElement = buttonRef.current;
                                    dispatchClickEvent(buttonElement);
                                    expect(innerOnClick).toHaveBeenCalledTimes(1);
                                    expect(outerOnClick).toHaveBeenCalledTimes(0);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    // @gate www
                    it('handle stopPropagation (outer) correctly between scopes', function () { return __awaiter(_this, void 0, void 0, function () {
                        function Test() {
                            var scopeRef = React.useRef(null);
                            var scope2Ref = React.useRef(null);
                            React.useEffect(function () {
                                var clear1 = setClick(scopeRef.current, outerOnClick);
                                var clear2 = setClick(scope2Ref.current, innerOnClick);
                                return function () {
                                    clear1();
                                    clear2();
                                };
                            });
                            return <TestScope ref={scopeRef}>
                                <TestScope2 ref={scope2Ref}>
                                    <button ref={buttonRef}/>
                                </TestScope2>
                            </TestScope>;
                        }
                        var buttonRef, outerOnClick, innerOnClick, TestScope, TestScope2, setClick, buttonElement;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    buttonRef = React.createRef();
                                    outerOnClick = jest.fn(function (e) { return e.stopPropagation(); });
                                    innerOnClick = jest.fn();
                                    TestScope = React.unstable_Scope;
                                    TestScope2 = React.unstable_Scope;
                                    setClick = ReactDOM.unstable_createEventHandle('click');
                                    return [4 /*yield*/, act(function () {
                                            ReactDOM.render(<Test />, container);
                                        })];
                                case 1:
                                    _a.sent();
                                    buttonElement = buttonRef.current;
                                    dispatchClickEvent(buttonElement);
                                    expect(innerOnClick).toHaveBeenCalledTimes(1);
                                    expect(outerOnClick).toHaveBeenCalledTimes(1);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    // @gate www
                    it('handle stopPropagation (inner and outer) correctly between scopes', function () { return __awaiter(_this, void 0, void 0, function () {
                        function Test() {
                            var scopeRef = React.useRef(null);
                            var scope2Ref = React.useRef(null);
                            React.useEffect(function () {
                                var clear1 = setClick(scopeRef.current, onClick);
                                var clear2 = setClick(scope2Ref.current, onClick);
                                return function () {
                                    clear1();
                                    clear2();
                                };
                            });
                            return <TestScope ref={scopeRef}>
                                <TestScope2 ref={scope2Ref}>
                                    <button ref={buttonRef}/>
                                </TestScope2>
                            </TestScope>;
                        }
                        var buttonRef, onClick, TestScope, TestScope2, setClick, buttonElement;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    buttonRef = React.createRef();
                                    onClick = jest.fn(function (e) { return e.stopPropagation(); });
                                    TestScope = React.unstable_Scope;
                                    TestScope2 = React.unstable_Scope;
                                    setClick = ReactDOM.unstable_createEventHandle('click');
                                    return [4 /*yield*/, act(function () {
                                            ReactDOM.render(<Test />, container);
                                        })];
                                case 1:
                                    _a.sent();
                                    buttonElement = buttonRef.current;
                                    dispatchClickEvent(buttonElement);
                                    expect(onClick).toHaveBeenCalledTimes(1);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    // @gate www
                    it('should be able to register handlers for events affected by the intervention', function () { return __awaiter(_this, void 0, void 0, function () {
                        function Component() {
                            React.useEffect(function () {
                                var clearTouchStart = setTouchStart(ref.current, function (e) { return e.preventDefault(); });
                                var clearTouchMove = setTouchMove(ref.current, function (e) { return e.preventDefault(); });
                                var clearWheel = setWheel(ref.current, function (e) { return e.preventDefault(); });
                                return function () {
                                    clearTouchStart();
                                    clearTouchMove();
                                    clearWheel();
                                };
                            });
                            return <div ref={ref}>test</div>;
                        }
                        var rootContainer, allEvents, defaultPreventedEvents, handler, ref, setTouchStart, setTouchMove, setWheel;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    rootContainer = document.createElement('div');
                                    container.appendChild(rootContainer);
                                    allEvents = [];
                                    defaultPreventedEvents = [];
                                    handler = function (e) {
                                        allEvents.push(e.type);
                                        if (e.defaultPrevented)
                                            defaultPreventedEvents.push(e.type);
                                    };
                                    container.addEventListener('touchstart', handler);
                                    container.addEventListener('touchmove', handler);
                                    container.addEventListener('wheel', handler);
                                    ref = React.createRef();
                                    setTouchStart = ReactDOM.unstable_createEventHandle('touchstart');
                                    setTouchMove = ReactDOM.unstable_createEventHandle('touchmove');
                                    setWheel = ReactDOM.unstable_createEventHandle('wheel');
                                    return [4 /*yield*/, act(function () {
                                            ReactDOM.render(<Component />, rootContainer);
                                        })];
                                case 1:
                                    _a.sent();
                                    dispatchEvent(ref.current, 'touchstart');
                                    dispatchEvent(ref.current, 'touchmove');
                                    dispatchEvent(ref.current, 'wheel');
                                    expect(allEvents).toEqual(['touchstart', 'touchmove', 'wheel']);
                                    // These events are passive by default, so we can't preventDefault.
                                    expect(defaultPreventedEvents).toEqual([]);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
            });
        });
    }
    withEnableLegacyFBSupport(false);
    withEnableLegacyFBSupport(true);
});
