import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { endereco } from "@prisma/client";
import { enderecoSchema } from "./endereco-schema";

export class EnderecoService {
  verificaCEP(cep: string): boolean {
    const cepRegex = /^[0-9]{5}-?[0-9]{3}$/;
    return cepRegex.test(cep);
  }

  inseriHifen(cep: string): string {
    return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  async findAll() {
    const enderecos = await prisma.endereco.findMany({
      orderBy: { id_endereco: "asc" },
    });

    if (!enderecos) {
      throw new AppError("Nenhum endereço cadastrado", 404);
    }

    return enderecos;
  }

  async findById(id: number) {
    const endereco = await prisma.endereco.findUnique({
      where: { id_endereco: id },
    });

    if (!endereco) {
      throw new AppError("Não foi possível localizar o endereço", 404);
    }

    return endereco;
  }

  async create(data: endereco) {
    const endereco = enderecoSchema.parse(data);

    if (!this.verificaCEP(endereco.CEP)) {
      throw new AppError("CEP inválido", 400);
    }

    endereco.CEP = this.inseriHifen(endereco.CEP);

    const enderecoCriado = await prisma.endereco.create({
      data: endereco,
    });

    if (!enderecoCriado) {
      throw new AppError("Não foi possível criar endereço", 400);
    }

    return enderecoCriado;
  }

  async update(id: number, data: endereco) {
    const endereco = await this.findById(id);

    if (!this.verificaCEP(endereco.CEP)) {
      throw new AppError("CEP inválido", 400);
    }

    endereco.CEP = this.inseriHifen(endereco.CEP);

    if (!endereco) {
      throw new AppError("Endereço não encontrado", 404);
    }

    const enderecoAtualizado = await prisma.endereco.update({
      where: { id_endereco: id },
      data,
    });

    if (!enderecoAtualizado) {
      throw new AppError("Endereço não atualizado", 400);
    }

    return enderecoAtualizado;
  }

  async delete(id: number) {
    const endereco = await this.findById(id);

    if (!endereco) {
      throw new AppError("Endereço não localizado", 404);
    }

    await prisma.endereco.delete({
      where: { id_endereco: id },
    });

    return { message: "Endereço deletado com sucesso" };
  }
}
