import api from "./api";

export interface Usuario {
  id_usuario: number;
  nome: string;
}

export interface Categoria {
  id_fb_categoria: number;
  categoria: string;
}

export interface Projeto {
  id_projeto: number;
  nome: string;
}

interface CreateSessaoData {
  fk_fb_categoria?: number;
  fk_projeto?: number;
  avaliados: number[];
  data_fim?: string;
}

export const getDadosParaFormulario = async () => {
  const [usuarios, categorias, projetos] = await Promise.all([
    api.get<Usuario[]>("/usuarios"),
    api.get<Categoria[]>("/fb-categorias"),
    api.get<Projeto[]>("/projetos"),
  ]);
  return {
    usuarios: usuarios.data,
    categorias: categorias.data,
    projetos: projetos.data,
  };
};

export const criarSessaoFeedback = (data: CreateSessaoData) => {
  return api.post("/feedback", data);
};
