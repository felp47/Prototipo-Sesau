"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PREFEITURA_URL } from "../../lib/site-map";
import { useSession } from "../../lib/data-hooks";
import { usePortal } from "../portal-provider";
import { SearchBox } from "../search/search-box";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";

const LOGO_SRC =
  "https://lh3.googleusercontent.com/aida/ALJJyrBo2BkycENfplzL2wAGGANWG3uxtpS-_GwEvtR38vuGycuIEakZ8diYZ9Pzbwx_Asz7x2wqV29gZNqEYr0MlGnU8aAFNkjbakd-o1edoBlMD1hmNChvyZUMBqOymhC8l-RCoUq2KCGQv3ArKsjQ1yZjvHFcC4P1Bu8H33gtX4DJ9rq6D_8RSnzZwYCS-Issjov4UncgOptITB6GeAWiE0IWrLWRwNQpoKNlSg_rXvHRHGXJrOG-nO_uxUvC";

const CONTAINER = "max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop";
const A11Y_BUTTON = "px-space-xs hover:text-primary-fixed transition-colors";

/**
 * Header global do portal — reprodução do header da Home exportada do Stitch
 * (telas/portal_da_sa_de_sesau_cama_ari_home). Único header para todas as rotas.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const { increaseFont, decreaseFont, toggleContrast, contrast, notify } = usePortal();
  const { perfil } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="site-header fixed top-0 left-0 right-0 z-50 bg-surface-card shadow-[0_2px_12px_rgba(74,21,77,0.06)]">
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[60] focus:bg-surface-card focus:text-brand-purple-deep focus:px-3 focus:py-2 focus:rounded-lg focus:shadow-md font-label-md text-label-md"
      >
        Pular para o conteúdo
      </a>

      {/* Barra de acessibilidade */}
      <div className="bg-brand-purple-deep text-text-on-purple">
        <div className={`${CONTAINER} h-10 flex items-center justify-between font-label-sm text-label-sm`}>
          <div className="flex items-center gap-space-md">
            <span className="flex items-center gap-space-xs font-semibold">
              <span className="material-symbols-outlined text-[17px]">accessibility_new</span>
              <span className="hidden sm:inline">Acessibilidade</span>
            </span>
            <div className="flex items-center gap-space-xs">
              <button className={`${A11Y_BUTTON} font-bold`} title="Aumentar fonte" type="button" onClick={increaseFont}>
                A+
              </button>
              <button className={`${A11Y_BUTTON} font-bold`} title="Diminuir fonte" type="button" onClick={decreaseFont}>
                A-
              </button>
              <button
                className={`${A11Y_BUTTON} flex items-center gap-0.5`}
                title="Alto Contraste"
                type="button"
                aria-pressed={contrast}
                onClick={toggleContrast}
              >
                <span className="material-symbols-outlined text-[16px]">contrast</span>
                Contraste
              </button>
              <button
                className={`${A11Y_BUTTON} flex items-center gap-0.5`}
                title="VLibras"
                type="button"
                onClick={() =>
                  notify("A tradução em Libras depende da instalação do widget oficial VLibras (gov.br), que ainda não foi configurado neste portal.")
                }
              >
                <span className="material-symbols-outlined text-[16px]">sign_language</span>
                Libras
              </button>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-space-md">
            <a
              className="flex items-center gap-space-xs hover:text-primary-fixed transition-colors font-semibold"
              href={PREFEITURA_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              Portal da Prefeitura de Camaçari
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
            </a>
          </div>
        </div>
      </div>

      {/* Identidade + busca + conta */}
      <div className="bg-surface-card border-b border-border-subtle">
        <div className={`${CONTAINER} h-20 flex items-center justify-between gap-space-md`}>
          <Link href="/" className="flex items-center gap-space-md min-w-0" aria-label="Secretaria Municipal da Saúde — página inicial">
            <div className="flex items-center gap-space-sm shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Logo Prefeitura de Camaçari" className="h-12 w-auto max-w-32 object-contain overflow-hidden text-[10px] leading-3 text-text-muted" src={LOGO_SRC} />
              <div className="h-10 w-[2px] bg-border-subtle hidden sm:block" />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="font-headline-sm text-headline-sm text-brand-purple-deep leading-tight truncate">Secretaria Municipal da Saúde</span>
              <span className="font-label-sm text-label-sm text-text-muted truncate">Camaçari · Bahia · SUS - Sistema Único de Saúde</span>
            </div>
          </Link>
          <div className="flex items-center gap-space-md shrink-0">
            <SearchBox className="relative hidden lg:block w-72" />
            <Link
              href="/minha-conta"
              aria-current={pathname === "/minha-conta" ? "page" : undefined}
              className="h-11 px-space-md rounded-lg bg-brand-purple-soft hover:bg-brand-purple-base hover:text-text-on-purple text-brand-purple-deep font-label-md text-label-md flex items-center gap-space-xs transition-all border border-border-subtle"
            >
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
              <span className="hidden sm:inline">{perfil ? `Olá, ${perfil.nome.split(" ")[0]}` : "Minha Conta"}</span>
            </Link>
            <div className="shrink-0 ml-1 hidden sm:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-border-subtle" src={LOGO_SRC} />
            </div>
          </div>
        </div>
      </div>

      {/* Navegação global */}
      <div className="relative bg-surface-card shadow-[0_4px_10px_-2px_rgba(74,21,77,0.04)]">
        <div className={`${CONTAINER} h-12 flex items-center justify-between`}>
          <DesktopNav className="hidden lg:flex" />
          <button
            type="button"
            className="lg:hidden px-space-md py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-brand-purple-soft hover:text-brand-purple-deep transition-all flex items-center gap-1 whitespace-nowrap -ml-space-md"
            aria-expanded={mobileOpen}
            aria-controls="menu-mobile"
            onClick={() => setMobileOpen((value) => !value)}
          >
            <span className="material-symbols-outlined text-[22px]">{mobileOpen ? "close" : "menu"}</span>
            Menu
          </button>
          <div className="hidden md:flex lg:hidden xl:flex items-center shrink-0">
            <Link
              className="px-space-sm py-1.5 rounded-full bg-status-emergency-bg border border-error/20 text-status-emergency font-label-sm text-label-sm font-bold flex items-center gap-1 hover:bg-status-emergency hover:text-on-error transition-all"
              href="/upa-24h"
            >
              <span className="material-symbols-outlined text-[16px]">emergency</span>
              Plantão UPA 24h
            </Link>
          </div>
        </div>
        <MobileNav id="menu-mobile" open={mobileOpen} onClose={closeMobile} />
      </div>
    </header>
  );
}
