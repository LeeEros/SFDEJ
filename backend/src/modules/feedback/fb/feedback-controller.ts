import { Request, Response } from "express";
import { FeedbackService } from "./feedback-service";

const fbService = new FeedbackService();

export class FeedbackController {
  async findAll(request: Request, response: Response) {
    const fb = await fbService.findAll();
    return response.status(200).json(fb);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;

    const fb = await fbService.findById(Number(id));
    return response.status(200).json(fb);
  }

  async create(request: Request, response: Response) {
    const fb = await fbService.create(request.body);
    return response.status(201).json(fb);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const fb = await fbService.update(Number(id), request.body);
    return response.status(200).json(fb);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const fb = await fbService.delete(Number(id));
    return response.status(200).json(fb);
  }
}
