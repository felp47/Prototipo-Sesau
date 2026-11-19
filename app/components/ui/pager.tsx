"use client";

import { Button } from "./modal";

export function Pager({ page, totalPages, onChange, label }: { page: number; totalPages: number; onChange: (page: number) => void; label: string }) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label={label} className="flex items-center justify-between gap-2">
      <Button variant="secondary" icon="chevron_left" className="h-9" disabled={page === 1} onClick={() => onChange(page - 1)}>
        Anterior
      </Button>
      <span className="font-label-sm text-label-sm text-text-muted">
        Página {page} de {totalPages}
      </span>
      <Button variant="secondary" icon="chevron_right" className="h-9 flex-row-reverse" disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        Próxima
      </Button>
    </nav>
  );
}
