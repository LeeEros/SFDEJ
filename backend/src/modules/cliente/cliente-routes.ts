import { Router } from "express";
import { usuarioAutenticado } from "@/middlewares/auth-usuario";
import { ClienteController } from "./cliente-controller";

const clienteRoutes = Router();
const clienteController = new ClienteController();

clienteRoutes.use(usuarioAutenticado);
clienteRoutes.get("/", clienteController.findAll);
clienteRoutes.get("/:id", clienteController.findById);
clienteRoutes.post("/", clienteController.create);
clienteRoutes.put("/:id", clienteController.update);
clienteRoutes.delete("/:id", clienteController.delete);

export { clienteRoutes };
