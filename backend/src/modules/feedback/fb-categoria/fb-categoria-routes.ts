import { usuarioAutenticado } from "@/middlewares/auth-usuario";
import { Router } from "express";
import { FbCategoriaController } from "./fb-categoria-controller";

const fbCategoriaRoutes = Router();
const fbCategoriaController = new FbCategoriaController();

fbCategoriaRoutes.use(usuarioAutenticado);
fbCategoriaRoutes.get("/", fbCategoriaController.findAll);
fbCategoriaRoutes.get("/:id", fbCategoriaController.findById);
fbCategoriaRoutes.post("/", fbCategoriaController.create);
fbCategoriaRoutes.put("/:id", fbCategoriaController.update);
fbCategoriaRoutes.delete("/:id", fbCategoriaController.delete);

export { fbCategoriaRoutes };
