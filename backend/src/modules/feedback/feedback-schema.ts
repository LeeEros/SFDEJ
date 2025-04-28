import z from "zod";

export const feedbackSchema = z.object({
  resultado_media: z.number(),
  data_realizacao: z.date(),
  comentario: z.string().optional(),
  media: z.number(),
  tipo_avaliador: z.enum(["EXTERNO", "INTERNO"]),
  fk_categoria: z.number().optional(),
  fk_projeto: z.number().optional(),
  fk_usuario_avaliado: z.number(),
});
