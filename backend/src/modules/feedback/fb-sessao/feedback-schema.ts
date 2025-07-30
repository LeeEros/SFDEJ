import z from "zod";

export const feedbackSessaoSchema = z.object({
  data_criacao: z.date().default(() => new Date()),
  data_atualizacao: z.date().optional(),
  link_forms: z.string().url().optional(),
  fk_fb_categoria: z.number().optional(),
  fk_projeto: z.number().optional(),
});
