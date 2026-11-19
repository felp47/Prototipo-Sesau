import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/category-page";
import { categories } from "../lib/site-map";

export const metadata: Metadata = { title: "Mapa do Site" };

export default function MapaDoSitePage() {
  return (
    <>
      <PageHero
        icon="account_tree"
        badge="Arquitetura da Informação SESAU"
        title="Mapa do Site"
        description="Navegação temática estruturada para acesso rápido aos programas preventivos, rotinas clínicas, suporte farmacêutico e vigilância."
      />
      <section className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-xl w-full">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          <li className="bg-surface-card rounded-2xl p-6 shadow-sm">
            <Link href="/" className="flex items-center gap-2 font-headline-sm text-headline-sm text-brand-purple-deep hover:text-brand-purple-base">
              <span className="material-symbols-outlined text-brand-purple-vivid">home</span>
              Início
            </Link>
            <ul className="mt-3 space-y-2 font-label-md text-label-md">
              <li>
                <Link href="/upa-24h" className="text-on-surface-variant hover:text-brand-purple-deep">
                  Plantão UPA 24h
                </Link>
              </li>
              <li>
                <Link href="/minha-conta" className="text-on-surface-variant hover:text-brand-purple-deep">
                  Minha Conta
                </Link>
              </li>
              <li>
                <Link href="/termos-de-uso" className="text-on-surface-variant hover:text-brand-purple-deep">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-on-surface-variant hover:text-brand-purple-deep">
                  Privacidade e LGPD
                </Link>
              </li>
              <li>
                <Link href="/busca" className="text-on-surface-variant hover:text-brand-purple-deep">
                  Busca no portal
                </Link>
              </li>
            </ul>
          </li>
          {categories.map((category) => (
            <li key={category.href} className="bg-surface-card rounded-2xl p-6 shadow-sm">
              <Link href={category.href} className="flex items-center gap-2 font-headline-sm text-headline-sm text-brand-purple-deep hover:text-brand-purple-base">
                <span className="material-symbols-outlined text-brand-purple-vivid">{category.icon}</span>
                {category.title}
              </Link>
              <ul className="mt-3 space-y-3">
                {category.sections.map((section) => (
                  <li key={section.href}>
                    <Link href={section.href} className="font-label-md text-label-md text-brand-purple-base hover:text-brand-purple-deep">
                      {section.label}
                    </Link>
                    <ul className="mt-1 ml-4 space-y-1 border-l border-border-subtle pl-3">
                      {section.items.map((item) => (
                        <li key={`${item.label}-${item.href}`}>
                          <Link href={item.href} className="font-label-sm text-label-sm text-on-surface-variant hover:text-brand-purple-deep">
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
