import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { compare } from "bcrypt";
import { Request, Response } from "express";
import { authConfig } from "@/configs/auth";
import { sign } from "jsonwebtoken";
import { loginSchema } from "../usuario/usuarios-schema";

class SessaoController {
  async findUsuario(request: Request, response: Response) {
    const { email, senha } = loginSchema.parse(request.body);

    const usuario = await prisma.usuarios.findFirst({
      where: { email },
    });

    if (!usuario) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const verificaSenha = await compare(senha, usuario.senha);

    if (!verificaSenha) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ permissao: usuario.permissao ?? "USUARIO" }, secret, {
      subject: String(usuario.id_usuario),
      expiresIn,
    });

    return response.json({ token });
  }
}

export { SessaoController };
