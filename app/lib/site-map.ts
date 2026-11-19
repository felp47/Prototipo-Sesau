/**
 * Fonte única da arquitetura de navegação do portal SESAU Camaçari.
 *
 * Header (3 níveis), rodapé, breadcrumbs, menus laterais, busca, mapa do site
 * e o roteamento dos links internos das telas do Stitch (bridge.js) leem
 * daqui. Todos os textos foram extraídos das telas exportadas em /telas.
 */

export type NavItem = {
  /** Rótulo usado no dropdown do header (Stitch) */
  label: string;
  /** Rótulo usado no rodapé do Stitch, quando diferente */
  footerLabel?: string;
  href: string;
  keywords?: string[];
  /** Âncoras antigas (#id) da página da seção que agora levam a esta página */
  legacyAnchors?: string[];
};

export type Highlight = {
  icon: string;
  tag: string;
  title: string;
  text: string;
  cta?: { label: string; icon: string; href: string };
  image?: { src: string; alt: string; date: string; category: string };
};

export type NavSection = {
  label: string;
  footerLabel: string;
  href: string;
  icon: string;
  items: NavItem[];
  keywords?: string[];
  /** Conteúdo do Stitch relacionado a esta subtela (texto literal) */
  highlights?: Highlight[];
};

export type NavCategory = {
  title: string;
  href: string;
  icon: string;
  description: string;
  sections: NavSection[];
  keywords?: string[];
};

export const MEDICAMENTOS_HREF = "/farmacia/acesso-medicamentos";
/** Páginas de itens usadas por CTAs das telas e de outros componentes */
export const ESTOQUE_HREF = `${MEDICAMENTOS_HREF}/fornecimento-e-estoque`;
export const REMUME_HREF = `${MEDICAMENTOS_HREF}/remedios-padronizados`;
export const POSTOS_HREF = "/institucional/acesso-funcionamento/mapa-de-postos";
export const OUVIDORIA_HREF = "/institucional/transparencia-ouvidoria/ouvidoria-sus";
export const PORTARIAS_HREF = "/institucional/transparencia-ouvidoria/portarias-e-diario";

export const CARTA_DE_SERVICOS_URL =
  "https://cartadeservicos.camacari.ba.gov.br/?secretaria=15#resultado";

export const PREFEITURA_URL = "https://www.camacari.ba.gov.br";

const highlightRegulacao: Highlight = {
  icon: "calendar_month",
  tag: "Central de Regulação",
  title: "Marcar Consulta & Exames",
  text: "Acompanhe a fila regulada do SUS, autorizações de exames especializados e pré-agendamentos para clínicos.",
};

const highlightPostos: Highlight = {
  icon: "pin_drop",
  tag: "Sede e Costa",
  title: "Encontre seu Posto de Saúde",
  text: "Localize a UBS ou USF mais próxima do seu bairro, horários de atendimento médico e equipe de referência.",
  cta: { label: "Abrir Mapa de Postos", icon: "map", href: POSTOS_HREF },
};

const highlightZoonoses: Highlight = {
  icon: "pest_control",
  tag: "Vigilância Ativa",
  title: "Controle da Dengue e Zoonoses",
  text: "Solicitação de visita dos agentes de endemias, denúncia de focos de mosquito e agenda do Castramóvel.",
};

const highlightNoticiaDengue: Highlight = {
  icon: "calendar_today",
  tag: "Ação Preventiva",
  title: "Mutirão de combate ao mosquito Aedes aegypti percorre bairros da sede e orla de Camaçari",
  text: "Equipes de controle de endemias reforçam visitas domiciliares, aplicação de larvicidas e conscientização direta dos moradores para eliminar água parada.",
  image: {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_N9CCOUHj391UA_bQuzy4vq9iCSsqKbJJpVXIX5NarP7z4PRU2POSPN6qe0HsrfNo_9aYQeDxwezk_9oB88s-EWgEipkqhK9Fb-DiIpIj-A7gc_d6Bqje_9DCmyqQseRWN7lejcMFhzEjrDNTHM1vXuUjjBnj_zDxbSYQJ6ODgmK2v3Z26LU4hUHmF0-rPqLUTLcaHMbkTGs7UIz8Mt_YsjxkpnA_xjJlUTl41m-q",
    alt: "Agente de endemias de Camaçari inspecionando reservatório de água em quintal residencial",
    date: "16 de Fevereiro, 2025",
    category: "Vigilância",
  },
};

const highlightNoticiaOdonto: Highlight = {
  icon: "calendar_today",
  tag: "Saúde Itinerante",
  title: "Odontomóvel divulga cronograma de atendimentos clínicos gratuitos na costa do município",
  text: "Carreta equipada levará profilaxia, restaurações e triagens odontológicas aos distritos de Barra do Pojuca, Monte Gordo e Vila de Abrantes nas próximas duas semanas.",
  image: {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqpqlavdpU3xAG52QL4wYQjtKU98Wv4zsm3ecjKNJYMruNTjRIBa98Nu8sbVRiQ897VsbWok6URRxwn9Ih-lzy3tvD1EMlTCLpEjVlYIGYfiX3iku3WFqr_q842HjxKOE0lnSOLWbef2Uvd3kyJC8J7FsyqDPCzL3IzrYYB5hGH0RnMg4IzgmdJxzlWBDvolpvCucmSIwCjP45x0iVxFC3oeABWw_s2uPwaWFTZDEV",
    alt: "Unidade móvel odontológica Odontomóvel estacionada em praça de Camaçari",
    date: "14 de Fevereiro, 2025",
    category: "Odontologia",
  },
};

export const highlightUpa: Highlight = {
  icon: "emergency",
  tag: "Plantão 24 Horas",
  title: "Emergência e UPA 24h",
  text: "Unidades de Pronto Atendimento em Gleba A, Pedreira do Abraão, Monte Gordo e Arembepe para casos agudos.",
  cta: { label: "Encontre seu Posto de Saúde", icon: "map", href: POSTOS_HREF },
};

export const categories: NavCategory[] = [
  {
    title: "Prevenção",
    href: "/prevencao",
    icon: "verified",
    description: "Boletins epidemiológicos, notícias da saúde e vacinação, centro de infectologia.",
    keywords: ["prevenção", "vigilância epidemiológica", "imunização", "saúde preventiva"],
    sections: [
      {
        label: "Boletins e Monitoramento",
        footerLabel: "Monitoramento",
        href: "/prevencao/boletins-monitoramento",
        icon: "monitoring",
        keywords: ["boletim", "epidemiológico", "dengue", "arboviroses", "liraa", "semana epidemiológica"],
        items: [{ label: "Boletim Epidemiológico", href: "/prevencao/boletins-monitoramento" }],
      },
      {
        label: "Notícias e Imunização",
        footerLabel: "Notícias & Vacina",
        href: "/prevencao/noticias-imunizacao",
        icon: "vaccines",
        keywords: ["vacina", "vacinação", "imunização", "campanha", "influenza", "covid", "sala de vacina", "caderneta", "notícias"],
        items: [
          { label: "Últimas Notícias", href: "/prevencao/noticias-imunizacao/ultimas-noticias" },
          { label: "Campanhas de Vacina", href: "/prevencao/noticias-imunizacao/campanhas-de-vacina", keywords: ["calendário de vacinação", "o que levar para se vacinar"], legacyAnchors: ["requisitos-vacina"] },
        ],
      },
      {
        label: "Unidades Especializadas",
        footerLabel: "Especializadas",
        href: "/prevencao/unidades-especializadas",
        icon: "biotech",
        keywords: ["infectologia", "cta", "ist", "hiv", "testagem"],
        items: [{ label: "Centro de Infectologia", href: "/prevencao/unidades-especializadas" }],
      },
    ],
  },
  {
    title: "Institucional",
    href: "/institucional",
    icon: "corporate_fare",
    description: "Mapa de postos e funcionamento, ouvidoria SUS e transparência, TFD e logística.",
    keywords: ["institucional", "sesau", "secretaria", "gestão municipal"],
    sections: [
      {
        label: "Acesso e Funcionamento",
        footerLabel: "Funcionamento",
        href: "/institucional/acesso-funcionamento",
        icon: "location_on",
        keywords: ["posto", "postos de saúde", "ubs", "usf", "unidade", "mapa", "horário", "bairro", "cartão sus"],
        highlights: [highlightPostos],
        items: [
          { label: "Mapa de Postos", footerLabel: "Mapa de Postos de Saúde", href: POSTOS_HREF },
          { label: "Atualização Cadastral", footerLabel: "Atualização Cadastral SUS", href: "/institucional/acesso-funcionamento/atualizacao-cadastral", keywords: ["cadastro", "cartão sus"] },
        ],
      },
      {
        label: "Transparência e Ouvidoria",
        footerLabel: "Transparência",
        href: "/institucional/transparencia-ouvidoria",
        icon: "record_voice_over",
        keywords: ["ouvidoria", "136", "denúncia", "elogio", "reclamação", "transparência", "carta de serviços", "portaria", "diário oficial"],
        items: [
          { label: "Ouvidoria SUS", footerLabel: "Ouvidoria Geral SUS", href: OUVIDORIA_HREF, keywords: ["manifestação", "protocolo", "reclamação", "denúncia", "elogio"] },
          { label: "Portarias e Diário", footerLabel: "Portarias e Diário Oficial", href: PORTARIAS_HREF, keywords: ["portaria", "resolução", "edital", "diário oficial"] },
        ],
      },
      {
        label: "Apoio Logístico",
        footerLabel: "Apoio Logístico",
        href: "/institucional/apoio-logistico",
        icon: "local_shipping",
        keywords: ["tfd", "tratamento fora do domicílio", "transporte", "voluntário", "voluntariado"],
        items: [
          { label: "TFD Logística", footerLabel: "TFD Logística Municipal", href: "/institucional/apoio-logistico/tfd-logistica" },
          { label: "Inscrição de Voluntários", href: "/institucional/apoio-logistico/inscricao-de-voluntarios" },
        ],
      },
    ],
  },
  {
    title: "Farmácia",
    href: "/farmacia",
    icon: "medication",
    description: "Fornecimento de medicamentos (REMUME), fórmulas nutricionais especiais e insumos.",
    keywords: ["farmácia", "assistência farmacêutica", "farmácia central", "policlínica"],
    sections: [
      {
        label: "Acesso a Medicamentos",
        footerLabel: "Medicamentos",
        href: MEDICAMENTOS_HREF,
        icon: "pill",
        keywords: [
          "remédio", "remédios", "medicamento", "medicamentos", "remume", "estoque", "receita",
          "remédios nos postos", "losartana", "dipirona", "insulina", "metformina", "amoxicilina", "clonazepam",
          "hipertensão", "diabetes", "antibiótico", "psicotrópico", "controlado",
        ],
        items: [
          { label: "Fornecimento e Estoque", href: ESTOQUE_HREF, keywords: ["remédios nos postos", "consultar estoque"], legacyAnchors: ["remedios-nos-postos"] },
          { label: "Remédios Padronizados", href: REMUME_HREF, keywords: ["remume", "lista padronizada"], legacyAnchors: ["bloco-medicamentos", "documentacao-necessaria"] },
        ],
      },
      {
        label: "Insumos e Nutrição Especial",
        footerLabel: "Insumos Especiais",
        href: "/farmacia/insumos-nutricao-especial",
        icon: "nutrition",
        keywords: ["fralda", "fraldas", "ostomia", "curativo", "sonda", "fórmula infantil", "aplv", "dieta enteral", "nutrição"],
        items: [
          { label: "Materiais Higiênicos", href: "/farmacia/insumos-nutricao-especial" },
          { label: "Fórmulas Alimentares", href: "/farmacia/insumos-nutricao-especial" },
        ],
      },
    ],
  },
  {
    title: "Serviços Clínicos",
    href: "/servicos-clinicos",
    icon: "stethoscope",
    description: "Consulta de agendamentos, cronograma de cirurgias, CAPS saúde mental e Odontomóvel.",
    keywords: ["serviços clínicos", "atendimento", "consulta médica"],
    sections: [
      {
        label: "Regulação e Agendamentos",
        footerLabel: "Regulação",
        href: "/servicos-clinicos/regulacao-agendamentos",
        icon: "calendar_month",
        keywords: ["agendamento", "agendar", "consulta", "exame", "exames", "cirurgia", "regulação", "fila", "marcar consulta"],
        highlights: [highlightRegulacao],
        items: [
          { label: "Consulta de Consultas", href: "/servicos-clinicos/regulacao-agendamentos/consulta-de-consultas" },
          { label: "Cronograma de Cirurgias", href: "/servicos-clinicos/regulacao-agendamentos/cronograma-de-cirurgias" },
        ],
      },
      {
        label: "Atenção Psicossocial",
        footerLabel: "Psicossocial",
        href: "/servicos-clinicos/atencao-psicossocial",
        icon: "psychology",
        keywords: ["caps", "saúde mental", "psicossocial", "apoio emocional", "psicólogo"],
        items: [
          { label: "Centros CAPS", footerLabel: "Centros CAPS Camaçari", href: "/servicos-clinicos/atencao-psicossocial/centros-caps" },
          { label: "Redes de Apoio", footerLabel: "Redes de Apoio Emocional", href: "/servicos-clinicos/atencao-psicossocial/redes-de-apoio" },
        ],
      },
      {
        label: "Serviços Odontológicos",
        footerLabel: "Odontologia",
        href: "/servicos-clinicos/servicos-odontologicos",
        icon: "dentistry",
        keywords: ["odontomóvel", "dentista", "odontologia", "dente", "saúde bucal"],
        highlights: [highlightNoticiaOdonto],
        items: [{ label: "Agenda do Odontomóvel", href: "/servicos-clinicos/servicos-odontologicos" }],
      },
    ],
  },
  {
    title: "Vigilância Sanitária",
    href: "/vigilancia-sanitaria",
    icon: "health_and_safety",
    description: "Alvará sanitário, responsabilidade técnica, castramóvel e controle de zoonoses.",
    keywords: ["vigilância sanitária", "visa", "fiscalização"],
    sections: [
      {
        label: "Serviços de Vigilância Sanitária",
        footerLabel: "Vigilância Sanitária",
        href: "/vigilancia-sanitaria/servicos",
        icon: "verified_user",
        keywords: ["alvará", "alvará sanitário", "licença", "responsabilidade técnica", "estabelecimento"],
        items: [
          { label: "Renovação de Alvará", href: "/vigilancia-sanitaria/servicos/renovacao-de-alvara" },
          { label: "Termo de Resp. Técnica", href: "/vigilancia-sanitaria/servicos/termo-de-resp-tecnica", keywords: ["termo de responsabilidade técnica"] },
        ],
      },
      {
        label: "Serviços Veterinários",
        footerLabel: "Veterinários",
        href: "/vigilancia-sanitaria/servicos-veterinarios",
        icon: "pets",
        keywords: ["castramóvel", "castração", "zoonoses", "dengue", "aedes", "mosquito", "endemias", "animais", "cachorro", "gato"],
        highlights: [highlightZoonoses, highlightNoticiaDengue],
        items: [
          { label: "Castramóvel", footerLabel: "Castramóvel Municipal", href: "/vigilancia-sanitaria/servicos-veterinarios/castramovel" },
          { label: "Controle de Zoonoses", href: "/vigilancia-sanitaria/servicos-veterinarios/controle-de-zoonoses" },
        ],
      },
    ],
  },
];

/** Rotas fora das cinco categorias */
export const extraPages = [
  { label: "Início", href: "/", description: "Portal da Saúde — SESAU Camaçari", keywords: ["home", "início", "portal"] },
  {
    label: "Plantão UPA 24h",
    href: "/upa-24h",
    description: highlightUpa.text,
    keywords: ["upa", "emergência", "urgência", "pronto atendimento", "plantão", "samu"],
  },
  { label: "Minha Conta", href: "/minha-conta", description: "Área do cidadão: dados cadastrais e acompanhamento de protocolos.", keywords: ["minha conta", "login", "entrar", "meus protocolos", "cadastro"] },
  { label: "Termos de Uso", href: "/termos-de-uso", description: "Condições de uso do Portal da Saúde.", keywords: ["termos"] },
  { label: "Privacidade e LGPD", href: "/privacidade", description: "Como os dados informados no portal são tratados.", keywords: ["privacidade", "lgpd", "dados pessoais"] },
  { label: "Mapa do Site", href: "/mapa-do-site", description: "Todas as páginas do portal organizadas pela arquitetura de navegação.", keywords: ["mapa do site", "sitemap"] },
  { label: "Busca", href: "/busca", description: "Pesquisa de páginas e conteúdos do portal.", keywords: ["buscar", "pesquisar"] },
];

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " e ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function slugify(text: string): string {
  return normalize(text).replace(/\s+/g, "-");
}

export function pathOf(href: string): string {
  return href.split("#")[0] || "/";
}

export type Crumb = { label: string; href: string };

/** Trilha (breadcrumb) da rota atual */
export function getTrail(pathname: string): Crumb[] {
  const trail: Crumb[] = [{ label: "Início", href: "/" }];
  if (pathname === "/") return trail;
  for (const category of categories) {
    if (pathname === category.href || pathname.startsWith(`${category.href}/`)) {
      trail.push({ label: category.title, href: category.href });
      const section = category.sections.find((s) => pathname === s.href || pathname.startsWith(`${s.href}/`));
      if (section) {
        trail.push({ label: section.label, href: section.href });
        const item = section.items.find((i) => i.href === pathname && i.href !== section.href);
        if (item) trail.push({ label: item.label, href: item.href });
      }
      return trail;
    }
  }
  const extra = extraPages.find((page) => page.href === pathname);
  if (extra) trail.push({ label: extra.label, href: extra.href });
  return trail;
}

export function findCategory(href: string): NavCategory | undefined {
  return categories.find((category) => category.href === href);
}

export function findSection(href: string): { category: NavCategory; section: NavSection } | undefined {
  for (const category of categories) {
    const section = category.sections.find((s) => s.href === href);
    if (section) return { category, section };
  }
  return undefined;
}

/** Item do menu (3º nível) com página própria */
export function findItem(href: string): { category: NavCategory; section: NavSection; item: NavItem } | undefined {
  for (const category of categories) {
    for (const section of category.sections) {
      const item = section.items.find((i) => i.href === href && i.href !== section.href);
      if (item) return { category, section, item };
    }
  }
  return undefined;
}

/** Itens de uma seção que possuem página própria (diferente da página da seção) */
export function itemPages(section: NavSection): NavItem[] {
  return section.items.filter((item) => item.href !== section.href);
}

/** Âncora antiga (#id) da página da seção → página do item correspondente */
export function legacyItemHref(section: NavSection, anchor: string): string | null {
  for (const item of itemPages(section)) {
    if (item.href.endsWith(`/${anchor}`) || item.legacyAnchors?.includes(anchor)) return item.href;
  }
  return null;
}

export function isActivePath(pathname: string, href: string): boolean {
  const path = pathOf(href);
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
}

/* ------------------------------------------------------------------ */
/* Links internos das telas do Stitch (todas exportadas com href="#")  */
/* ------------------------------------------------------------------ */

/** Texto do link (normalizado) → rota. Inclui rótulos do header, rodapé e CTAs das telas. */
const stitchLinkAliases: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  const add = (label: string, href: string) => {
    map[normalize(label)] = href;
  };
  for (const category of categories) {
    add(category.title, category.href);
    for (const section of category.sections) {
      add(section.label, section.href);
      for (const item of section.items) {
        add(item.label, item.href);
        if (item.footerLabel) add(item.footerLabel, item.href);
      }
    }
  }
  // CTAs da Home (portal_da_sa_de_sesau_cama_ari_home)
  add("Canais de Atendimento e Ouvidoria", OUVIDORIA_HREF);
  add("Ver catálogo completo de postos e rotinas", POSTOS_HREF);
  add("Consultar Estoque de Medicamentos", ESTOQUE_HREF);
  add("Abrir Mapa de Postos", POSTOS_HREF);
  add("Ver UPAs e Pronto Atendimento", "/upa-24h");
  add("Acompanhar Regulação", "/servicos-clinicos/regulacao-agendamentos");
  add("Ver Campanhas de Vacina", "/prevencao/noticias-imunizacao");
  add("Agendar Castramóvel & Focos", "/vigilancia-sanitaria/servicos-veterinarios");
  add("Acessar Boletim Epidemiológico e Notícias", "/prevencao/boletins-monitoramento");
  add("Registrar Elogio ou Denúncia", OUVIDORIA_HREF);
  add("Baixar Carta de Serviços (PDF)", CARTA_DE_SERVICOS_URL);
  add("Carta de Serviços", CARTA_DE_SERVICOS_URL);
  add("Ver Carta de Serviços", CARTA_DE_SERVICOS_URL);
  add("Plantão UPA 24h", "/upa-24h");
  add("Início", "/");
  // Prevenção
  add("Ver Postos Abertos", POSTOS_HREF);
  add("Ver Mapa Completo das 38 Unidades", POSTOS_HREF);
  // Postos / Remédios (rodapé do tema roxo)
  add("Unidades e Telefones", POSTOS_HREF);
  add("Horários de Atendimento", POSTOS_HREF);
  add("Fazer Manifestação", OUVIDORIA_HREF);
  add("Elogios e Reclamações", OUVIDORIA_HREF);
  // Documentos e ações sem página própria
  add("Ver Guia do CTA", "doc:guia-cta");
  add("Regulamento Farmacêutico", "doc:regulamento-farmaceutico");
  add("Saiba mais", "/prevencao/noticias-imunizacao/campanhas-de-vacina");
  add("Ver escala", POSTOS_HREF);
  add("WhatsApp Saúde", OUVIDORIA_HREF);
  add("Termos de Uso", "/termos-de-uso");
  add("Privacidade e LGPD", "/privacidade");
  add("Ver todos os avisos", "/prevencao/noticias-imunizacao/ultimas-noticias");
  add("Todas as notícias", "/prevencao/noticias-imunizacao/ultimas-noticias");
  add("Ler notícia completa", "/prevencao/noticias-imunizacao/ultimas-noticias");
  add("Saúde para Profissionais Protocolos e notas técnicas", PORTARIAS_HREF);
  add("Conselho de Saúde Participação social e reuniões", PORTARIAS_HREF);
  add("Documentos e Editais Relatórios e transparência", PORTARIAS_HREF);
  add("Relatórios de Gestão", PORTARIAS_HREF);
  add("Conselho de Saúde", PORTARIAS_HREF);
  add("Prestação de Contas", PORTARIAS_HREF);
  add("Acessibilidade", "/mapa-do-site");
  add("Serviços", "/mapa-do-site");
  add("SAMU 192 (Urgência)", "/upa-24h");
  add("Portal da Prefeitura", PREFEITURA_URL);
  // Cards de notícias da Home (marcados com data-bridge-link no build das telas)
  add("noticia-vacinacao", "/prevencao/noticias-imunizacao/ultimas-noticias");
  add("noticia-dengue", "/vigilancia-sanitaria/servicos-veterinarios");
  add("noticia-odontomovel", "/servicos-clinicos/servicos-odontologicos");
  return map;
})();

const stitchDataPaths: Record<string, string> = {
  home: "/",
  prevencao: "/prevencao",
  institucional: "/institucional",
  farmacia: "/farmacia",
  "servicos-clinicos": "/servicos-clinicos",
  "vigilancia-sanitaria": "/vigilancia-sanitaria",
  "upa-urgencia": "/upa-24h",
};

/** Âncoras das telas → rota que exibe aquele bloco */
const stitchAnchors: Record<string, string> = {
  "bloco-1-1": "/prevencao/boletins-monitoramento",
  "bloco-1-2": "/prevencao/noticias-imunizacao",
  "requisitos-vacina": "/prevencao/noticias-imunizacao/campanhas-de-vacina",
  "bloco-1-3": "/prevencao/unidades-especializadas",
  "bloco-medicamentos": `${REMUME_HREF}#bloco-medicamentos`,
  "documentacao-necessaria": `${REMUME_HREF}#documentacao-necessaria`,
  "bloco-insumos": "/farmacia/insumos-nutricao-especial#bloco-insumos",
  "fluxo-triagem": "/farmacia/insumos-nutricao-especial#fluxo-triagem",
  "farmacia-central": "/farmacia#farmacia-central",
};

/**
 * Resolve um link clicado dentro de uma tela do Stitch.
 * Prioridade: texto exato (mais específico) → data-path da categoria.
 * Retorna null quando o destino ainda não existe (ex.: PDF não publicado).
 */
export function resolveStitchLink(dataPath: string, text: string): string | null {
  const byText = stitchLinkAliases[normalize(text)];
  if (byText) return byText;
  if (dataPath && stitchDataPaths[dataPath]) return stitchDataPaths[dataPath];
  return null;
}

export function resolveStitchAnchor(id: string): string | null {
  return stitchAnchors[id] ?? null;
}

/* ------------------------------------------------------------------ */
/* Busca                                                               */
/* ------------------------------------------------------------------ */

export type SearchEntry = {
  title: string;
  href: string;
  context: string;
  description: string;
  haystack: string;
};

export const searchIndex: SearchEntry[] = (() => {
  const entries: SearchEntry[] = [];
  const push = (title: string, href: string, context: string, description: string, keywords: string[] = []) => {
    entries.push({ title, href, context, description, haystack: normalize([title, context, description, ...keywords].join(" ")) });
  };
  for (const category of categories) {
    push(category.title, category.href, "Categoria", category.description, category.keywords);
    for (const section of category.sections) {
      const sectionText = section.items.map((item) => item.label).join(", ");
      push(section.label, section.href, category.title, sectionText, [
        ...(section.keywords ?? []),
        ...(section.highlights ?? []).map((h) => `${h.title} ${h.text}`),
      ]);
      for (const item of section.items) {
        if (item.href === section.href) continue;
        push(item.label, item.href, `${category.title} › ${section.label}`, section.label, [item.footerLabel ?? "", ...(item.keywords ?? []), ...(section.keywords ?? [])]);
      }
    }
  }
  for (const page of extraPages) {
    if (page.href === "/busca") continue;
    push(page.label, page.href, "Portal", page.description, page.keywords);
  }
  return entries;
})();

export function searchPortal(query: string, limit = 50): SearchEntry[] {
  const terms = normalize(query).split(" ").filter((term) => term.length > 1);
  if (terms.length === 0) return [];
  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of searchIndex) {
    const title = normalize(entry.title);
    let score = 0;
    let matchedAll = true;
    for (const term of terms) {
      if (title.includes(term)) score += 6;
      else if (entry.haystack.includes(term)) score += 2;
      else matchedAll = false;
    }
    if (!matchedAll) continue;
    if (title === normalize(query)) score += 10;
    // páginas inteiras antes de itens que apontam para âncoras
    if (!entry.href.includes("#")) score += 1;
    scored.push({ entry, score });
  }
  scored.sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const result: SearchEntry[] = [];
  for (const { entry } of scored) {
    const key = `${entry.title}|${entry.href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(entry);
    if (result.length >= limit) break;
  }
  return result;
}
