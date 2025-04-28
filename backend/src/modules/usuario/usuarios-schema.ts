import z from "zod";

export const usuarioSchema = z.object({
  nome: z.string().trim().min(5, "Nome deve ter pelo menos 5 caracteres"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().max(15, "Telefone deve ter no máximo 15 caracteres"),
  senha: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  diretor: z.boolean().optional(),
  ativo: z.boolean(),
  permissao: z.enum(["USUARIO", "ADMIN"]),
  fk_diretoria: z.number().optional(),
  fk_ej: z.number().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});
