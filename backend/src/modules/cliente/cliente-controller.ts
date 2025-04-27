import { Request, Response } from "express";
import { ClienteService } from "./cliente-service";

const clienteService = new ClienteService();

export class ClienteController {
  async findAll(request: Request, response: Response) {
    const cliente = await clienteService.findAll();
    return response.status(200).json(cliente);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;

    const cliente = await clienteService.findById(Number(id));
    return response.status(201).json(cliente);
  }

  async create(request: Request, response: Response) {
    const cliente = await clienteService.create(request.body);
    return response.status(201).json(cliente);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const cliente = await clienteService.update(Number(id), request.body);
    return response.status(200).json(cliente);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const cliente = await clienteService.delete(Number(id));
    return response.status(200).json(cliente);
  }
}
