import { Request, Response } from "express";
import { EJService } from "./ej-service";

const ejService = new EJService();

export class EJController {
  async findAll(request: Request, response: Response) {
    const EJ = await ejService.findAll();
    return response.status(200).json(EJ);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;

    const ej = await ejService.findById(Number(id));
    return response.status(200).json(ej);
  }

  async create(request: Request, response: Response) {
    const ej = await ejService.create(request.body);
    return response.status(201).json(ej);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const ej = await ejService.update(Number(id), request.body);
    return response.status(200).json(ej);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const ej = await ejService.delete(Number(id));
    return response.status(200).json(ej);
  }
}
