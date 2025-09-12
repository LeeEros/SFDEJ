import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { feedbackSessaoSchema } from "./feedback-schema";
import { feedback_sessao } from "@prisma/client";
import { z } from "zod";

type PostProps = z.infer<typeof feedbackSessaoSchema>;

export class FeedbackService {
  async findAll() {
    const fb = await prisma.feedback_sessao.findMany({
      orderBy: { data_criacao: "desc" },
      include: {
        feedback_categoria: { select: { categoria: true } },
        projeto: { select: { nome: true } },
        _count: {
          select: { avaliados: true },
        },
      },
    });

    if (!fb) {
      throw new AppError("Nenhum feedback encontrado.", 404);
    }

    return fb;
  }

  async findLinks(id_sessao: number) {
    const sessao = await prisma.feedback_sessao.findUnique({
      where: { id_sessao },
      select: {
        avaliados: {
          select: {
            token: true,
            avaliado: {
              select: { nome: true },
            },
          },
        },
      },
    });

    if (!sessao) {
      throw new AppError("Sessão não encontrada.", 404);
    }
    return sessao.avaliados;
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
    const { fk_fb_categoria, fk_projeto, avaliados, data_fim } =
      feedbackSessaoSchema.parse(data);

    const novaSessao = await prisma.feedback_sessao.create({
      data: {
        status: true,
        data_fim,
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

  async delete(id_sessao: number) {
    const sessao = await prisma.feedback_sessao.findUnique({
      where: { id_sessao },
    });

    if (!sessao) {
      throw new AppError("Sessão de feedback não encontrada.", 404);
    }
    await prisma.feedback_sessao.delete({
      where: { id_sessao },
    });
  }

  async getReport(id_sessao: number) {
    const sessao = await prisma.feedback_sessao.findUnique({
      where: { id_sessao },
      include: {
        feedback_categoria: {
          select: {
            categoria: true,
            questoes: true,
          },
        },
        projeto: {
          select: {
            nome: true,
          },
        },
        avaliados: {
          include: {
            avaliado: {
              select: {
                nome: true,
              },
            },
            respostas: {
              select: {
                nota: true,
                comentario: true,
                fk_fb_questao: true,
              },
            },
          },
        },
      },
    });

    if (!sessao) {
      throw new AppError("Sessão de feedback não encontrada.", 404);
    }

    const questoesDoFormulario = sessao.feedback_categoria?.questoes || [];

    const relatorioAvaliados = sessao.avaliados.map((avaliacao) => {
      const resultadosPorQuestao = questoesDoFormulario.map((questao) => {
        const respostasParaQuestao = avaliacao.respostas.filter(
          (r) => r.fk_fb_questao === questao.id_questao
        );

        const totalNotas = respostasParaQuestao.reduce(
          (soma, r) => soma + r.nota,
          0
        );
        const media =
          respostasParaQuestao.length > 0
            ? totalNotas / respostasParaQuestao.length
            : 0;

        const comentarios = respostasParaQuestao
          .map((r) => r.comentario)
          .filter((c) => c);

        return {
          id_questao: questao.id_questao,
          enunciado: questao.enunciado,
          media_notas: parseFloat(media.toFixed(2)),
          comentarios,
        };
      });

      return {
        nome_avaliado: avaliacao.avaliado.nome,
        status: avaliacao.respostas.length > 0 ? "Respondido" : "Pendente",
        resultados: resultadosPorQuestao,
      };
    });

    return {
      id_sessao: sessao.id_sessao,
      data_criacao: sessao.data_criacao,
      categoria: sessao.feedback_categoria?.categoria || "N/A",
      projeto: sessao.projeto?.nome || "N/A",
      participantes: relatorioAvaliados,
    };
  }
}
