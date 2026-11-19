import type { ReactNode } from "react";
import { PageHero } from "./category-page";

export function LegalPage({ icon, title, description, sections }: { icon: string; title: string; description: string; sections: { heading: string; body: ReactNode }[] }) {
  return (
    <>
      <PageHero icon={icon} badge="Portal da Saúde · SESAU Camaçari" title={title} description={description} />
      <section className="max-w-4xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-xl w-full flex flex-col gap-space-lg">
        <p className="font-label-md text-label-md text-status-warning bg-status-warning-bg rounded-lg p-3">
          Versão de demonstração (MVP). Este texto descreve o funcionamento atual do protótipo e não substitui o documento oficial da Prefeitura.
        </p>
        {sections.map((section) => (
          <article key={section.heading} className="bg-surface-card rounded-2xl shadow-sm p-space-lg">
            <h2 className="font-headline-sm text-headline-sm text-brand-purple-deep mb-2">{section.heading}</h2>
            <div className="font-body-md text-body-md text-on-surface-variant flex flex-col gap-2">{section.body}</div>
          </article>
        ))}
      </section>
    </>
  );
}
