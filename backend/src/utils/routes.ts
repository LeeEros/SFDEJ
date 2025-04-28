import { clienteRoutes } from "@/modules/cliente/cliente-routes";
import { diretoriasRoutes } from "@/modules/diretoria/diretoria-routes";
import { ejRoutes } from "@/modules/ej/ej-routes";
import { enderecoRoutes } from "@/modules/endereco/endereco-routes";
import { federacaoRoutes } from "@/modules/federacao/federacao-routes";
import { fbHistoricoRoutes } from "@/modules/feedback/fb-historico/fb-historico-routes";
import { feedbackRoutes } from "@/modules/feedback/fb/feedback-routes";
import { instRoutes } from "@/modules/instituicao/insituicao-routes";
import { categoriaRoutes } from "@/modules/projeto/categoria/categoria-routes";
import { projetoRoutes } from "@/modules/projeto/projeto-routes";
import { sessaoRoutes } from "@/modules/sessao/sessao-routes";
import { usuariosRoutes } from "@/modules/usuario/usuarios-routes";

import { Router } from "express";

const routes = Router();
routes.use("/login", sessaoRoutes);
routes.use("/usuarios", usuariosRoutes);

routes.use("/clientes", clienteRoutes);
routes.use("/diretorias", diretoriasRoutes);
routes.use("/ejs", ejRoutes);
routes.use("/enderecos", enderecoRoutes);
routes.use("/feedback", feedbackRoutes);
routes.use("/fb-historico", fbHistoricoRoutes);
routes.use("/instituicoes", instRoutes);
routes.use("/federacoes", federacaoRoutes);

routes.use("/projetos", projetoRoutes);
routes.use("/projetos-categorias", categoriaRoutes);

export { routes };
