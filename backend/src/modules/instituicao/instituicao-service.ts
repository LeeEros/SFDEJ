import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { ej, instituicao } from "@prisma/client";
import { instituicaoSchema } from "./instituicao-schema";

export class InstituicaoService {
  async findAll() {
    const inst = await prisma.instituicao.findMany({
      orderBy: { id_instituicao: "asc" },
    });

    if (!inst) {
      throw new AppError("Nenhuma instituição encontrada.", 404);
    }

    return inst;
  }

  async findById(id: number) {
    const inst = await prisma.instituicao.findUnique({
      where: { id_instituicao: id },
    });

    if (!inst) {
      throw new AppError("Instituição não encontrada.", 404);
    }

    return inst;
  }

  async create(data: instituicao) {
    const inst = instituicaoSchema.parse(data);

    const instCriada = await prisma.instituicao.create({ data: inst });

    if (!instCriada) {
      throw new AppError("Não foi possível criar instituição.", 404);
    }

    return instCriada;
  }

  async update(id: number, data: instituicao) {
    const inst = await this.findById(id);

    if (!inst) {
      throw new AppError("instituição não encontrada.", 404);
    }

    const instAtualizada = await prisma.instituicao.update({
      where: { id_instituicao: id },
      data,
    });

    if (!instAtualizada) {
      throw new AppError("Não foi possível atualizar a EJ.", 400);
    }

    return instAtualizada;
  }

  async delete(id: number) {
    const inst = await this.findById(id);

    if (!inst) {
      throw new AppError("Instituição não encontrada.", 404);
    }

    await prisma.instituicao.delete({ where: { id_instituicao: id } });

    return { message: "Instituição deletada com sucesso." };
  }
}
