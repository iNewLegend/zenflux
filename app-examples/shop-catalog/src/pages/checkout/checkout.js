"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CART_FRACTION_DIGITS = void 0;
var core_1 = require("@zenflux/core");
require("./checkout.css");
var zenflux_config_ts_1 = require("../../zenflux-config.ts");
exports.CART_FRACTION_DIGITS = 2;
function Checkout() {
    var controller = {
        items: [
            {
                id: 1,
                name: "Product 1",
                price: '100',
                amount: 1,
            },
            {
                id: 2,
                name: "Product 2",
                price: "200",
                amount: 1,
            },
            {
                id: 3,
                name: "Product 3",
                price: "300",
                amount: 1,
            },
        ],
    };
    if (!controller.items.length) {
        return <div className="container">
            <h1>Cart is empty</h1>
        </div>;
    }
    var removeItem = function (id) {
        return core_1.default.managers.commands.run("Cart/Item/Commands/Remove", { id: id });
    };
    return (<div id="checkout">
            <div className="container">
                <div className="basket">
                    <div className="basket-labels">
                        <ul>
                            <li className="item item-heading">Item</li>
                            <li className="price">Price</li>
                            <li className="quantity">Quantity</li>
                            <li className="subtotal">Subtotal</li>
                        </ul>
                    </div>
                    {controller.items.map(function (item, index) {
            return (<div className="basket-product" key={index}>
                                <div className="item">
                                    <div className="product-image">
                                        <img className="product-frame" src={zenflux_config_ts_1.default.baseURL + "/catalog/get_product_image/".concat(item.id)} // TODO this line is repeated, make common item
             alt={item.name || ""}/>
                                    </div>

                                    <div className="product-details">
                                        <h1><strong><span className="item-quantity"></span> {item.name}</strong></h1>
                                    </div>
                                </div>

                                <div className="price">{item.price}</div>
                                <div className="quantity">
                                    <input type="number" defaultValue={item.amount} min="1" className="quantity-field"/>
                                </div>
                                <div className="subtotal">{((item.amount || 1) * (parseInt(item.price))).toFixed(exports.CART_FRACTION_DIGITS)}</div>
                                <div className="remove">
                                    <button onClick={function () { return removeItem(item.id); }}>Remove</button>
                                </div>
                            </div>);
        })}
                </div>
            </div>
        </div>);
}
exports.default = Checkout;
