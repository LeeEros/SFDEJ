import z from "zod";

export const feedbackQuestaoSchema = z.object({
  enunciado: z.string().max(255),
  fk_fb_categoria: z.number().int(),
});
