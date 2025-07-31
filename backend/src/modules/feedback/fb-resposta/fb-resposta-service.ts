import { prisma } from "@/database/prisma";

export class fbRespostaService {
  async findAll() {
    const fb_resposta = await prisma.feedback_resposta.findMany({
      orderBy: { id_resposta: "asc" },
    });

    if (!fb_resposta) {
      throw new Error("Nenhuma resposta encontrada. ");
    }

    return fb_resposta;
  }

  async findById(id: number) {
    const fb_resposta = await prisma.feedback_resposta.findUnique({
      where: { id_resposta: id },
    });

    if (!fb_resposta) {
      throw new Error("Resposta não encontrada.");
    }

    return fb_resposta;
  }

  async create(data: any) {
    const fb_resposta = data;

    const respostaCriada = await prisma.feedback_resposta.create({
      data: fb_resposta,
    });

    if (!respostaCriada) {
      throw new Error("Não foi possível criar resposta.");
    }

    return respostaCriada;
  }

  async update(id: number, data: any) {
    const fb_resposta = await this.findById(id);

    if (!fb_resposta) {
      throw new Error("Resposta não encontrada.");
    }

    const respostaAtualizada = await prisma.feedback_resposta.update({
      where: { id_resposta: id },
      data,
    });

    if (!respostaAtualizada) {
      throw new Error("Não foi possível atualizar a resposta.");
    }

    return respostaAtualizada;
  }

  async delete(id: number) {
    const fb_resposta = await this.findById(id);

    if (!fb_resposta) {
      throw new Error("Resposta não encontrada.");
    }

    const respostaDeletada = await prisma.feedback_resposta.delete({
      where: { id_resposta: id },
    });

    if (!respostaDeletada) {
      throw new Error("Não foi possível deletar a resposta.");
    }

    return { message: "Resposta deletada com sucesso." };
  }
}
