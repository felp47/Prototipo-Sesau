"use client";

/**
 * Armazenamento local do MVP (sem backend).
 *
 * Os dados ficam no localStorage deste navegador e são compartilhados entre
 * todas as telas via useSyncExternalStore — uma alteração feita em uma página
 * aparece imediatamente nas demais (e em outras abas, pelo evento "storage").
 */
import { useCallback, useSyncExternalStore } from "react";

const PREFIX = "sesau-mvp:";
const cache = new Map<string, unknown>();
const listeners = new Map<string, Set<() => void>>();

function emit(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  if (cache.has(key)) return cache.get(key) as T;
  let value = fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw !== null) value = JSON.parse(raw) as T;
  } catch {
    /* armazenamento indisponível ou corrompido: usa o valor inicial */
  }
  cache.set(key, value);
  return value;
}

function write<T>(key: string, value: T) {
  cache.set(key, value);
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* modo privado/cota cheia: mantém em memória nesta visita */
  }
  emit(key);
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (!event.key?.startsWith(PREFIX)) return;
    const key = event.key.slice(PREFIX.length);
    cache.delete(key);
    emit(key);
  });
}

function subscribe(key: string, listener: () => void) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(listener);
  return () => listeners.get(key)!.delete(listener);
}

/** Estado persistente compartilhado. `fallback` deve ser uma referência estável (constante de módulo). */
export function usePersistentState<T>(key: string, fallback: T): [T, (next: T | ((current: T) => T)) => void] {
  const value = useSyncExternalStore(
    (listener) => subscribe(key, listener),
    () => read(key, fallback),
    () => fallback,
  );
  const setValue = useCallback(
    (next: T | ((current: T) => T)) => {
      const current = read(key, fallback);
      write(key, typeof next === "function" ? (next as (current: T) => T)(current) : next);
    },
    [key, fallback],
  );
  return [value, setValue];
}

const noopSubscribe = () => () => {};
const localToday = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

/** Data de hoje (AAAA-MM-DD) lida só no navegador; vazio durante a pré-renderização */
export function useToday(): string {
  return useSyncExternalStore(noopSubscribe, localToday, () => "");
}

/* ------------------------------------------------------------------ */
/* Coleções de registros (CRUD)                                        */
/* ------------------------------------------------------------------ */

export type BaseRecord = {
  id: string;
  protocolo: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  /** CPF (somente dígitos) de quem registrou — relaciona o registro à "Minha Conta" */
  ownerCpf: string;
};

export type RecordInput<T extends BaseRecord> = Omit<T, keyof BaseRecord> & { status?: string; ownerCpf?: string };

export function generateProtocol(prefix: string): string {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  return `${prefix}-${stamp}-${String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0")}`;
}

export function useCollection<T extends BaseRecord>(name: string, seed: T[], protocolPrefix: string, initialStatus: string) {
  const [items, setItems] = usePersistentState<T[]>(`colecao:${name}`, seed);

  const create = useCallback(
    (input: RecordInput<T>): T => {
      const now = new Date().toISOString();
      const record = {
        ...input,
        id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
        protocolo: generateProtocol(protocolPrefix),
        status: input.status ?? initialStatus,
        ownerCpf: input.ownerCpf ?? "",
        createdAt: now,
        updatedAt: now,
      } as T;
      setItems((current) => [record, ...current]);
      return record;
    },
    [setItems, protocolPrefix, initialStatus],
  );

  const update = useCallback(
    (id: string, patch: Partial<T>) => {
      setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item)));
    },
    [setItems],
  );

  const remove = useCallback(
    (id: string) => {
      setItems((current) => current.filter((item) => item.id !== id));
    },
    [setItems],
  );

  return { items, create, update, remove };
}

/** Vincula ao CPF informado os registros feitos neste navegador antes do login */
export function claimUnownedRecords(cpf: string) {
  if (!cpf) return;
  let keys: string[] = [];
  try {
    keys = Object.keys(window.localStorage).filter((key) => key.startsWith(`${PREFIX}colecao:`)).map((key) => key.slice(PREFIX.length));
  } catch {
    keys = [...cache.keys()].filter((key) => key.startsWith("colecao:"));
  }
  for (const key of keys) {
    const items = read<BaseRecord[]>(key, []);
    if (items.some((item) => !item.ownerCpf)) write(key, items.map((item) => (item.ownerCpf ? item : { ...item, ownerCpf: cpf })));
  }
}

/** Limpa todos os dados do MVP neste navegador (usado em "Minha Conta") */
export function resetAllData() {
  try {
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith(PREFIX))
      .forEach((key) => window.localStorage.removeItem(key));
  } catch {
    /* ignore */
  }
  const keys = [...cache.keys()];
  cache.clear();
  keys.forEach(emit);
}
