import { authConfig } from "@/configs/auth";
import { AppError } from "@/utils/AppError";
import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface TokenPayload {
  permissao: string;
  sub: string;
}

function usuarioAutenticado(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError("JWT Token não encontrado", 401);
    }

    const [, token] = authHeader.split(" ");

    const { permissao, sub: id_usuario } = verify(
      token,
      authConfig.jwt.secret
    ) as TokenPayload;

    request.usuario = {
      id: id_usuario,
      permissao,
    };

    return next();
  } catch (error) {
    throw new AppError("JWT token inválido", 401);
  }
}
