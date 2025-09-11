import z from "zod";

export const feedbackSessaoSchema = z.object({
  data_atualizacao: z.date().optional(),
  data_fim: z.coerce.date().optional(),
  fk_fb_categoria: z.number().int().positive().optional(),
  fk_projeto: z.number().int().positive().optional(),
  avaliados: z
    .array(z.number().int().positive())
    .min(1, "É necessário selecionar pelo menos um usuário para ser avaliado."),
});
