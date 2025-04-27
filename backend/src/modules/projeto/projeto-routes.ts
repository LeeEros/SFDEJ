import { Router } from "express";
import { ProjetoController } from "./projeto-controller";
import { usuarioAutenticado } from "@/middlewares/auth-usuario";

const projetoRoutes = Router();
const projetoController = new ProjetoController();

projetoRoutes.use(usuarioAutenticado);
projetoRoutes.get("/", projetoController.findAll);
projetoRoutes.get("/:id", projetoController.findById);
projetoRoutes.post("/", projetoController.create);
projetoRoutes.put("/:id", projetoController.update);
projetoRoutes.delete("/:id", projetoController.delete);

export { projetoRoutes };
