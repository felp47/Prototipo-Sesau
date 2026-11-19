"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { searchPortal } from "../../lib/site-map";

type SearchBoxProps = {
  /** Classes do wrapper (Stitch: "relative hidden lg:block w-72") */
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  defaultValue?: string;
  /** Mostrar sugestões enquanto digita */
  suggestions?: boolean;
  onNavigate?: () => void;
};

const STITCH_INPUT =
  "w-full h-11 pl-10 pr-4 rounded-lg bg-surface-canvas border border-border-strong text-on-surface font-body-md text-label-md placeholder:text-text-muted focus:outline-none focus:border-brand-purple-base focus:bg-surface-card transition-all";

export function searchHref(query: string): string {
  return `/busca?q=${encodeURIComponent(query.trim())}`;
}

export function SearchBox({
  className = "relative w-full",
  inputClassName = STITCH_INPUT,
  placeholder = "Buscar no portal...",
  defaultValue = "",
  suggestions = true,
  onNavigate,
}: SearchBoxProps) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [error, setError] = useState(false);
  const wrapper = useRef<HTMLFormElement>(null);

  const results = useMemo(() => (suggestions ? searchPortal(query, 6) : []), [query, suggestions]);
  const showPanel = suggestions && open && query.trim().length >= 2;

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function go(href: string) {
    setOpen(false);
    setActive(-1);
    onNavigate?.();
    router.push(href);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (active >= 0 && results[active]) {
      go(results[active].href);
      return;
    }
    if (query.trim().length < 2) {
      setError(true);
      return;
    }
    go(searchHref(query));
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!showPanel) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(results.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(-1, index - 1));
    } else if (event.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  }

  return (
    <form ref={wrapper} role="search" className={className} onSubmit={submit} noValidate>
      <input
        className={`${inputClassName}${error ? " border-error focus:border-error" : ""}`}
        placeholder={placeholder}
        type="search"
        name="q"
        value={query}
        aria-label="Buscar no portal"
        aria-invalid={error || undefined}
        aria-describedby={error ? `${listId}-error` : undefined}
        role="combobox"
        aria-expanded={showPanel}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        autoComplete="off"
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setActive(-1);
          if (error) setError(false);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      <button
        type="submit"
        aria-label="Pesquisar"
        className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-[20px] hover:text-brand-purple-deep transition-colors"
      >
        search
      </button>
      {error && (
        <p id={`${listId}-error`} role="alert" className="absolute left-0 top-full mt-1 z-50 bg-surface-card border border-error/30 rounded-lg px-3 py-1.5 font-label-sm text-label-sm text-error shadow-sm whitespace-nowrap">
          Digite ao menos 2 caracteres para buscar.
        </p>
      )}
      {showPanel && (
        <div className="dropdown-enter absolute left-0 right-0 top-full pt-1.5 z-50 min-w-[280px]">
          <div className="bg-surface-card rounded-xl p-space-sm shadow-[0_12px_24px_rgba(74,21,77,0.12)] border border-border-subtle">
            {results.length > 0 ? (
              <ul id={listId} role="listbox" aria-label="Sugestões de busca">
                {results.map((result, index) => (
                  <li key={`${result.href}-${result.title}`} id={`${listId}-${index}`} role="option" aria-selected={index === active}>
                    <Link
                      href={result.href}
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                      className={`block px-space-sm py-1.5 rounded-lg text-label-sm transition-colors ${
                        index === active ? "bg-brand-purple-soft text-brand-purple-deep" : "text-on-surface-variant hover:bg-brand-purple-soft hover:text-brand-purple-deep"
                      }`}
                    >
                      <span className="block font-semibold">{result.title}</span>
                      <span className="block text-text-muted text-[12px] leading-4">{result.context}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p id={listId} className="px-space-sm py-1.5 font-label-sm text-label-sm text-text-muted">
                Nenhuma página encontrada para “{query.trim()}”.
              </p>
            )}
            <Link
              href={searchHref(query)}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="mt-1 pt-1 border-t border-border-subtle/50 flex items-center justify-between px-space-sm py-1.5 rounded-lg font-label-sm text-label-sm font-bold text-brand-purple-base hover:text-brand-purple-dark"
            >
              Ver todos os resultados
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      )}
    </form>
  );
}
