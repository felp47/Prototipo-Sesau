"use client";

import Link from "next/link";
import { Fragment } from "react";
import { CARTA_DE_SERVICOS_URL, categories } from "../lib/site-map";

const FOOTER_LINK = "hover:text-white transition-colors";

/** Rodapé global — reprodução do rodapé da Home exportada do Stitch */
export function SiteFooter() {
  return (
    <footer className="w-full bg-[#230b26] text-[#e4d1e6] font-body-md">
      <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-space-lg mb-12 border-b border-white/10 pb-12">
          {categories.map((category) => (
            <div key={category.href}>
              <h4 className="font-label-md text-label-md font-bold text-white mb-3">
                <Link href={category.href} className={`flex items-center gap-1 ${FOOTER_LINK}`}>
                  <span className="material-symbols-outlined text-brand-purple-vivid text-[18px]">{category.icon}</span>
                  {category.title}
                </Link>
              </h4>
              <ul className="space-y-2 text-label-sm font-label-sm">
                {category.sections.map((section, index) => (
                  <Fragment key={section.href}>
                    <li className={`font-semibold text-primary-fixed-dim ${index === 0 ? "pt-1" : "pt-2"}`}>
                      <Link href={section.href} className={FOOTER_LINK}>
                        {section.footerLabel}
                      </Link>
                    </li>
                    {section.items.map((item) => (
                      <li key={`${item.label}-${item.href}`}>
                        <Link className={FOOTER_LINK} href={item.href}>
                          {item.footerLabel ?? item.label}
                        </Link>
                      </li>
                    ))}
                  </Fragment>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg text-label-sm font-label-sm">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-white font-headline-sm text-headline-sm">Prefeitura Municipal de Camaçari</span>
            <span className="text-primary-fixed-dim">Secretaria Municipal da Saúde (SESAU) · SUS Bahia</span>
            <span className="text-text-muted mt-1">Rua Rodolfo Tourinho, s/n - Centro Administrativo, Camaçari - BA, CEP: 42800-000</span>
          </div>
          <div className="flex flex-wrap items-center gap-space-md text-primary-fixed-dim">
            <a className={`flex items-center gap-1 ${FOOTER_LINK}`} href="tel:7136216824">
              <span className="material-symbols-outlined text-[18px]">call</span>
              <span>Central SESAU: (71) 3621-6824</span>
            </a>
            <Link className={`flex items-center gap-1 ${FOOTER_LINK}`} href="/institucional/transparencia-ouvidoria">
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
              <span>Ouvidoria: 136 / (71) 3622-7700</span>
            </Link>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
              <span>Atendimento: Seg a Sex, 08h às 17h</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-space-md text-[13px] text-text-muted">
          <p>© 2025 Prefeitura Municipal de Camaçari. Todos os direitos reservados. Sistema Único de Saúde.</p>
          <div className="flex flex-wrap items-center justify-center gap-space-md">
            <Link className={FOOTER_LINK} href="/termos-de-uso">
              Termos de Uso
            </Link>
            <Link className={FOOTER_LINK} href="/privacidade">
              Privacidade e LGPD
            </Link>
            <a className={FOOTER_LINK} href={CARTA_DE_SERVICOS_URL} target="_blank" rel="noopener noreferrer">
              Carta de Serviços
            </a>
            <Link className={FOOTER_LINK} href="/mapa-do-site">
              Mapa do Site
            </Link>
            <button
              type="button"
              className={`${FOOTER_LINK} flex items-center gap-1`}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              Voltar ao topo
            </button>
          </div>
        </div>
        <p className="mt-4 text-center text-[12px] text-text-muted">
          Versão de demonstração (MVP): dados fictícios, armazenados somente neste navegador. Nenhuma informação é enviada à SESAU.
        </p>
      </div>
    </footer>
  );
}
