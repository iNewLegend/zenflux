// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './app.tsx'
//
// ReactDOM.createRoot( document.getElementById( 'root' )! ).render(
//     <React.StrictMode>
//         <App/>
//     </React.StrictMode>,
// );

import React, { useEffect } from 'react';
import { BehaviorSubject } from 'rxjs';
import { customRenderer, useObservable } from "./renderer/renderer-new.ts";
import App from "./app.tsx";

// Your customRenderer and useObservable functions (with TypeScript annotations)

// Create an observable to track a counter
const counterObservable = new BehaviorSubject<number>( 0 );
const counterObservable2 = new BehaviorSubject<number>( 0 );

const CounterApp2 = ( props: any ) => {
    const [ state, setState ] = React.useState( 0 );

    // Register the observable with useObservable
    // const observable = useObservable( counterObservable );
    //
    // const increment = () => {
    //     // Update the observable's value
    //     counterObservable.next( observable.getValue() + 1 );
    // };


    setTimeout( () => {
        // setState( 99 );
    }, 1000 );
    //
    setInterval( () => {
        // increment();
    }, 1000 );

    return (
        <div className="app-2">
            <h1>Counter App2</h1>
            <p>Time: { new Date().toLocaleTimeString() }</p>
            <p>State: { state }</p>
            {/*<p>Count: { observable.getValue() }</p>*/}
            {/*<button onClick={ increment }>Increment</button>*/}
            <button onClick={ () => setState( Math.random() ) }>Update State</button>
        </div>
    );
};


const CounterApp = ( props: any ) => {
    // const [ state, setState ] = React.useState( 0 );

    // Register the observable with useObservable
    const observable = useObservable( counterObservable );
    const observable2 = useObservable( counterObservable2 );

    const increment = () => {
        // Update the observable's value
        counterObservable.next( observable.getValue() + 1 );
    };
    const increment2 = () => {
        // Update the observable's value
        counterObservable2.next( observable2.getValue() + 1 );
    };

    // setTimeout( () => {
    //     setState( 99 );
    // }, 1000 );

    setInterval( () => {
        // increment();
    }, 1000 );

    return (
        <div className="app-it-self">
            <h1>Counter App</h1>
            <p>Time: { new Date().toLocaleTimeString() }</p>
            {/*<p>State: { state }</p>*/}
            <p>1.Count: { observable.getValue() }</p>
            <p>2.Count: { observable2.getValue() }</p>
            <button onClick={ increment }>Increment</button>
            <button onClick={ increment2 }>Increment 2</button>
        </div>
    );
};

// Render the CounterApp using the customRenderer

const rootElement = document.getElementById( 'root' );

if ( rootElement ) {
    const render = customRenderer( rootElement );

    render(
        <App/>,
        // <div className="first-root">
        //     <CounterApp/>
        //     <hr />
        //     <CounterApp2/>
        // </div>,
    );

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
