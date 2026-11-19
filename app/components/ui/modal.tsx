"use client";

import { useEffect, useId, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: string;
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  footer?: ReactNode;
};

const SIZES = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl" };
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const noop = () => () => {};

/** Diálogo modal acessível (foco preso, Esc fecha, foco devolvido ao fechar) */
export function Modal({ open, onClose, title, description, icon, size = "md", children, footer }: ModalProps) {
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const isClient = useSyncExternalStore(noop, () => true, () => false);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      const first = panel.current?.querySelector<HTMLElement>("[data-autofocus]") ?? panel.current?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel.current)?.focus();
    });
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current();
      } else if (event.key === "Tab" && panel.current) {
        const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open]);

  if (!open || !isClient) return null;

  return createPortal(
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-brand-purple-deep/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`dropdown-enter relative w-full ${SIZES[size]} max-h-[92dvh] flex flex-col bg-surface-card rounded-t-2xl sm:rounded-2xl shadow-[0_24px_48px_rgba(74,21,77,0.25)] focus:outline-none`}
      >
        <div className="flex items-start gap-3 p-space-lg pb-space-md border-b border-border-subtle">
          {icon && (
            <div className="w-10 h-10 shrink-0 rounded-xl bg-brand-purple-soft text-brand-purple-base flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">{icon}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 id={titleId} className="font-headline-sm text-headline-sm text-brand-purple-deep">
              {title}
            </h2>
            {description && <p className="font-label-sm text-label-sm text-text-muted mt-0.5">{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="w-9 h-9 shrink-0 rounded-lg text-text-muted hover:bg-brand-purple-soft hover:text-brand-purple-deep flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>
        <div className="p-space-lg overflow-y-auto">{children}</div>
        {footer && <div className="p-space-md px-space-lg border-t border-border-subtle flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel: string;
  tone?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ open, title, message, confirmLabel, tone = "danger", onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      icon={tone === "danger" ? "warning" : "help"}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} data-autofocus>
            Voltar
          </Button>
          <Button variant={tone === "danger" ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="font-body-md text-body-md text-on-surface-variant">{message}</div>
    </Modal>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  icon?: string;
  loading?: boolean;
};

const VARIANTS = {
  primary: "bg-brand-purple-base text-text-on-purple hover:bg-brand-purple-dark shadow-sm",
  secondary: "bg-surface-card text-brand-purple-deep border border-border-subtle hover:bg-brand-purple-soft",
  danger: "bg-status-emergency text-on-error hover:opacity-90 shadow-sm",
  ghost: "text-brand-purple-base hover:bg-brand-purple-soft",
};

/** Botão no padrão dos CTAs do Stitch (h-11, rounded-lg, label-md) */
export function Button({ variant = "primary", icon, loading, children, className = "", disabled, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`h-11 px-space-md rounded-lg font-label-md text-label-md inline-flex items-center justify-center gap-2 transition-all disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
    >
      {loading ? (
        <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
      ) : (
        icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>
      )}
      {children}
    </button>
  );
}
