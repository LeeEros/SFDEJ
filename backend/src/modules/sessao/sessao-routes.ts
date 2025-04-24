import { Router } from "express";
import { SessaoController } from "./sessao-controller";

const sessaoRoutes = Router();
const sessaoController = new SessaoController();

sessaoRoutes.post("/", sessaoController.findUsuario);

export { sessaoRoutes };
