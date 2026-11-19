"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type Notice = { id: number; message: string };

type PortalContextValue = {
  fontScale: number;
  contrast: boolean;
  increaseFont: () => void;
  decreaseFont: () => void;
  toggleContrast: () => void;
  /** Exibe um aviso não bloqueante (ex.: funcionalidade que depende de integração externa) */
  notify: (message: string) => void;
};

const PortalContext = createContext<PortalContextValue | null>(null);

const STORAGE_KEY = "sesau-a11y";
const MIN_SCALE = 0.9;
const MAX_SCALE = 1.3;

function readPrefs(): { fontScale: number; contrast: boolean } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { fontScale: 1, contrast: false };
    const parsed = JSON.parse(raw) as { fontScale?: number; contrast?: boolean };
    const scale = typeof parsed.fontScale === "number" ? Math.min(MAX_SCALE, Math.max(MIN_SCALE, parsed.fontScale)) : 1;
    return { fontScale: scale, contrast: Boolean(parsed.contrast) };
  } catch {
    return { fontScale: 1, contrast: false };
  }
}

export function PortalProvider({ children }: { children: ReactNode }) {
  const [fontScale, setFontScale] = useState(1);
  const [contrast, setContrast] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const loaded = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const prefs = readPrefs();
    // Preferências salvas no navegador são aplicadas após a hidratação
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFontScale(prefs.fontScale);
    setContrast(prefs.contrast);
    loaded.current = true;
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--content-zoom", String(fontScale));
    root.classList.toggle("a11y-contrast", contrast);
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontScale, contrast }));
    } catch {
      /* armazenamento indisponível: preferências valem só nesta visita */
    }
  }, [fontScale, contrast]);

  const notify = useCallback((message: string) => {
    if (timer.current) clearTimeout(timer.current);
    setNotice({ id: Date.now(), message });
    timer.current = setTimeout(() => setNotice(null), 7000);
  }, []);

  const value = useMemo<PortalContextValue>(
    () => ({
      fontScale,
      contrast,
      increaseFont: () => setFontScale((v) => Math.min(MAX_SCALE, Math.round((v + 0.1) * 10) / 10)),
      decreaseFont: () => setFontScale((v) => Math.max(MIN_SCALE, Math.round((v - 0.1) * 10) / 10)),
      toggleContrast: () => setContrast((v) => !v),
      notify,
    }),
    [fontScale, contrast, notify],
  );

  return (
    <PortalContext.Provider value={value}>
      {children}
      <div aria-live="polite" role="status" className="fixed bottom-4 right-4 left-4 sm:left-auto z-[200] flex justify-end pointer-events-none">
        {notice && (
          <div
            key={notice.id}
            className="toast-enter pointer-events-auto max-w-md bg-brand-purple-deep text-text-on-purple p-space-md rounded-xl shadow-[0_12px_24px_rgba(74,21,77,0.25)] flex items-start gap-3"
          >
            <span className="material-symbols-outlined text-primary-fixed-dim text-[22px]">info</span>
            <p className="font-label-md text-label-md font-medium flex-1">{notice.message}</p>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="text-primary-fixed hover:text-white transition-colors"
              aria-label="Fechar aviso"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        )}
      </div>
    </PortalContext.Provider>
  );
}

export function usePortal(): PortalContextValue {
  const context = useContext(PortalContext);
  if (!context) throw new Error("usePortal deve ser usado dentro de <PortalProvider>");
  return context;
}

export const PENDING_INTEGRATION_MESSAGE =
  "Este conteúdo ainda não foi publicado no portal. O documento ou serviço depende de integração com os sistemas da SESAU.";
