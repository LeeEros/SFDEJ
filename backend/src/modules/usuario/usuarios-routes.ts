import { Router } from "express";
import { UsuariosController } from "./usuarios-controller";
import { userAuthenticated } from "@/middlewares/auth-usuario";

const usuariosRoutes = Router();
const usuariosController = new UsuariosController();

usuariosRoutes.post("/", usuariosController.create);
usuariosRoutes.use(userAuthenticated);
usuariosRoutes.get("/", usuariosController.findAll);
usuariosRoutes.get("/desativados", usuariosController.findAllDisabled);
usuariosRoutes.get("/:id", usuariosController.findById);
usuariosRoutes.put("/:id", usuariosController.update);
usuariosRoutes.delete("/:id", usuariosController.delete);
usuariosRoutes.get(
  "/relatorio/:id_usuario",
  usuariosController.getFeedbackReport
);
usuariosRoutes.get(
  "/relatorio/:id_usuario/grafico-radar",
  usuariosController.getRadarChartData
);

export { usuariosRoutes };
