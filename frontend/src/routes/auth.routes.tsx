import { Route, Routes } from "react-router";
import { Login } from "../pages/Login";


export function AuthRoutes(){
    return(
        <Routes>
            <Route path="/login" element={ < Login />} />
        </Routes>
    )
}