import { Request, Response } from "express";
import { CategoriaService } from "./categoria-service";

const categoriaService = new CategoriaService();

export class CategoriaController {
  async findAll(request: Request, response: Response) {
    const categoria = await categoriaService.findAll();
    return response.status(200).json(categoria);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;

    const categoria = await categoriaService.findById(Number(id));
    return response.status(200).json(categoria);
  }

  async create(request: Request, response: Response) {
    const categoria = await categoriaService.create(request.body);
    return response.status(201).json(categoria);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const categoria = await categoriaService.update(Number(id), request.body);
    return response.status(200).json(categoria);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const categoria = await categoriaService.delete(Number(id));
    return response.status(200).json(categoria);
  }
}
