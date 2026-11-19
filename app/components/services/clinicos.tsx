"use client";

import { useMemo, useState } from "react";
import { useSession } from "../../lib/data-hooks";
import { CAPS_UNIDADES, CIRURGIAS, CONSULTAS_REGULADAS, ODONTOMOVEL, REDES_APOIO, type ConsultaRegulada } from "../../lib/mock-data";
import { normalize } from "../../lib/site-map";
import { formatDate, isValidCns, maskCns, onlyDigits } from "../../lib/validators";
import { useToday } from "../../lib/store";
import { StatusBadge } from "../records/status-badge";
import { FormAlert } from "../ui/form-fields";
import { Button } from "../ui/modal";
import { Pager } from "../ui/pager";
import { ServiceCard } from "./service-card";

const SELECT = "h-11 px-3 rounded-lg bg-surface-canvas border border-border-strong font-label-md text-label-md text-on-surface focus:outline-none focus:border-brand-purple-base";
const SEARCH = "w-full h-11 pl-10 pr-3 rounded-lg bg-surface-canvas border border-border-strong font-body-md text-label-md placeholder:text-text-muted focus:outline-none focus:border-brand-purple-base focus:bg-surface-card";

function SearchInput({ value, onChange, placeholder, label }: { value: string; onChange: (value: string) => void; placeholder: string; label: string }) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-[20px]">search</span>
      <input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={SEARCH} />
    </label>
  );
}

function EmptyResult({ message, onReset }: { message: string; onReset?: () => void }) {
  return (
    <div role="status" className="flex flex-col items-center text-center gap-2 py-8 rounded-xl border border-dashed border-border-strong">
      <span className="material-symbols-outlined text-brand-purple-base text-[36px]">search_off</span>
      <p className="font-label-md text-label-md text-brand-purple-deep">{message}</p>
      {onReset && (
        <Button variant="ghost" icon="filter_alt_off" onClick={onReset}>
          Limpar filtros
        </Button>
      )}
    </div>
  );
}

/* 4.1 — Consulta de consultas e exames regulados */
export function ConsultaConsultas() {
  const { perfil } = useSession();
  const [cns, setCns] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConsultaRegulada[] | null>(null);

  function consultar(value: string) {
    if (!isValidCns(value)) {
      setError("O Cartão SUS deve ter 15 dígitos.");
      setResult(null);
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setResult(CONSULTAS_REGULADAS.filter((c) => c.cns === onlyDigits(value)));
      setLoading(false);
    }, 400);
  }

  return (
    <ServiceCard id="consulta-de-consultas" icon="fact_check" title="Consulta de Consultas e Exames" description="Acompanhe a fila regulada, autorizações e datas agendadas pelo número do Cartão SUS.">
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          consultar(cns);
        }}
        className="flex flex-col sm:flex-row gap-2 sm:items-start"
      >
        <div className="flex-1 flex flex-col gap-1">
          <label htmlFor="cns-consulta" className="font-label-md text-label-md">
            Cartão SUS (CNS)
          </label>
          <input
            id="cns-consulta"
            inputMode="numeric"
            value={cns}
            onChange={(event) => {
              setCns(maskCns(event.target.value));
              if (error) setError("");
            }}
            placeholder="000 0000 0000 0000"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "cns-erro" : "cns-ajuda"}
            className={`w-full h-11 px-3 rounded-lg bg-surface-card border font-body-md text-body-md focus:outline-none ${error ? "border-error" : "border-border-strong focus:border-brand-purple-base"}`}
          />
          {error ? (
            <p id="cns-erro" role="alert" className="font-label-sm text-label-sm text-error">
              {error}
            </p>
          ) : (
            <p id="cns-ajuda" className="font-label-sm text-label-sm text-text-muted">
              Demonstração: use 898 0012 3456 7891 ou 700 5098 7654 3210.
            </p>
          )}
        </div>
        <div className="flex gap-2 sm:pt-[26px]">
          <Button type="submit" icon="search" loading={loading}>
            Consultar
          </Button>
          {perfil && (
            <Button
              variant="secondary"
              icon="badge"
              onClick={() => {
                setCns(perfil.cns);
                consultar(perfil.cns);
              }}
            >
              Usar meu cartão
            </Button>
          )}
        </div>
      </form>

      {result && result.length === 0 && <FormAlert tone="info">Nenhuma consulta ou exame regulado encontrado para este Cartão SUS.</FormAlert>}
      {result && result.length > 0 && (
        <div role="status" className="flex flex-col gap-2">
          <p className="font-label-md text-label-md text-brand-purple-deep">Paciente: {result[0].paciente}</p>
          <ul className="flex flex-col gap-2">
            {result.map((c) => (
              <li key={c.procedimento} className="rounded-xl border border-border-subtle bg-surface-canvas p-3 flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                <div>
                  <p className="font-label-lg text-label-lg">{c.procedimento}</p>
                  <p className="font-label-sm text-label-sm text-text-muted">
                    {c.unidade}
                    {c.data ? ` · ${formatDate(c.data)} às ${c.hora}` : c.posicaoFila ? ` · posição na fila: ${c.posicaoFila}º` : ""}
                  </p>
                </div>
                <StatusBadge status={c.status} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </ServiceCard>
  );
}

/* 4.1 — Cronograma de cirurgias eletivas */
export function CronogramaCirurgias() {
  const [query, setQuery] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [unidade, setUnidade] = useState("");
  const [sort, setSort] = useState<"data" | "vagas">("data");
  const [page, setPage] = useState(1);
  const especialidades = useMemo(() => [...new Set(CIRURGIAS.map((c) => c.especialidade))].sort(), []);
  const unidades = useMemo(() => [...new Set(CIRURGIAS.map((c) => c.unidade))].sort(), []);

  const filtered = useMemo(() => {
    const terms = normalize(query);
    return CIRURGIAS.filter((c) => (!especialidade || c.especialidade === especialidade) && (!unidade || c.unidade === unidade))
      .filter((c) => !terms || normalize(`${c.procedimento} ${c.especialidade} ${c.unidade}`).includes(terms))
      .sort((a, b) => (sort === "data" ? a.data.localeCompare(b.data) : b.vagas - a.vagas));
  }, [query, especialidade, unidade, sort]);
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, totalPages);
  const reset = () => {
    setQuery("");
    setEspecialidade("");
    setUnidade("");
    setSort("data");
    setPage(1);
  };

  return (
    <ServiceCard id="cronograma-de-cirurgias" icon="event_note" title="Cronograma de Cirurgias Eletivas" description="Mutirões e cirurgias eletivas programadas na rede municipal.">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="sm:col-span-3">
          <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Buscar procedimento..." label="Buscar procedimento" />
        </div>
        <select aria-label="Especialidade" className={SELECT} value={especialidade} onChange={(e) => { setEspecialidade(e.target.value); setPage(1); }}>
          <option value="">Todas as especialidades</option>
          {especialidades.map((e) => <option key={e}>{e}</option>)}
        </select>
        <select aria-label="Unidade" className={SELECT} value={unidade} onChange={(e) => { setUnidade(e.target.value); setPage(1); }}>
          <option value="">Todas as unidades</option>
          {unidades.map((u) => <option key={u}>{u}</option>)}
        </select>
        <select aria-label="Ordenar" className={SELECT} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
          <option value="data">Por data</option>
          <option value="vagas">Mais vagas</option>
        </select>
      </div>
      <p role="status" className="font-label-sm text-label-sm text-text-muted">{filtered.length} cirurgias programadas</p>
      {filtered.length === 0 ? (
        <EmptyResult message="Nenhuma cirurgia encontrada para os filtros." onReset={reset} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border-subtle">
          <table className="w-full min-w-[620px] text-left">
            <thead className="bg-brand-purple-soft text-brand-purple-deep font-label-sm text-label-sm uppercase">
              <tr>
                <th className="p-3">Data</th>
                <th className="p-3">Procedimento</th>
                <th className="p-3">Unidade</th>
                <th className="p-3 text-right">Vagas</th>
              </tr>
            </thead>
            <tbody className="font-label-md text-label-md font-medium">
              {filtered.slice((current - 1) * pageSize, current * pageSize).map((c) => (
                <tr key={c.id} className="border-t border-border-subtle">
                  <td className="p-3 whitespace-nowrap">{formatDate(c.data)} · {c.turno}</td>
                  <td className="p-3">
                    {c.procedimento}
                    <span className="block font-label-sm text-label-sm text-text-muted">{c.especialidade}</span>
                  </td>
                  <td className="p-3">{c.unidade}</td>
                  <td className="p-3 text-right font-bold text-brand-purple-deep">{c.vagas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pager page={current} totalPages={totalPages} onChange={setPage} label="Paginação do cronograma de cirurgias" />
      <p className="font-label-sm text-label-sm text-text-muted">A convocação do paciente é feita pela Central de Regulação a partir da fila. Acompanhe pela consulta acima.</p>
    </ServiceCard>
  );
}

/* 4.2 — Centros CAPS */
export function CentrosCaps() {
  const [tipo, setTipo] = useState("");
  const [query, setQuery] = useState("");
  const tipos = [...new Set(CAPS_UNIDADES.map((c) => c.tipo))];
  const filtered = CAPS_UNIDADES.filter((c) => (!tipo || c.tipo === tipo) && (!query || normalize(`${c.nome} ${c.bairro} ${c.publico}`).includes(normalize(query))));

  return (
    <ServiceCard id="centros-caps" icon="psychology" title="Centros de Atenção Psicossocial (CAPS)" description="Atendimento de portas abertas: não é necessário encaminhamento para o acolhimento.">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
        <SearchInput value={query} onChange={setQuery} placeholder="Buscar por nome, bairro ou público..." label="Buscar CAPS" />
        <select aria-label="Tipo de CAPS" className={SELECT} value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Todos os tipos</option>
          {tipos.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      {filtered.length === 0 ? (
        <EmptyResult message="Nenhuma unidade encontrada." onReset={() => { setTipo(""); setQuery(""); }} />
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {filtered.map((c) => (
            <li key={c.nome} className="rounded-xl border border-border-subtle bg-surface-canvas p-3 flex flex-col gap-1">
              <span className="self-start px-2 py-0.5 rounded-full bg-brand-purple-soft text-brand-purple-deep font-label-sm text-label-sm font-bold">{c.tipo}</span>
              <p className="font-label-lg text-label-lg">{c.nome}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">{c.publico}</p>
              <p className="font-label-sm text-label-sm text-text-muted">{c.endereco} — {c.bairro} · {c.horario}</p>
              <div className="flex flex-wrap gap-3 mt-1">
                <a href={`tel:${onlyDigits(c.telefone)}`} className="font-label-sm text-label-sm font-bold text-brand-purple-base hover:text-brand-purple-dark flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">call</span>{c.telefone}
                </a>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.endereco}, ${c.bairro}, Camaçari BA`)}`} target="_blank" rel="noopener noreferrer" className="font-label-sm text-label-sm font-bold text-brand-purple-base hover:text-brand-purple-dark flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">map</span>Ver no mapa
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </ServiceCard>
  );
}

/* 4.2 — Redes de apoio */
export function RedesApoio() {
  return (
    <ServiceCard id="redes-de-apoio" icon="diversity_3" title="Redes de Apoio Emocional" description="Canais gratuitos de escuta, acolhimento e urgência.">
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {REDES_APOIO.map((r) => (
          <li key={r.nome} className="rounded-xl border border-border-subtle bg-surface-canvas p-3 flex gap-3">
            <span className="material-symbols-outlined text-brand-purple-vivid text-[26px]">{r.icon}</span>
            <div>
              <p className="font-label-lg text-label-lg">{r.nome}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">{r.descricao}</p>
              {r.href ? (
                <a href={r.href} className="font-label-sm text-label-sm font-bold text-brand-purple-base hover:text-brand-purple-dark">{r.contato}</a>
              ) : (
                <span className="font-label-sm text-label-sm font-bold text-brand-purple-deep">{r.contato}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </ServiceCard>
  );
}

/* 4.3 — Agenda do Odontomóvel */
export function AgendaOdontomovel() {
  const [distrito, setDistrito] = useState("");
  const [periodo, setPeriodo] = useState<"proximas" | "todas">("proximas");
  const hoje = useToday();
  const situacao = (inicio: string, fim: string) => (fim < hoje ? "Realizada" : inicio <= hoje ? "Em atendimento" : "Programada");
  const filtered = ODONTOMOVEL.filter((p) => (!distrito || p.distrito === distrito) && (periodo === "todas" || p.fim >= hoje));

  return (
    <ServiceCard id="agenda-do-odontomovel" icon="dentistry" title="Agenda do Odontomóvel" description="Atendimento odontológico itinerante gratuito. Distribuição de senhas a partir das 7h no local.">
      <div className="flex flex-col sm:flex-row gap-2">
        <select aria-label="Distrito" className={`${SELECT} flex-1`} value={distrito} onChange={(e) => setDistrito(e.target.value)}>
          <option value="">Todos os distritos</option>
          {ODONTOMOVEL.map((p) => <option key={p.id}>{p.distrito}</option>)}
        </select>
        <div role="group" aria-label="Período" className="flex gap-1 p-1 bg-surface-canvas rounded-lg">
          {(["proximas", "todas"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={periodo === value}
              onClick={() => setPeriodo(value)}
              className={`flex-1 px-3 py-2 rounded-md font-label-sm text-label-sm ${periodo === value ? "bg-surface-card shadow-sm text-brand-purple-deep font-bold" : "text-text-muted hover:text-brand-purple-deep"}`}
            >
              {value === "proximas" ? "Próximas paradas" : "Todas"}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <EmptyResult message="Nenhuma parada programada para este filtro." onReset={() => { setDistrito(""); setPeriodo("todas"); }} />
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((p) => (
            <li key={p.id} className="rounded-xl border border-border-subtle bg-surface-canvas p-3 flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
              <div>
                <p className="font-label-lg text-label-lg">{p.distrito} — {p.local}</p>
                <p className="font-label-sm text-label-sm text-text-muted">
                  {formatDate(p.inicio)} a {formatDate(p.fim)} · {p.servicos} · {p.vagasDia} atendimentos/dia
                </p>
              </div>
              <StatusBadge status={situacao(p.inicio, p.fim)} />
            </li>
          ))}
        </ul>
      )}
    </ServiceCard>
  );
}
