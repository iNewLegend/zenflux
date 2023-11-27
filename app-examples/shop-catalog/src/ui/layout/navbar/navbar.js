"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./navbar.css");
var spinner_1 = require("../../spinner/spinner");
function Navbar() {
    // const controller = ZenRedux.hooks.useController( "Cart/Controller" ) as ICartState,
    //     { items, loaded } = controller,
    //     totalItems = items.reduce( ( current, prev ) => current + ( prev.amount || 0 ), 0 ),
    //     shouldShowCart = loaded || items.length,
    //     toggle = () => ZenCore.managers.commands.run( "Layout/Sidebar/Commands/Toggle", );
    var shouldShowCart = true, items = [], totalItems = 0, toggle = function () { };
    var cartToggle = shouldShowCart ?
        (<>
                <img className="cart" src="/img/cart.png" alt="cart"/>
                <span className={"amount bg-light ".concat(items.length ? "" : "hidden")}>{totalItems}
                </span>
            </>) : (<spinner_1.default />);
    return (<ul className="navbar">
            <li>
                <span id="logo">
                    <h2 onClick={function () { return alert("logo"); }}>My Shop
                    </h2>
                </span>
            </li>

            <li id="toggle" className="pointer" onClick={toggle}>
                {cartToggle}
            </li>
        </ul>);
}
exports.default = Navbar;
