import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { cliente } from "@prisma/client";
import { clienteSchema } from "./cliente-schema";

export class ClienteService {
  async findAll() {
    const cliente = await prisma.cliente.findMany({
      orderBy: { id_cliente: "asc" },
    });

    if (!cliente) {
      throw new AppError("Nenhum cliente encontrado.", 404);
    }

    return cliente;
  }

  async findById(id: number) {
    const cliente = await prisma.cliente.findUnique({
      where: { id_cliente: id },
    });

    if (!cliente) {
      throw new AppError("Cliente não encontrado.", 404);
    }

    return cliente;
  }

  async create(data: cliente) {
    const cliente = clienteSchema.parse(data);

    const clienteCriado = await prisma.cliente.create({ data: cliente });

    if (!clienteCriado) {
      throw new AppError("Não foi possível criar cliente.", 404);
    }

    return clienteCriado;
  }

  async update(id: number, data: cliente) {
    const cliente = await this.findById(id);

    if (!cliente) {
      throw new AppError("EJ não encontrada.", 404);
    }

    const clienteAtualizado = await prisma.cliente.update({
      where: { id_cliente: id },
      data,
    });

    if (!clienteAtualizado) {
      throw new AppError("Não foi possível atualizar cliente.", 400);
    }

    return clienteAtualizado;
  }

  async delete(id: number) {
    const cliente = await this.findById(id);

    if (!cliente) {
      throw new AppError("Cliente não encontrada.", 404);
    }

    await prisma.cliente.delete({ where: { id_cliente: id } });

    return { message: "Cliente deletado com sucesso." };
  }
}
