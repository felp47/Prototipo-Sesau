"use client";

import { useMemo, useState } from "react";
import type { Documento } from "../../lib/mock-data";
import { normalize } from "../../lib/site-map";
import { formatDate } from "../../lib/validators";
import { usePortal } from "../portal-provider";
import { Button, Modal } from "../ui/modal";
import { Pager } from "../ui/pager";

/** Gera e baixa o documento (versão de demonstração em HTML, sem servidor) */
export function downloadDocument(doc: Documento) {
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${doc.titulo}</title>
<style>body{font-family:Arial,sans-serif;max-width:720px;margin:40px auto;color:#241727;line-height:1.5}h1{color:#4A154D}dt{font-weight:bold;margin-top:8px}.aviso{background:#FFFBEB;color:#B45309;padding:12px;border-radius:8px}</style></head>
<body><p>Prefeitura Municipal de Camaçari · Secretaria Municipal da Saúde (SESAU)</p><h1>${doc.titulo}</h1>
<dl><dt>Tipo</dt><dd>${doc.tipo}</dd><dt>Tema</dt><dd>${doc.tema}</dd><dt>Data de publicação</dt><dd>${formatDate(doc.data)}</dd><dt>Referência</dt><dd>${doc.periodo}</dd></dl>
<h2>Resumo</h2><p>${doc.resumo}</p>
<p class="aviso">Documento gerado pelo MVP do Portal da Saúde para demonstração. O conteúdo é fictício e não substitui a publicação oficial.</p></body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${doc.id}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function DocumentViewer({ doc, onClose }: { doc: Documento | null; onClose: () => void }) {
  const { notify } = usePortal();
  return (
    <Modal
      open={doc !== null}
      onClose={onClose}
      title={doc?.titulo ?? ""}
      description={doc ? `${doc.tipo} · ${formatDate(doc.data)}` : undefined}
      icon="description"
      footer={
        doc && (
          <>
            <Button variant="secondary" onClick={onClose}>
              Fechar
            </Button>
            <Button
              icon="download"
              onClick={() => {
                downloadDocument(doc);
                notify(`Download iniciado: ${doc.titulo} (${doc.tamanho}).`);
              }}
            >
              Baixar documento
            </Button>
          </>
        )
      }
    >
      {doc && (
        <div className="flex flex-col gap-space-md">
          <dl className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-x-4 gap-y-2">
            <dt className="font-label-sm text-label-sm text-text-muted">Tema</dt>
            <dd className="font-body-md text-body-md">{doc.tema}</dd>
            <dt className="font-label-sm text-label-sm text-text-muted">Referência</dt>
            <dd className="font-body-md text-body-md">{doc.periodo}</dd>
            <dt className="font-label-sm text-label-sm text-text-muted">Tamanho</dt>
            <dd className="font-body-md text-body-md">{doc.tamanho}</dd>
          </dl>
          <p className="font-body-md text-body-md text-on-surface-variant">{doc.resumo}</p>
          <p className="font-label-sm text-label-sm text-status-warning bg-status-warning-bg rounded-lg p-3">
            Versão de demonstração: o arquivo baixado é gerado no navegador com dados fictícios.
          </p>
        </div>
      )}
    </Modal>
  );
}

type DocumentListProps = {
  documents: Documento[];
  /** Ano pré-selecionado no filtro */
  initialYear?: string;
  searchPlaceholder?: string;
  pageSize?: number;
};

export function DocumentList({ documents, initialYear = "", searchPlaceholder = "Buscar por título, tema ou resumo...", pageSize = 8 }: DocumentListProps) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState(initialYear);
  const [tema, setTema] = useState("");
  const [sort, setSort] = useState<"recentes" | "antigos">("recentes");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<Documento | null>(null);

  const years = useMemo(() => [...new Set(documents.map((doc) => doc.data.slice(0, 4)))].sort().reverse(), [documents]);
  const temas = useMemo(() => [...new Set(documents.map((doc) => doc.tema))].sort(), [documents]);

  const filtered = useMemo(() => {
    const terms = normalize(query);
    return documents
      .filter((doc) => (!year || doc.data.startsWith(year)) && (!tema || doc.tema === tema))
      .filter((doc) => !terms || normalize(`${doc.titulo} ${doc.tema} ${doc.resumo} ${doc.periodo}`).includes(terms))
      .sort((a, b) => (sort === "recentes" ? b.data.localeCompare(a.data) : a.data.localeCompare(b.data)));
  }, [documents, query, year, tema, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, totalPages);
  const items = filtered.slice((current - 1) * pageSize, current * pageSize);
  const reset = () => {
    setQuery("");
    setYear("");
    setTema("");
    setSort("recentes");
    setPage(1);
  };
  const select = "h-11 px-3 rounded-lg bg-surface-canvas border border-border-strong font-label-md text-label-md text-on-surface focus:outline-none focus:border-brand-purple-base";

  return (
    <div className="flex flex-col gap-space-md">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2">
        <label className="relative sm:col-span-4">
          <span className="sr-only">Buscar documentos</span>
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-[20px]">search</span>
          <input
            type="search"
            value={query}
            placeholder={searchPlaceholder}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            className="w-full h-11 pl-10 pr-3 rounded-lg bg-surface-canvas border border-border-strong font-body-md text-label-md placeholder:text-text-muted focus:outline-none focus:border-brand-purple-base focus:bg-surface-card"
          />
        </label>
        <select aria-label="Filtrar por ano" className={select} value={year} onChange={(event) => { setYear(event.target.value); setPage(1); }}>
          <option value="">Todos os anos</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select aria-label="Filtrar por tema" className={select} value={tema} onChange={(event) => { setTema(event.target.value); setPage(1); }}>
          <option value="">Todos os temas</option>
          {temas.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select aria-label="Ordenar" className={select} value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
          <option value="recentes">Mais recentes</option>
          <option value="antigos">Mais antigos</option>
        </select>
        <Button variant="ghost" icon="filter_alt_off" onClick={reset} disabled={!query && !year && !tema && sort === "recentes"}>
          Limpar
        </Button>
      </div>

      <p role="status" className="font-label-sm text-label-sm text-text-muted">
        Mostrando {items.length} de {filtered.length} {filtered.length === 1 ? "documento" : "documentos"}
        {filtered.length !== documents.length && ` (total: ${documents.length})`}
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center text-center gap-2 py-8 rounded-xl border border-dashed border-border-strong">
          <span className="material-symbols-outlined text-brand-purple-base text-[36px]">search_off</span>
          <p className="font-label-md text-label-md text-brand-purple-deep">Nenhum documento encontrado para os filtros selecionados.</p>
          <Button variant="ghost" icon="filter_alt_off" onClick={reset}>
            Limpar filtros
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((doc) => (
            <li key={doc.id} className="rounded-xl border border-border-subtle bg-surface-canvas p-3 flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="material-symbols-outlined text-brand-purple-vivid text-[26px]">description</span>
              <div className="flex-1 min-w-0">
                <p className="font-label-lg text-label-lg text-on-surface">{doc.titulo}</p>
                <p className="font-label-sm text-label-sm text-text-muted">
                  {formatDate(doc.data)} · {doc.tema} · {doc.periodo}
                </p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <Button variant="secondary" className="h-9" icon="visibility" onClick={() => setViewing(doc)}>
                  Ver
                </Button>
                <Button variant="secondary" className="h-9" icon="download" onClick={() => downloadDocument(doc)} aria-label={`Baixar ${doc.titulo}`}>
                  {doc.tamanho}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Pager page={current} totalPages={totalPages} onChange={setPage} label="Paginação de documentos" />
      <DocumentViewer doc={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
