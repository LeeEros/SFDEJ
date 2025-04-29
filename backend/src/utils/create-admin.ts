import { prisma } from "@/database/prisma";
import { hashSenha as hash } from "@/utils/hash";
import { env } from "process";

export async function createAdmin() {
  const email =
    env.ADMIN_EMAIL ??
    (() => {
      throw new Error("ADMIN_EMAIL não está definido.");
    })();
  const senha = env.ADMIN_SENHA ?? "";

  const adminExistente = await prisma.usuarios.findFirst({
    where: { email },
  });

  if (!adminExistente) {
    if (!senha) {
      throw new Error("ADMIN_SENHA não está definido.");
    }
    const senhaHash = await hash(senha);

    await prisma.usuarios.create({
      data: {
        nome: "Administrador Geral",
        email,
        telefone: "00000000000",
        senha: senhaHash,
        permissao: "ADMIN",
        diretor: true,
        ativo: true,
      },
    });
  } else if (adminExistente) {
    console.log("Usuário administrador já existe.");
  } else {
    throw new Error("Erro ao criar o usuário administrador.");
  }
}
