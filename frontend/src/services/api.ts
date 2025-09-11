import axios from "axios";

const url = "http://localhost:3333";

const api = axios.create({
  baseURL: url,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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

export interface Sessao {
  id_sessao: number;
  data_criacao: string;
  data_fim: string | null;
  status: boolean;
  feedback_categoria?: { categoria: string };
  projeto?: { nome: string };
  _count: { avaliados: number };
}

export const getFormularioPublico = (token: string) => {
  return api.get<FormularioData>(`/fb-avaliacao/publico/${token}`);
};

export const enviarRespostas = (token: string, respostas: Resposta[]) => {
  return api.post(`/fb-respostas/publico/${token}`, { respostas });
};

export const getSessoes = () => {
  return api.get<Sessao[]>("/feedback");
};

export const getLinksDaSessao = (id_sessao: number) => {
  return api.get<any[]>(`/feedback/${id_sessao}/links`);
};

export default api;
