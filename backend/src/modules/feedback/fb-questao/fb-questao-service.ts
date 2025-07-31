import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { feedback_questao } from "@prisma/client";
import { feedbackQuestaoSchema } from "./fb-questao.schema";

export class FbQuestaoService {
  async findAll() {
    const fb_questao = await prisma.feedback_questao.findMany({
      orderBy: { id_questao: "asc" },
    });

    if (!fb_questao) {
      throw new AppError("Nenhuma questão encontrada.", 404);
    }

    return fb_questao;
  }

  async findById(id: number) {
    const fb_questao = await prisma.feedback_questao.findUnique({
      where: { id_questao: id },
    });

    if (!fb_questao) {
      throw new AppError("Questão não encontrada.", 404);
    }

    return fb_questao;
  }

  async create(data: feedback_questao) {
    const fb_questao = feedbackQuestaoSchema.parse(data);

    const questaoCriada = await prisma.feedback_questao.create({
      data: fb_questao,
    });

    if (!questaoCriada) {
      throw new AppError("Não foi possível criar questão.", 400);
    }

    return questaoCriada;
  }

  async update(id: number, data: feedback_questao) {
    const fb_questao = await this.findById(id);

    if (!fb_questao) {
      throw new AppError("EJ não encontrada.", 404);
    }

    const questaoAtualizada = await prisma.feedback_questao.update({
      where: { id_questao: id },
      data,
    });

    if (!questaoAtualizada) {
      throw new AppError("Não foi possível atualizar a questão.", 400);
    }

    return questaoAtualizada;
  }

  async delete(id: number) {
    const fb_questao = await this.findById(id);

    if (!fb_questao) {
      throw new AppError("Questão não encontrada.", 404);
    }

    await prisma.feedback_questao.delete({ where: { id_questao: id } });

    return { message: "ej deletada com sucesso." };
  }
}
