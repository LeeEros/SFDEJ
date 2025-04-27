import { Router } from "express";
import { UsuariosController } from "@/modules/usuarios/usuarios-controller";
import { usuarioAutenticado } from "@/middlewares/auth-usuario";

const usuariosRoutes = Router();
const usuariosController = new UsuariosController();

usuariosRoutes.post("/", usuariosController.create);
usuariosRoutes.use(usuarioAutenticado);
usuariosRoutes.get("/", usuariosController.findAll);
usuariosRoutes.get("/desativados", usuariosController.findAllDesativados);
usuariosRoutes.get("/:id", usuariosController.findById);
usuariosRoutes.put("/:id", usuariosController.update);
usuariosRoutes.delete("/:id", usuariosController.delete);

export { usuariosRoutes };
