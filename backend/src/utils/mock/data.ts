import { faker } from "@faker-js/faker";
import { hashSenha } from "../hash";
import { prisma } from "@/database/prisma";

async function main() {
  console.log("Iniciando inserção de dados fictícios...");

  const diretoria = [];
  for (let i = 0; i < 10; i++) {
    diretoria.push(
      await prisma.diretoria.create({
        data: {
          diretoria: faker.company.name(),
        },
      })
    );
  }

  const enderecos = [];
  for (let i = 0; i < 10; i++) {
    enderecos.push(
      await prisma.endereco.create({
        data: {
          CEP: faker.location.zipCode("########"),
          cidade: faker.location.city(),
          endereco: faker.location.streetAddress(),
          numero: faker.number.int({ min: 1, max: 1000 }),
        },
      })
    );
  }

  const federacoes = [];
  for (let i = 0; i < 10; i++) {
    federacoes.push(
      await prisma.federacao.create({
        data: {
          nome: faker.company.name(),
          nivel: faker.helpers.arrayElement([
            "REGIONAL",
            "ESTADUAL",
            "NACIONAL",
            "INTERNACIONAL",
          ]),
        },
      })
    );
  }

  const instituicoes = [];
  for (let i = 0; i < 10; i++) {
    instituicoes.push(
      await prisma.instituicao.create({
        data: {
          faculdade: faker.company.name(),
          unidade: faker.company.catchPhrase(),
          CNPJ: faker.string.numeric(14),
          fk_endereco: enderecos[i % enderecos.length].id_endereco,
        },
      })
    );
  }

  const ejs = [];
  for (let i = 0; i < 10; i++) {
    ejs.push(
      await prisma.ej.create({
        data: {
          nome: faker.company.name(),
          CNPJ: faker.string.numeric(14),
          fk_endereco: enderecos[i % enderecos.length].id_endereco,
          fk_federacao: federacoes[i % federacoes.length].id_federacao,
          fk_instituicao: instituicoes[i % instituicoes.length].id_instituicao,
        },
      })
    );
  }

  const usuarios = [];
  for (let i = 0; i < 10; i++) {
    const senhaHash = await hashSenha(faker.internet.password({ length: 10 }));
    usuarios.push(
      await prisma.usuarios.create({
        data: {
          nome: faker.person.fullName(),
          email: faker.internet.email(),
          senha: senhaHash, // Salva o hash da senha
          diretor: faker.datatype.boolean(),
          ativo: faker.datatype.boolean(),
          fk_diretoria: diretoria[i % diretoria.length].id_diretoria,
          fk_ej: ejs[i % ejs.length].id_ej,
        },
      })
    );
  }

  const feedbacks = [];
  for (let i = 0; i < 10; i++) {
    feedbacks.push(
      await prisma.feedback.create({
        data: {
          resultado_media: faker.number.float({
            min: 0,
            max: 10,
            fractionDigits: 1,
          }),
          tipo_avaliador: faker.helpers.arrayElement(["INTERNO", "EXTERNO"]),
          fk_usuario_avaliado: usuarios[i % usuarios.length].id_usuario,
        },
      })
    );
  }

  for (let i = 0; i < 10; i++) {
    await prisma.feedback_historico.create({
      data: {
        media_notas: faker.number.float({ min: 0, max: 10, fractionDigits: 1 }),
        media_questoes: faker.number.float({
          min: 0,
          max: 10,
          fractionDigits: 1,
        }),
        data_realizacao: faker.date.past(),
        fk_feedback: feedbacks[i % feedbacks.length].id_feedback,
      },
    });
  }

  for (let i = 0; i < 10; i++) {
    await prisma.feedback_categoria.create({
      data: {
        categoria: faker.commerce.department(),
        descricao_categoria: faker.commerce.productDescription(),
        fk_feedback: feedbacks[i % feedbacks.length].id_feedback,
      },
    });
  }

  for (let i = 0; i < 10; i++) {
    await prisma.feedback_empresario.create({
      data: {
        data_realizacao: faker.date.past(),
        comentario: faker.lorem.sentence(),
        fk_feedback: feedbacks[i % feedbacks.length].id_feedback,
      },
    });
  }

  const clientes = [];
  for (let i = 0; i < 10; i++) {
    clientes.push(
      await prisma.cliente.create({
        data: {
          nome: faker.person.fullName(),
          CNPJ: faker.string.numeric(14),
          CPF: faker.string.numeric(11),
          email: faker.internet.email(),
          telefone: faker.phone.number({ style: "national" }),
          fk_endereco: enderecos[i % enderecos.length].id_endereco,
        },
      })
    );
  }

  const categorias = [];
  for (let i = 0; i < 10; i++) {
    categorias.push(
      await prisma.categoria.create({
        data: {
          categoria: faker.commerce.department(),
          complexidade: faker.helpers.arrayElement([
            "N1",
            "N2",
            "N3",
            "N4",
            "N5",
          ]),
          comentario_complexidade: faker.lorem.sentence(),
        },
      })
    );
  }

  const projetos = [];
  for (let i = 0; i < 10; i++) {
    projetos.push(
      await prisma.projeto.create({
        data: {
          nome: faker.commerce.productName(),
          descricao: faker.commerce.productDescription(),
          status: faker.helpers.arrayElement([
            "NEGOCIACAO",
            "EM_ANDAMENTO",
            "FINALIZADO",
            "CANCELADO",
          ]),
          data_assinatura: faker.date.past(),
          valor: faker.number.float({
            min: 1000,
            max: 100000,
            fractionDigits: 2,
          }),
          fk_categoria: categorias[i % categorias.length].id_categoria,
          fk_cliente: clientes[i % clientes.length].id_cliente,
        },
      })
    );
  }

  for (let i = 0; i < 10; i++) {
    await prisma.feedback_projeto.create({
      data: {
        data_realizacao: faker.date.past(),
        feedbackId_feedback: feedbacks[i % feedbacks.length].id_feedback,
        fk_projeto: projetos[i % projetos.length].id_projeto,
      },
    });
  }

  for (let i = 0; i < 10; i++) {
    await prisma.questoes.create({
      data: {
        enunciado: faker.lorem.sentence(),
        pontuacao: faker.number.int({ min: 1, max: 10 }),
        media: faker.number.float({ min: 0, max: 10, fractionDigits: 1 }),
        descricao: faker.lorem.sentence(),
        fk_fb_projeto: feedbacks[i % feedbacks.length].id_feedback,
      },
    });
  }

  console.log("Dados fictícios inseridos com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
