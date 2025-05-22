import { Route, Routes } from "react-router";

import { AuthLayout } from "../components/AuthLayout";
import { Login } from "../pages/Login";


export function AuthRoutes(){
    return(
        <Routes>
            <Route path="/" element = {<AuthLayout/>}>
                <Route path="/" element={ < Login />} />
            </Route>
        </Routes>
    )
}