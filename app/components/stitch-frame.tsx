"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { resolveStitchAnchor, resolveStitchLink } from "../lib/site-map";
import { mapsUrl, useDialogs } from "./dialogs/global-dialogs";
import { PENDING_INTEGRATION_MESSAGE, usePortal } from "./portal-provider";
import { searchHref } from "./search/search-box";

type StitchFrameProps = {
  /** Caminho da tela exportada do Stitch em /public/telas */
  src: string;
  title: string;
  /** Exibe somente estes blocos (ids) da tela */
  only?: string[];
  /** Oculta estes blocos (ids) da tela */
  hide?: string[];
};

type BridgeMessage =
  | { source: "stitch-bridge"; type: "ready" }
  | { source: "stitch-bridge"; type: "height"; height: number }
  | { source: "stitch-bridge"; type: "scroll"; top: number }
  | { source: "stitch-bridge"; type: "link"; path: string; text: string }
  | { source: "stitch-bridge"; type: "anchor"; id: string }
  | { source: "stitch-bridge"; type: "search"; query: string }
  | { source: "stitch-bridge"; type: "document"; id: string }
  | { source: "stitch-bridge"; type: "repository"; year: string }
  | { source: "stitch-bridge"; type: "unit"; name: string }
  | { source: "stitch-bridge"; type: "route"; name: string };

const RESIZE_EVENT = "stitch:resize";

function headerOffset(): number {
  const header = document.querySelector(".site-header");
  return (header?.getBoundingClientRect().height ?? 169) + 16;
}

function currentHash(): string {
  return decodeURIComponent(window.location.hash.replace(/^#/, ""));
}

/** Rola a página até um id — no documento do portal ou dentro de uma tela incorporada */
export function scrollToHash(id: string, behavior: ScrollBehavior = "smooth"): boolean {
  if (!id) return false;
  const element = document.getElementById(id);
  if (element) {
    window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - headerOffset(), behavior });
    return true;
  }
  document.querySelectorAll<HTMLIFrameElement>("iframe.stitch-frame").forEach((frame) => {
    frame.contentWindow?.postMessage({ source: "stitch-host", type: "reveal", id }, window.location.origin);
  });
  return false;
}

function navigate(router: ReturnType<typeof useRouter>, href: string, openDocument: (id: string) => void) {
  if (href.startsWith("doc:")) {
    openDocument(href.slice(4));
    return;
  }
  if (/^https?:/i.test(href)) {
    window.open(href, "_blank", "noopener,noreferrer");
    return;
  }
  const [path, hash] = href.split("#");
  if (path === window.location.pathname && hash) {
    window.history.pushState(null, "", href);
    scrollToHash(hash);
    return;
  }
  router.push(href);
}

/**
 * Exibe uma tela do Stitch sem barra de rolagem própria: a altura acompanha o
 * conteúdo e os links internos usam o roteador do portal (via public/telas/bridge.js).
 */
export function StitchFrame({ src, title, only, hide }: StitchFrameProps) {
  const router = useRouter();
  const { notify } = usePortal();
  const { openDocument, openRepository, openUnit } = useDialogs();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  const query = new URLSearchParams({ embed: "1" });
  if (only?.length) query.set("only", only.join(","));
  if (hide?.length) query.set("hide", hide.join(","));
  const url = `${src}?${query.toString()}`;

  useEffect(() => {
    function onMessage(event: MessageEvent<BridgeMessage>) {
      const frame = frameRef.current;
      if (!frame || event.source !== frame.contentWindow || event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data || data.source !== "stitch-bridge") return;

      switch (data.type) {
        case "ready": {
          const hash = currentHash();
          if (hash) frame.contentWindow?.postMessage({ source: "stitch-host", type: "reveal", id: hash }, window.location.origin);
          break;
        }
        case "height":
          setHeight(data.height);
          window.dispatchEvent(new Event(RESIZE_EVENT));
          break;
        case "scroll": {
          const rect = frame.getBoundingClientRect();
          const zoom = frame.offsetHeight ? rect.height / frame.offsetHeight : 1;
          window.scrollTo({ top: rect.top + window.scrollY + data.top * zoom - headerOffset(), behavior: "smooth" });
          break;
        }
        case "link": {
          const href = resolveStitchLink(data.path, data.text);
          if (href) navigate(router, href, openDocument);
          else notify(PENDING_INTEGRATION_MESSAGE);
          break;
        }
        case "anchor": {
          const href = resolveStitchAnchor(data.id);
          if (href) navigate(router, href, openDocument);
          else notify(PENDING_INTEGRATION_MESSAGE);
          break;
        }
        case "search":
          router.push(searchHref(data.query));
          break;
        case "document":
          openDocument(data.id);
          break;
        case "repository":
          openRepository(data.year);
          break;
        case "unit":
          openUnit(data.name);
          break;
        case "route":
          window.open(mapsUrl(data.name), "_blank", "noopener,noreferrer");
          break;
      }
    }
    window.addEventListener("message", onMessage);
    // A tela pode ter carregado (ex.: do cache) antes da hidratação: pede o estado de novo
    sayHello();
    return () => window.removeEventListener("message", onMessage);
  }, [router, notify, openDocument, openRepository, openUnit]);

  function sayHello() {
    frameRef.current?.contentWindow?.postMessage({ source: "stitch-host", type: "hello" }, window.location.origin);
  }

  return (
    <iframe
      ref={frameRef}
      className="stitch-frame"
      src={url}
      title={title}
      loading="eager"
      onLoad={sayHello}
      data-ready={height !== null}
      style={{ height: height ?? "75vh" }}
    />
  );
}

/**
 * Mantém a rolagem para âncoras (#id) funcionando entre o portal e as telas:
 * ao entrar numa rota com hash e ao clicar em links para a mesma página.
 */
export function HashScroller() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = currentHash();
    if (!hash) return;
    let userScrolled = false;
    const stop = () => {
      userScrolled = true;
    };
    const retry = () => {
      if (!userScrolled && document.getElementById(hash)) scrollToHash(hash, "auto");
    };
    const first = window.setTimeout(() => scrollToHash(hash), 120);
    // Telas acima do alvo ainda podem crescer enquanto carregam
    window.addEventListener(RESIZE_EVENT, retry);
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchmove", stop, { passive: true });
    window.addEventListener("keydown", stop);
    const done = window.setTimeout(() => window.removeEventListener(RESIZE_EVENT, retry), 4000);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(done);
      window.removeEventListener(RESIZE_EVENT, retry);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      window.removeEventListener("keydown", stop);
    };
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || anchor.target === "_blank") return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const id = decodeURIComponent(url.hash.slice(1));
      window.setTimeout(() => scrollToHash(id), 60);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
