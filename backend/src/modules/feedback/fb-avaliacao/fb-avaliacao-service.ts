import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { feedbackAvaliacaoSchema } from "./fb-avaliacao-schema";
import { feedback_avaliacao } from "@prisma/client";
import { randomUUID } from "crypto";

export class fbHistoricoService {
  async findAll() {
    return prisma.feedback_avaliacao.findMany({
      orderBy: {
        id_avaliacao: "desc",
      },
      include: {
        sessao: {
          select: {
            id_sessao: true,
          },
        },
        avaliado: {
          select: {
            nome: true,
          },
        },
        _count: {
          select: {
            respostas: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    const fb_avaliacao = await prisma.feedback_avaliacao.findUnique({
      where: { id_avaliacao: id },
    });

    if (!fb_avaliacao) {
      throw new AppError("Avaliação não encontrada.", 404);
    }

    return fb_avaliacao;
  }

  async create(data: feedback_avaliacao) {
    const fb_avaliacao = feedbackAvaliacaoSchema.parse(data);

    const uuuid = randomUUID();
    const linkAvaliacao = uuuid;

    const avaliacaoCriada = await prisma.feedback_avaliacao.create({
      data: {
        ...fb_avaliacao,
        link_forms: linkAvaliacao,
      },
    });

    if (!avaliacaoCriada) {
      throw new AppError("Não foi possível criar avaliação.", 400);
    }

    return avaliacaoCriada;
  }

  async update(id: number, data: feedback_avaliacao) {
    const fb_avaliacao = await this.findById(id);

    if (!fb_avaliacao) {
      throw new AppError("Avaliação não encontrado.", 404);
    }

    const historicoAtualizado = await prisma.feedback_avaliacao.update({
      where: { id_avaliacao: id },
      data,
    });

    if (!historicoAtualizado) {
      throw new AppError("Não foi possível atualizar avaliação.", 400);
    }

    return historicoAtualizado;
  }

  async delete(id: number) {
    const fb_avalicao = await this.findById(id);

    if (!fb_avalicao) {
      throw new AppError("Avaliação não encontrado.", 404);
    }

    await prisma.feedback_avaliacao.delete({ where: { id_avaliacao: id } });

    return { message: "Avaliação deletada com sucesso." };
  }

  async findPublicByToken(token: string) {
    const avaliacao = await prisma.feedback_avaliacao.findUnique({
      where: {
        token,
      },
      select: {
        avaliado: {
          select: { nome: true },
        },
        sessao: {
          select: {
            data_fim: true,
            feedback_categoria: {
              select: {
                categoria: true,
                questoes: {
                  select: {
                    id_questao: true,
                    enunciado: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!avaliacao) {
      throw new AppError(
        "Formulário de feedback não encontrado ou inválido.",
        404
      );
    }

    const agora = new Date();
    if (avaliacao.sessao.data_fim && avaliacao.sessao.data_fim < agora) {
      throw new AppError(
        "Este formulário de feedback expirou e não pode mais ser respondido.",
        403
      );
    }

    return {
      nome_avaliado: avaliacao.avaliado.nome,
      categoria: avaliacao.sessao.feedback_categoria?.categoria,
      questoes: avaliacao.sessao.feedback_categoria?.questoes || [],
    };
  }
}
