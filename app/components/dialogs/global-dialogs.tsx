"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { BOLETINS, DOCUMENTOS_AVULSOS, UNIDADES, type Documento, type Unidade } from "../../lib/mock-data";
import { normalize } from "../../lib/site-map";
import { onlyDigits } from "../../lib/validators";
import { DocumentList, DocumentViewer } from "../documents/document-list";
import { Button, Modal } from "../ui/modal";

type DialogsContextValue = {
  openDocument: (idOrTitle: string) => void;
  openRepository: (year?: string) => void;
  openUnit: (name: string) => void;
};

const DialogsContext = createContext<DialogsContextValue | null>(null);

export function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${query}, Camaçari BA`)}`;
}

function findDocument(idOrTitle: string): Documento | undefined {
  const key = normalize(idOrTitle);
  return DOCUMENTOS_AVULSOS[idOrTitle] ?? [...BOLETINS, ...Object.values(DOCUMENTOS_AVULSOS)].find((doc) => doc.id === idOrTitle || normalize(doc.titulo) === key);
}

export function findUnit(name: string): Unidade | undefined {
  const key = normalize(name);
  return UNIDADES.find((u) => normalize(u.nome) === key) ?? UNIDADES.find((u) => key.includes(normalize(u.nome)) || normalize(u.nome).includes(key));
}

export function DialogsProvider({ children }: { children: ReactNode }) {
  const [doc, setDoc] = useState<Documento | null>(null);
  const [repository, setRepository] = useState<{ year: string } | null>(null);
  const [unit, setUnit] = useState<{ name: string; data?: Unidade } | null>(null);

  const openDocument = useCallback((idOrTitle: string) => setDoc(findDocument(idOrTitle) ?? null), []);
  const openRepository = useCallback((year = "") => setRepository({ year }), []);
  const openUnit = useCallback((name: string) => setUnit({ name, data: findUnit(name) }), []);
  const value = useMemo(() => ({ openDocument, openRepository, openUnit }), [openDocument, openRepository, openUnit]);

  return (
    <DialogsContext.Provider value={value}>
      {children}
      <DocumentViewer doc={doc} onClose={() => setDoc(null)} />
      <Modal
        open={repository !== null}
        onClose={() => setRepository(null)}
        title="Repositório de Boletins Epidemiológicos"
        description={`${BOLETINS.length} boletins publicados de 2020 a 2025`}
        icon="folder_open"
        size="lg"
      >
        {repository && <DocumentList documents={BOLETINS} initialYear={repository.year} pageSize={6} searchPlaceholder="Buscar boletim, tema ou período..." />}
      </Modal>
      <Modal
        open={unit !== null}
        onClose={() => setUnit(null)}
        title={unit?.data?.nome ?? unit?.name ?? ""}
        description={unit?.data?.tipo}
        icon="local_hospital"
        footer={
          unit && (
            <>
              {unit.data && (
                <a
                  href={`tel:${onlyDigits(unit.data.telefone)}`}
                  className="h-11 px-space-md rounded-lg bg-surface-card text-brand-purple-deep border border-border-subtle hover:bg-brand-purple-soft font-label-md text-label-md inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  Ligar
                </a>
              )}
              <a
                href={mapsUrl(unit.data ? `${unit.data.endereco}, ${unit.data.bairro}` : unit.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-space-md rounded-lg bg-brand-purple-base text-text-on-purple hover:bg-brand-purple-dark font-label-md text-label-md inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">directions</span>
                Traçar rota
              </a>
              <Button variant="secondary" onClick={() => setUnit(null)}>
                Fechar
              </Button>
            </>
          )
        }
      >
        {unit?.data ? (
          <dl className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-4 gap-y-2">
            <dt className="font-label-sm text-label-sm text-text-muted">Endereço</dt>
            <dd className="font-body-md text-body-md">
              {unit.data.endereco} — {unit.data.bairro} ({unit.data.regiao})
            </dd>
            <dt className="font-label-sm text-label-sm text-text-muted">Telefone</dt>
            <dd className="font-body-md text-body-md">{unit.data.telefone}</dd>
            <dt className="font-label-sm text-label-sm text-text-muted">Funcionamento</dt>
            <dd className="font-body-md text-body-md">{unit.data.horario}</dd>
            <dt className="font-label-sm text-label-sm text-text-muted">Serviços</dt>
            <dd className="flex flex-wrap gap-1.5">
              {unit.data.servicos.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-full bg-brand-purple-soft text-brand-purple-deep font-label-sm text-label-sm font-semibold">
                  {s}
                </span>
              ))}
            </dd>
          </dl>
        ) : (
          <p className="font-body-md text-body-md text-on-surface-variant">Dados detalhados desta unidade não estão disponíveis. Use “Traçar rota” para localizá-la no mapa.</p>
        )}
      </Modal>
    </DialogsContext.Provider>
  );
}

export function useDialogs(): DialogsContextValue {
  const context = useContext(DialogsContext);
  if (!context) throw new Error("useDialogs deve ser usado dentro de <DialogsProvider>");
  return context;
}
