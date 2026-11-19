"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { categories, isActivePath, pathOf, slugify, type NavCategory } from "../../lib/site-map";

/* Classes exatamente como no header da Home exportada do Stitch */
const TRIGGER_BASE =
  "py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-brand-purple-soft hover:text-brand-purple-deep transition-all flex items-center gap-1 whitespace-nowrap";
const TRIGGER_ACTIVE =
  "py-2 transition-all flex items-center gap-1 whitespace-nowrap bg-brand-purple-soft text-brand-purple-deep font-label-md rounded-lg";
/* Stitch usa px-space-md; entre 1024px e 1279px o espaçamento é reduzido para caber na linha */
const TRIGGER_PADDING = "px-2 xl:px-space-md";
const DROPDOWN_PANEL =
  "bg-surface-card rounded-xl p-space-sm shadow-[0_12px_24px_rgba(74,21,77,0.12)] border border-border-subtle";
const LEVEL2 =
  "block px-space-sm py-1 font-label-sm text-label-sm font-bold text-brand-purple-deep border-b border-border-subtle/50 hover:text-brand-purple-vivid transition-colors";
const LEVEL3 =
  "block px-space-sm py-1.5 rounded-lg text-label-sm text-on-surface-variant hover:bg-brand-purple-soft hover:text-brand-purple-deep transition-colors";
const LEVEL3_ACTIVE = "block px-space-sm py-1.5 transition-colors bg-brand-purple-soft text-brand-purple-deep font-label-md text-label-sm rounded-lg";

export function DesktopNav({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<number | null>(null);
  const pointerType = useRef<string>("mouse");
  const navRef = useRef<HTMLElement>(null);

  // Fecha o menu ao trocar de rota
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(null);
  }, [pathname]);

  // Fecha ao tocar/clicar fora
  useEffect(() => {
    function onPointerDown(event: globalThis.PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) setOpen(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function triggers(): HTMLAnchorElement[] {
    return Array.from(navRef.current?.querySelectorAll<HTMLAnchorElement>("[data-nav-trigger]") ?? []);
  }

  function menuLinks(index: number): HTMLAnchorElement[] {
    return Array.from(navRef.current?.querySelectorAll<HTMLAnchorElement>(`[data-nav-menu="${index}"] a`) ?? []);
  }

  function focusMenu(index: number, position: "first" | "last") {
    setOpen(index);
    requestAnimationFrame(() => {
      const links = menuLinks(index);
      (position === "first" ? links[0] : links[links.length - 1])?.focus();
    });
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLAnchorElement>, index: number) {
    const all = triggers();
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusMenu(index, "first");
        break;
      case "ArrowUp":
        event.preventDefault();
        focusMenu(index, "last");
        break;
      case "ArrowRight":
        event.preventDefault();
        all[(index + 1) % all.length]?.focus();
        break;
      case "ArrowLeft":
        event.preventDefault();
        all[(index - 1 + all.length) % all.length]?.focus();
        break;
      case "Escape":
        setOpen(null);
        break;
    }
  }

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>, index: number) {
    const links = menuLinks(index);
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      links[(current + 1) % links.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      links[(current - 1 + links.length) % links.length]?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(null);
      triggers()[index]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      links[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      links[links.length - 1]?.focus();
    }
  }

  return (
    <nav ref={navRef} aria-label="Menu principal" className={`items-center gap-space-xs py-1 ${className}`}>
      {categories.map((category, index) => (
        <NavGroup
          key={category.href}
          category={category}
          index={index}
          pathname={pathname}
          isOpen={open === index}
          onOpen={() => setOpen(index)}
          onClose={() => setOpen((current) => (current === index ? null : current))}
          onTriggerPointerDown={(event) => {
            pointerType.current = event.pointerType;
          }}
          onTriggerClick={(event) => {
            // Em telas de toque o primeiro toque abre o submenu; o segundo navega
            if (pointerType.current !== "mouse" && open !== index) {
              event.preventDefault();
              setOpen(index);
            }
          }}
          onTriggerKeyDown={(event) => onTriggerKeyDown(event, index)}
          onMenuKeyDown={(event) => onMenuKeyDown(event, index)}
        />
      ))}
    </nav>
  );
}

type NavGroupProps = {
  category: NavCategory;
  index: number;
  pathname: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onTriggerPointerDown: (event: PointerEvent<HTMLAnchorElement>) => void;
  onTriggerClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  onTriggerKeyDown: (event: KeyboardEvent<HTMLAnchorElement>) => void;
  onMenuKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
};

function NavGroup({
  category,
  index,
  pathname,
  isOpen,
  onOpen,
  onClose,
  onTriggerPointerDown,
  onTriggerClick,
  onTriggerKeyDown,
  onMenuKeyDown,
}: NavGroupProps) {
  const active = isActivePath(pathname, category.href);
  const menuId = `menu-categoria-${slugify(category.title)}`;

  return (
    <div
      className="relative group"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) onClose();
      }}
    >
      <Link
        href={category.href}
        data-nav-trigger
        aria-current={active ? "page" : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={menuId}
        className={`${TRIGGER_PADDING} ${active ? TRIGGER_ACTIVE : TRIGGER_BASE}`}
        onPointerDown={onTriggerPointerDown}
        onClick={onTriggerClick}
        onKeyDown={onTriggerKeyDown}
      >
        {category.title}
        <span
          className={`material-symbols-outlined text-[18px] text-text-muted group-hover:text-brand-purple-deep transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          expand_more
        </span>
      </Link>
      <div
        id={menuId}
        data-nav-menu={index}
        className={`absolute left-0 top-full pt-1.5 z-50 min-w-[280px] ${isOpen ? "block dropdown-enter" : "hidden"}`}
        onKeyDown={onMenuKeyDown}
      >
        <div className={DROPDOWN_PANEL}>
          {category.sections.map((section, sectionIndex) => (
            <div key={section.href} role="group" aria-label={section.label}>
              <Link href={section.href} className={`${LEVEL2} ${sectionIndex === 0 ? "mb-1" : "my-1 pt-1"}`}>
                {section.label}
              </Link>
              {section.items.map((item) => {
                const itemActive = pathname === pathOf(item.href);
                return (
                  <Link
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    aria-current={itemActive ? "page" : undefined}
                    className={itemActive ? LEVEL3_ACTIVE : LEVEL3}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
