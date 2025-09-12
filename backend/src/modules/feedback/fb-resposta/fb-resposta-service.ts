import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { POST_RESPOSTA_SCHEMA } from "./fb-resposta-schema";

type PostProps = z.infer<typeof POST_RESPOSTA_SCHEMA>;

export class fbRespostaService {
  async createPublic(token: string, data: PostProps) {
    const { respostas } = POST_RESPOSTA_SCHEMA.parse(data);

    const avaliacao = await prisma.feedback_avaliacao.findUnique({
      where: { token },
      include: { respostas: true },
    });

    if (!avaliacao) {
      throw new AppError(
        "Formulário de feedback não encontrado ou inválido.",
        404
      );
    }

    const dadosParaCriar = respostas.map((resposta) => ({
      ...resposta,
      fk_fb_avaliacao: avaliacao.id_avaliacao,
    }));

    await prisma.feedback_resposta.createMany({
      data: dadosParaCriar,
    });

    return { message: "Feedback enviado com sucesso!" };
  }
}
