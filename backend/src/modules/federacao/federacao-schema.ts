import z from "zod";

export const federacaoSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  nivel: z.enum(["REGIONAL", "ESTADUAL", "NACIONAL", "INTERNACIONAL"]),
});
