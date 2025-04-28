import { Router } from "express";
import { usuarioAutenticado } from "@/middlewares/auth-usuario";
import { FbHistoricoController } from "./fb-historico-controllers";

const fbHistoricoRoutes = Router();
const fbHistController = new FbHistoricoController();

fbHistoricoRoutes.use(usuarioAutenticado);
fbHistoricoRoutes.get("/", fbHistController.findAll);
fbHistoricoRoutes.get("/:id", fbHistController.findById);
fbHistoricoRoutes.post("/", fbHistController.create);
fbHistoricoRoutes.put("/:id", fbHistController.update);
fbHistoricoRoutes.delete("/:id", fbHistController.delete);

export { fbHistoricoRoutes };
