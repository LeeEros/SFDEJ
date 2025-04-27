import { Request, Response } from "express";
import { ProjetoService } from "./projeto-service";

const projetoService = new ProjetoService();

export class ProjetoController {
  async findAll(request: Request, response: Response) {
    const projeto = await projetoService.findAll();
    return response.status(200).json(projeto);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;

    const projeto = await projetoService.findById(Number(id));
    return response.status(201).json(projeto);
  }

  async create(request: Request, response: Response) {
    const ej = await projetoService.create(request.body);
    return response.status(201).json(ej);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const projeto = await projetoService.update(Number(id), request.body);
    return response.status(200).json(projeto);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const projeto = await projetoService.delete(Number(id));
    return response.status(200).json(projeto);
  }
}
