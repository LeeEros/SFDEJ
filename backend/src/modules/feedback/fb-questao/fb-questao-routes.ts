import { Router } from "express";
import { FbQuestaoController } from "./fb-questao-controller";
import { usuarioAutenticado } from "@/middlewares/auth-usuario";

const fbQuestaoRoutes = Router();
const fbQuestaoController = new FbQuestaoController();

fbQuestaoRoutes.use(usuarioAutenticado);
fbQuestaoRoutes.get("/", fbQuestaoController.findAll);
fbQuestaoRoutes.get("/:id", fbQuestaoController.findById);
fbQuestaoRoutes.post("/", fbQuestaoController.create);
fbQuestaoRoutes.put("/:id", fbQuestaoController.update);
fbQuestaoRoutes.delete("/:id", fbQuestaoController.delete);

export { fbQuestaoRoutes };
