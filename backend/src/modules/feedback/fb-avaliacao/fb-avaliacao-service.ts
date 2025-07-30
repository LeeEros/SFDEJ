import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { feedbackAvaliacaoSchema } from "./fb-avaliacao-schema";
import { feedback_avaliacao } from "@prisma/client";

export class fbHistoricoService {
  async findAll() {
    const fb_avaliacao = await prisma.feedback_avaliacao.findMany({
      orderBy: { id_avaliacao: "asc" },
    });

    if (!fb_avaliacao) {
      throw new AppError("Nenhum histórico encontrado.", 404);
    }

    return fb_avaliacao;
  }

  async findById(id: number) {
    const fb_avaliacao = await prisma.feedback_avaliacao.findUnique({
      where: { id_avaliacao: id },
    });

    if (!fb_avaliacao) {
      throw new AppError("Avaliação não encontrada.", 404);
    }

    return fb_avaliacao;
  }

  async create(data: feedback_avaliacao) {
    const fb_avaliacao = feedbackAvaliacaoSchema.parse(data);

    const avaliacaoCriada = await prisma.feedback_avaliacao.create({
      data: fb_avaliacao,
    });

    if (!avaliacaoCriada) {
      throw new AppError("Não foi possível criar avaliação.", 400);
    }

    return avaliacaoCriada;
  }

  async update(id: number, data: feedback_avaliacao) {
    const fb_avaliacao = await this.findById(id);

    if (!fb_avaliacao) {
      throw new AppError("Avaliação não encontrado.", 404);
    }

    const historicoAtualizado = await prisma.feedback_avaliacao.update({
      where: { id_avaliacao: id },
      data,
    });

    if (!historicoAtualizado) {
      throw new AppError("Não foi possível atualizar avaliação.", 400);
    }

    return historicoAtualizado;
  }

  async delete(id: number) {
    const fb_avalicao = await this.findById(id);

    if (!fb_avalicao) {
      throw new AppError("Avaliação não encontrado.", 404);
    }

    await prisma.feedback_avaliacao.delete({ where: { id_avaliacao: id } });

    return { message: "Avaliação deletada com sucesso." };
  }
}
