import { diretoriasRoutes } from "@/modules/diretorias/diretoria-routes";
import { ejRoutes } from "@/modules/ej/ej-routes";
import { enderecoRoutes } from "@/modules/endereco/endereco-routes";
import { sessaoRoutes } from "@/modules/sessao/sessao-routes";
import { usuariosRoutes } from "@/modules/usuarios/usuarios-routes";
import { Router } from "express";

const routes = Router();
routes.use("/sessao", sessaoRoutes);
routes.use("/usuarios", usuariosRoutes);
routes.use("/ejs", ejRoutes);
routes.use("/enderecos", enderecoRoutes);
routes.use("/diretorias", diretoriasRoutes);

export { routes };
