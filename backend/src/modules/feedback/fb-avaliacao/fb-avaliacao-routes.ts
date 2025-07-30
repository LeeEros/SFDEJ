import { Router } from "express";
import { usuarioAutenticado } from "@/middlewares/auth-usuario";
import { FbHistoricoController } from "./fb-avaliacao-controllers";

const fbAvalicaoRoutes = Router();
const fbAvaliacaoController = new FbHistoricoController();

fbAvalicaoRoutes.use(usuarioAutenticado);
fbAvalicaoRoutes.get("/", fbAvaliacaoController.findAll);
fbAvalicaoRoutes.get("/:id", fbAvaliacaoController.findById);
fbAvalicaoRoutes.post("/", fbAvaliacaoController.create);
fbAvalicaoRoutes.put("/:id", fbAvaliacaoController.update);
fbAvalicaoRoutes.delete("/:id", fbAvaliacaoController.delete);

export { fbAvalicaoRoutes };
