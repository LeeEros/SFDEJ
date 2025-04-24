import bcrypt from "bcrypt";

export async function hashSenha(senha: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(senha, saltRounds);
}
