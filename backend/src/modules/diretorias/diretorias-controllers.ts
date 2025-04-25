import { Request, Response } from "express";
import { DiretoriasService } from "./diretoria-service";

const diretoriaService = new DiretoriasService();

export class DiretoriasController {
  async findAll(request: Request, response: Response) {
    const diretorias = await diretoriaService.FindAll();
    return response.status(200).json(diretorias);
  }
}
