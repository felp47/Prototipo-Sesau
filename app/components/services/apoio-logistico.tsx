"use client";

import { STATUS_EDITAVEIS, useTfd, useVoluntarios } from "../../lib/data-hooks";
import type { SolicitacaoTfd, Voluntario } from "../../lib/mock-data";
import { formatDate, maskCns } from "../../lib/validators";
import { RecordManager } from "../records/record-manager";

const CIDADES_TFD = ["Salvador - BA", "Feira de Santana - BA", "Aracaju - SE", "Recife - PE", "São Paulo - SP", "Barretos - SP"];
const ESPECIALIDADES_TFD = ["Oncologia", "Cardiologia (alta complexidade)", "Neurocirurgia", "Nefrologia / Hemodiálise", "Transplantes", "Oftalmologia (alta complexidade)", "Ortopedia (alta complexidade)"];
const AREAS_VOLUNTARIADO = ["Campanhas de vacinação", "Mutirões de combate à dengue", "Acolhimento nas unidades", "Apoio administrativo", "Eventos de educação em saúde"];
const DISPONIBILIDADES = ["Dias úteis — manhã", "Dias úteis — tarde", "Sábados", "Domingos e feriados", "Flexível"];

export function TfdManager() {
  const collection = useTfd();
  return (
    <RecordManager<SolicitacaoTfd>
      id="tfd-logistica"
      title="TFD — Tratamento Fora do Domicílio"
      description="Solicite transporte e ajuda de custo para tratamento fora de Camaçari, mediante laudo do médico do SUS."
      icon="airport_shuttle"
      singular="Solicitação de TFD"
      collection={collection}
      createActions={[{ label: "Solicitar TFD", icon: "add_road" }]}
      fields={[
        { name: "paciente", label: "Nome do paciente", kind: "text", required: true, prefill: (p) => p.nome },
        { name: "cns", label: "Cartão SUS do paciente", kind: "cns", required: true, prefill: (p) => p.cns },
        { name: "cidadeDestino", label: "Cidade de destino", kind: "select", required: true, options: CIDADES_TFD.map((c) => ({ value: c, label: c })) },
        { name: "especialidade", label: "Especialidade", kind: "select", required: true, options: ESPECIALIDADES_TFD.map((e) => ({ value: e, label: e })) },
        { name: "dataConsulta", label: "Data do atendimento no destino", kind: "date", required: true, min: "today", help: "Solicite com no mínimo 10 dias de antecedência." },
        { name: "acompanhante", label: "Necessita de acompanhante?", kind: "select", required: true, options: [{ value: "Sim", label: "Sim (mediante justificativa médica)" }, { value: "Não", label: "Não" }] },
        { name: "observacoes", label: "Observações", kind: "textarea", maxLength: 500, placeholder: "Ex.: uso de cadeira de rodas, horário do exame..." },
      ]}
      summary={(r) => ({ title: `${r.especialidade} — ${r.cidadeDestino}`, subtitle: `${r.paciente} · atendimento em ${formatDate(r.dataConsulta)}` })}
      details={(r) => [
        ["Paciente", r.paciente],
        ["Cartão SUS", maskCns(r.cns)],
        ["Destino", r.cidadeDestino],
        ["Especialidade", r.especialidade],
        ["Data do atendimento", formatDate(r.dataConsulta)],
        ["Acompanhante", r.acompanhante],
        ["Observações", r.observacoes],
        ["Próximo passo", "Apresente o laudo médico (com CID) e documentos na Central de TFD, Centro Administrativo, em até 5 dias úteis."],
      ]}
      statusOptions={["Em análise", "Aprovada", "Viagem agendada", "Cancelada"]}
      editableStatuses={STATUS_EDITAVEIS.tfd}
      deleteLabel="Cancelar"
      successMessage={(r) => `Solicitação de TFD enviada. Protocolo ${r.protocolo}.`}
      emptyMessage="Nenhuma solicitação de TFD registrada."
    />
  );
}

export function VoluntariosManager() {
  const collection = useVoluntarios();
  return (
    <RecordManager<Voluntario>
      id="inscricao-de-voluntarios"
      title="Inscrição de Voluntários"
      description="Participe das campanhas e mutirões de saúde do município (Edital de Chamamento nº 02/2025)."
      icon="volunteer_activism"
      singular="Inscrição"
      collection={collection}
      createActions={[{ label: "Quero ser voluntário", icon: "person_add" }]}
      fields={[
        { name: "nome", label: "Nome completo", kind: "text", required: true, prefill: (p) => p.nome },
        { name: "cpf", label: "CPF", kind: "cpf", required: true, prefill: (p) => p.cpf },
        { name: "email", label: "E-mail", kind: "email", required: true, prefill: (p) => p.email },
        { name: "telefone", label: "Telefone (WhatsApp)", kind: "tel", required: true, prefill: (p) => p.telefone },
        { name: "area", label: "Área de interesse", kind: "select", required: true, options: AREAS_VOLUNTARIADO.map((a) => ({ value: a, label: a })) },
        { name: "disponibilidade", label: "Disponibilidade", kind: "select", required: true, options: DISPONIBILIDADES.map((d) => ({ value: d, label: d })) },
        { name: "observacoes", label: "Experiência ou observações", kind: "textarea", maxLength: 500, placeholder: "Ex.: sou estudante de enfermagem, tenho experiência em atendimento ao público..." },
      ]}
      summary={(r) => ({ title: `${r.nome} — ${r.area}`, subtitle: r.disponibilidade })}
      details={(r) => [
        ["Nome", r.nome],
        ["CPF", r.cpf],
        ["E-mail", r.email],
        ["Telefone", r.telefone],
        ["Área de interesse", r.area],
        ["Disponibilidade", r.disponibilidade],
        ["Observações", r.observacoes],
      ]}
      statusOptions={["Inscrição recebida", "Inscrição aprovada", "Cancelada"]}
      editableStatuses={STATUS_EDITAVEIS.voluntarios}
      deleteLabel="Cancelar"
      successMessage={(r) => `Inscrição recebida! Protocolo ${r.protocolo}. A equipe entrará em contato.`}
      emptyMessage="Nenhuma inscrição de voluntário registrada."
    />
  );
}
