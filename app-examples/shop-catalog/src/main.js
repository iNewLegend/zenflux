"use strict";
// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './app.tsx'
//
// ReactDOM.createRoot( document.getElementById( 'root' )! ).render(
//     <React.StrictMode>
//         <App/>
//     </React.StrictMode>,
// );
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var rxjs_1 = require("rxjs");
var renderer_new_ts_1 = require("./renderer/renderer-new.ts");
var app_tsx_1 = require("./app.tsx");
// Your customRenderer and useObservable functions (with TypeScript annotations)
// Create an observable to track a counter
var counterObservable = new rxjs_1.BehaviorSubject(0);
var counterObservable2 = new rxjs_1.BehaviorSubject(0);
var CounterApp2 = function (props) {
    var _a = react_1.default.useState(0), state = _a[0], setState = _a[1];
    // Register the observable with useObservable
    // const observable = useObservable( counterObservable );
    //
    // const increment = () => {
    //     // Update the observable's value
    //     counterObservable.next( observable.getValue() + 1 );
    // };
    setTimeout(function () {
        // setState( 99 );
    }, 1000);
    //
    setInterval(function () {
        // increment();
    }, 1000);
    return (<div className="app-2">
            <h1>Counter App2</h1>
            <p>Time: {new Date().toLocaleTimeString()}</p>
            <p>State: {state}</p>
            {/*<p>Count: { observable.getValue() }</p>*/}
            {/*<button onClick={ increment }>Increment</button>*/}
            <button onClick={function () { return setState(Math.random()); }}>Update State</button>
        </div>);
};
var CounterApp = function (props) {
    // const [ state, setState ] = React.useState( 0 );
    // Register the observable with useObservable
    var observable = (0, renderer_new_ts_1.useObservable)(counterObservable);
    var observable2 = (0, renderer_new_ts_1.useObservable)(counterObservable2);
    var increment = function () {
        // Update the observable's value
        counterObservable.next(observable.getValue() + 1);
    };
    var increment2 = function () {
        // Update the observable's value
        counterObservable2.next(observable2.getValue() + 1);
    };
    // setTimeout( () => {
    //     setState( 99 );
    // }, 1000 );
    setInterval(function () {
        // increment();
    }, 1000);
    return (<div className="app-it-self">
            <h1>Counter App</h1>
            <p>Time: {new Date().toLocaleTimeString()}</p>
            {/*<p>State: { state }</p>*/}
            <p>1.Count: {observable.getValue()}</p>
            <p>2.Count: {observable2.getValue()}</p>
            <button onClick={increment}>Increment</button>
            <button onClick={increment2}>Increment 2</button>
        </div>);
};
// Render the CounterApp using the customRenderer
var rootElement = document.getElementById('root');
if (rootElement) {
    var render = (0, renderer_new_ts_1.customRenderer)(rootElement);
    render(<app_tsx_1.default />);
    // Example: Trigger a re-render with updated children after 3 seconds
    // setTimeout( () => {
    //     const updatedApp = (
    //             <div className="second-root">
    //                 <CounterApp/>
    //                 <p>Updated at { new Date().toLocaleTimeString() }</p>
    //             </div>
    //         // <React.StrictMode>
    //         // <div className="second-root">
    //         //     <CounterApp/>
    //         //     <p>Updated at { new Date().toLocaleTimeString() }</p>
    //         // </div>
    //         // </React.StrictMode>
    //     );
    //     render( updatedApp );
    // }, 3000 );
}
//
// const realDom = ReactDOM.createRoot( document.getElementById( 'root' )! );
//
// if ( rootElement ) {
//     realDom.render( <div className="first-root">
//         <CounterApp/>
//     </div> );
//
//     // Example: Trigger a re-render with updated children after 3 seconds
//     setTimeout( () => {
//         const updatedApp = (
//             <div className="second-root">
//                 <CounterApp/>
//                 <p>Updated at { new Date().toLocaleTimeString() }</p>
//             </div>
//         );
//         realDom.render( updatedApp );
//     }, 3000 );
// }
