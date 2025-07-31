import { Request, Response } from "express";
import { FbQuestaoService } from "./fb-questao-service";

const fbQuestaoService = new FbQuestaoService();

export class FbQuestaoController {
  async findAll(request: Request, response: Response) {
    const fb_questao = await fbQuestaoService.findAll();
    return response.status(200).json(fb_questao);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;

    const fb_questao = await fbQuestaoService.findById(Number(id));
    return response.status(200).json(fb_questao);
  }

  async create(request: Request, response: Response) {
    const fb_questao = await fbQuestaoService.create(request.body);
    return response.status(201).json(fb_questao);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const fb_questao = await fbQuestaoService.update(Number(id), request.body);
    return response.status(200).json(fb_questao);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const fb_questao = await fbQuestaoService.delete(Number(id));
    return response.status(200).json(fb_questao);
  }
}
