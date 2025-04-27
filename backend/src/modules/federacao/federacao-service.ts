import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { federacao } from "@prisma/client";
import { federacaoSchema } from "./federacao-schema";

export class FederacaoService {
  async findAll() {
    const federacao = await prisma.federacao.findMany({
      orderBy: { id_federacao: "asc" },
    });

    if (!federacao) {
      throw new AppError("Nenhuma federação encontrada.", 404);
    }

    return federacao;
  }

  async findById(id: number) {
    const federacao = await prisma.federacao.findUnique({
      where: { id_federacao: id },
    });

    if (!federacao) {
      throw new AppError("Federação não encontrada.", 404);
    }

    return federacao;
  }

  async create(data: federacao) {
    const federacao = federacaoSchema.parse(data);

    const federacaoCriada = await prisma.federacao.create({ data: federacao });

    if (!federacaoCriada) {
      throw new AppError("Não foi possível criar federação.", 404);
    }

    return federacaoCriada;
  }

  async update(id: number, data: federacao) {
    const federacao = await this.findById(id);

    if (!federacao) {
      throw new AppError("Federação não encontrada.", 404);
    }

    const federacaoAtualizada = await prisma.federacao.update({
      where: { id_federacao: id },
      data,
    });

    if (!federacaoAtualizada) {
      throw new AppError("Não foi possível atualizar a federação.", 400);
    }

    return federacaoAtualizada;
  }

  async delete(id: number) {
    const federacao = await this.findById(id);

    if (!federacao) {
      throw new AppError("Federação não encontrada.", 404);
    }

    await prisma.federacao.delete({ where: { id_federacao: id } });

    return { message: "Federação deletada com sucesso." };
  }
}
