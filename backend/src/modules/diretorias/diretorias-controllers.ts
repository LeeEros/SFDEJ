import { Request, Response } from "express";
import { DiretoriasService } from "./diretoria-service";
import { AppError } from "@/utils/AppError";

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
}
