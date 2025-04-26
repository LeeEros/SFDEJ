import { prisma } from "@/database/prisma";
import { diretoriaSchema } from "./diretorias-schema";
import { AppError } from "@/utils/AppError";
import { diretoria } from "@prisma/client";

export class DiretoriasService {
  async FindAll() {
    const diretorias = await prisma.diretoria.findMany({
      orderBy: { id_diretoria: "asc" },
    });

    if (!diretorias) {
      throw new AppError("Nenhuma diretoria encontrada", 404);
    }

    return diretorias;
  }

  async findById(id: number) {
    const diretoria = await prisma.diretoria.findUnique({
      where: { id_diretoria: id },
    });

    if (!diretoria) {
      throw new AppError("Diretoria não encontrada", 404);
    }

    return diretoria;
  }

  async create(data: diretoria) {
    const diretoria = diretoriaSchema.parse(data);

    if (!diretoria) {
      throw new AppError("Diretoria inválida", 400);
    }

    const diretoriaCriada = await prisma.diretoria.create({
      data: diretoria,
    });

    return diretoriaCriada;
  }

  async update(id: number, data: diretoria) {
    const diretoria = await this.findById(id);

    if (!diretoria) {
      throw new AppError("Diretoria não encontrada", 404);
    }

    const diretoriaAtualizada = await prisma.diretoria.update({
      where: { id_diretoria: id },
      data,
    });

    return diretoriaAtualizada;
  }

  async delete(id: number) {
    const diretoria = await prisma.diretoria.findUnique({
      where: { id_diretoria: id },
    });

    if (!diretoria) {
      throw new AppError("Diretoria não encontrada", 404);
    }

    await prisma.diretoria.delete({
      where: { id_diretoria: id },
    });

    return { message: "Diretoria deletada com sucesso" };
  }
}
