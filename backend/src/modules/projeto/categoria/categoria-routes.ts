import { Router } from "express";
import { usuarioAutenticado } from "@/middlewares/auth-usuario";
import { CategoriaController } from "./categoria-controller";

const categoriaRoutes = Router();
const categoriaController = new CategoriaController();

categoriaRoutes.use(usuarioAutenticado);
categoriaRoutes.get("/", categoriaController.findAll);
categoriaRoutes.get("/:id", categoriaController.findById);
categoriaRoutes.post("/", categoriaController.create);
categoriaRoutes.put("/:id", categoriaController.update);
categoriaRoutes.delete("/:id", categoriaController.delete);

export { categoriaRoutes };
