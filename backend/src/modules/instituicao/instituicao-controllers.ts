import { Request, Response } from "express";
import { InstituicaoService } from "./instituicao-service";

const instituicaoService = new InstituicaoService();

export class InstituicaoController {
  async findAll(request: Request, response: Response) {
    const inst = await instituicaoService.findAll();
    return response.status(200).json(inst);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;

    const inst = await instituicaoService.findById(Number(id));
    return response.status(201).json(inst);
  }

  async create(request: Request, response: Response) {
    const inst = await instituicaoService.create(request.body);
    return response.status(201).json(inst);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const inst = await instituicaoService.update(Number(id), request.body);
    return response.status(200).json(inst);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const inst = await instituicaoService.delete(Number(id));
    return response.status(200).json(inst);
  }
}
