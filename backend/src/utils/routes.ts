import { diretoriasRoutes } from "@/modules/diretoria/diretoria-routes";
import { ejRoutes } from "@/modules/ej/ej-routes";
import { enderecoRoutes } from "@/modules/endereco/endereco-routes";
import { federacaoRoutes } from "@/modules/federacao/federacao-routes";
import { instRoutes } from "@/modules/instituicao/insituicao-routes";
import { sessaoRoutes } from "@/modules/sessao/sessao-routes";
import { usuariosRoutes } from "@/modules/usuarios/usuarios-routes";
import { Router } from "express";

const routes = Router();
routes.use("/sessao", sessaoRoutes);
routes.use("/usuarios", usuariosRoutes);
routes.use("/diretorias", diretoriasRoutes);
routes.use("/ejs", ejRoutes);
routes.use("/enderecos", enderecoRoutes);
routes.use("/instituicoes", instRoutes);
routes.use("/federacoes", federacaoRoutes);

export { routes };
