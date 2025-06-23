import { Routes, Route } from "react-router-dom";
import AutenticarRota from "../components/rotasAutenticadas";
import { NotFound } from "../pages/NotFound";
import Home from "../pages/home";
import Login from "../pages/login";


const App = () => {
  return (
      <Routes>
        <Route path="/home" index element={ <AutenticarRota><Home /></AutenticarRota>} />
        <Route path="/login" element={<Login />} />

        <Route path="*" element = {<NotFound/> }></Route>
      </Routes>
  );
};

export default App;