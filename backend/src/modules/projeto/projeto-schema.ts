import z from "zod";

export const projetoSchema = z.object({
  nome: z.string().min(3, "Nome deve conter no mínimo 3 letras"),
  descricao: z.string().min(3, "Descrição deve conter no mínimo 3 letras"),
  status: z.enum(["NEGOCIACAO", "EM_ANDAMENTO", "FINALIZADO", "CANCELADO"]),
  data_assinatura: z
    .string()
    .transform((data) => new Date(data))
    .optional(),
  data_conclusao: z.date().optional(),
  valor: z.number(),
  anexo: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "O arquivo deve ter no máximo 10MB",
    })
    .optional(),
  fk_categoria: z.number().int("ID da categoria deve ser inteiro"),
  fk_cliente: z.number().int("ID da categoria deve ser inteiro").optional(),
});
