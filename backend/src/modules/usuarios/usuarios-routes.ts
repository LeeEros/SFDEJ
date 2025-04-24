import { Router } from "express";
import { UsuariosController } from "@/modules/usuarios/usuarios-controller";

const usuariosRoutes = Router();
const usuariosController = new UsuariosController();

usuariosRoutes.get("/", usuariosController.findAll);
usuariosRoutes.get("/:id", usuariosController.findById);
usuariosRoutes.post("/", usuariosController.create);

export { usuariosRoutes };
