import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { feedback_categoria } from "@prisma/client";
import { feedbackCategoriaSchema } from "./fb-categoria-schema";

export class FbCategoriaService {
  async findAll() {
    const fb_categ = await prisma.feedback_categoria.findMany({
      orderBy: { id_fb_categoria: "asc" },
    });

    if (!fb_categ) {
      throw new AppError("Nenhuma categoria encontrada.", 404);
    }

    return fb_categ;
  }

  async findById(id: number) {
    const fb_categ = await prisma.feedback_categoria.findUnique({
      where: { id_fb_categoria: id },
    });

    if (!fb_categ) {
      throw new AppError("Categoria não encontrada.", 404);
    }

    return fb_categ;
  }

  async create(data: feedback_categoria) {
    const fb_categ = feedbackCategoriaSchema.parse(data);

    const categoriaCriada = await prisma.feedback_categoria.create({
      data: fb_categ,
    });

    if (!categoriaCriada) {
      throw new AppError("Não foi possível criar categoria.", 400);
    }

    return categoriaCriada;
  }

  async update(id: number, data: feedback_categoria) {
    const fb_categ = await this.findById(id);

    if (!fb_categ) {
      throw new AppError("EJ não encontrada.", 404);
    }

    const categoriaAtualizada = await prisma.feedback_categoria.update({
      where: { id_fb_categoria: id },
      data,
    });

    if (!categoriaAtualizada) {
      throw new AppError("Não foi possível atualizar a categoria.", 400);
    }

    return categoriaAtualizada;
  }

  async delete(id: number) {
    const fb_categ = await this.findById(id);

    if (!fb_categ) {
      throw new AppError("Categoria não encontrada.", 404);
    }

    await prisma.feedback_categoria.delete({ where: { id_fb_categoria: id } });

    return { message: "Categoria deletada com sucesso." };
  }
}
