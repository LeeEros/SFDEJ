import { Router } from "express";

import { usuarioAutenticado } from "@/middlewares/auth-usuario";
import { EnderecoController } from "./endereco-controller";

const enderecoRoutes = Router();
const enderecoController = new EnderecoController();

enderecoRoutes.use(usuarioAutenticado);
enderecoRoutes.get("/", enderecoController.findAll);
enderecoRoutes.get("/:id", enderecoController.findById);
enderecoRoutes.post("/", enderecoController.create);
enderecoRoutes.put("/:id", enderecoController.update);
enderecoRoutes.delete("/:id", enderecoController.delete);

export { enderecoRoutes };
