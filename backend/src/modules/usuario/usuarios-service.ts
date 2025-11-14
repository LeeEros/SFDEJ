import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { hashSenha } from "@/utils/hash";

import { usuarios } from "@prisma/client";
import { usuarioSchema } from "./usuarios-schema";

export class UsuariosService {
  async findAll() {
    const usuarios = await prisma.usuarios.findMany({
      where: { ativo: true },
      orderBy: { id_usuario: "asc" },
    });
    const usuariosSemSenha = usuarios.map(({ senha, ...corpo }) => corpo);
    return usuariosSemSenha;
  }

  async findAllDisabled() {
    const usuarioDesativados = await prisma.usuarios.findMany({
      where: { ativo: false },
      orderBy: { id_usuario: "asc" },
    });
    const usuariosSemSenha = usuarioDesativados.map(
      ({ senha, ...corpo }) => corpo
    );
    return usuariosSemSenha;
  }

  async findById(id: number) {
    const usuario = await prisma.usuarios.findUnique({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    const { senha, ...usuariosSemSenha } = usuario;
    return usuariosSemSenha;
  }

  async create(
    data: usuarios,
    usuarioAutenticado?: { id: string; permissao: string }
  ) {
    const usuario = usuarioSchema.parse(data);

    if (usuario.permissao === "ADMIN") {
      if (!usuarioAutenticado || usuarioAutenticado.permissao !== "ADMIN") {
        throw new AppError("Não autorizado.", 403);
      }
    }

    const usuarioEmailUsado = await prisma.usuarios.findFirst({
      where: { email: usuario.email },
    });

    if (usuarioEmailUsado) {
      throw new AppError("Email já utilizado ou inválido");
    }

    const hashSenhaUsuario = await hashSenha(usuario.senha);

    const usuarioCriado = await prisma.usuarios.create({
      data: {
        ...usuario,
        senha: hashSenhaUsuario,
      },
    });

    const { senha, ...usuarioSemSenha } = usuarioCriado;
    return usuarioSemSenha;
  }

  async update(id: number, data: usuarios) {
    const dadoValidado = usuarioSchema.partial().parse(data);

    const usuario = await prisma.usuarios.findUnique({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    if (dadoValidado.email) {
      const usuarioEmailUsado = await prisma.usuarios.findFirst({
        where: { email: dadoValidado.email, id_usuario: { not: id } },
      });

      if (usuarioEmailUsado) {
        throw new AppError("Email já utilizado ou inválido");
      }
    }

    let updatedData = { ...dadoValidado };
    if (dadoValidado.senha) {
      updatedData.senha = await hashSenha(dadoValidado.senha);
    }

    const usuarioAtualizado = await prisma.usuarios.update({
      where: { id_usuario: id },
      data: updatedData,
    });

    const { senha, ...usuarioSemSenha } = usuarioAtualizado;
    return usuarioSemSenha;
  }

  async delete(id: number) {
    const usuario = await prisma.usuarios.findUnique({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    await prisma.usuarios.update({
      where: { id_usuario: id },
      data: {
        ativo: false,
        data_desligamento: new Date(),
      },
    });

    return { message: "Usuário desativado com sucesso" };
  }

  async getFeedbackReport(id_usuario: number) {
    const usuarioComAvaliacoes = await prisma.usuarios.findUnique({
      where: { id_usuario },

      include: {
        feedback_avaliado: {
          orderBy: {
            sessao: {
              data_criacao: "desc",
            },
          },
          include: {
            respostas: {
              include: {
                questao: {
                  select: { enunciado: true },
                },
              },
            },
            sessao: {
              include: {
                feedback_categoria: { select: { categoria: true } },
                projeto: { select: { nome: true } },
              },
            },
          },
        },
      },
    });

    if (!usuarioComAvaliacoes) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    const relatorioFormatado = usuarioComAvaliacoes.feedback_avaliado.map(
      (avaliacao) => {
        const respostasAgrupadas = avaliacao.respostas.reduce(
          (acc, resposta) => {
            const questao = resposta.questao.enunciado;
            if (!acc[questao]) {
              acc[questao] = { notas: [], comentarios: [] };
            }
            acc[questao].notas.push(resposta.nota);
            if (resposta.comentario) {
              acc[questao].comentarios.push(resposta.comentario);
            }
            return acc;
          },
          {} as Record<string, { notas: number[]; comentarios: string[] }>
        );

        return {
          data_feedback: avaliacao.sessao.data_criacao,
          contexto:
            avaliacao.sessao.projeto?.nome ||
            avaliacao.sessao.feedback_categoria?.categoria ||
            "Geral",
          resultados: Object.entries(respostasAgrupadas).map(
            ([enunciado, dados]) => {
              const media =
                dados.notas.reduce((s, n) => s + n, 0) / dados.notas.length;
              return {
                enunciado,
                media_notas: parseFloat(media.toFixed(2)),
                comentarios: dados.comentarios,
              };
            }
          ),
        };
      }
    );

    return {
      id_usuario: usuarioComAvaliacoes.id_usuario,
      nome_usuario: usuarioComAvaliacoes.nome,
      historico_feedbacks: relatorioFormatado,
    };
  }

  async getRadarChartData(id_usuario: number) {
    const respostas = await prisma.feedback_resposta.findMany({
      where: {
        avaliacao: {
          fk_avaliado: id_usuario,
        },
      },
      include: {
        questao: {
          include: {
            feedback_categoria: {
              select: { categoria: true },
            },
          },
        },
      },
    });

    const notasPorCategoria = respostas.reduce((acc, resposta) => {
      const categoria = resposta.questao.feedback_categoria.categoria;
      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push(resposta.nota);
      return acc;
    }, {} as Record<string, number[]>);

    const mediaPorCategoria = Object.entries(notasPorCategoria).map(
      ([categoria, notas]) => {
        const media =
          notas.reduce((soma, nota) => soma + nota, 0) / notas.length;
        return {
          categoria,
          media: parseFloat(media.toFixed(2)),
        };
      }
    );

    return mediaPorCategoria;
  }
}
