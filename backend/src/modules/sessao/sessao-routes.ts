import { Router } from "express";
import { SessaoController } from "./sessao-controller";

const sessaoRoutes = Router();
const sessaoController = new SessaoController();

sessaoRoutes.post("/", sessaoController.findUsuario);
// "http://localhost:3000/login/validar-token"
sessaoRoutes.post("/validar-token", sessaoController.validarToken);

export { sessaoRoutes };
