import Spinner from "../../ui/spinner/spinner.tsx";
import Catalog from "../../ui/catalog/catalog.tsx";

export default function () {
    const items = [];

    if ( ! items.length ) {
        return <Spinner color={ "red" }/>;
    }

    return (
        <div className="container">
            <Catalog/>
        </div>
    );
}
