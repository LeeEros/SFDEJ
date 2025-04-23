import { Request, Response } from "express";
import { hash } from "bcrypt";
import z from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class UsuariosController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      nome: z.string().trim().min(5, "Nome deve ter pelo menos 5 caracteres"),
      email: z.string().email("E-mail inválido"),
      senha: z.string().min(8),
      diretor: z.boolean().optional(),
      ativo: z.boolean(),
      data_criacao: z.date().default(() => new Date()),
      data_atualizacao: z.date().optional(),
      data_desligamento: z.date().optional(),
      fk_diretoria: z.number(),
      fk_ej: z.number(),
      permissao: z.enum(["USUARIO", "ADMIN"]),
    });

    const {
      nome,
      email,
      senha,
      diretor,
      ativo,
      data_criacao,
      data_atualizacao,
      data_desligamento,
      fk_diretoria,
      fk_ej,
      permissao,
    } = bodySchema.parse(request.body);

    const usuarioEmailUsado = await prisma.usuarios.findFirst({
      where: { email },
    });

    if (usuarioEmailUsado) {
      throw new AppError("Email já utilizado ou inválido");
    }

    const hashSenha = await hash(senha, 10);

    const usuario = await prisma.usuarios.create({
      data: {
        nome,
        email,
        senha: hashSenha,
        diretor,
        ativo,
        data_criacao,
        data_atualizacao,
        data_desligamento,
        fk_diretoria,
        fk_ej,
        permissao,
      },
    });

    return response.status(201).json(usuario);
  }
}

export { UsuariosController };
