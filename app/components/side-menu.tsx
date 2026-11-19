"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { pathOf } from "../lib/site-map";

export type SideMenuItem = { label: string; href: string; icon: string; children?: { label: string; href: string }[] };

type SideMenuProps = {
  eyebrow: string;
  title: string;
  items: SideMenuItem[];
};

const ITEM = "flex items-center justify-between p-3 rounded-lg font-label-md text-label-md transition-all";
const ITEM_ACTIVE = "bg-brand-purple-soft text-brand-purple-deep font-semibold";
const ITEM_IDLE = "text-on-surface-variant hover:bg-brand-purple-soft hover:text-brand-purple-deep";
const CHILD = "block px-3 py-2 rounded-lg font-label-sm text-label-sm transition-colors";

/** Menu lateral no padrão "Guia de Farmácia" da tela 3.0 do Stitch */
export function SideMenu({ eyebrow, title, items }: SideMenuProps) {
  const pathname = usePathname();

  return (
    <div className="bg-surface-card p-space-md rounded-xl shadow-md">
      <div className="pb-3 mb-3">
        <span className="font-label-sm text-label-sm uppercase font-bold text-brand-purple-base tracking-wider">{eyebrow}</span>
        <h3 className="font-headline-sm text-headline-sm text-brand-purple-deep mt-1">{title}</h3>
      </div>
      <nav className="flex flex-col gap-1.5" aria-label={title}>
        {items.map((item) => {
          const path = pathOf(item.href);
          const active = pathname === path && !item.href.includes("#");
          const children = item.children ?? [];
          const expanded = children.length > 0 && (pathname === path || pathname.startsWith(`${path}/`));
          return (
            <div key={item.href} className="flex flex-col gap-1">
              <Link href={item.href} aria-current={active ? "page" : undefined} className={`${ITEM} ${active || expanded ? ITEM_ACTIVE : ITEM_IDLE}`}>
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-[20px] ${active || expanded ? "text-brand-purple-vivid" : "text-text-muted"}`}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <span className={`material-symbols-outlined text-[18px] transition-transform ${expanded ? "rotate-90" : ""}`}>chevron_right</span>
              </Link>
              {expanded && (
                <div className="ml-5 pl-3 border-l border-border-subtle flex flex-col gap-0.5">
                  {children.map((child) => {
                    const childActive = pathname === pathOf(child.href);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        aria-current={childActive ? "page" : undefined}
                        className={`${CHILD} ${childActive ? "bg-brand-purple-soft text-brand-purple-deep font-semibold" : "text-on-surface-variant hover:bg-brand-purple-soft hover:text-brand-purple-deep"}`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
