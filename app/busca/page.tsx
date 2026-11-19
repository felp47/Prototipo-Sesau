import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "../components/category-page";
import { SearchResults } from "../components/search/search-results";

export const metadata: Metadata = { title: "Busca no portal" };

export default function BuscaPage() {
  return (
    <>
      <PageHero
        icon="search"
        badge="Busca no portal"
        title="Buscar no portal"
        description="Pesquise páginas, serviços e conteúdos da Secretaria Municipal da Saúde de Camaçari."
      />
      <section className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-xl w-full">
        <Suspense fallback={<p className="font-body-md text-body-md text-text-muted">Carregando resultados...</p>}>
          <SearchResults />
        </Suspense>
      </section>
    </>
  );
}
