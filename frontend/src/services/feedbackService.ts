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

export interface Sessao {
  id_sessao: number;
  data_criacao: string;
  data_fim: string | null;
  status: boolean;
  fk_fb_categoria?: number;
  fk_projeto?: number;
  feedback_categoria?: { categoria: string };
  projeto?: { nome: string };
  _count: { avaliados: number };
}

interface CreateSessaoPayload {
  fk_fb_categoria?: number;
  fk_projeto?: number;
  avaliados: number[];
  data_fim?: string;
}

interface UpdateSessaoPayload {
  fk_fb_categoria?: number;
  fk_projeto?: number;
  data_fim?: string | null;
}

export interface RelatorioAvaliado {
  nome_avaliado: string;
  status: "Respondido" | "Pendente";
}

export interface RelatorioSessao {
  id_sessao: number;
  data_criacao: string;
  categoria: string;
  projeto: string;
  participantes: RelatorioAvaliado[];
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

export const getSessoes = () => api.get<Sessao[]>("/feedback");

export const getSessaoById = (id_sessao: number) =>
  api.get<Sessao>(`/feedback/${id_sessao}`);

export const criarSessaoFeedback = (data: CreateSessaoPayload) =>
  api.post("/feedback", data);

export const updateSessao = (id_sessao: number, data: UpdateSessaoPayload) =>
  api.put(`/feedback/${id_sessao}`, data);

export const deleteSessao = (id_sessao: number) =>
  api.delete(`/feedback/${id_sessao}`);

export const getLinksDaSessao = (id_sessao: number) =>
  api.get<any[]>(`/feedback/${id_sessao}/links`);

export const getRelatorioSessao = (id_sessao: number) =>
  api.get<RelatorioSessao>(`/feedback/relatorio/${id_sessao}`);
