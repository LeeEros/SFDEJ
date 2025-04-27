import { Router } from "express";
import { EJController } from "./ej-controllers";
import { usuarioAutenticado } from "@/middlewares/auth-usuario";

const ejRoutes = Router();
const ejController = new EJController();

ejRoutes.use(usuarioAutenticado);
ejRoutes.get("/", ejController.findAll);
ejRoutes.get("/:id", ejController.findById);
ejRoutes.post("/", ejController.create);
ejRoutes.put("/:id", ejController.update);
ejRoutes.delete("/:id", ejController.delete);

export { ejRoutes };
