import { diretoriasRoutes } from "@/modules/diretorias/diretoria-routes";
import { sessaoRoutes } from "@/modules/sessao/sessao-routes";
import { usuariosRoutes } from "@/modules/usuarios/usuarios-routes";
import { Router } from "express";

const routes = Router();
routes.use("/usuarios", usuariosRoutes);
routes.use("/sessao", sessaoRoutes);
routes.use("/diretorias", diretoriasRoutes);

export { routes };
