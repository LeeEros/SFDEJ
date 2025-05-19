import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AutenticarRota from "../components/rotasAutenticadas";
import Home from "../pages/Home";
import Login from "../pages/Login";
import { NotFound } from "../pages/NotFound";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" index element={ <AutenticarRota><Home /></AutenticarRota>} />
        <Route path="/login" element={<Login />} />

        <Route path="*" element = {<NotFound/> }></Route>
      </Routes>
    </Router>
  );
};

export default App;