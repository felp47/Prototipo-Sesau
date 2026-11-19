import Link from "next/link";
import { categories } from "./lib/site-map";

export default function NotFound() {
  return (
    <section className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-16 w-full flex flex-col items-center text-center gap-4">
      <span className="material-symbols-outlined text-brand-purple-base text-[48px]">travel_explore</span>
      <h1 className="font-headline-lg text-headline-lg text-brand-purple-deep">Página não encontrada</h1>
      <p className="font-body-md text-body-md text-text-muted max-w-xl">
        O endereço acessado não existe ou foi movido. Use o menu, a busca ou os atalhos abaixo.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Link href="/" className="px-4 h-11 rounded-lg bg-brand-purple-base text-white font-label-md text-label-md flex items-center gap-2 hover:bg-brand-purple-dark transition-colors">
          <span className="material-symbols-outlined text-[18px]">home</span>
          Voltar ao início
        </Link>
        {categories.map((category) => (
          <Link
            key={category.href}
            href={category.href}
            className="px-4 h-11 rounded-lg bg-surface-card border border-border-subtle text-brand-purple-deep font-label-md text-label-md flex items-center hover:bg-brand-purple-soft transition-colors"
          >
            {category.title}
          </Link>
        ))}
        <Link
          href="/mapa-do-site"
          className="px-4 h-11 rounded-lg bg-surface-card border border-border-subtle text-brand-purple-deep font-label-md text-label-md flex items-center hover:bg-brand-purple-soft transition-colors"
        >
          Mapa do Site
        </Link>
      </div>
    </section>
  );
}
