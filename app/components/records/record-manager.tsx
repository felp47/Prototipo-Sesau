"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { useSession } from "../../lib/data-hooks";
import type { Perfil } from "../../lib/mock-data";
import { normalize } from "../../lib/site-map";
import { useToday, type BaseRecord, type RecordInput } from "../../lib/store";
import {
  formatDateTime,
  isValidCnpj,
  isValidCns,
  isValidCpf,
  isValidEmail,
  isValidPhone,
  maskCnpj,
  maskCns,
  maskCpf,
  maskPhone,
  onlyDigits,
  todayIso,
} from "../../lib/validators";
import { usePortal } from "../portal-provider";
import { FormAlert, SelectField, TextAreaField, TextField } from "../ui/form-fields";
import { Button, ConfirmDialog, Modal } from "../ui/modal";
import { Pager } from "../ui/pager";
import { StatusBadge } from "./status-badge";

export type Values = Record<string, string>;

export type FieldConfig = {
  name: string;
  label: string;
  kind: "text" | "email" | "tel" | "date" | "select" | "textarea" | "cpf" | "cnpj" | "cns";
  required?: boolean | ((values: Values) => boolean);
  options?: { value: string; label: string; disabled?: boolean }[] | ((values: Values, editing: BaseRecord | null) => { value: string; label: string; disabled?: boolean }[]);
  placeholder?: string;
  help?: string;
  full?: boolean;
  /** Data mínima (campos "date"): "today" exige data futura */
  min?: "today";
  maxLength?: number;
  validate?: (value: string, values: Values) => string | undefined;
  prefill?: (perfil: Perfil) => string;
  /** Oculta o campo conforme os demais valores */
  hidden?: (values: Values) => boolean;
};

type Collection<T extends BaseRecord> = {
  items: T[];
  create: (input: RecordInput<T>) => T;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
};

export type RecordManagerProps<T extends BaseRecord> = {
  id: string;
  title: string;
  description: string;
  icon: string;
  singular: string;
  collection: Collection<T>;
  fields: FieldConfig[];
  /** Botões de criação (um ou mais, com valores pré-definidos) */
  createActions: { label: string; icon: string; preset?: Values; anchorId?: string }[];
  summary: (record: T) => { title: string; subtitle: string };
  details: (record: T) => [string, ReactNode][];
  statusOptions: string[];
  editableStatuses: string[];
  deleteLabel?: string;
  successMessage: (record: T) => string;
  emptyMessage: string;
};

const PAGE_SIZE = 5;

function isRequired(field: FieldConfig, values: Values) {
  return typeof field.required === "function" ? field.required(values) : Boolean(field.required);
}

function validateField(field: FieldConfig, values: Values): string | undefined {
  if (field.hidden?.(values)) return undefined;
  const value = (values[field.name] ?? "").trim();
  if (!value) return isRequired(field, values) ? "Campo obrigatório." : undefined;
  switch (field.kind) {
    case "cpf":
      if (!isValidCpf(value)) return "CPF inválido. Confira os 11 dígitos.";
      break;
    case "cnpj":
      if (!isValidCnpj(value)) return "CNPJ inválido. Confira os 14 dígitos.";
      break;
    case "cns":
      if (!isValidCns(value)) return "O Cartão SUS deve ter 15 dígitos.";
      break;
    case "email":
      if (!isValidEmail(value)) return "Informe um e-mail válido (ex.: nome@email.com).";
      break;
    case "tel":
      if (!isValidPhone(value)) return "Informe um telefone com DDD.";
      break;
    case "date":
      if (field.min === "today" && value < todayIso()) return "Escolha uma data a partir de hoje.";
      break;
  }
  if (field.kind === "text" || field.kind === "textarea") {
    if (value.length < 3) return "Informe ao menos 3 caracteres.";
  }
  return field.validate?.(value, values);
}

const MASKS: Partial<Record<FieldConfig["kind"], (value: string) => string>> = { cpf: maskCpf, cnpj: maskCnpj, cns: maskCns, tel: maskPhone };

export function RecordManager<T extends BaseRecord>(props: RecordManagerProps<T>) {
  const { collection, fields, singular } = props;
  const { notify } = usePortal();
  const { perfil, cpf } = useSession();
  const today = useToday();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState<"recentes" | "antigos" | "az">("recentes");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [viewing, setViewing] = useState<T | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);

  // Logado: registros do cidadão. Sem login: somente registros anônimos feitos neste navegador
  // (registros de outras contas — inclusive a de demonstração — não são exibidos).
  const visible = useMemo(() => collection.items.filter((item) => (cpf ? item.ownerCpf === cpf : !item.ownerCpf)), [collection.items, cpf]);

  const filtered = useMemo(() => {
    const terms = normalize(query);
    const list = visible.filter((item) => {
      if (statusFilter && item.status !== statusFilter) return false;
      if (!terms) return true;
      const { title, subtitle } = props.summary(item);
      return normalize(`${item.protocolo} ${title} ${subtitle} ${item.status}`).includes(terms);
    });
    return list.sort((a, b) => {
      if (sort === "az") return props.summary(a).title.localeCompare(props.summary(b).title, "pt-BR");
      return sort === "recentes" ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt);
    });
    // props.summary é estável por configuração
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, query, statusFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasFilters = query !== "" || statusFilter !== "" || sort !== "recentes";

  function openCreate(preset?: Values) {
    const initial: Values = {};
    for (const field of fields) initial[field.name] = perfil && field.prefill ? field.prefill(perfil) : "";
    setValues({ ...initial, ...preset });
    setErrors({});
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(record: T) {
    const initial: Values = {};
    for (const field of fields) initial[field.name] = String((record as Record<string, unknown>)[field.name] ?? "");
    setValues(initial);
    setErrors({});
    setEditing(record);
    setViewing(null);
    setFormOpen(true);
  }

  function setField(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: "" }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    for (const field of fields) {
      const error = validateField(field, values);
      if (error) nextErrors[field.name] = error;
    }
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus());
      return;
    }
    setSaving(true);
    // Simula o tempo de envio (não há backend no MVP)
    setTimeout(() => {
      const data: Values = {};
      for (const field of fields) data[field.name] = field.hidden?.(values) ? "" : (values[field.name] ?? "").trim();
      if (editing) {
        collection.update(editing.id, data as unknown as Partial<T>);
        notify(`${singular} ${editing.protocolo} atualizado(a) com sucesso.`);
      } else {
        const ownerCpf = cpf || onlyDigits(values.cpf ?? "");
        const record = collection.create({ ...(data as unknown as RecordInput<T>), ownerCpf });
        notify(props.successMessage(record));
        setQuery("");
        setStatusFilter("");
        setSort("recentes");
        setPage(1);
        setViewing(record);
      }
      setSaving(false);
      setFormOpen(false);
    }, 450);
  }

  function confirmDelete() {
    if (!deleting) return;
    collection.remove(deleting.id);
    notify(`${singular} ${deleting.protocolo} ${props.deleteLabel === "Cancelar" ? "cancelado(a)" : "excluído(a)"}.`);
    setDeleting(null);
    setViewing(null);
  }

  const canEdit = (record: T) => props.editableStatuses.includes(record.status);

  return (
    <section id={props.id} className="flex flex-col gap-space-md">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-brand-purple-soft text-brand-purple-base flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">{props.icon}</span>
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md text-brand-purple-deep">{props.title}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">{props.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {props.createActions.map((action) => (
            <span key={action.label} id={action.anchorId} className="contents">
              <Button icon={action.icon} onClick={() => openCreate(action.preset)}>
                {action.label}
              </Button>
            </span>
          ))}
        </div>
      </div>

      <div className="bg-surface-card rounded-2xl shadow-sm p-space-md flex flex-col gap-space-md">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="font-label-md text-label-md text-brand-purple-deep">
            {cpf ? `Meus registros (${visible.length})` : `Registros feitos neste navegador (${visible.length})`}
          </span>
          {!cpf && (
            <Link href="/minha-conta" className="font-label-sm text-label-sm font-bold text-brand-purple-base hover:text-brand-purple-dark flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">login</span>
              Entrar para vincular à sua conta
            </Link>
          )}
        </div>

        {visible.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-2 items-end">
            <label className="relative">
              <span className="sr-only">Buscar em {props.title}</span>
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-[20px]">search</span>
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Buscar por protocolo ou texto..."
                className="w-full h-11 pl-10 pr-3 rounded-lg bg-surface-canvas border border-border-strong font-body-md text-label-md placeholder:text-text-muted focus:outline-none focus:border-brand-purple-base focus:bg-surface-card"
              />
            </label>
            <label className="sr-only" htmlFor={`${props.id}-status`}>
              Filtrar por situação
            </label>
            <select
              id={`${props.id}-status`}
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              className="h-11 px-3 rounded-lg bg-surface-canvas border border-border-strong font-label-md text-label-md text-on-surface focus:outline-none focus:border-brand-purple-base"
            >
              <option value="">Todas as situações</option>
              {props.statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor={`${props.id}-ordem`}>
              Ordenar
            </label>
            <select
              id={`${props.id}-ordem`}
              value={sort}
              onChange={(event) => setSort(event.target.value as typeof sort)}
              className="h-11 px-3 rounded-lg bg-surface-canvas border border-border-strong font-label-md text-label-md text-on-surface focus:outline-none focus:border-brand-purple-base"
            >
              <option value="recentes">Mais recentes</option>
              <option value="antigos">Mais antigos</option>
              <option value="az">A → Z</option>
            </select>
            <Button
              variant="ghost"
              icon="filter_alt_off"
              disabled={!hasFilters}
              onClick={() => {
                setQuery("");
                setStatusFilter("");
                setSort("recentes");
                setPage(1);
              }}
            >
              Limpar
            </Button>
          </div>
        )}

        {visible.length === 0 ? (
          <div className="flex flex-col items-center text-center gap-2 py-8 px-4 rounded-xl border border-dashed border-border-strong">
            <span className="material-symbols-outlined text-brand-purple-base text-[36px]">inbox</span>
            <p className="font-label-md text-label-md text-brand-purple-deep">{props.emptyMessage}</p>
            <Button variant="secondary" icon={props.createActions[0].icon} onClick={() => openCreate(props.createActions[0].preset)}>
              {props.createActions[0].label}
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div role="status" className="flex flex-col items-center text-center gap-2 py-8 px-4 rounded-xl border border-dashed border-border-strong">
            <span className="material-symbols-outlined text-brand-purple-base text-[36px]">search_off</span>
            <p className="font-label-md text-label-md text-brand-purple-deep">Nenhum registro corresponde aos filtros.</p>
            <Button
              variant="ghost"
              icon="filter_alt_off"
              onClick={() => {
                setQuery("");
                setStatusFilter("");
              }}
            >
              Limpar filtros
            </Button>
          </div>
        ) : (
          <>
            <p role="status" className="font-label-sm text-label-sm text-text-muted">
              {filtered.length} {filtered.length === 1 ? "registro encontrado" : "registros encontrados"}
            </p>
            <ul className="flex flex-col gap-2">
              {pageItems.map((record) => {
                const { title, subtitle } = props.summary(record);
                return (
                  <li key={record.id} className="rounded-xl border border-border-subtle bg-surface-canvas p-3 flex flex-col md:flex-row md:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-label-sm text-label-sm font-bold text-brand-purple-vivid">{record.protocolo}</span>
                        <StatusBadge status={record.status} />
                      </div>
                      <p className="font-label-lg text-label-lg text-on-surface mt-1 break-words">{title}</p>
                      <p className="font-label-sm text-label-sm text-text-muted break-words">
                        {subtitle} · {formatDateTime(record.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 shrink-0">
                      <Button variant="secondary" icon="visibility" className="h-9" onClick={() => setViewing(record)}>
                        Detalhes
                      </Button>
                      {canEdit(record) && (
                        <Button variant="secondary" icon="edit" className="h-9" onClick={() => openEdit(record)}>
                          Editar
                        </Button>
                      )}
                      <Button variant="ghost" icon="delete" className="h-9 text-status-emergency hover:bg-status-emergency-bg" onClick={() => setDeleting(record)}>
                        {props.deleteLabel ?? "Excluir"}
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <Pager page={currentPage} totalPages={totalPages} onChange={setPage} label={`Paginação de ${props.title}`} />
          </>
        )}
      </div>

      {/* Formulário (cadastro/edição) */}
      <Modal
        open={formOpen}
        onClose={() => !saving && setFormOpen(false)}
        title={editing ? `Editar ${singular.toLowerCase()} ${editing.protocolo}` : props.createActions.find((a) => a.preset?.tipo && a.preset.tipo === values.tipo)?.label ?? props.createActions[0].label}
        description="Campos com * são obrigatórios."
        icon={editing ? "edit" : props.icon}
        size="md"
      >
        <form noValidate onSubmit={submit} className="flex flex-col gap-space-md">
          {Object.values(errors).some(Boolean) && <FormAlert tone="error">Corrija os campos destacados para continuar.</FormAlert>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {fields.map((field) => {
              if (field.hidden?.(values)) return null;
              const common = {
                label: field.label,
                name: field.name,
                value: values[field.name] ?? "",
                onChange: (value: string) => setField(field.name, value),
                required: isRequired(field, values),
                error: errors[field.name],
                help: field.help,
                className: field.full || field.kind === "textarea" ? "md:col-span-2" : "",
              };
              if (field.kind === "select") {
                const options = typeof field.options === "function" ? field.options(values, editing) : field.options ?? [];
                return <SelectField {...common} key={field.name} options={options} />;
              }
              if (field.kind === "textarea") return <TextAreaField {...common} key={field.name} placeholder={field.placeholder} maxLength={field.maxLength ?? 1000} />;
              return (
                <TextField
                  {...common}
                  key={field.name}
                  type={field.kind === "date" ? "date" : field.kind === "email" ? "email" : field.kind === "tel" ? "tel" : "text"}
                  inputMode={["cpf", "cnpj", "cns", "tel"].includes(field.kind) ? "numeric" : undefined}
                  mask={MASKS[field.kind]}
                  placeholder={field.placeholder}
                  min={field.min === "today" ? today || undefined : undefined}
                  maxLength={field.maxLength}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-border-subtle">
            <Button variant="secondary" onClick={() => setFormOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" icon="send" loading={saving}>
              {saving ? "Enviando..." : editing ? "Salvar alterações" : "Enviar"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Detalhes */}
      <Modal
        open={viewing !== null}
        onClose={() => setViewing(null)}
        title={viewing ? props.summary(viewing).title : ""}
        description={viewing ? `Protocolo ${viewing.protocolo}` : undefined}
        icon={props.icon}
        footer={
          viewing && (
            <>
              <Button variant="ghost" icon="delete" className="text-status-emergency hover:bg-status-emergency-bg" onClick={() => setDeleting(viewing)}>
                {props.deleteLabel ?? "Excluir"}
              </Button>
              {canEdit(viewing) && (
                <Button variant="secondary" icon="edit" onClick={() => openEdit(viewing)}>
                  Editar
                </Button>
              )}
              <Button onClick={() => setViewing(null)}>Fechar</Button>
            </>
          )
        }
      >
        {viewing && (
          <dl className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-x-4 gap-y-2">
            <dt className="font-label-sm text-label-sm text-text-muted">Situação</dt>
            <dd>
              <StatusBadge status={viewing.status} />
            </dd>
            <dt className="font-label-sm text-label-sm text-text-muted">Registrado em</dt>
            <dd className="font-body-md text-body-md">{formatDateTime(viewing.createdAt)}</dd>
            {viewing.updatedAt !== viewing.createdAt && (
              <>
                <dt className="font-label-sm text-label-sm text-text-muted">Última alteração</dt>
                <dd className="font-body-md text-body-md">{formatDateTime(viewing.updatedAt)}</dd>
              </>
            )}
            {props.details(viewing).map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="font-label-sm text-label-sm text-text-muted">{label}</dt>
                <dd className="font-body-md text-body-md text-on-surface break-words whitespace-pre-line">{value || "—"}</dd>
              </div>
            ))}
          </dl>
        )}
        {viewing && !canEdit(viewing) && (
          <p className="mt-space-md font-label-sm text-label-sm text-text-muted">Este registro já está em andamento e não pode mais ser editado.</p>
        )}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title={props.deleteLabel === "Cancelar" ? `Cancelar ${singular.toLowerCase()}?` : `Excluir ${singular.toLowerCase()}?`}
        message={
          <>
            O registro <strong>{deleting?.protocolo}</strong> será removido deste navegador. Esta ação não pode ser desfeita.
          </>
        }
        confirmLabel={props.deleteLabel === "Cancelar" ? "Sim, cancelar" : "Sim, excluir"}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </section>
  );
}
