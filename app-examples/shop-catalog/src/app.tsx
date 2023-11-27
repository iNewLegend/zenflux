import ZenCore from "@zenflux/core";

import "@zenflux/logging";

import config from "./zenflux-config";

import CatalogController from "./api/catalog/controller.ts";

import "./assets/css/index.css";

import Navbar from "./ui/layout/navbar/navbar";
import Sidebar from "./ui/layout/sidebar/sidebar";

import Pages from "./pages/pages.tsx";


// It maybe caused by import + global, maybe only when current file is re-compiling?
try {
    ZenCore.initialize( config );

    ZenCore.managers.controllers.register( new CatalogController );
} catch ( e ) {
    // Determine how to handle this error
    console.warn( e );
}

setTimeout( () => {
    ZenCore.managers.internal.run( "Catalog/Internal/Start" );
} );

function App() {
    return (
        <>
            <header>
                <Navbar/>
            </header>

            <Sidebar/>

            <section className="main">
                <Pages/>
            </section>
        </>
    );
}

export default App
