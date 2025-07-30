import z from "zod";

export const feedbackAvaliacaoSchema = z.object({
  fk_fb_sessao: z.number().int(),
  fk_usuario: z.number().int(),
});
