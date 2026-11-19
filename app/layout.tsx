import type { Metadata } from "next";
import "./globals.css";
import { Breadcrumbs } from "./components/breadcrumbs";
import { DialogsProvider } from "./components/dialogs/global-dialogs";
import { SiteHeader } from "./components/header/site-header";
import { PortalProvider } from "./components/portal-provider";
import { SiteFooter } from "./components/site-footer";
import { HashScroller } from "./components/stitch-frame";

export const metadata: Metadata = {
  title: {
    default: "SESAU Camaçari - Secretaria Municipal da Saúde",
    template: "%s · SESAU Camaçari",
  },
  description: "Portal da Saúde — Secretaria Municipal da Saúde de Camaçari (SUS).",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&display=swap" />
        {/* Fonte de ícones com display=block: evita exibir o nome do ícone como texto durante o carregamento */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" />
      </head>
      <body className="bg-surface-canvas font-body-md text-body-md text-on-surface antialiased selection:bg-brand-purple-soft selection:text-brand-purple-deep">
        <PortalProvider>
          <DialogsProvider>
          <SiteHeader />
          <div className="pt-[169px]">
            <div className="site-content">
              <Breadcrumbs />
              <main id="conteudo-principal" tabIndex={-1} className="w-full bg-surface-canvas min-h-[50vh] focus:outline-none">
                {children}
              </main>
              <SiteFooter />
            </div>
          </div>
          <HashScroller />
          </DialogsProvider>
        </PortalProvider>
      </body>
    </html>
  );
}
