import { BrowserRouter } from "react-router";
import { AuthRota } from "./Auth";
import { EmpresarioRota } from "./Empresario";

export function Routes() {
    return (
        <BrowserRouter>
            <EmpresarioRota />
        </BrowserRouter>
    )
}