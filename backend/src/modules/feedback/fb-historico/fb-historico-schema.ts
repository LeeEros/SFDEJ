import z from "zod";

export const feedbackHistoricoSchema = z.object({
  media_geral: z.number(),
  media_categorias: z.number(),
  data_atualizacao: z.date().optional(),
  fk_feedback: z.number().int(),
});
