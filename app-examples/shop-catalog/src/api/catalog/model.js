"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catalogState = exports.catalogSubject = void 0;
var rxjs_1 = require("rxjs");
var initialState = {
    items: [],
    pagination: {},
    prevPage: 0,
};
exports.catalogSubject = new rxjs_1.BehaviorSubject(initialState);
exports.catalogState = exports.catalogSubject.asObservable();
// Research * about https://react-rxjs.org/
// https://www.youtube.com/watch?v=Urv82SGIu_0&list=PLw5h0DiJ-9PAXbn39FwGwvkSDR3WBeUFY
// The Flux Architectural
// https://github.com/web-perf/react-worker-dom/tree/master
