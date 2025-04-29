import { Router } from "express";
import { usuarioAutenticado } from "@/middlewares/auth-usuario";
import { CategoriaController } from "./categoria-controller";
import { verificarPermissao } from "@/middlewares/auth-permissao";

const categoriaRoutes = Router();
const categoriaController = new CategoriaController();

categoriaRoutes.use(usuarioAutenticado, verificarPermissao(["ADMIN"]));
categoriaRoutes.get("/", categoriaController.findAll);
categoriaRoutes.get("/:id", categoriaController.findById);
categoriaRoutes.post("/", categoriaController.create);
categoriaRoutes.put("/:id", categoriaController.update);
categoriaRoutes.delete("/:id", categoriaController.delete);

export { categoriaRoutes };
