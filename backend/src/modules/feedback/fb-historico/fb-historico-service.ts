import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { feedback_historico } from "@prisma/client";
import { feedbackHistoricoSchema } from "./fb-historico-schema";

export class fbHistoricoService {
  async findAll() {
    const fb_his = await prisma.feedback_historico.findMany({
      orderBy: { id_fb_historico: "asc" },
    });

    if (!fb_his) {
      throw new AppError("Nenhum histórico encontrado.", 404);
    }

    return fb_his;
  }

  async findById(id: number) {
    const fb_his = await prisma.feedback_historico.findUnique({
      where: { id_fb_historico: id },
    });

    if (!fb_his) {
      throw new AppError("Histórico não encontrado.", 404);
    }

    return fb_his;
  }

  async create(data: feedback_historico) {
    const fb_his = feedbackHistoricoSchema.parse(data);

    const historicoCriado = await prisma.feedback_historico.create({
      data: fb_his,
    });

    if (!historicoCriado) {
      throw new AppError("Não foi possível criar histórico.", 400);
    }

    return historicoCriado;
  }

  async update(id: number, data: feedback_historico) {
    const fb_his = await this.findById(id);

    if (!fb_his) {
      throw new AppError("Histórico não encontrado.", 404);
    }

    const historicoAtualizado = await prisma.feedback_historico.update({
      where: { id_fb_historico: id },
      data,
    });

    if (!historicoAtualizado) {
      throw new AppError("Não foi possível atualizar histórico.", 400);
    }

    return historicoAtualizado;
  }

  async delete(id: number) {
    const fb_his = await this.findById(id);

    if (!fb_his) {
      throw new AppError("Histórico não encontrado.", 404);
    }

    await prisma.feedback_historico.delete({ where: { id_fb_historico: id } });

    return { message: "Histórico deletado com sucesso." };
  }
}
