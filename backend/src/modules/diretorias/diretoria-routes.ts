import { Router } from "express";
import { DiretoriasController } from "./diretorias-controllers";

const diretoriasRoutes = Router();
const diretoriasController = new DiretoriasController();

diretoriasRoutes.get("/", diretoriasController.findAll);
diretoriasRoutes.get("/:id", diretoriasController.findById);
diretoriasRoutes.post("/", diretoriasController.create);
diretoriasRoutes.put("/:id", diretoriasController.update);
diretoriasRoutes.delete("/:id", diretoriasController.delete);

export { diretoriasRoutes };
