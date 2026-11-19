"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { categories, isActivePath, pathOf, slugify } from "../../lib/site-map";
import { SearchBox } from "../search/search-box";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  id: string;
};

export function MobileNav({ open, onClose, id }: MobileNavProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    // Ao abrir, expande a categoria da página atual
    const current = categories.find((category) => isActivePath(pathname, category.href));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpanded(current?.href ?? null);
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, pathname, onClose]);

  if (!open) return null;

  return (
    <div
      id={id}
      className="dropdown-enter absolute left-0 right-0 top-full z-50 bg-surface-card border-t border-border-subtle shadow-[0_12px_24px_rgba(74,21,77,0.12)] max-h-[calc(100dvh-169px)] overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet py-space-md flex flex-col gap-space-sm">
        <SearchBox className="relative w-full lg:hidden" onNavigate={onClose} />
        <Link
          href="/"
          onClick={onClose}
          aria-current={pathname === "/" ? "page" : undefined}
          className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-label-md text-label-md transition-all ${
            pathname === "/" ? "bg-brand-purple-soft text-brand-purple-deep" : "text-on-surface-variant hover:bg-brand-purple-soft hover:text-brand-purple-deep"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
          Início
        </Link>
        <nav aria-label="Menu principal (mobile)" className="flex flex-col gap-space-xs">
          {categories.map((category) => {
            const isExpanded = expanded === category.href;
            const active = isActivePath(pathname, category.href);
            const panelId = `${id}-${slugify(category.title)}`;
            return (
              <div key={category.href} className="rounded-lg border border-border-subtle overflow-hidden">
                <div className={`flex items-center ${active ? "bg-brand-purple-soft" : ""}`}>
                  <Link
                    href={category.href}
                    onClick={onClose}
                    aria-current={pathname === category.href ? "page" : undefined}
                    className={`flex-1 flex items-center gap-2 px-space-md py-3 font-label-md text-label-md ${active ? "text-brand-purple-deep" : "text-on-surface-variant"}`}
                  >
                    <span className="material-symbols-outlined text-brand-purple-vivid text-[20px]">{category.icon}</span>
                    {category.title}
                  </Link>
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    aria-label={`${isExpanded ? "Recolher" : "Expandir"} ${category.title}`}
                    onClick={() => setExpanded(isExpanded ? null : category.href)}
                    className="h-12 w-12 flex items-center justify-center text-text-muted hover:text-brand-purple-deep border-l border-border-subtle"
                  >
                    <span className={`material-symbols-outlined text-[22px] transition-transform ${isExpanded ? "rotate-180" : ""}`}>expand_more</span>
                  </button>
                </div>
                {isExpanded && (
                  <div id={panelId} className="bg-surface-card p-space-sm border-t border-border-subtle">
                    {category.sections.map((section, index) => (
                      <div key={section.href}>
                        <Link
                          href={section.href}
                          onClick={onClose}
                          className={`block px-space-sm py-1.5 font-label-sm text-label-sm font-bold text-brand-purple-deep border-b border-border-subtle/50 ${index === 0 ? "mb-1" : "my-1 pt-1"}`}
                        >
                          {section.label}
                        </Link>
                        {section.items.map((item) => {
                          const itemActive = pathname === pathOf(item.href);
                          return (
                            <Link
                              key={`${item.label}-${item.href}`}
                              href={item.href}
                              onClick={onClose}
                              aria-current={itemActive ? "page" : undefined}
                              className={`block px-space-sm py-2 rounded-lg text-label-sm transition-colors ${
                                itemActive ? "bg-brand-purple-soft text-brand-purple-deep font-semibold" : "text-on-surface-variant hover:bg-brand-purple-soft hover:text-brand-purple-deep"
                              }`}
                            >
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <Link
          href="/upa-24h"
          onClick={onClose}
          className="self-start px-space-sm py-1.5 rounded-full bg-status-emergency-bg border border-error/20 text-status-emergency font-label-sm text-label-sm font-bold flex items-center gap-1 hover:bg-status-emergency hover:text-on-error transition-all md:hidden"
        >
          <span className="material-symbols-outlined text-[16px]">emergency</span>
          Plantão UPA 24h
        </Link>
      </div>
    </div>
  );
}
