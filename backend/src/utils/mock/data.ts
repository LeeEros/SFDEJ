import { faker } from "@faker-js/faker";
import { hashSenha } from "../hash";
import { prisma } from "@/database/prisma";

export const mockData = {
  usuarios: Array.from({ length: 10 }, () => ({
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    telefone: faker.phone.number().slice(0, 15),
    senha: faker.internet.password({ length: 10 }),
    diretor: faker.datatype.boolean(),
    ativo: faker.datatype.boolean(),
    data_criacao: faker.date.past(),
    data_atualizacao: faker.date.recent(),
    data_desligamento: faker.datatype.boolean() ? faker.date.past() : null,
    permissao: faker.helpers.arrayElement(["USUARIO", "ADMIN"]),
  })),

  diretoria: Array.from({ length: 10 }, () => ({
    diretoria: faker.company.name(),
  })),

  endereco: Array.from({ length: 10 }, () => ({
    CEP: faker.location.zipCode("########"),
    cidade: faker.location.city(),
    estado: faker.location.state(),
    endereco: faker.location.streetAddress(),
    numero: faker.number.int({ min: 1, max: 1000 }),
  })),

  ej: Array.from({ length: 10 }, () => ({
    nome: faker.company.name(),
    CNPJ: faker.string.numeric(14),
  })),

  instituicao: Array.from({ length: 10 }, () => ({
    faculdade: faker.company.name(),
    unidade: faker.company.catchPhrase(),
    CNPJ: faker.string.numeric(14),
  })),

  federacao: Array.from({ length: 10 }, () => ({
    nome: faker.company.name(),
    nivel: faker.helpers.arrayElement([
      "REGIONAL",
      "ESTADUAL",
      "NACIONAL",
      "INTERNACIONAL",
    ]),
  })),

  cliente: Array.from({ length: 10 }, () => ({
    nome: faker.person.fullName(),
    CNPJ: faker.string.numeric(14),
    CPF: faker.string.numeric(11),
    email: faker.internet.email(),
    telefone: faker.phone.number().slice(0, 15),
  })),

  categoria: Array.from({ length: 10 }, () => ({
    categoria: faker.commerce.department(),
    complexidade: faker.helpers.arrayElement(["N1", "N2", "N3", "N4", "N5"]),
    comentario_complexidade: faker.lorem.sentence(),
  })),

  projeto: Array.from({ length: 10 }, () => ({
    nome: faker.commerce.productName(),
    descricao: faker.commerce.productDescription(),
    status: faker.helpers.arrayElement([
      "NEGOCIACAO",
      "EM_ANDAMENTO",
      "FINALIZADO",
      "CANCELADO",
    ]),
    data_assinatura: faker.date.past(),
    data_conclusao: faker.datatype.boolean() ? faker.date.recent() : null,
    valor: faker.number.float({ min: 1000, max: 100000, fractionDigits: 2 }),
    anexo: faker.datatype.boolean() ? Buffer.from(faker.lorem.words(10)) : null,
  })),

  feedback_categoria: Array.from({ length: 10 }, () => ({
    categoria: faker.commerce.department(),
    descricao_categoria: faker.commerce.productDescription(),
    perfil: faker.helpers.arrayElement(["hard_skills", "soft_skills"]),
    media_categoria: faker.datatype.boolean()
      ? faker.number.float({ min: 0, max: 10, fractionDigits: 1 })
      : null,
  })),

  feedback: Array.from({ length: 10 }, () => ({
    tipo_avaliador: faker.helpers.arrayElement(["INTERNO", "EXTERNO"]),
    comentario: faker.lorem.sentence(),
    media_geral: faker.number.float({ min: 0, max: 10, fractionDigits: 1 }),
    data_realizacao: faker.date.past(),
  })),

  feedback_historico: Array.from({ length: 10 }, () => ({
    media_geral: faker.number.float({ min: 0, max: 10, fractionDigits: 1 }),
    media_categorias: faker.number.float({
      min: 0,
      max: 10,
      fractionDigits: 1,
    }),
    data_geracao: faker.date.past(),
    data_atualizacao: faker.date.recent(),
  })),

  feedback_questao: Array.from({ length: 10 }, () => ({
    enunciado: faker.lorem.sentence(),
    pontuacao: faker.number.int({ min: 1, max: 10 }),
    comentario: faker.lorem.sentence(),
  })),
};

async function main() {
  console.log("Iniciando inserção de dados fictícios...");

  const diretorias = await Promise.all(
    mockData.diretoria.map((data) =>
      prisma.diretoria.create({
        data,
      })
    )
  );

  const enderecos = await Promise.all(
    mockData.endereco.map((data) =>
      prisma.endereco.create({
        data,
      })
    )
  );

  const federacoes = await Promise.all(
    mockData.federacao.map((data) =>
      prisma.federacao.create({
        data,
      })
    )
  );

  const instituicoes = await Promise.all(
    mockData.instituicao.map((data, i) =>
      prisma.instituicao.create({
        data: {
          ...data,
          fk_endereco: enderecos[i % enderecos.length].id_endereco,
        },
      })
    )
  );

  const ejs = await Promise.all(
    mockData.ej.map((data, i) =>
      prisma.ej.create({
        data: {
          ...data,
          fk_endereco: enderecos[i % enderecos.length].id_endereco,
          fk_federacao: federacoes[i % federacoes.length].id_federacao,
          fk_instituicao: instituicoes[i % instituicoes.length].id_instituicao,
        },
      })
    )
  );

  const usuarios = await Promise.all(
    mockData.usuarios.map(async (data, i) => {
      const senhaHash = await hashSenha(data.senha);
      return prisma.usuarios.create({
        data: {
          ...data,
          senha: senhaHash,
          fk_diretoria: diretorias[i % diretorias.length].id_diretoria,
          fk_ej: ejs[i % ejs.length].id_ej,
        },
      });
    })
  );

  const clientes = await Promise.all(
    mockData.cliente.map((data, i) =>
      prisma.cliente.create({
        data: {
          ...data,
          fk_endereco: enderecos[i % enderecos.length].id_endereco,
        },
      })
    )
  );

  const categorias = await Promise.all(
    mockData.categoria.map((data) =>
      prisma.categoria.create({
        data,
      })
    )
  );

  const projetos = await Promise.all(
    mockData.projeto.map((data, i) =>
      prisma.projeto.create({
        data: {
          ...data,
          fk_categoria: categorias[i % categorias.length].id_categoria,
          fk_cliente: clientes[i % clientes.length].id_cliente,
        },
      })
    )
  );

  const feedbackCategorias = await Promise.all(
    mockData.feedback_categoria.map((data) =>
      prisma.feedback_categoria.create({
        data,
      })
    )
  );

  const feedbacks = await Promise.all(
    mockData.feedback.map((data, i) =>
      prisma.feedback.create({
        data: {
          ...data,
          fk_usuario_avaliado: usuarios[i % usuarios.length].id_usuario,
          fk_fb_categoria:
            feedbackCategorias[i % feedbackCategorias.length].id_fb_categoria,
          fk_projeto: projetos[i % projetos.length].id_projeto,
        },
      })
    )
  );

  await Promise.all(
    mockData.feedback_historico.map((data, i) =>
      prisma.feedback_historico.create({
        data: {
          ...data,
          fk_feedback: feedbacks[i % feedbacks.length].id_feedback,
        },
      })
    )
  );

  await Promise.all(
    mockData.feedback_questao.map((data, i) =>
      prisma.feedback_questao.create({
        data: {
          ...data,
          fk_fb_categoria:
            feedbackCategorias[i % feedbackCategorias.length].id_fb_categoria,
        },
      })
    )
  );

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
