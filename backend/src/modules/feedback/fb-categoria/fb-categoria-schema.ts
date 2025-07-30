import z from "zod";

export const feedbackCategoriaSchema = z.object({
  categoria: z.string().max(255),
  descricao_categoria: z.string(),
  perfil: z.enum(["hard_skills", "soft_skills"]),
});
