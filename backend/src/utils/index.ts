import { usuariosRoutes } from "@/modules/usuarios/usuarios-routes";
import { Router } from "express";

const routes = Router();
routes.use("/usuarios", usuariosRoutes);

export { routes };
