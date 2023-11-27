"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
require("./page-transaction.css");
function PageTransaction(props) {
    var _a = react_1.default.useState(true), transition = _a[0], setTransition = _a[1], timeout = react_1.default.useRef(false);
    if (!timeout.current) {
        timeout.current = true;
        setTimeout(function () {
            setTransition(false);
        }, props.timeout);
    }
    return (<div className={"page-transition ".concat(transition && "out")}>
            {props.children}
        </div>);
}
exports.default = PageTransaction;
