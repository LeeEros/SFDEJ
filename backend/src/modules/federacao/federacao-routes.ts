import { Router } from "express";
import { FederacaoController } from "./federacao-controller";
import { usuarioAutenticado } from "@/middlewares/auth-usuario";

const federacaoRoutes = Router();
const federacaoController = new FederacaoController();

federacaoRoutes.use(usuarioAutenticado);
federacaoRoutes.get("/", federacaoController.findAll);
federacaoRoutes.get("/:id", federacaoController.findById);
federacaoRoutes.post("/", federacaoController.create);
federacaoRoutes.put("/:id", federacaoController.update);
federacaoRoutes.delete("/:id", federacaoController.delete);

export { federacaoRoutes };
