import { Request, Response } from "express";
import { FederacaoService } from "./federacao-service";

const federacaoService = new FederacaoService();

export class FederacaoController {
  async findAll(request: Request, response: Response) {
    const federacao = await federacaoService.findAll();
    return response.status(200).json(federacao);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;

    const federacao = await federacaoService.findById(Number(id));
    return response.status(200).json(federacao);
  }

  async create(request: Request, response: Response) {
    const federacao = await federacaoService.create(request.body);
    return response.status(201).json(federacao);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const federacao = await federacaoService.update(Number(id), request.body);
    return response.status(200).json(federacao);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const federacao = await federacaoService.delete(Number(id));
    return response.status(200).json(federacao);
  }
}
