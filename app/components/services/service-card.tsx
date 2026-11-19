import type { ReactNode } from "react";

/** Bloco de serviço no padrão dos blocos numerados das telas do Stitch */
export function ServiceCard({ id, icon, title, description, children }: { id: string; icon: string; title: string; description?: string; children: ReactNode }) {
  return (
    <section id={id} className="flex flex-col gap-space-md">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 shrink-0 rounded-xl bg-brand-purple-soft text-brand-purple-base flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px]">{icon}</span>
        </div>
        <div>
          <h3 className="font-headline-md text-headline-md text-brand-purple-deep">{title}</h3>
          {description && <p className="font-body-md text-body-md text-on-surface-variant">{description}</p>}
        </div>
      </div>
      <div className="bg-surface-card rounded-2xl shadow-sm p-space-md flex flex-col gap-space-md">{children}</div>
    </section>
  );
}
