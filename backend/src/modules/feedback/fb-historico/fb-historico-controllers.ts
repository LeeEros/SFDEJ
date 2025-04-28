import { Request, Response } from "express";
import { fbHistoricoService } from "./fb-historico-service";

const fbHisService = new fbHistoricoService();

export class FbHistoricoController {
  async findAll(request: Request, response: Response) {
    const fb = await fbHisService.findAll();
    return response.status(200).json(fb);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;

    const fb = await fbHisService.findById(Number(id));
    return response.status(201).json(fb);
  }

  async create(request: Request, response: Response) {
    const fb = await fbHisService.create(request.body);
    return response.status(201).json(fb);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const fb = await fbHisService.update(Number(id), request.body);
    return response.status(200).json(fb);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const fb = await fbHisService.delete(Number(id));
    return response.status(200).json(fb);
  }
}
