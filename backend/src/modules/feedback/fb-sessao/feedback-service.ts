import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { feedbackSessaoSchema } from "./feedback-schema";
import { feedback_sessao } from "@prisma/client";
import { z } from "zod";

type PostProps = z.infer<typeof feedbackSessaoSchema>;

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

  async create(data: PostProps) {
    const { fk_fb_categoria, fk_projeto, avaliados } =
      feedbackSessaoSchema.parse(data);

    const novaSessao = await prisma.feedback_sessao.create({
      data: {
        status: true,
        ...(fk_fb_categoria && {
          feedback_categoria: {
            connect: { id_fb_categoria: fk_fb_categoria },
          },
        }),

        ...(fk_projeto && {
          projeto: {
            connect: { id_projeto: fk_projeto },
          },
        }),
        avaliados: {
          create: avaliados.map((idUsuario) => ({
            avaliado: {
              connect: { id_usuario: idUsuario },
            },
          })),
        },
      },
      include: {
        avaliados: {
          select: {
            token: true,
            avaliado: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
    });

    return novaSessao;
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
