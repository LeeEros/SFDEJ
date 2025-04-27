import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { projeto } from "@prisma/client";
import { projetoSchema } from "./projeto-schema";

export class ProjetoService {
  async findAll() {
    const projeto = await prisma.projeto.findMany({
      orderBy: { id_projeto: "asc" },
    });

    if (!projeto) {
      throw new AppError("Nenhum projeto encontrado.", 404);
    }

    return projeto;
  }

  async findById(id: number) {
    const projeto = await prisma.projeto.findUnique({
      where: { id_projeto: id },
    });

    if (!projeto) {
      throw new AppError("Projeto não encontrado.", 404);
    }

    return projeto;
  }

  async create(data: projeto) {
    const projeto = projetoSchema.parse(data);

    let anexoBuffer: Buffer | undefined = undefined;

    if (projeto.anexo) {
      const buffer = await projeto.anexo.arrayBuffer();
      anexoBuffer = Buffer.from(buffer);
    }

    const projetoCriado = await prisma.projeto.create({
      data: {
        nome: projeto.nome,
        descricao: projeto.descricao,
        status: projeto.status,
        data_assinatura: projeto.data_assinatura,
        data_conclusao: projeto.data_conclusao,
        valor: projeto.valor,
        anexo: anexoBuffer,
        fk_categoria: projeto.fk_categoria,
        fk_cliente: projeto.fk_cliente,
      },
    });

    if (!projetoCriado) {
      throw new AppError("Não foi possível criar projeto.", 404);
    }

    return projetoCriado;
  }

  async update(id: number, data: projeto) {
    const projeto = await this.findById(id);

    if (!projeto) {
      throw new AppError("Projeto não encontrado.", 404);
    }

    if (projeto.status === "FINALIZADO") {
      await prisma.projeto.update({
        where: { id_projeto: id },
        data: {
          data_conclusao: new Date(),
        },
      });
    }

    const projetoAtualizado = await prisma.projeto.update({
      where: { id_projeto: id },
      data,
    });

    if (!projetoAtualizado) {
      throw new AppError("Não foi possível atualizar projeto.", 400);
    }

    return projetoAtualizado;
  }

  async delete(id: number) {
    const projeto = await this.findById(id);

    if (!projeto) {
      throw new AppError("Projeto não encontrado.", 404);
    }

    await prisma.projeto.delete({ where: { id_projeto: id } });

    return { message: "Projeto deletado com sucesso." };
  }
}
