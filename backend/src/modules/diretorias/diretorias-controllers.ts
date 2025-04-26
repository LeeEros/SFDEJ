import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { DiretoriasService } from "./diretoria-service";

const diretoriaService = new DiretoriasService();

export class DiretoriasController {
  async findAll(request: Request, response: Response) {
    try {
      const diretorias = await diretoriaService.FindAll();
      return response.status(200).json(diretorias);
    } catch (error) {
      if (error instanceof AppError) {
        return response
          .status(error.statusCode)
          .json({ message: error.message });
      }
      return response.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;
    try {
      const diretoria = await diretoriaService.findById(Number(id));
      return response.status(200).json(diretoria);
    } catch (error) {
      if (error instanceof AppError) {
        return response
          .status(error.statusCode)
          .json({ message: error.message });
      }
      return response.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async create(request: Request, response: Response) {
    try {
      const diretoria = await diretoriaService.create(request.body);
      return response.status(201).json(diretoria);
    } catch (error) {
      if (error instanceof AppError) {
        return response
          .status(error.statusCode)
          .json({ message: "Erro interno do servidor" + error });
      }
    }
  }

  async update(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const diretoria = await diretoriaService.update(Number(id), request.body);
      return response.status(200).json(diretoria);
    } catch (error) {
      if (error instanceof AppError) {
        return response
          .status(error.statusCode)
          .json({ message: "Erro interno do servidor" + error });
      }
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const diretoria = await diretoriaService.delete(Number(id));
    return response.status(200).json(diretoria);
  }
}
