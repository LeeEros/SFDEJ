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

export interface RadarData {
  categoria: string;
  media: number;
}

export const getRelatorioUsuario = (id_usuario: number) => {
  return api.get<RelatorioUsuario>(`/usuarios/relatorio/${id_usuario}`);
};

export const getUsuarioRadarChart = (id_usuario: number) => {
  return api.get<RadarData[]>(
    `/usuarios/relatorio/${id_usuario}/grafico-radar`
  );
};
