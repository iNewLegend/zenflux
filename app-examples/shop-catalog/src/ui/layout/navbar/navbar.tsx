import "./navbar.css";
import Spinner from "../../spinner/spinner";

export default function Navbar() {
    // const controller = ZenRedux.hooks.useController( "Cart/Controller" ) as ICartState,
    //     { items, loaded } = controller,
    //     totalItems = items.reduce( ( current, prev ) => current + ( prev.amount || 0 ), 0 ),
    //     shouldShowCart = loaded || items.length,
    //     toggle = () => ZenCore.managers.commands.run( "Layout/Sidebar/Commands/Toggle", );

    const shouldShowCart = true,
        items = [],
        totalItems = 0,
        toggle = () => {};

    const cartToggle = shouldShowCart ?
        (
            <>
                <img className="cart" src="/img/cart.png" alt="cart"/>
                <span
                    className={ `amount bg-light ${ items.length ? "" : "hidden" }` }>{ totalItems }
                </span>
            </>
        ) : (
            <Spinner/>
        );

    return (
        <ul className="navbar">
            <li>
                <span id="logo">
                    <h2
                        onClick={ () => alert( "logo" ) }>My Shop
                    </h2>
                </span>
            </li>

            <li id="toggle" className="pointer" onClick={ toggle }>
                { cartToggle }
            </li>
        </ul>
    );
}
