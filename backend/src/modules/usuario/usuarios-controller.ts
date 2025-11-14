import { Request, Response } from "express";
import { UsuariosService } from "./usuarios-service";

const usuariosService = new UsuariosService();

export class UsuariosController {
  async findAll(request: Request, response: Response) {
    const usuarios = await usuariosService.findAll();
    return response.status(200).json(usuarios);
  }

  async findAllDisabled(request: Request, response: Response) {
    const usuarios = await usuariosService.findAllDisabled();
    return response.status(200).json(usuarios);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;
    const usuario = await usuariosService.findById(Number(id));
    return response.status(200).json(usuario);
  }

  async create(request: Request, response: Response) {
    const usuarioAutenticado = request.usuario;
    const usuario = await usuariosService.create(
      request.body,
      usuarioAutenticado
    );
    return response.status(201).json(usuario);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const usuario = await usuariosService.update(Number(id), request.body);
    return response.status(200).json(usuario);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const usuario = await usuariosService.delete(Number(id));
    return response.status(200).json(usuario);
  }

  async getFeedbackReport(req: Request, res: Response) {
    const { id_usuario } = req.params;
    const resultado = await usuariosService.getFeedbackReport(
      Number(id_usuario)
    );
    return res.status(200).json(resultado);
  }

  async getRadarChartData(req: Request, res: Response) {
    const { id_usuario } = req.params;
    const resultado = await usuariosService.getRadarChartData(
      Number(id_usuario)
    );
    return res.status(200).json(resultado);
  }
}
