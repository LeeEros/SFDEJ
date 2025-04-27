import z from "zod";

export const instituicaoSchema = z.object({
  faculdade: z
    .string()
    .min(3, "O nome da faculdade deve ter pelo menos 3 caracteres"),
  unidade: z.string().optional(),
  CNPJ: z.string().length(14, "O CNPJ deve ter exatamente 14 caracteres"),
  fk_endereco: z.number().int("O ID do endereço deve ser um número inteiro"),
});
