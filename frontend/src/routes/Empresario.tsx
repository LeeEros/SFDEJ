import { Routes, Route } from "react-router";
import { NaoEncontrado } from "../pages/NaoEncontrado";
import { Empresario } from "../pages/EmpresarioJunior";


export function EmpresarioRota() {
    return (
        <Routes>
            <Route path="/" element={<Empresario />} />

            <Route path="*" element={<NaoEncontrado />} />
        </Routes>
    )
}