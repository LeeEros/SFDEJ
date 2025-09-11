import { Router } from "express";
import { FbRespostaController } from "./fb-resposta-controller";

const fbRespostaRoutes = Router();
const fbRespostaController = new FbRespostaController();

fbRespostaRoutes.post("/publico/:token", fbRespostaController.createPublic);

export { fbRespostaRoutes };
