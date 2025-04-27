import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { ej } from "@prisma/client";
import { ejSchema } from "./ej-schema";

export class EJService {
  async findAll() {
    const EJ = await prisma.ej.findMany({
      orderBy: { id_ej: "asc" },
    });

    if (!EJ) {
      throw new AppError("Nenhuma EJ encontrada", 404);
    }

    return EJ;
  }

  async findById(id: number) {
    const EJ = await prisma.ej.findUnique({ where: { id_ej: id } });

    if (!EJ) {
      throw new AppError("EJ não encontrada", 404);
    }

    return EJ;
  }

  async create(data: ej) {
    const ej = ejSchema.parse(data);

    if (!ej) {
      throw new AppError("Não foi possível criar EJ", 404);
    }

    const ejCriada = await prisma.ej.create({ data: ej });

    return ejCriada;
  }

  async update(id: number, data: ej) {
    const ej = await this.findById(id);

    if (!ej) {
      throw new AppError("EJ não encontrada", 404);
    }

    const ejAtualizada = await prisma.ej.update({
      where: { id_ej: id },
      data,
    });

    if (!ejAtualizada) {
      throw new AppError("Não foi possível atualizar a EJ", 400);
    }

    return ejAtualizada;
  }

  async delete(id: number) {
    const ej = await this.findById(id);

    if (!ej) {
      throw new AppError("EJ não encontrada", 404);
    }

    await prisma.ej.delete({ where: { id_ej: id } });

    return { message: "ej deletada com sucesso" };
  }
}
