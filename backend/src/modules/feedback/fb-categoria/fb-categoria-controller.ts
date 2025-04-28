import { Request, Response } from "express";
import { FbCategoriaService } from "./fb-categoria-service";

const fbCategoriaService = new FbCategoriaService();

export class FbCategoriaController {
  async findAll(request: Request, response: Response) {
    const fb_categ = await fbCategoriaService.findAll();
    return response.status(200).json(fb_categ);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;
    const fb_categ = await fbCategoriaService.findById(Number(id));
    return response.status(200).json(fb_categ);
  }

  async create(request: Request, response: Response) {
    const fb_categ = await fbCategoriaService.create(request.body);
    return response.status(201).json(fb_categ);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const fb_categ = await fbCategoriaService.update(Number(id), request.body);
    return response.status(200).json(fb_categ);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const fb_categ = await fbCategoriaService.delete(Number(id));
    return response.status(200).json(fb_categ);
  }
}
