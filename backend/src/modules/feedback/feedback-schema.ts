import z from "zod";

export const feedbackSchema = z.object({
  resultado_media: z.number(),
  tipo_avaliador: z.enum(["EXTERNO", "INTERNO"]),
  fk_usuario_avaliado: z.number(),
});
