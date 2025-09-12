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

export interface Questao {
  id_questao: number;
  enunciado: string;
}

export interface FormularioData {
  nome_avaliado: string;
  categoria: string;
  questoes: Questao[];
}

export interface Resposta {
  fk_fb_questao: number;
  nota: number;
  comentario?: string;
}

export interface ResultadoPorQuestao {
  id_questao: number;
  enunciado: string;
  media_notas: number;
  comentarios: string[];
}

export interface RelatorioAvaliado {
  nome_avaliado: string;
  status: "Respondido" | "Pendente";
  resultados: ResultadoPorQuestao[];
}

export interface RelatorioSessao {
  id_sessao: number;
  data_criacao: string;
  categoria: string;
  projeto: string;
  participantes: RelatorioAvaliado[];
}

export interface UpdateSessaoData {
  fk_fb_categoria?: number;
  fk_projeto?: number;
  data_fim?: string | null;
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

export const getSessoes = () => {
  return api.get<CreateSessaoData[]>("/feedback");
};

export const getLinksDaSessao = (id_sessao: number) => {
  return api.get<any[]>(`/feedback/${id_sessao}/links`);
};

export const getFormularioPublico = (token: string) => {
  return api.get<FormularioData>(`/fb-avaliacao/publico/${token}`);
};

export const enviarRespostas = (token: string, respostas: Resposta[]) => {
  return api.post(`/fb-respostas/publico/${token}`, { respostas });
};

export const getRelatorioSessao = (id_sessao: number) => {
  return api.get<RelatorioSessao>(`/feedback/relatorio/${id_sessao}`);
};

export const deleteSessao = (id_sessao: number) => {
  return api.delete(`/feedback/${id_sessao}`);
};

export const getSessaoById = (id_sessao: number) => {
  return api.get<Sessao>(`/feedback/${id_sessao}`);
};

export const updateSessao = (id_sessao: number, data: UpdateSessaoData) => {
  return api.put(`/feedback/${id_sessao}`, data);
};
