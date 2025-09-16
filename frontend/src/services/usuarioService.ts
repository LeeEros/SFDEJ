import api from "./api";

interface ResultadoDetalhado {
  enunciado: string;
  media_notas: number;
  comentarios: string[];
}

interface HistoricoFeedback {
  data_feedback: string;
  contexto: string;
  resultados: ResultadoDetalhado[];
}

export interface RelatorioUsuario {
  id_usuario: number;
  nome_usuario: string;
  historico_feedbacks: HistoricoFeedback[];
}

export const getRelatorioUsuario = (id_usuario: number) => {
  return api.get<RelatorioUsuario>(`/usuarios/relatorio/${id_usuario}`);
};
