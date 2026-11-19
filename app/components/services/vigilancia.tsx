"use client";

import { useMemo } from "react";
import { STATUS_EDITAVEIS, useCastracoes, useDenuncias, useSolicitacoesVisa } from "../../lib/data-hooks";
import { BAIRROS, MUTIROES_CASTRAMOVEL, type AgendamentoCastracao, type DenunciaZoonose, type SolicitacaoVisa } from "../../lib/mock-data";
import { formatDate } from "../../lib/validators";
import { RecordManager } from "../records/record-manager";

const TIPO_ALVARA = "Renovação de Alvará Sanitário";
const TIPO_RT = "Termo de Responsabilidade Técnica";
const ATIVIDADES = ["Farmácia / Drogaria", "Restaurante / Lanchonete", "Supermercado / Mercearia", "Clínica / Consultório", "Laboratório", "Academia", "Salão de beleza / Estética", "Indústria de alimentos"];

const VISA = {
  alvara: {
    tipo: TIPO_ALVARA,
    id: "renovacao-de-alvara",
    title: "Renovação de Alvará Sanitário",
    description: "Protocole a renovação do alvará sanitário do seu estabelecimento.",
    icon: "autorenew",
    action: { label: "Renovar alvará", icon: "autorenew" },
  },
  rt: {
    tipo: TIPO_RT,
    id: "termo-de-resp-tecnica",
    title: "Termo de Responsabilidade Técnica",
    description: "Protocole o termo de responsabilidade técnica do seu estabelecimento.",
    icon: "assignment_ind",
    action: { label: "Enviar termo de RT", icon: "assignment_ind" },
  },
} as const;

/** Solicitações da VISA de um único tipo (cada item do menu tem a sua página) */
export function VisaManager({ tipo }: { tipo: keyof typeof VISA }) {
  const config = VISA[tipo];
  const all = useSolicitacoesVisa();
  const items = useMemo(() => all.items.filter((r) => r.tipo === config.tipo), [all.items, config.tipo]);
  const collection = useMemo(() => ({ ...all, items }), [all, items]);
  return (
    <RecordManager<SolicitacaoVisa>
      id={config.id}
      title={config.title}
      description={config.description}
      icon={config.icon}
      singular="Solicitação"
      collection={collection}
      createActions={[{ ...config.action, preset: { tipo: config.tipo } }]}
      fields={[
        { name: "tipo", label: "Tipo de solicitação", kind: "select", required: true, full: true, options: [{ value: config.tipo, label: config.tipo }] },
        { name: "razaoSocial", label: "Razão social", kind: "text", required: true },
        { name: "cnpj", label: "CNPJ", kind: "cnpj", required: true },
        { name: "atividade", label: "Atividade", kind: "select", required: true, options: ATIVIDADES.map((a) => ({ value: a, label: a })) },
        { name: "endereco", label: "Endereço do estabelecimento", kind: "text", required: true },
        { name: "responsavelTecnico", label: "Responsável técnico", kind: "text", required: (v) => v.tipo === TIPO_RT, help: "Obrigatório para o termo de RT." },
        { name: "registroConselho", label: "Registro no conselho (CRF, CRM...)", kind: "text", required: (v) => v.tipo === TIPO_RT, placeholder: "Ex.: CRF-BA 12345" },
        { name: "observacoes", label: "Observações", kind: "textarea", maxLength: 500 },
      ]}
      summary={(r) => ({ title: `${r.tipo} — ${r.razaoSocial}`, subtitle: `${r.atividade} · CNPJ ${r.cnpj}` })}
      details={(r) => [
        ["Tipo", r.tipo],
        ["Razão social", r.razaoSocial],
        ["CNPJ", r.cnpj],
        ["Atividade", r.atividade],
        ["Endereço", r.endereco],
        ["Responsável técnico", r.responsavelTecnico],
        ["Registro no conselho", r.registroConselho],
        ["Observações", r.observacoes],
        ["Próximo passo", "A vistoria sanitária será agendada pela equipe da VISA em até 15 dias úteis (Portaria SESAU nº 063/2025)."],
      ]}
      statusOptions={["Protocolado", "Em vistoria", "Deferido", "Indeferido"]}
      editableStatuses={STATUS_EDITAVEIS.visa}
      deleteLabel="Cancelar"
      successMessage={(r) => `${r.tipo} protocolada. Protocolo ${r.protocolo}.`}
      emptyMessage={`Nenhuma solicitação de ${config.title.toLowerCase()} registrada.`}
    />
  );
}

export function CastramovelManager() {
  const collection = useCastracoes();
  const ocupadas = (mutiraoId: string, ignorarId?: string) => collection.items.filter((item) => item.mutiraoId === mutiraoId && item.id !== ignorarId && item.status !== "Cancelado").length;
  const mutirao = (id: string) => MUTIROES_CASTRAMOVEL.find((m) => m.id === id);

  return (
    <RecordManager<AgendamentoCastracao>
      id="castramovel"
      title="Castramóvel — Agendamento de castração"
      description="Castração gratuita de cães e gatos. Escolha um mutirão com vagas disponíveis."
      icon="pets"
      singular="Agendamento"
      collection={collection}
      createActions={[{ label: "Agendar castração", icon: "event_available" }]}
      fields={[
        {
          name: "mutiraoId",
          label: "Mutirão (data e local)",
          kind: "select",
          required: true,
          full: true,
          options: (values, editing) =>
            MUTIROES_CASTRAMOVEL.map((m) => {
              const restantes = m.vagas - ocupadas(m.id, editing?.id);
              return { value: m.id, label: `${formatDate(m.data)} · ${m.local} (${m.bairro}) — ${restantes > 0 ? `${restantes} vagas` : "esgotado"}`, disabled: restantes <= 0 && values.mutiraoId !== m.id };
            }),
        },
        { name: "tutor", label: "Nome do tutor", kind: "text", required: true, prefill: (p) => p.nome },
        { name: "telefone", label: "Telefone", kind: "tel", required: true, prefill: (p) => p.telefone },
        { name: "nomeAnimal", label: "Nome do animal", kind: "text", required: true },
        { name: "especie", label: "Espécie", kind: "select", required: true, options: ["Cão", "Gato"].map((e) => ({ value: e, label: e })) },
        { name: "sexo", label: "Sexo", kind: "select", required: true, options: ["Macho", "Fêmea"].map((e) => ({ value: e, label: e })) },
        { name: "idade", label: "Idade aproximada", kind: "select", required: true, options: ["6 meses a 1 ano", "1 ano", "2 a 4 anos", "5 a 7 anos", "8 anos ou mais"].map((e) => ({ value: e, label: e })) },
      ]}
      summary={(r) => {
        const m = mutirao(r.mutiraoId);
        return { title: `${r.nomeAnimal} (${r.especie}, ${r.sexo})`, subtitle: m ? `${formatDate(m.data)} · ${m.local}` : "Mutirão não encontrado" };
      }}
      details={(r) => {
        const m = mutirao(r.mutiraoId);
        return [
          ["Animal", `${r.nomeAnimal} — ${r.especie}, ${r.sexo}, ${r.idade}`],
          ["Tutor", r.tutor],
          ["Telefone", r.telefone],
          ["Mutirão", m ? `${formatDate(m.data)} · ${m.local} (${m.bairro})` : "—"],
          ["Orientações", "Jejum de 8 horas de comida e 4 horas de água. Cães com guia e focinheira; gatos em caixa de transporte."],
        ];
      }}
      statusOptions={["Confirmado", "Realizado", "Cancelado"]}
      editableStatuses={STATUS_EDITAVEIS.castracoes}
      deleteLabel="Cancelar"
      successMessage={(r) => `Castração agendada para ${r.nomeAnimal}. Protocolo ${r.protocolo}.`}
      emptyMessage="Nenhum agendamento do Castramóvel."
    />
  );
}

export function ZoonosesManager() {
  const collection = useDenuncias();
  return (
    <RecordManager<DenunciaZoonose>
      id="controle-de-zoonoses"
      title="Controle de Zoonoses — Visita e denúncia de focos"
      description="Solicite a visita de agentes de endemias ou denuncie focos do mosquito Aedes aegypti e outros riscos."
      icon="pest_control"
      singular="Solicitação"
      collection={collection}
      createActions={[{ label: "Solicitar visita / denunciar foco", icon: "report" }]}
      fields={[
        { name: "tipo", label: "Tipo", kind: "select", required: true, full: true, options: ["Foco do mosquito (água parada)", "Terreno baldio com lixo", "Escorpiões / animais peçonhentos", "Morcegos ou ratos", "Animal com suspeita de raiva"].map((t) => ({ value: t, label: t })) },
        { name: "endereco", label: "Endereço da ocorrência", kind: "text", required: true, prefill: (p) => p.endereco },
        { name: "bairro", label: "Bairro", kind: "select", required: true, options: BAIRROS.map((b) => ({ value: b, label: b })), prefill: (p) => p.bairro },
        { name: "referencia", label: "Ponto de referência", kind: "text" },
        { name: "telefone", label: "Telefone para contato", kind: "tel", prefill: (p) => p.telefone },
        { name: "descricao", label: "Descrição", kind: "textarea", required: true, maxLength: 600, validate: (v) => (v.length < 15 ? "Descreva com ao menos 15 caracteres." : undefined) },
      ]}
      summary={(r) => ({ title: r.tipo, subtitle: `${r.endereco} — ${r.bairro}` })}
      details={(r) => [
        ["Tipo", r.tipo],
        ["Endereço", `${r.endereco} — ${r.bairro}`],
        ["Referência", r.referencia],
        ["Telefone", r.telefone],
        ["Descrição", r.descricao],
        ["Prazo", "A equipe de endemias realiza a visita em até 5 dias úteis."],
      ]}
      statusOptions={["Recebida", "Visita agendada", "Concluída"]}
      editableStatuses={STATUS_EDITAVEIS.zoonoses}
      deleteLabel="Cancelar"
      successMessage={(r) => `Solicitação registrada. Protocolo ${r.protocolo}.`}
      emptyMessage="Nenhuma solicitação de visita registrada."
    />
  );
}
