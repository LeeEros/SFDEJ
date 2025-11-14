import { Router } from "express";
import { InstituicaoController } from "./instituicao-controllers";
import { userAuthenticated } from "@/middlewares/auth-usuario";

const instRoutes = Router();
const instituicaoController = new InstituicaoController();

instRoutes.use(userAuthenticated);
instRoutes.get("/", instituicaoController.findAll);
instRoutes.get("/:id", instituicaoController.findById);
instRoutes.post("/", instituicaoController.create);
instRoutes.put("/:id", instituicaoController.update);
instRoutes.delete("/:id", instituicaoController.delete);

export { instRoutes };
