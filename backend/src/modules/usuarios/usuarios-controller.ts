import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { usuarioSchema } from "./usuarios-schema";
import { hashSenha } from "@/utils/mock/hash";

class UsuariosController {
  async findAll(request: Request, response: Response) {
    const usuarios = await prisma.usuarios.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
    });

    return response.status(200).json(usuarios);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;

    const usuario = await prisma.usuarios.findUnique({
      where: { id_usuario: Number(id) },
    });

    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    return response.status(200).json(usuario);
  }

  async create(request: Request, response: Response) {
    const data = usuarioSchema.parse(request.body);

    const usuarioEmailUsado = await prisma.usuarios.findFirst({
      where: { email: data.email },
    });

    if (usuarioEmailUsado) {
      throw new AppError("Email já utilizado ou inválido");
    }

    const hashSenhaUsuario = await hashSenha(data.senha);

    const usuario = await prisma.usuarios.create({
      data: {
        ...data,
        senha: hashSenhaUsuario,
      },
    });

    const { senha, ...usuarioSemSenha } = usuario;

    return response.status(201).json(usuarioSemSenha);
  }
}

export { UsuariosController };
