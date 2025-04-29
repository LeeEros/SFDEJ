import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";

function verificarPermissao(permissao: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.usuario) {
      throw new AppError("Não autorizado", 401);
    }

    if (!permissao.includes(request.usuario.permissao)) {
      throw new AppError("Não autorizado", 401);
    }

    return next();
  };
}

export { verificarPermissao };
