import z from "zod";

export const feedbackRespostaSchema = z.object({
  nota: z.number().min(0).max(10),
  data_resposta: z.string().datetime(),
  comentario: z.string().max(500).optional(),
  fk_fb_avaliacao: z.number().int(),
  fk_fb_questao: z.number().int(),
});
