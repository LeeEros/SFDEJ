import { Router } from "express";
import { FbRespostaController } from "./fb-resposta-controller";
import { usuarioAutenticado } from "@/middlewares/auth-usuario";

const fbRespostaRoutes = Router();
const fbRespostaController = new FbRespostaController();

fbRespostaRoutes.use(usuarioAutenticado);
fbRespostaRoutes.get("/", fbRespostaController.findAll);
fbRespostaRoutes.get("/:id", fbRespostaController.findById);
fbRespostaRoutes.post("/", fbRespostaController.create);
fbRespostaRoutes.put("/:id", fbRespostaController.update);
fbRespostaRoutes.delete("/:id", fbRespostaController.delete);

export { fbRespostaRoutes };
