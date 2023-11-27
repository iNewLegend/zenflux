"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./sidebar.css");
var cart_1 = require("../../cart/cart");
function Sidebar() {
    var status = false;
    return (<>
            <div id="sidebar" className={status ? "show" : ""}>
                <div id="header">
                    <h2>YOUR CART</h2>
                    <button onClick={function () { return alert("toggle"); }} id="close">&#12297;</button>
                </div>
                <cart_1.default />
            </div>
            <div id="overlay" className={status ? "show" : "hide"} onClick={function () { return alert("toggle from cart"); }}/>
        </>);
}
exports.default = Sidebar;
