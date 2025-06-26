import z, { number } from "zod";

export const clienteSchema = z.object({
  nome: z.string().min(5, "Nome deve ter pelo menos 5 letras"),
  CNPJ: z.string().length(14, "CNPJ deve ter 14 caracteres").optional(),
  CPF: z.string().length(14, "CNPJ deve ter 14 caracteres").optional(),
  email: z.string().email("Email inválido").optional(),
  telefone: z
    .string()
    .max(15, "Telfone deve ter no máximo 15 caracteres")
    .optional(),
  fk_endereco: number().optional(),
});
