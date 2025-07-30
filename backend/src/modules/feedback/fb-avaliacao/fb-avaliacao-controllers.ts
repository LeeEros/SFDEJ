import { Request, Response } from "express";
import { fbHistoricoService } from "./fb-avaliacao-service";

const fb_avaliacao = new fbHistoricoService();

export class FbHistoricoController {
  async findAll(request: Request, response: Response) {
    const fb = await fb_avaliacao.findAll();
    return response.status(200).json(fb);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;

    const fb = await fb_avaliacao.findById(Number(id));
    return response.status(200).json(fb);
  }

  async create(request: Request, response: Response) {
    const fb = await fb_avaliacao.create(request.body);
    return response.status(201).json(fb);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const fb = await fb_avaliacao.update(Number(id), request.body);
    return response.status(200).json(fb);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const fb = await fb_avaliacao.delete(Number(id));
    return response.status(200).json(fb);
  }
}
