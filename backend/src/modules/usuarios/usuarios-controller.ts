import { Request, Response } from "express";
import { UsuariosService } from "./usuarios-service";

const usuariosService = new UsuariosService();

class UsuariosController {
  async findAll(request: Request, response: Response) {
    const usuarios = await usuariosService.findAll();
    return response.status(200).json(usuarios);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;
    const usuario = await usuariosService.findById(Number(id));
    return response.status(200).json(usuario);
  }

  async create(request: Request, response: Response) {
    const usuario = await usuariosService.create(request.body);
    return response.status(201).json(usuario);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const usuario = await usuariosService.update(Number(id), request.body);
    return response.status(200).json(usuario);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const result = await usuariosService.delete(Number(id));
    return response.status(200).json(result);
  }
}

export { UsuariosController };
