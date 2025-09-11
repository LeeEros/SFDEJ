import { Request, Response } from "express";
import { fbRespostaService } from "./fb-resposta-service";

const fb_avaliacao = new fbRespostaService();

export class FbRespostaController {
  async createPublic(req: Request, res: Response) {
    const { token } = req.params;
    const resultado = await fb_avaliacao.createPublic(token, req.body);
    return res.status(201).json(resultado);
  }
}
