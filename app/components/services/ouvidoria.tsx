"use client";

import { useState } from "react";
import { STATUS_EDITAVEIS, useManifestacoes } from "../../lib/data-hooks";
import { PORTARIAS, UNIDADES, type Manifestacao } from "../../lib/mock-data";
import { formatDateTime } from "../../lib/validators";
import { DocumentList } from "../documents/document-list";
import { RecordManager } from "../records/record-manager";
import { StatusBadge } from "../records/status-badge";
import { FormAlert } from "../ui/form-fields";
import { Button } from "../ui/modal";
import { ServiceCard } from "./service-card";

const TIPOS = ["Elogio", "Sugestão", "Solicitação", "Reclamação", "Denúncia"];
const ASSUNTOS = ["Atendimento", "Medicamentos", "Agendamento de consultas e exames", "Vacinação", "Estrutura da unidade", "Vigilância sanitária", "Outros"];

export function ManifestacoesManager() {
  const collection = useManifestacoes();
  return (
    <RecordManager<Manifestacao>
      id="ouvidoria-sus"
      title="Ouvidoria SUS — Manifestações"
      description="Registre elogios, sugestões, solicitações, reclamações ou denúncias e acompanhe pelo número de protocolo."
      icon="record_voice_over"
      singular="Manifestação"
      collection={collection}
      createActions={[{ label: "Registrar manifestação", icon: "add_comment" }]}
      fields={[
        { name: "tipo", label: "Tipo de manifestação", kind: "select", required: true, options: TIPOS.map((t) => ({ value: t, label: t })) },
        { name: "assunto", label: "Assunto", kind: "select", required: true, options: ASSUNTOS.map((a) => ({ value: a, label: a })) },
        {
          name: "unidade",
          label: "Unidade relacionada",
          kind: "select",
          full: true,
          options: [...UNIDADES.map((u) => ({ value: u.nome, label: u.nome })), { value: "Não se aplica", label: "Não se aplica / outra" }],
        },
        { name: "descricao", label: "Descreva sua manifestação", kind: "textarea", required: true, maxLength: 1000, placeholder: "Conte o que aconteceu, quando e onde.", validate: (v) => (v.length < 20 ? "Descreva com ao menos 20 caracteres." : undefined) },
        { name: "nome", label: "Nome completo", kind: "text", required: (v) => v.tipo !== "Denúncia", help: "Denúncias podem ser anônimas.", prefill: (p) => p.nome },
        { name: "email", label: "E-mail para resposta", kind: "email", required: (v) => v.tipo !== "Denúncia", prefill: (p) => p.email },
        { name: "telefone", label: "Telefone", kind: "tel", prefill: (p) => p.telefone },
      ]}
      summary={(r) => ({ title: `${r.tipo} — ${r.assunto}`, subtitle: r.unidade || "Sem unidade informada" })}
      details={(r) => [
        ["Tipo", r.tipo],
        ["Assunto", r.assunto],
        ["Unidade", r.unidade],
        ["Descrição", r.descricao],
        ["Nome", r.nome || "Anônimo"],
        ["E-mail", r.email],
        ["Telefone", r.telefone],
        ["Resposta da Ouvidoria", r.resposta ?? "Aguardando análise (prazo de até 30 dias)."],
      ]}
      statusOptions={["Registrada", "Em análise", "Respondida"]}
      editableStatuses={STATUS_EDITAVEIS.manifestacoes}
      deleteLabel="Cancelar"
      successMessage={(r) => `Manifestação registrada. Protocolo ${r.protocolo}.`}
      emptyMessage="Nenhuma manifestação registrada ainda."
    />
  );
}

/** Consulta pública de protocolo (busca em todas as manifestações deste navegador) */
export function ConsultaProtocolo() {
  const { items } = useManifestacoes();
  const [protocolo, setProtocolo] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<Manifestacao | null | undefined>(undefined);

  function consultar(event: React.FormEvent) {
    event.preventDefault();
    const value = protocolo.trim().toUpperCase();
    if (!/^OUV-\d{6}-\d{6}$/.test(value)) {
      setError("Informe o protocolo no formato OUV-AAAAMM-000000.");
      setResult(undefined);
      return;
    }
    setError("");
    setResult(items.find((item) => item.protocolo === value) ?? null);
  }

  return (
    <ServiceCard id="consultar-protocolo" icon="manage_search" title="Consultar protocolo" description="Acompanhe a situação de uma manifestação pelo número do protocolo.">
      <form noValidate onSubmit={consultar} className="flex flex-col sm:flex-row gap-2 sm:items-start">
        <div className="flex-1 flex flex-col gap-1">
          <label htmlFor="protocolo-consulta" className="sr-only">
            Número do protocolo
          </label>
          <input
            id="protocolo-consulta"
            value={protocolo}
            onChange={(event) => {
              setProtocolo(event.target.value.toUpperCase());
              if (error) setError("");
            }}
            placeholder="Ex.: OUV-202611-118790"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "protocolo-erro" : undefined}
            className={`w-full h-11 px-3 rounded-lg bg-surface-card border font-body-md text-body-md uppercase placeholder:normal-case placeholder:text-text-muted focus:outline-none ${error ? "border-error" : "border-border-strong focus:border-brand-purple-base"}`}
          />
          {error && (
            <p id="protocolo-erro" role="alert" className="font-label-sm text-label-sm text-error">
              {error}
            </p>
          )}
        </div>
        <Button type="submit" icon="search">
          Consultar
        </Button>
      </form>
      {result === null && <FormAlert tone="error">Protocolo não encontrado. Confira o número informado.</FormAlert>}
      {result && (
        <div className="rounded-xl border border-border-subtle bg-surface-canvas p-3 flex flex-col gap-1" role="status">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-label-sm text-label-sm font-bold text-brand-purple-vivid">{result.protocolo}</span>
            <StatusBadge status={result.status} />
          </div>
          <p className="font-label-lg text-label-lg">
            {result.tipo} — {result.assunto}
          </p>
          <p className="font-label-sm text-label-sm text-text-muted">Registrada em {formatDateTime(result.createdAt)}</p>
          {result.resposta && <p className="font-body-md text-body-md text-on-surface-variant mt-1">Resposta: {result.resposta}</p>}
        </div>
      )}
    </ServiceCard>
  );
}

export function PortariasDiario() {
  return (
    <ServiceCard id="portarias-e-diario" icon="history_edu" title="Portarias e Diário Oficial" description="Atos normativos da Secretaria Municipal da Saúde.">
      <DocumentList documents={PORTARIAS} pageSize={5} searchPlaceholder="Buscar portaria, resolução ou edital..." />
    </ServiceCard>
  );
}
