import { prisma } from "@/database/prisma";

export class DiretoriasService {
  async FindAll() {
    const diretorias = await prisma.diretoria.findMany({
      orderBy: { id_diretoria: "asc" },
    });

    return diretorias;
  }
}
