import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { categories, findItem, findSection, itemPages, type NavCategory, type NavItem, type NavSection } from "../lib/site-map";
import { LegacyAnchorRedirect } from "./legacy-anchor-redirect";
import { HighlightCard } from "./nav-card";
import { SideMenu } from "./side-menu";

/*
 * Páginas das áreas que não possuem tela própria exportada do Stitch
 * (Institucional, Serviços Clínicos, Vigilância Sanitária e suas subtelas).
 * Montadas com os mesmos padrões visuais/classes da tela 3.0 Farmácia do Stitch
 * (hero, menu lateral "Guia" e blocos por seção) e com textos da arquitetura.
 */

const CONTAINER = "max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop";

type HeroProps = {
  icon: string;
  badge: string;
  title: string;
  description?: string;
};

export function PageHero({ icon, badge, title, description }: HeroProps) {
  return (
    <section className="relative w-full bg-surface-container-high/40 pb-10 pt-6">
      <div className={CONTAINER}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
          <div className="lg:col-span-8 flex flex-col gap-space-xs">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-brand-purple-soft text-brand-purple-deep font-label-sm text-label-sm font-bold">
              <span className="material-symbols-outlined text-[16px] text-brand-purple-vivid">{icon}</span>
              <span>{badge}</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg md:font-display-lg md:text-display-lg text-brand-purple-deep tracking-tight">{title}</h1>
            {description && <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">{description}</p>}
          </div>
          <ContactCard />
        </div>
      </div>
    </section>
  );
}

/** Card institucional de contato (textos do card "Gestão Municipal SESAU" da Home) */
function ContactCard() {
  return (
    <div className="lg:col-span-4 bg-surface-card p-space-md rounded-xl shadow-md flex flex-col gap-3">
      <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">Gabinete da Secretaria</span>
      <div className="flex flex-col gap-2 font-label-md text-label-md text-on-surface">
        <a href="tel:7136216824" className="flex items-center gap-2 hover:text-brand-purple-base transition-colors">
          <span className="material-symbols-outlined text-brand-purple-vivid text-[20px]">call</span>
          (71) 3621-6824
        </a>
        <span className="flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-purple-vivid text-[20px]">schedule</span>
          Segunda a Sexta · 08h às 17h
        </span>
        <span className="flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-purple-vivid text-[20px]">location_on</span>
          Centro Administrativo de Camaçari
        </span>
      </div>
      <Link
        href="/institucional/transparencia-ouvidoria"
        className="text-center font-label-sm text-label-sm font-bold text-brand-purple-base hover:text-brand-purple-dark flex items-center justify-center gap-1 pt-1"
      >
        <span className="material-symbols-outlined text-[16px]">contact_support</span>
        <span>Canais de Atendimento e Ouvidoria</span>
      </Link>
    </div>
  );
}

function CategoryShell({ category, children }: { category: NavCategory; children: ReactNode }) {
  const menuItems = [
    { label: "Visão geral", href: category.href, icon: category.icon },
    ...category.sections.map((section) => ({
      label: section.label,
      href: section.href,
      icon: section.icon,
      children: itemPages(section).map((item) => ({ label: item.label, href: item.href })),
    })),
  ];
  const others = categories.filter((other) => other.href !== category.href);

  return (
    <section className={`${CONTAINER} py-space-xl w-full`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        <aside className="lg:col-span-4 flex flex-col gap-space-md lg:sticky lg:top-[190px]">
          <SideMenu eyebrow="Arquitetura de Serviços" title={`Guia de ${category.title}`} items={menuItems} />
          <div className="bg-brand-purple-deep text-text-on-purple p-space-md rounded-xl shadow-md flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed-dim text-[24px]">account_tree</span>
              <span className="font-headline-sm text-headline-sm font-bold">Outros eixos</span>
            </div>
            <nav aria-label="Outros eixos" className="flex flex-col gap-1">
              {others.map((other) => (
                <Link key={other.href} href={other.href} className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-3 rounded-lg font-label-md text-label-md transition-colors">
                  <span>{other.title}</span>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        <div className="lg:col-span-8 flex flex-col gap-space-2xl min-w-0">{children}</div>
      </div>
    </section>
  );
}

function ItemCards({ items, eyebrow }: { items: NavItem[]; eyebrow?: string }) {
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
      {items.map((item) => (
        <Link
          key={`${item.label}-${item.href}`}
          href={item.href}
          className="group bg-surface-card rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-between gap-4 relative overflow-hidden"
        >
          <div className="w-full h-1.5 bg-brand-purple-base absolute top-0 left-0" />
          <div>
            {eyebrow && <span className="font-label-sm text-label-sm font-bold text-brand-purple-vivid uppercase tracking-wide">{eyebrow}</span>}
            <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 group-hover:text-brand-purple-base transition-colors">{item.footerLabel ?? item.label}</h3>
          </div>
          <span className="material-symbols-outlined text-brand-purple-base text-[22px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </Link>
      ))}
    </div>
  );
}

function SectionHeading({ section }: { section: NavSection }) {
  return (
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined w-8 h-8 shrink-0 rounded-full bg-brand-purple-soft text-brand-purple-deep flex items-center justify-center text-[18px]">{section.icon}</span>
      <h2 className="font-headline-lg text-headline-lg text-brand-purple-deep">
        <Link href={section.href} className="hover:text-brand-purple-base transition-colors">
          {section.label}
        </Link>
      </h2>
    </div>
  );
}

function Highlights({ section }: { section: NavSection }) {
  if (!section.highlights || section.highlights.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
      {section.highlights.map((highlight) => (
        <HighlightCard key={highlight.title} highlight={highlight} />
      ))}
    </div>
  );
}

/** Página de categoria (nível 1): as seções, cada uma com os cards dos seus itens */
export function CategoryHub({ category }: { category: NavCategory }) {
  return (
    <>
      <PageHero icon={category.icon} badge={category.title} title={category.title} description={category.description} />
      <CategoryShell category={category}>
        {category.sections.map((section) => (
          <div key={section.href} className="flex flex-col gap-space-lg">
            <SectionHeading section={section} />
            <ItemCards items={section.items} eyebrow={section.label} />
            <Highlights section={section} />
          </div>
        ))}
      </CategoryShell>
    </>
  );
}

/**
 * Página da seção (nível 2). Com itens próprios, funciona como índice (cards
 * que levam à página de cada item); sem itens próprios, exibe o conteúdo (children).
 */
export function SectionPage({ category, section, children }: { category: NavCategory; section: NavSection; children?: ReactNode }) {
  const items = itemPages(section);
  const legacy: Record<string, string> = {};
  for (const item of items) {
    legacy[item.href.split("/").pop() ?? ""] = item.href;
    item.legacyAnchors?.forEach((anchor) => (legacy[anchor] = item.href));
  }
  return (
    <>
      <PageHero icon={section.icon} badge={category.title} title={section.label} description={category.description} />
      <CategoryShell category={category}>
        {(items.length > 0 || section.highlights) && (
          <div className="flex flex-col gap-space-lg">
            {items.length > 0 && <h2 className="font-headline-md text-headline-md text-brand-purple-deep">Escolha o serviço</h2>}
            <ItemCards items={items} />
            <Highlights section={section} />
          </div>
        )}
        {children}
      </CategoryShell>
      {items.length > 0 && <LegacyAnchorRedirect targets={legacy} />}
    </>
  );
}

/** Página de um item do menu (nível 3), com o conteúdo somente daquele item */
export function ItemPage({ section, category, item, children }: { category: NavCategory; section: NavSection; item: NavItem; children: ReactNode }) {
  return (
    <>
      <PageHero icon={section.icon} badge={section.label} title={item.footerLabel ?? item.label} />
      <CategoryShell category={category}>{children}</CategoryShell>
    </>
  );
}

/** Rota de seção (nível 2) a partir do site-map */
export function SectionRoute({ href, children }: { href: string; children?: ReactNode }) {
  const match = findSection(href);
  if (!match) notFound();
  return (
    <SectionPage category={match.category} section={match.section}>
      {children}
    </SectionPage>
  );
}

/** Rota de item (nível 3) a partir do site-map */
export function ItemRoute({ href, children }: { href: string; children: ReactNode }) {
  const match = findItem(href);
  if (!match) notFound();
  return (
    <ItemPage category={match.category} section={match.section} item={match.item}>
      {children}
    </ItemPage>
  );
}
