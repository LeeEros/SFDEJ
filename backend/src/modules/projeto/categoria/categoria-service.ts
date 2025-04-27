import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { categoria } from "@prisma/client";
import { categoriaSchema } from "./categoria-schema";

export class CategoriaService {
  async findAll() {
    const categoria = await prisma.categoria.findMany({
      orderBy: { id_categoria: "asc" },
    });

    if (!categoria) {
      throw new AppError("Nenhuma categoria encontrada.", 404);
    }

    return categoria;
  }

  async findById(id: number) {
    const categoria = await prisma.categoria.findUnique({
      where: { id_categoria: id },
    });

    if (!categoria) {
      throw new AppError("Categoria não encontrada.", 404);
    }

    return categoria;
  }

  async create(data: categoria) {
    const categoria = categoriaSchema.parse(data);

    const categoriaCriada = await prisma.categoria.create({ data: categoria });

    if (!categoriaCriada) {
      throw new AppError("Não foi possível criar categoria.", 400);
    }

    return categoriaCriada;
  }

  async update(id: number, data: categoria) {
    const categoria = await this.findById(id);

    if (!categoria) {
      throw new AppError("Categoria não encontrada.", 404);
    }

    const categoriaAtualizada = await prisma.categoria.update({
      where: { id_categoria: id },
      data,
    });

    if (!categoriaAtualizada) {
      throw new AppError("Não foi possível atualizar a categoria.", 400);
    }

    return categoriaAtualizada;
  }

  async delete(id: number) {
    const categoria = await this.findById(id);

    if (!categoria) {
      throw new AppError("Categoria não encontrada.", 404);
    }

    await prisma.categoria.delete({ where: { id_categoria: id } });

    return { message: "Categoria deletada com sucesso." };
  }
}
