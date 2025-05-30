import { Routes, Route } from "react-router";
import { NaoEncontrado } from "../pages/NaoEncontrado";
import { Empresario } from "../pages/Federacao";
import { AppLayout } from "../components/AppLayout";

export function EmpresarioRota() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route path="/" element={<Empresario />} />
            </Route>

            <Route path="*" element={<NaoEncontrado />} />
        </Routes>
    )
}