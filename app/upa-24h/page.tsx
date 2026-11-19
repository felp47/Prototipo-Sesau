import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/category-page";
import { HighlightCard, NavCard } from "../components/nav-card";
import { highlightUpa } from "../lib/site-map";

export const metadata: Metadata = { title: "Plantão UPA 24h" };

export default function UpaPage() {
  return (
    <>
      <PageHero icon="emergency" badge="Plantão 24 Horas" title="Emergência e UPA 24h" description={highlightUpa.text} />
      <section className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
        <HighlightCard highlight={highlightUpa} />
        <NavCard
          href="/institucional/acesso-funcionamento/mapa-de-postos"
          icon="pin_drop"
          eyebrow="2.1 Acesso e Funcionamento"
          title="Encontre seu Posto de Saúde"
          description="Localize a UBS ou USF mais próxima do seu bairro, horários de atendimento médico e equipe de referência."
          cta="Abrir Mapa de Postos"
        />
        <div className="bg-status-emergency-bg border border-error/20 rounded-2xl p-6 flex flex-col gap-3">
          <span className="material-symbols-outlined text-status-emergency text-[32px]">call</span>
          <h2 className="font-headline-sm text-headline-sm text-status-emergency">SAMU 192 (Urgência)</h2>
          <a href="tel:192" className="self-start px-space-md h-11 rounded-lg bg-status-emergency text-on-error font-label-md text-label-md flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-[18px]">call</span>
            Ligar 192
          </a>
          <Link href="/" className="font-label-sm text-label-sm font-bold text-brand-purple-base hover:text-brand-purple-dark flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">home</span>
            Voltar ao início
          </Link>
        </div>
      </section>
    </>
  );
}
