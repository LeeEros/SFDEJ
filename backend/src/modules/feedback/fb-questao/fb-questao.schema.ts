import z from "zod";

export const feedbackQuestaoSchema = z.object({
  enunciado: z.string().max(255),
  comentario: z.string(),
  pontuacao: z.number().int(),
  fk_fb_categoria: z.number().int(),
});
