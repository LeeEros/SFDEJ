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
  })),

  feedback_questao: Array.from({ length: 10 }, () => ({
    enunciado: faker.lorem.sentence(),
  })),

  feedback_sessao: Array.from({ length: 10 }, () => ({
    status: faker.datatype.boolean(),
    data_criacao: faker.date.past(),
    data_atualizacao: faker.date.recent(),
  })),

  feedback_avaliacao: Array.from({ length: 10 }, () => ({
    link_forms: faker.internet.url(),
  })),

  feedback_resposta: Array.from({ length: 10 }, () => ({
    nota: faker.number.int({ min: 1, max: 10 }),
    data_resposta: faker.date.recent(),
    comentario: faker.lorem.sentence(),
  })),

  usuarios_em_projetos: Array.from({ length: 10 }, () => ({
    data_entrada: faker.date.past(),
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

  const feedbackQuestoes = await Promise.all(
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

  const feedbackSessoes = await Promise.all(
    mockData.feedback_sessao.map((data, i) =>
      prisma.feedback_sessao.create({
        data: {
          ...data,
          fk_fb_categoria:
            feedbackCategorias[i % feedbackCategorias.length].id_fb_categoria,
          fk_projeto: projetos[i % projetos.length].id_projeto,
        },
      })
    )
  );

  const feedbackAvaliacoes = await Promise.all(
    mockData.feedback_avaliacao.map((data, i) =>
      prisma.feedback_avaliacao.create({
        data: {
          ...data,
          fk_fb_sessao: feedbackSessoes[i % feedbackSessoes.length].id_sessao,
          fk_usuario: usuarios[i % usuarios.length].id_usuario,
        },
      })
    )
  );

  await Promise.all(
    mockData.feedback_resposta.map((data, i) =>
      prisma.feedback_resposta.create({
        data: {
          ...data,
          fk_fb_avaliacao:
            feedbackAvaliacoes[i % feedbackAvaliacoes.length].id_avaliacao,
          fk_fb_questao:
            feedbackQuestoes[i % feedbackQuestoes.length].id_questao,
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
