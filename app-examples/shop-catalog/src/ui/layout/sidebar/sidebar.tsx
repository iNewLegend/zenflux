import "./sidebar.css";

import Cart from "../../cart/cart";

export default function Sidebar() {
    const status = false;

    return (
        <>
            <div id="sidebar" className={ status ? "show" : "" }>
                <div id="header">
                    <h2>YOUR CART</h2>
                    <button onClick={ () => alert( "toggle" ) } id="close">&#12297;</button>
                </div>
                <Cart/>
            </div>
            <div id="overlay" className={ status ? "show" : "hide" } onClick={ () => alert( "toggle from cart" ) }/>
        </>
    );
}
