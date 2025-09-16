import { Route, BrowserRouter as Router, Routes } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AutenticarRota from "./components/rotasAutenticadas";
import AppFooter from "./layout/AppFooter";
import AppLayout from "./layout/AppLayout";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import CategoriaDashboard from "./pages/core/Categoria/CategoriaDashboard";
import ClienteDashboard from "./pages/core/Cliente/ClienteDashboard";
import DiretoriaDashboard from "./pages/core/Diretoria/DiretoriaDashboard";
import EJDashboard from "./pages/core/EJ/EJDashboard";
import EnderecoDashboard from "./pages/core/Endereco/EnderecoDashboard";
import FederacaoDashboard from "./pages/core/Federacao/FederacaoDashboard";
import FeedbackAvaliacaoDashboard from "./pages/core/Feedback/FeedbackAvaliacaoDashboard";
import FeedbackCategoriaDashboard from "./pages/core/Feedback/FeedbackCategoriaDashboard";
import FeedbackQuestaoDashboard from "./pages/core/Feedback/FeedbackQuestaoDashboard";
import FeedbackReportPage from "./pages/core/Feedback/FeedbackReportPage";
import FeedbackSessaoDashboard from "./pages/core/Feedback/FeedbackSessaoDashboard";
import PublicFeedbackForm from "./pages/core/Feedback/PublicFeedbackForms";
import InstituicaoDashboard from "./pages/core/Instituicao/InstituicaoDashboard";
import ProjetoDashboard from "./pages/core/Projeto/ProjetoDashboard";
import UsuarioDashboard from "./pages/core/Usuario/UsuarioDashboard";
import Home from "./pages/Dashboard/Home";
import NotFound from "./pages/OtherPage/NotFound";
import UserFeedbackReportPage from "./pages/core/Usuario/UsuarioFeedbackReportPage";


export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>

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

            <Route path="/feedback/relatorio/:id_sessao"
              element={
                <AutenticarRota>
                  <FeedbackReportPage />
                </AutenticarRota>
              } />

            <Route path="/usuarios/relatorio/:id_usuario" element={<UserFeedbackReportPage />} />

          </Route>


          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/feedback/responder/:token" element={<PublicFeedbackForm />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      <AppFooter />
    </>
  );
}

