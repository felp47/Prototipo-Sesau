"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getTrail } from "../lib/site-map";

/**
 * Trilha de navegação global, gerada a partir da arquitetura em lib/site-map.
 * Estilo da trilha das telas do Stitch (Farmácia / Prevenção).
 */
export function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  const trail = getTrail(pathname);

  return (
    <div className="w-full bg-surface-container-low py-space-sm">
      <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
        <nav aria-label="Trilha de navegação">
          <ol className="flex flex-wrap items-center gap-space-xs font-label-sm text-label-sm text-text-muted">
            {trail.map((crumb, index) => {
              const isFirst = index === 0;
              const isLast = index === trail.length - 1;
              return (
                <li key={crumb.href} className="flex items-center gap-space-xs">
                  {!isFirst && (
                    <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
                      chevron_right
                    </span>
                  )}
                  {isLast ? (
                    <span aria-current="page" className="text-brand-purple-deep font-bold">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className={`hover:text-brand-purple-deep transition-colors flex items-center gap-1 ${isFirst ? "" : "text-brand-purple-base font-semibold"}`}
                    >
                      {isFirst && (
                        <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                          home
                        </span>
                      )}
                      <span>{crumb.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
