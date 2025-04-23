import { Request, Response } from "express";

class UsuariosController {
  create(request: Request, response: Response) {
    return response.json({ message: "ok" });
  }
}

export { UsuariosController };
