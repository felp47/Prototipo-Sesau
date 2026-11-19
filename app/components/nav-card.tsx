import Link from "next/link";
import type { Highlight } from "../lib/site-map";

type NavCardProps = {
  href: string;
  icon: string;
  eyebrow: string;
  title: string;
  description?: string;
  cta: string;
};

/** Card clicável no padrão "Cinco Eixos da Saúde" da Home do Stitch */
export function NavCard({ href, icon, eyebrow, title, description, cta }: NavCardProps) {
  return (
    <Link
      href={href}
      className="group bg-surface-card rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden focus-visible:outline-2 focus-visible:outline-brand-purple-base"
    >
      <div className="w-full h-1.5 bg-brand-purple-base absolute top-0 left-0" />
      <div>
        <div className="w-12 h-12 rounded-xl bg-brand-purple-soft text-brand-purple-base flex items-center justify-center mb-4 group-hover:bg-brand-purple-base group-hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[28px]">{icon}</span>
        </div>
        <span className="font-label-sm text-label-sm font-bold text-brand-purple-vivid uppercase tracking-wide">{eyebrow}</span>
        <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 group-hover:text-brand-purple-base transition-colors">{title}</h3>
        {description && <p className="font-body-md text-body-md text-text-muted mt-2">{description}</p>}
      </div>
      <div className="mt-6 pt-4 flex items-center justify-between text-brand-purple-base font-label-sm text-label-sm font-semibold">
        <span>{cta}</span>
        <span className="material-symbols-outlined text-[18px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
      </div>
    </Link>
  );
}

/** Card de serviço ou notícia com texto extraído das telas do Stitch */
export function HighlightCard({ highlight, href }: { highlight: Highlight; href?: string }) {
  if (highlight.image) {
    const body = (
      <>
        <div className="relative h-48 w-full overflow-hidden bg-brand-purple-deep">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={highlight.image.src} alt={highlight.image.alt} />
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-status-success-bg text-secondary font-label-sm text-label-sm backdrop-blur-sm font-semibold">
            {highlight.tag}
          </span>
        </div>
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-text-muted font-label-sm text-label-sm mb-2">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              <span>{highlight.image.date}</span>
              <span>·</span>
              <span>{highlight.image.category}</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-brand-purple-base transition-colors leading-snug">{highlight.title}</h3>
            <p className="font-body-md text-body-md text-text-muted mt-3">{highlight.text}</p>
          </div>
        </div>
      </>
    );
    const className = "bg-surface-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group";
    return href ? (
      <Link href={href} className={className}>
        {body}
      </Link>
    ) : (
      <article className={className}>{body}</article>
    );
  }

  return (
    <div className="bg-surface-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="w-12 h-12 rounded-xl bg-brand-purple-soft text-brand-purple-base flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">{highlight.icon}</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-brand-purple-soft text-brand-purple-deep font-label-sm text-label-sm font-semibold">{highlight.tag}</span>
        </div>
        <h3 className="font-headline-sm text-headline-sm text-brand-purple-deep">{highlight.title}</h3>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2">{highlight.text}</p>
      </div>
      {highlight.cta && (
        <div className="mt-6">
          <Link
            className="w-full h-11 rounded-lg bg-surface-canvas hover:bg-brand-purple-base hover:text-white text-brand-purple-deep font-label-md text-label-md flex items-center justify-center gap-2 transition-all shadow-sm"
            href={highlight.cta.href}
          >
            <span className="material-symbols-outlined text-[18px]">{highlight.cta.icon}</span>
            <span>{highlight.cta.label}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
