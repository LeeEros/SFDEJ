import { Route, Routes } from "react-router";
import { AuthLayout } from "../components/AuthLayout";

import { Login } from "../pages/Login";
import { CriarConta } from "../pages/CriarConta";
import { NaoEncontrado } from "../pages/NaoEncontrado";


export function AuthRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AuthLayout />}>
                <Route path="/" element={< Login />} />
                <Route path="/criar-conta" element={< CriarConta />} />
            </Route>

            <Route path="*" element={<NaoEncontrado />} />
        </Routes>
    )
}