import { Router } from "express";

import { usuarioAutenticado } from "@/middlewares/auth-usuario";
import { FeedbackController } from "./feedback.controller";

const feedbackRoutes = Router();
const fbController = new FeedbackController();

feedbackRoutes.use(usuarioAutenticado);
feedbackRoutes.get("/", fbController.findAll);
feedbackRoutes.get("/:id", fbController.findById);
feedbackRoutes.post("/", fbController.create);
feedbackRoutes.put("/:id", fbController.update);
feedbackRoutes.delete("/:id", fbController.delete);

export { feedbackRoutes };
