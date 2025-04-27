import { Request, Response } from "express";
import { DiretoriasService } from "./diretoria-service";

const diretoriaService = new DiretoriasService();

export class DiretoriasController {
  async findAll(request: Request, response: Response) {
    const diretorias = await diretoriaService.findAll();
    return response.status(200).json(diretorias);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;

    const diretoria = await diretoriaService.findById(Number(id));
    return response.status(200).json(diretoria);
  }

  async create(request: Request, response: Response) {
    const diretoria = await diretoriaService.create(request.body);
    return response.status(201).json(diretoria);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const diretoria = await diretoriaService.update(Number(id), request.body);
    return response.status(200).json(diretoria);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const diretoria = await diretoriaService.delete(Number(id));
    return response.status(200).json(diretoria);
  }
}
