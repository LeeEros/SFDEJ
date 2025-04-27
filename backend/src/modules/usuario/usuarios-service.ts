import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { hashSenha } from "@/utils/hash";

import { usuarios } from "@prisma/client";
import { usuarioSchema } from "./usuarios-schema";

export class UsuariosService {
  async findAll() {
    const usuarios = await prisma.usuarios.findMany({
      where: { ativo: true },
      orderBy: { id_usuario: "asc" },
    });
    const usuariosSemSenha = usuarios.map(({ senha, ...corpo }) => corpo);
    return usuariosSemSenha;
  }

  async findAllDesativados() {
    const usuarioDesativados = await prisma.usuarios.findMany({
      where: { ativo: false },
      orderBy: { id_usuario: "asc" },
    });
    const usuariosSemSenha = usuarioDesativados.map(
      ({ senha, ...corpo }) => corpo
    );
    return usuariosSemSenha;
  }

  async findById(id: number) {
    const usuario = await prisma.usuarios.findUnique({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    const { senha, ...usuariosSemSenha } = usuario;
    return usuariosSemSenha;
  }

  async create(data: usuarios) {
    const usuario = usuarioSchema.parse(data);

    const usuarioEmailUsado = await prisma.usuarios.findFirst({
      where: { email: usuario.email },
    });

    if (usuarioEmailUsado) {
      throw new AppError("Email já utilizado ou inválido");
    }

    const hashSenhaUsuario = await hashSenha(usuario.senha);

    const usuarioCriado = await prisma.usuarios.create({
      data: {
        ...usuario,
        senha: hashSenhaUsuario,
      },
    });

    const { senha, ...usuarioSemSenha } = usuarioCriado;
    return usuarioSemSenha;
  }

  async update(id: number, data: usuarios) {
    const dadoValidado = usuarioSchema.partial().parse(data);

    const usuario = await prisma.usuarios.findUnique({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    if (dadoValidado.email) {
      const usuarioEmailUsado = await prisma.usuarios.findFirst({
        where: { email: dadoValidado.email, id_usuario: { not: id } },
      });

      if (usuarioEmailUsado) {
        throw new AppError("Email já utilizado ou inválido");
      }
    }

    let updatedData = { ...dadoValidado };
    if (dadoValidado.senha) {
      updatedData.senha = await hashSenha(dadoValidado.senha);
    }

    const usuarioAtualizado = await prisma.usuarios.update({
      where: { id_usuario: id },
      data: updatedData,
    });

    const { senha, ...usuarioSemSenha } = usuarioAtualizado;
    return usuarioSemSenha;
  }

  async delete(id: number) {
    const usuario = await prisma.usuarios.findUnique({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    await prisma.usuarios.update({
      where: { id_usuario: id },
      data: {
        ativo: false,
        data_desligamento: new Date(),
      },
    });

    return { message: "Usuário desativado com sucesso" };
  }
}
