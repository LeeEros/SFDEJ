import z from "zod";

export const usuarioSchema = z.object({
  nome: z.string().trim().min(5, "Nome deve ter pelo menos 5 caracteres"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  diretor: z.boolean().optional(),
  ativo: z.boolean(),
  fk_diretoria: z.number(),
  fk_ej: z.number(),
  permissao: z.enum(["USUARIO", "ADMIN"]),
});
