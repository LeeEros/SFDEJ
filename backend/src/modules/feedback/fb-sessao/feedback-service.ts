import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { feedbackSessaoSchema } from "./feedback-schema";
import { feedback_sessao } from "@prisma/client";

export class FeedbackService {
  async findAll() {
    const fb = await prisma.feedback_sessao.findMany({
      orderBy: { id_sessao: "asc" },
    });

    if (!fb) {
      throw new AppError("Nenhum feedback encontrado.", 404);
    }

    return fb;
  }

  async findById(id: number) {
    const fb = await prisma.feedback_sessao.findUnique({
      where: { id_sessao: id },
    });

    if (!fb) {
      throw new AppError("Feedback não encontrado.", 404);
    }

    return fb;
  }

  async create(data: feedback_sessao) {
    const fb = feedbackSessaoSchema.parse(data);

    const fbCriada = await prisma.feedback_sessao.create({ data: fb });

    if (!fbCriada) {
      throw new AppError("Não foi possível criar feedback.", 400);
    }

    return fbCriada;
  }

  async update(id: number, data: feedback_sessao) {
    const fb = await this.findById(id);

    if (!fb) {
      throw new AppError("Feedback não encontrado.", 404);
    }

    const fbAtualizado = await prisma.feedback_sessao.update({
      where: { id_sessao: id },
      data,
    });

    if (!fbAtualizado) {
      throw new AppError("Não foi possível atualizar o feedback.", 400);
    }

    return fbAtualizado;
  }

  async delete(id: number) {
    const fb = await this.findById(id);

    if (!fb) {
      throw new AppError("feedback não encontrado.", 404);
    }

    await prisma.feedback_sessao.delete({ where: { id_sessao: id } });

    return { message: "feedback deletado com sucesso." };
  }
}
