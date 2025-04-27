import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { feedback } from "@prisma/client";
import { feedbackSchema } from "./feedback-schema";

export class FeedbackService {
  async findAll() {
    const fb = await prisma.feedback.findMany({
      orderBy: { id_feedback: "asc" },
    });

    if (!fb) {
      throw new AppError("Nenhum feedback encontrado.", 404);
    }

    return fb;
  }

  async findById(id: number) {
    const fb = await prisma.feedback.findUnique({ where: { id_feedback: id } });

    if (!fb) {
      throw new AppError("Feedback não encontrado.", 404);
    }

    return fb;
  }

  async create(data: feedback) {
    const fb = feedbackSchema.parse(data);

    const fbCriada = await prisma.feedback.create({ data: fb });

    if (!fbCriada) {
      throw new AppError("Não foi possível criar feedback.", 400);
    }

    return fbCriada;
  }

  async update(id: number, data: feedback) {
    const fb = await this.findById(id);

    if (!fb) {
      throw new AppError("EJ não encontrada.", 404);
    }

    const fbAtualizado = await prisma.feedback.update({
      where: { id_feedback: id },
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

    await prisma.feedback.delete({ where: { id_feedback: id } });

    return { message: "feedback deletado com sucesso." };
  }
}
