import z from "zod";

export const projetoSchema = z.object({
  nome: z.string().min(3, "Nome deve conter no mínimo 3 letras"),
  descricao: z.string().min(3, "Descrição deve conter no mínimo 3 letras"),
  status: z.enum(["NEGOCIACAO", "DESENVOLVIMENTO", "FINALIZADO", "CANCELADO"]),
  data_assinatura: z.coerce.date().optional(),
  data_conclusao: z.coerce.date().optional(),
  valor: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .optional(),
  anexo: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "O arquivo deve ter no máximo 10MB",
    })
    .optional(),
  fk_categoria: z.number().int("ID da categoria deve ser inteiro").optional(),
  fk_cliente: z.number().int("ID da categoria deve ser inteiro").optional(),
});
