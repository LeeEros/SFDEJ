import { Request, Response } from "express";
import { EnderecoService } from "./endereco-service";

const enderecoService = new EnderecoService();

export class EnderecoController {
  async findAll(request: Request, response: Response) {
    const endereco = await enderecoService.findAll();
    return response.status(200).json(endereco);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;

    const endereco = await enderecoService.findById(Number(id));
    return response.status(200).json(endereco);
  }

  async create(request: Request, response: Response) {
    const endereco = await enderecoService.create(request.body);
    return response.status(201).json(endereco);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const endereco = await enderecoService.update(Number(id), request.body);
    return response.status(200).json(endereco);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const endereco = await enderecoService.delete(Number(id));
    return response.status(200).json(endereco);
  }
}
