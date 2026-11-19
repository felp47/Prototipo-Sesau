"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Links antigos apontavam para âncoras da página da seção
 * (ex.: /institucional/apoio-logistico#tfd-logistica). Agora cada item tem
 * página própria: a âncora (que não chega ao servidor) é convertida aqui.
 */
export function LegacyAnchorRedirect({ targets }: { targets: Record<string, string> }) {
  const router = useRouter();
  useEffect(() => {
    const check = () => {
      const anchor = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      const target = anchor && targets[anchor];
      if (target) router.replace(target);
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [router, targets]);
  return null;
}
