import z, { optional } from "zod";

export const categoriaSchema = z.object({
  categoria: z.string().min(3, "Categoria deve conter no mínimo 3 letras"),
  complexidade: z.enum(["N1", "N2", "N3", "N4", "N5"]),
  comentario_complexidade: z.string().optional(),
});
