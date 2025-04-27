import z from "zod";

export const ejSchema = z.object({
  nome: z.string().min(3, "O nome da EJ deve ter pelo menos 3 caracteres"),
  CNPJ: z
    .string()
    .length(14, "O CNPJ deve ter exatamente 14 caracteres")
    .regex(/^\d+$/, "O CNPJ deve conter apenas números"),
  fk_endereco: z.number().int("O ID do endereço deve ser um número inteiro"),
  fk_federacao: z.number().int("O ID da federação deve ser um número inteiro"),
  fk_instituicao: z
    .number()
    .int("O ID da instituição deve ser um número inteiro"),
});
