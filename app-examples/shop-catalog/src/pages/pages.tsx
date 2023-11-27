import Catalog from "./catalog/catalog";
import Checkout from "./checkout/checkout";
import Spinner from "../ui/spinner/spinner";

function getCurrent() {
    // ZenCore.routes.getCurrent('pages') returns the current route
    const current = ( 1 === 1 ) ? "Catalog" : "Checkout";

    switch ( current ) {
    case "Catalog":
        return <Catalog/>;

    case "Checkout":
        return <Checkout/>;

        // Favor suspense over loading
    default:
        return <Spinner/>;
    }
}

export default function Pages() {
    return (
        <div className="page">
            { getCurrent() }
        </div>
    );
}
