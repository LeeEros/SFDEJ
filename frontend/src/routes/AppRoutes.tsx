import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AutenticarRota from "../components/rotasAutenticadas";
import Home from "../pages/home";
import Login from "../pages/login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" index element={ <AutenticarRota><Home /></AutenticarRota>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;