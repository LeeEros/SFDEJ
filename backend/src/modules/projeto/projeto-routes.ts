import { Router } from "express";
import { ProjetoController } from "./projeto-controller";
import { userAuthenticated } from "@/middlewares/auth-usuario";
import { verificarPermissao } from "@/middlewares/auth-permissao";

const projetoRoutes = Router();
const projetoController = new ProjetoController();

projetoRoutes.use(userAuthenticated, verificarPermissao(["ADMIN"]));
projetoRoutes.get("/", projetoController.findAll);
projetoRoutes.get("/:id", projetoController.findById);
projetoRoutes.post("/", projetoController.create);
projetoRoutes.put("/:id", projetoController.update);
projetoRoutes.delete("/:id", projetoController.delete);

export { projetoRoutes };
