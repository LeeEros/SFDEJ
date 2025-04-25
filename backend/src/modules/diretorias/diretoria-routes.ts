import { Router } from "express";
import { DiretoriasController } from "./diretorias-controllers";

const diretoriasRoutes = Router();
const diretoriasController = new DiretoriasController();

diretoriasRoutes.get("/", diretoriasController.findAll);

export { diretoriasRoutes };
