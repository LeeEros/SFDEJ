import { Route, BrowserRouter as Router, Routes } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppLayout from "./layout/AppLayout";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import Blank from "./pages/Blank";
import Calendar from "./pages/Calendar";
import BarChart from "./pages/Charts/BarChart";
import LineChart from "./pages/Charts/LineChart";
import Home from "./pages/Dashboard/Home";
import FormElements from "./pages/Forms/FormElements";
import NotFound from "./pages/OtherPage/NotFound";
import BasicTables from "./pages/Tables/BasicTables";
import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";
import UserProfiles from "./pages/UserProfiles";

import AutenticarRota from "./components/rotasAutenticadas";
import AppFooter from "./layout/AppFooter";
import CategoriaDashboard from "./pages/core/Categoria/CategoriaDashboard";
import ClienteDashboard from "./pages/core/Cliente/ClienteDashboard";
import DiretoriaDashboard from "./pages/core/Diretoria/DiretoriaDashboard";
import EJDashboard from "./pages/core/EJ/EJDashboard";
import EnderecoDashboard from "./pages/core/Endereco/EnderecoDashboard";
import FederacaoDashboard from "./pages/core/Federacao/FederacaoDashboard";
import FeedbackCategoriaDashboard from "./pages/core/Feedback/FeedbackCategoriaDashboard";
import FeedbackQuestaoDashboard from "./pages/core/Feedback/FeedbackQuestaoDashboard";
import FeedbackRespostasDashboard from "./pages/core/Feedback/FeedbackRespostaDashboard";
import FeedbackSessaoDashboard from "./pages/core/Feedback/FeedbackSessaoDashboard";
import InstituicaoDashboard from "./pages/core/Instituicao/InstituicaoDashboard";
import ProjetoDashboard from "./pages/core/Projeto/ProjetoDashboard";
import UsuarioDashboard from "./pages/core/Usuario/UsuarioDashboard";
import FeedbackAvaliacaoDashboard from "./pages/core/Feedback/FeedbackAvaliacaoDashboard";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route
              index
              path="/"
              element={
                <AutenticarRota>
                  <Home />
                </AutenticarRota>
              }
            />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />

            {/* Rotas protegidas */}

            <Route
              path="/usuarios"
              element={
                <AutenticarRota>
                  <UsuarioDashboard />
                </AutenticarRota>
              }
            />


            <Route
              path="/federacao"
              element={
                <AutenticarRota>
                  <FederacaoDashboard />
                </AutenticarRota>
              }
            />
            <Route
              path="/endereco"
              element={
                <AutenticarRota>
                  <EnderecoDashboard />
                </AutenticarRota>
              }
            />
            <Route
              path="/instituicoes"
              element={
                <AutenticarRota>
                  <InstituicaoDashboard />
                </AutenticarRota>
              }
            />

            <Route
              path="/ejs"
              element={
                <AutenticarRota>
                  <EJDashboard />
                </AutenticarRota>
              }
            />

            <Route
              path="/diretorias"
              element={
                <AutenticarRota>
                  <DiretoriaDashboard />
                </AutenticarRota>
              }
            />

            <Route
              path="/clientes"
              element={
                <AutenticarRota>
                  <ClienteDashboard />
                </AutenticarRota>
              }
            />

            <Route
              path="/categorias"
              element={
                <AutenticarRota>
                  <CategoriaDashboard />
                </AutenticarRota>
              }
            />

            <Route
              path="/projetos"
              element={
                <AutenticarRota>
                  <ProjetoDashboard />
                </AutenticarRota>
              }
            />

            <Route
              path="/feedbacks"
              element={
                <AutenticarRota>
                  <FeedbackSessaoDashboard />
                </AutenticarRota>
              }
            />

            <Route path="/feedback-avaliacoes" element={
              <AutenticarRota>
                <FeedbackAvaliacaoDashboard />
              </AutenticarRota>
            } />

            <Route
              path="/feedback-categorias"
              element={
                <AutenticarRota>
                  <FeedbackCategoriaDashboard />
                </AutenticarRota>
              }
            />

            <Route
              path="/feedback-questoes"
              element={
                <AutenticarRota>
                  <FeedbackQuestaoDashboard />
                </AutenticarRota>
              }
            />

            <Route
              path="/feedback-respostas"
              element={
                <AutenticarRota>
                  <FeedbackRespostasDashboard />
                </AutenticarRota>
              }
            />

          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      <AppFooter />
    </>
  );
}

