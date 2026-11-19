/**
 * Dados fictícios do MVP (demonstração). Centralizados aqui para que todas as
 * telas usem a mesma base. Nomes de unidades e bairros seguem as telas do Stitch.
 * Nenhum dado aqui representa informação oficial da SESAU Camaçari.
 */
import type { BaseRecord } from "./store";

/* ------------------------------------------------------------------ */
/* Usuário de demonstração                                             */
/* ------------------------------------------------------------------ */

export type Perfil = {
  nome: string;
  cpf: string;
  cns: string;
  nascimento: string;
  telefone: string;
  email: string;
  endereco: string;
  bairro: string;
  unidadeReferencia: string;
};

export const DEMO_USER: Perfil = {
  nome: "Maria Aparecida dos Santos",
  cpf: "529.982.247-25",
  cns: "898 0012 3456 7891",
  nascimento: "1984-06-12",
  telefone: "(71) 98812-4410",
  email: "maria.santos@email.com",
  endereco: "Rua da Amizade, 145",
  bairro: "Gravatá",
  unidadeReferencia: "USF Gravatá",
};
const DEMO_CPF = "52998224725";

export const BAIRROS = [
  "Centro", "Gravatá", "Ponto Certo", "Gleba A", "Gleba B", "Gleba C", "Gleba E", "Parque Verde", "Nova Vitória",
  "Natal", "Arembepe", "Barra do Jacuípe", "Guarajuba", "Monte Gordo", "Itacimirim", "Vila de Abrantes", "Jauá", "Catu de Abrantes",
];

/* ------------------------------------------------------------------ */
/* Unidades de saúde                                                   */
/* ------------------------------------------------------------------ */

export type Unidade = {
  nome: string;
  tipo: string;
  endereco: string;
  bairro: string;
  regiao: "Sede" | "Orla" | "Distrito";
  telefone: string;
  horario: string;
  servicos: string[];
};

export const UNIDADES: Unidade[] = [
  { nome: "USF Nova Vitória", tipo: "Unidade de Saúde da Família", endereco: "Rua Bahia, s/n", bairro: "Nova Vitória", regiao: "Sede", telefone: "(71) 3622-6410", horario: "Seg a Sex · 07h às 17h", servicos: ["Clínico geral", "Pediatria", "Vacinação", "Farmácia básica", "Pré-natal"] },
  { nome: "UBS Arembepe", tipo: "Unidade Básica de Saúde", endereco: "Estrada do Coco, km 26", bairro: "Arembepe", regiao: "Orla", telefone: "(71) 3624-1180", horario: "Seg a Sex · 07h às 17h", servicos: ["Clínico geral", "Odontologia", "Vacinação", "Curativos", "Farmácia básica"] },
  { nome: "USF Ponto Certo", tipo: "Unidade de Saúde da Família", endereco: "Av. Leste, 220", bairro: "Ponto Certo", regiao: "Sede", telefone: "(71) 3622-6455", horario: "Seg a Sex · 07h às 17h", servicos: ["Clínico geral", "Saúde da mulher", "Hiperdia", "Vacinação"] },
  { nome: "USF Gravatá — Dr. José Ramos da Silva", tipo: "Unidade de Saúde da Família", endereco: "Rua da Amizade, s/n", bairro: "Gravatá", regiao: "Sede", telefone: "(71) 3622-7714", horario: "Farmácia: 08h às 16h30", servicos: ["Clínico geral", "Farmácia", "Vacinação", "Testagem rápida"] },
  { nome: "USF Gleba B — Irmã Dulce", tipo: "Unidade de Saúde da Família", endereco: "Av. Eixo Urbano Central", bairro: "Gleba B", regiao: "Sede", telefone: "(71) 3622-6800", horario: "Farmácia: 08h às 17h", servicos: ["Clínico geral", "Farmácia", "Odontologia", "Pediatria"] },
  { nome: "USF Parque Verde II", tipo: "Unidade de Saúde da Família", endereco: "Av. Rio Camaçari", bairro: "Parque Verde", regiao: "Sede", telefone: "(71) 3622-6490", horario: "Seg a Sex · 08h às 16h30", servicos: ["Clínico geral", "Vacinação", "Pré-natal"] },
  { nome: "USF Gleba E", tipo: "Unidade de Saúde da Família", endereco: "Rua das Flores", bairro: "Gleba E", regiao: "Sede", telefone: "(71) 3622-6532", horario: "Seg a Sex · 08h às 16h30", servicos: ["Clínico geral", "Vacinação", "Saúde do idoso"] },
  { nome: "USF Arembepe (Costa)", tipo: "Unidade de Saúde da Família", endereco: "Estrada do Coco, km 26", bairro: "Arembepe", regiao: "Orla", telefone: "(71) 3624-1185", horario: "Seg a Sex · 08h às 16h30", servicos: ["Vacinação", "Clínico geral", "Curativos"] },
  { nome: "USF Monte Gordo", tipo: "Unidade de Saúde da Família", endereco: "Rua Principal, 40", bairro: "Monte Gordo", regiao: "Orla", telefone: "(71) 3624-2210", horario: "Seg a Sex · 07h às 17h", servicos: ["Clínico geral", "Farmácia básica", "Odontologia"] },
  { nome: "Farmácia Central Municipal (Policlínica)", tipo: "Farmácia de referência", endereco: "Av. Jorge Amado, s/n", bairro: "Centro", regiao: "Sede", telefone: "(71) 3621-6824", horario: "Seg a Sex · 07h às 18h", servicos: ["Medicamentos especiais", "Psicotrópicos", "Insulinas", "Insumos especiais"] },
];

/* ------------------------------------------------------------------ */
/* Documentos (boletins, portarias, guias)                             */
/* ------------------------------------------------------------------ */

export type Documento = {
  id: string;
  titulo: string;
  tipo: string;
  tema: string;
  data: string;
  periodo: string;
  tamanho: string;
  resumo: string;
};

const TEMAS_BOLETIM = [
  ["Monitoramento de Dengue & Chikungunya", "Arboviroses"],
  ["Cobertura Vacinal Pediátrica & Idosos", "Imunização"],
  ["Aedes Aegypti nos Bairros da Sede", "Arboviroses"],
  ["Síndromes Respiratórias (Influenza / VSR)", "Respiratórias"],
  ["Tuberculose e Hanseníase", "Doenças crônicas transmissíveis"],
  ["IST/HIV e Hepatites Virais", "Infectologia"],
] as const;

export const BOLETINS: Documento[] = (() => {
  const fixos: Documento[] = [
    { id: "bol-2025-14", titulo: "Boletim Epidemiológico nº 14/2025", tipo: "Edição Ordinária", tema: "Arboviroses", data: "2025-04-14", periodo: "Semana Epidemiológica 14 e 15 (Abril/2025)", tamanho: "1.8 MB", resumo: "Monitoramento de Dengue & Chikungunya na sede e na orla, com casos notificados, confirmados e distribuição por bairro." },
    { id: "bol-2025-imuniza", titulo: "Boletim Especial Imuniza Camaçari 2025.1", tipo: "Edição Temática", tema: "Imunização", data: "2025-03-28", periodo: "1º Trimestre Consolidado (Jan - Mar 2025)", tamanho: "2.4 MB", resumo: "Cobertura vacinal pediátrica e de idosos por unidade de saúde, com metas do Programa Nacional de Imunizações." },
    { id: "bol-2025-it12", titulo: "Informe Técnico Semanal de Arboviroses nº 12", tipo: "Levantamento Rápido", tema: "Arboviroses", data: "2025-03-18", periodo: "Mapeamento de Índice de Infestação Predial (LIRAa)", tamanho: "940 KB", resumo: "Índice de infestação predial do Aedes aegypti nos bairros da sede, com recomendações de controle vetorial." },
  ];
  const gerados: Documento[] = [];
  let numero = 13;
  for (let i = 0; gerados.length < 45; i++) {
    const ano = 2025 - Math.floor(i / 9);
    const mes = 12 - (i % 9) - (ano === 2025 ? 9 : 0);
    if (mes < 1) continue;
    const [tema, categoria] = TEMAS_BOLETIM[i % TEMAS_BOLETIM.length];
    const n = ano === 2025 ? numero-- : 40 - (i % 9) * 4;
    gerados.push({
      id: `bol-${ano}-${String(mes).padStart(2, "0")}-${i}`,
      titulo: `Boletim Epidemiológico nº ${String(n).padStart(2, "0")}/${ano}`,
      tipo: "Edição Ordinária",
      tema: categoria,
      data: `${ano}-${String(mes).padStart(2, "0")}-${String(10 + (i % 15)).padStart(2, "0")}`,
      periodo: `Competência ${String(mes).padStart(2, "0")}/${ano}`,
      tamanho: `${(0.8 + (i % 7) * 0.3).toFixed(1)} MB`,
      resumo: `${tema}: indicadores do período, comparativo com o ano anterior e ações da Vigilância em Saúde.`,
    });
  }
  return [...fixos, ...gerados].sort((a, b) => b.data.localeCompare(a.data));
})();

export const PORTARIAS: Documento[] = [
  { id: "port-2025-112", titulo: "Portaria SESAU nº 112/2025", tipo: "Portaria", tema: "Assistência Farmacêutica", data: "2025-10-06", periodo: "Diário Oficial do Município", tamanho: "320 KB", resumo: "Atualiza a Relação Municipal de Medicamentos Essenciais (REMUME) e os polos de dispensação." },
  { id: "port-2025-098", titulo: "Portaria SESAU nº 098/2025", tipo: "Portaria", tema: "Atenção Primária", data: "2025-08-21", periodo: "Diário Oficial do Município", tamanho: "280 KB", resumo: "Define o horário estendido de funcionamento das USF polo aos sábados." },
  { id: "port-2025-087", titulo: "Portaria SESAU nº 087/2025", tipo: "Portaria", tema: "Regulação", data: "2025-07-02", periodo: "Diário Oficial do Município", tamanho: "410 KB", resumo: "Estabelece o fluxo de regulação de consultas especializadas e exames de média complexidade." },
  { id: "port-2025-063", titulo: "Portaria SESAU nº 063/2025", tipo: "Portaria", tema: "Vigilância Sanitária", data: "2025-05-15", periodo: "Diário Oficial do Município", tamanho: "350 KB", resumo: "Regulamenta prazos para renovação de alvará sanitário e termo de responsabilidade técnica." },
  { id: "res-2025-cms-04", titulo: "Resolução CMS nº 04/2025", tipo: "Resolução", tema: "Controle Social", data: "2025-04-29", periodo: "Conselho Municipal de Saúde", tamanho: "190 KB", resumo: "Aprova o Relatório Anual de Gestão 2024 da Secretaria Municipal da Saúde." },
  { id: "port-2025-041", titulo: "Portaria SESAU nº 041/2025", tipo: "Portaria", tema: "Apoio Logístico", data: "2025-03-11", periodo: "Diário Oficial do Município", tamanho: "260 KB", resumo: "Normatiza o Tratamento Fora do Domicílio (TFD): documentação, ajuda de custo e transporte." },
  { id: "edital-2025-02", titulo: "Edital de Chamamento nº 02/2025", tipo: "Edital", tema: "Voluntariado", data: "2025-02-20", periodo: "Diário Oficial do Município", tamanho: "510 KB", resumo: "Chamamento público para voluntários em campanhas de vacinação e mutirões de saúde." },
  { id: "port-2024-210", titulo: "Portaria SESAU nº 210/2024", tipo: "Portaria", tema: "Saúde Mental", data: "2024-11-28", periodo: "Diário Oficial do Município", tamanho: "300 KB", resumo: "Organiza a Rede de Atenção Psicossocial (RAPS) e o acolhimento nos CAPS." },
  { id: "port-2024-176", titulo: "Portaria SESAU nº 176/2024", tipo: "Portaria", tema: "Saúde Bucal", data: "2024-09-09", periodo: "Diário Oficial do Município", tamanho: "240 KB", resumo: "Institui o cronograma itinerante do Odontomóvel nos distritos da orla." },
  { id: "port-2024-133", titulo: "Portaria SESAU nº 133/2024", tipo: "Portaria", tema: "Zoonoses", data: "2024-07-17", periodo: "Diário Oficial do Município", tamanho: "220 KB", resumo: "Regulamenta o programa municipal de castração gratuita (Castramóvel)." },
];

export const DOCUMENTOS_AVULSOS: Record<string, Documento> = {
  "guia-cta": { id: "guia-cta", titulo: "Guia do Centro de Testagem e Aconselhamento (CTA)", tipo: "Guia de orientação", tema: "Infectologia", data: "2025-02-03", periodo: "Centro de Infectologia", tamanho: "1.1 MB", resumo: "Testagem rápida gratuita para HIV, sífilis e hepatites B e C, sigilo do atendimento, horários e encaminhamentos." },
  "regulamento-farmaceutico": { id: "regulamento-farmaceutico", titulo: "Regulamento Farmacêutico Municipal", tipo: "Regulamento", tema: "Assistência Farmacêutica", data: "2025-10-06", periodo: "Farmácia Central", tamanho: "640 KB", resumo: "Regras de dispensação, validade de receitas, medicamentos controlados e retirada por terceiros." },
};

/* ------------------------------------------------------------------ */
/* Serviços clínicos                                                   */
/* ------------------------------------------------------------------ */

export type ConsultaRegulada = {
  cns: string;
  paciente: string;
  procedimento: string;
  especialidade: string;
  unidade: string;
  data: string;
  hora: string;
  status: "Agendada" | "Aguardando vaga" | "Autorizada" | "Realizada" | "Cancelada";
  posicaoFila?: number;
};

export const CONSULTAS_REGULADAS: ConsultaRegulada[] = [
  { cns: "898001234567891", paciente: "Maria Aparecida dos Santos", procedimento: "Consulta em Cardiologia", especialidade: "Cardiologia", unidade: "Policlínica Municipal", data: "2026-12-03", hora: "08:30", status: "Agendada" },
  { cns: "898001234567891", paciente: "Maria Aparecida dos Santos", procedimento: "Ecocardiograma transtorácico", especialidade: "Cardiologia", unidade: "Centro de Diagnóstico", data: "", hora: "", status: "Aguardando vaga", posicaoFila: 37 },
  { cns: "898001234567891", paciente: "Maria Aparecida dos Santos", procedimento: "Consulta em Oftalmologia", especialidade: "Oftalmologia", unidade: "Policlínica Municipal", data: "2026-09-15", hora: "10:00", status: "Realizada" },
  { cns: "700509876543210", paciente: "José Carlos Ribeiro", procedimento: "Ultrassonografia de abdome total", especialidade: "Radiologia", unidade: "Centro de Diagnóstico", data: "2026-11-27", hora: "14:00", status: "Autorizada" },
  { cns: "700509876543210", paciente: "José Carlos Ribeiro", procedimento: "Consulta em Ortopedia", especialidade: "Ortopedia", unidade: "Hospital Geral de Camaçari", data: "", hora: "", status: "Aguardando vaga", posicaoFila: 112 },
];

export type Cirurgia = {
  id: string;
  procedimento: string;
  especialidade: string;
  unidade: string;
  data: string;
  turno: "Manhã" | "Tarde";
  vagas: number;
};

export const CIRURGIAS: Cirurgia[] = [
  ["Colecistectomia videolaparoscópica", "Cirurgia Geral", "Hospital Geral de Camaçari", "2026-11-21", "Manhã", 4],
  ["Herniorrafia inguinal", "Cirurgia Geral", "Hospital Geral de Camaçari", "2026-11-21", "Tarde", 6],
  ["Facectomia (catarata)", "Oftalmologia", "Policlínica Municipal", "2026-11-24", "Manhã", 12],
  ["Artroscopia de joelho", "Ortopedia", "Hospital Geral de Camaçari", "2026-11-25", "Manhã", 3],
  ["Histerectomia", "Ginecologia", "Maternidade Municipal", "2026-11-26", "Manhã", 2],
  ["Postectomia", "Urologia", "Policlínica Municipal", "2026-11-27", "Tarde", 8],
  ["Facectomia (catarata)", "Oftalmologia", "Policlínica Municipal", "2026-12-01", "Manhã", 12],
  ["Colecistectomia videolaparoscópica", "Cirurgia Geral", "Hospital Geral de Camaçari", "2026-12-02", "Manhã", 4],
  ["Exérese de lipoma", "Cirurgia Geral", "Policlínica Municipal", "2026-12-03", "Tarde", 10],
  ["Correção de varizes", "Cirurgia Vascular", "Hospital Geral de Camaçari", "2026-12-04", "Manhã", 3],
  ["Laqueadura tubária", "Ginecologia", "Maternidade Municipal", "2026-12-08", "Manhã", 5],
  ["Vasectomia", "Urologia", "Policlínica Municipal", "2026-12-09", "Tarde", 8],
  ["Artroplastia de quadril", "Ortopedia", "Hospital Geral de Camaçari", "2026-12-10", "Manhã", 1],
  ["Pterígio", "Oftalmologia", "Policlínica Municipal", "2026-12-11", "Tarde", 9],
  ["Tireoidectomia", "Cirurgia de Cabeça e Pescoço", "Hospital Geral de Camaçari", "2026-12-15", "Manhã", 2],
  ["Herniorrafia umbilical", "Cirurgia Geral", "Hospital Geral de Camaçari", "2026-12-16", "Tarde", 6],
].map(([procedimento, especialidade, unidade, data, turno, vagas], index) => ({
  id: `cir-${index}`,
  procedimento: procedimento as string,
  especialidade: especialidade as string,
  unidade: unidade as string,
  data: data as string,
  turno: turno as Cirurgia["turno"],
  vagas: vagas as number,
}));

export type Caps = {
  nome: string;
  tipo: string;
  publico: string;
  endereco: string;
  bairro: string;
  telefone: string;
  horario: string;
};

export const CAPS_UNIDADES: Caps[] = [
  { nome: "CAPS II Nise da Silveira", tipo: "CAPS II", publico: "Adultos com transtornos mentais graves e persistentes", endereco: "Rua do Contorno, 88", bairro: "Centro", telefone: "(71) 3621-5530", horario: "Seg a Sex · 08h às 18h" },
  { nome: "CAPS AD Camaçari", tipo: "CAPS AD", publico: "Pessoas com necessidades decorrentes do uso de álcool e outras drogas", endereco: "Av. Radial B, 310", bairro: "Gleba A", telefone: "(71) 3621-5541", horario: "Seg a Sex · 08h às 18h" },
  { nome: "CAPSi Crescer", tipo: "CAPSi", publico: "Crianças e adolescentes", endereco: "Rua Jequitibá, 52", bairro: "Gravatá", telefone: "(71) 3621-5560", horario: "Seg a Sex · 08h às 17h" },
  { nome: "CAPS II Orla", tipo: "CAPS II", publico: "Adultos — atendimento aos distritos da orla", endereco: "Av. Beira-Mar, 1200", bairro: "Arembepe", telefone: "(71) 3624-3302", horario: "Seg a Sex · 08h às 17h" },
  { nome: "Unidade de Acolhimento Adulto", tipo: "UA", publico: "Acolhimento transitório vinculado ao CAPS AD", endereco: "Rua das Palmeiras, 15", bairro: "Gleba C", telefone: "(71) 3621-5577", horario: "24 horas" },
];

export type RedeApoio = { nome: string; descricao: string; contato: string; href?: string; icon: string };

export const REDES_APOIO: RedeApoio[] = [
  { nome: "CVV — Centro de Valorização da Vida", descricao: "Apoio emocional e prevenção do suicídio, gratuito e sigiloso, 24 horas.", contato: "Ligue 188", href: "tel:188", icon: "support_agent" },
  { nome: "SAMU 192", descricao: "Urgências e emergências, inclusive crises psiquiátricas com risco à vida.", contato: "Ligue 192", href: "tel:192", icon: "emergency" },
  { nome: "Grupo de Apoio a Familiares (CAPS II)", descricao: "Encontros quinzenais para familiares e cuidadores, às quintas, 14h.", contato: "(71) 3621-5530", href: "tel:7136215530", icon: "groups" },
  { nome: "Práticas Integrativas na Atenção Primária", descricao: "Yoga, meditação e auriculoterapia nas USF polo, com inscrição na recepção.", contato: "Procure sua USF de referência", icon: "self_improvement" },
  { nome: "Ouvidoria SUS", descricao: "Sugestões, elogios e reclamações sobre os serviços de saúde mental.", contato: "Ligue 136", href: "tel:136", icon: "record_voice_over" },
];

export type ParadaOdontomovel = { id: string; local: string; distrito: string; inicio: string; fim: string; servicos: string; vagasDia: number };

export const ODONTOMOVEL: ParadaOdontomovel[] = [
  { id: "odo-1", local: "Praça Central de Barra do Pojuca", distrito: "Barra do Pojuca", inicio: "2026-11-09", fim: "2026-11-13", servicos: "Profilaxia, restaurações e triagem", vagasDia: 30 },
  { id: "odo-2", local: "Escola Municipal de Monte Gordo", distrito: "Monte Gordo", inicio: "2026-11-16", fim: "2026-11-20", servicos: "Profilaxia, restaurações e triagem", vagasDia: 30 },
  { id: "odo-3", local: "Praça da Igreja de Vila de Abrantes", distrito: "Vila de Abrantes", inicio: "2026-11-23", fim: "2026-11-27", servicos: "Profilaxia, restaurações e extrações simples", vagasDia: 28 },
  { id: "odo-4", local: "Associação de Moradores de Jauá", distrito: "Jauá", inicio: "2026-11-30", fim: "2026-12-04", servicos: "Profilaxia e aplicação de flúor (escolares)", vagasDia: 35 },
  { id: "odo-5", local: "Largo de Arembepe", distrito: "Arembepe", inicio: "2026-12-07", fim: "2026-12-11", servicos: "Profilaxia, restaurações e triagem", vagasDia: 30 },
  { id: "odo-6", local: "Quadra Poliesportiva de Guarajuba", distrito: "Guarajuba", inicio: "2026-12-14", fim: "2026-12-18", servicos: "Triagem e encaminhamento para CEO", vagasDia: 25 },
  { id: "odo-7", local: "Centro Comunitário de Catu de Abrantes", distrito: "Catu de Abrantes", inicio: "2027-01-11", fim: "2027-01-15", servicos: "Profilaxia, restaurações e triagem", vagasDia: 30 },
];

/* ------------------------------------------------------------------ */
/* Vigilância — mutirões do Castramóvel                                */
/* ------------------------------------------------------------------ */

export type Mutirao = { id: string; local: string; bairro: string; data: string; vagas: number };

export const MUTIROES_CASTRAMOVEL: Mutirao[] = [
  { id: "cas-1", local: "Centro de Controle de Zoonoses", bairro: "Gleba C", data: "2026-11-28", vagas: 40 },
  { id: "cas-2", local: "Praça de Arembepe", bairro: "Arembepe", data: "2026-12-05", vagas: 35 },
  { id: "cas-3", local: "Escola Municipal Ponto Certo", bairro: "Ponto Certo", data: "2026-12-12", vagas: 40 },
  { id: "cas-4", local: "Quadra de Monte Gordo", bairro: "Monte Gordo", data: "2026-12-19", vagas: 30 },
  { id: "cas-5", local: "Centro de Controle de Zoonoses", bairro: "Gleba C", data: "2027-01-09", vagas: 40 },
];

/* ------------------------------------------------------------------ */
/* Registros (CRUD) — tipos e dados iniciais                           */
/* ------------------------------------------------------------------ */

export type Manifestacao = BaseRecord & {
  tipo: string;
  assunto: string;
  unidade: string;
  descricao: string;
  nome: string;
  email: string;
  telefone: string;
  resposta?: string;
};

export type Voluntario = BaseRecord & {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  area: string;
  disponibilidade: string;
  observacoes: string;
};

export type SolicitacaoTfd = BaseRecord & {
  paciente: string;
  cns: string;
  cidadeDestino: string;
  especialidade: string;
  dataConsulta: string;
  acompanhante: string;
  observacoes: string;
};

export type SolicitacaoVisa = BaseRecord & {
  tipo: string;
  razaoSocial: string;
  cnpj: string;
  atividade: string;
  endereco: string;
  responsavelTecnico: string;
  registroConselho: string;
  observacoes: string;
};

export type AgendamentoCastracao = BaseRecord & {
  tutor: string;
  telefone: string;
  nomeAnimal: string;
  especie: string;
  sexo: string;
  idade: string;
  mutiraoId: string;
};

export type DenunciaZoonose = BaseRecord & {
  tipo: string;
  endereco: string;
  bairro: string;
  referencia: string;
  descricao: string;
  telefone: string;
};

const base = (id: string, protocolo: string, status: string, createdAt: string) => ({
  id,
  protocolo,
  status,
  createdAt,
  updatedAt: createdAt,
  ownerCpf: DEMO_CPF,
});

export const SEED_MANIFESTACOES: Manifestacao[] = [
  {
    ...base("seed-man-1", "OUV-202610-104233", "Respondida", "2026-10-08T10:14:00.000Z"),
    tipo: "Elogio",
    assunto: "Atendimento",
    unidade: "USF Gravatá — Dr. José Ramos da Silva",
    descricao: "Fui muito bem atendida pela equipe de enfermagem na campanha de vacinação contra a gripe. Atendimento rápido e humanizado.",
    nome: DEMO_USER.nome,
    email: DEMO_USER.email,
    telefone: DEMO_USER.telefone,
    resposta: "Agradecemos o reconhecimento. O elogio foi encaminhado à coordenação da USF Gravatá e à equipe envolvida.",
  },
  {
    ...base("seed-man-2", "OUV-202611-118790", "Em análise", "2026-11-12T15:40:00.000Z"),
    tipo: "Reclamação",
    assunto: "Medicamentos",
    unidade: "USF Gleba B — Irmã Dulce",
    descricao: "Losartana 50 mg em falta na farmácia da unidade há duas semanas. Preciso do medicamento de uso contínuo.",
    nome: DEMO_USER.nome,
    email: DEMO_USER.email,
    telefone: DEMO_USER.telefone,
  },
];

export const SEED_VOLUNTARIOS: Voluntario[] = [];
export const SEED_TFD: SolicitacaoTfd[] = [];
export const SEED_VISA: SolicitacaoVisa[] = [];
export const SEED_CASTRACOES: AgendamentoCastracao[] = [
  {
    ...base("seed-cas-1", "CAS-202611-220415", "Confirmado", "2026-11-10T09:00:00.000Z"),
    tutor: DEMO_USER.nome,
    telefone: DEMO_USER.telefone,
    nomeAnimal: "Pipoca",
    especie: "Gato",
    sexo: "Fêmea",
    idade: "1 ano",
    mutiraoId: "cas-1",
  },
];
export const SEED_DENUNCIAS: DenunciaZoonose[] = [];
