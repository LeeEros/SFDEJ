import z from "zod";

export const diretoriaSchema = z.object({
  diretoria: z.string().min(3, "Diretoria deve ter no mínimo 3 letras"),
});
