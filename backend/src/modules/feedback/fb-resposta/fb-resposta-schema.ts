import { z } from "zod";

const respostaSchema = z.object({
  fk_fb_questao: z.number().int().positive(),
  nota: z.number().int().min(1).max(10),
  comentario: z.string().max(1000).optional(),
});

export const POST_RESPOSTA_SCHEMA = z.object({
  respostas: z
    .array(respostaSchema)
    .min(1, "É necessário fornecer ao menos uma resposta."),
});
