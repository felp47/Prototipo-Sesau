"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { categories, searchPortal } from "../../lib/site-map";
import { SearchBox } from "./search-box";

/* Mesmas sugestões "Mais buscados" da Home do Stitch */
const SUGESTOES = ["Vacina", "Remédios", "Agendamento de Consulta", "Posto de Saúde", "Castramóvel", "Boletim Epidemiológico"];

export function SearchResults() {
  const params = useSearchParams();
  const query = (params.get("q") ?? "").trim();
  const results = searchPortal(query);

  return (
    <div className="flex flex-col gap-space-lg">
      <SearchBox
        key={query}
        defaultValue={query}
        suggestions={false}
        className="relative w-full max-w-2xl"
        placeholder="Qual serviço de saúde você está procurando?"
      />
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-label-sm text-label-sm text-text-muted">Mais buscados:</span>
        {SUGESTOES.map((sugestao) => (
          <Link
            key={sugestao}
            href={`/busca?q=${encodeURIComponent(sugestao)}`}
            className="px-3 py-1 rounded-full bg-brand-purple-soft text-brand-purple-deep font-label-sm text-label-sm font-semibold hover:bg-brand-purple-base hover:text-white transition-colors"
          >
            {sugestao}
          </Link>
        ))}
      </div>

      {query === "" ? (
        <p className="font-body-md text-body-md text-text-muted">Digite um termo para pesquisar as páginas do portal.</p>
      ) : results.length === 0 ? (
        <div role="status" className="bg-surface-card rounded-2xl p-8 shadow-sm flex flex-col items-center text-center gap-3">
          <span className="material-symbols-outlined text-brand-purple-base text-[40px]">search_off</span>
          <h2 className="font-headline-sm text-headline-sm text-brand-purple-deep">Nenhum resultado para &ldquo;{query}&rdquo;</h2>
          <p className="font-body-md text-body-md text-text-muted max-w-xl">
            Verifique a grafia ou tente termos mais gerais. Você também pode navegar pelos cinco eixos do portal:
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="px-3 py-1.5 rounded-lg bg-surface-canvas border border-border-subtle text-brand-purple-deep font-label-sm text-label-sm font-semibold hover:bg-brand-purple-soft transition-colors"
              >
                {category.title}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-space-md">
          <p role="status" className="font-label-md text-label-md text-text-muted">
            {results.length} {results.length === 1 ? "resultado" : "resultados"} para &ldquo;{query}&rdquo;
          </p>
          <ul className="flex flex-col gap-space-sm">
            {results.map((result) => (
              <li key={`${result.title}-${result.href}`}>
                <Link
                  href={result.href}
                  className="group bg-surface-card rounded-xl p-space-md shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <span className="font-label-sm text-label-sm font-bold text-brand-purple-vivid uppercase tracking-wide">{result.context}</span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-brand-purple-base transition-colors">{result.title}</h2>
                    <p className="font-body-md text-body-md text-text-muted">{result.description}</p>
                  </div>
                  <span className="material-symbols-outlined text-brand-purple-base text-[22px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
