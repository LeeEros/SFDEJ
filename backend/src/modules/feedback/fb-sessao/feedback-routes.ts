import { Router } from "express";
import { userAuthenticated } from "@/middlewares/auth-usuario";
import { FeedbackController } from "./feedback-controller";

const feedbackRoutes = Router();
const fbController = new FeedbackController();

feedbackRoutes.use(userAuthenticated);
feedbackRoutes.get("/", fbController.findAll);
feedbackRoutes.get("/:id", fbController.findById);
feedbackRoutes.post("/", fbController.create);
feedbackRoutes.put("/:id", fbController.update);
feedbackRoutes.delete("/:id", fbController.delete);
feedbackRoutes.get("/:id_sessao/links", fbController.findLinks);
feedbackRoutes.get("/relatorio/:id_sessao", fbController.getReport);
feedbackRoutes.get(
  "/relatorios/media-por-categoria",
  fbController.getMediaPorCategoria
);

export { feedbackRoutes };
