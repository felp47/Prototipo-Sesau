"use client";

import { useId, type ReactNode } from "react";

/* Campos no padrão dos formulários das telas do Stitch (Remédios/Farmácia) */

const CONTROL =
  "w-full h-11 px-3 rounded-lg bg-surface-card border text-on-surface font-body-md text-body-md placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-purple-soft transition-all";

function controlClass(error?: string) {
  return `${CONTROL} ${error ? "border-error focus:border-error" : "border-border-strong focus:border-brand-purple-base"}`;
}

type FieldShellProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  help?: string;
  className?: string;
  children: ReactNode;
};

function FieldShell({ id, label, required, error, help, className = "", children }: FieldShellProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="font-label-md text-label-md text-on-surface">
        {label}
        {required && (
          <span className="text-status-emergency ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-erro`} role="alert" className="flex items-center gap-1 font-label-sm text-label-sm text-error">
          <span className="material-symbols-outlined text-[16px]">error</span>
          {error}
        </p>
      ) : (
        help && (
          <p id={`${id}-ajuda`} className="font-label-sm text-label-sm text-text-muted">
            {help}
          </p>
        )
      )}
    </div>
  );
}

type BaseProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  help?: string;
  className?: string;
};

export function TextField({
  type = "text",
  placeholder,
  mask,
  inputMode,
  autoComplete,
  min,
  maxLength,
  ...props
}: BaseProps & {
  type?: string;
  placeholder?: string;
  mask?: (value: string) => string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  min?: string;
  maxLength?: number;
}) {
  const id = useId();
  return (
    <FieldShell id={id} label={props.label} required={props.required} error={props.error} help={props.help} className={props.className}>
      <input
        id={id}
        name={props.name}
        type={type}
        value={props.value}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        min={min}
        maxLength={maxLength}
        aria-required={props.required || undefined}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={props.error ? `${id}-erro` : props.help ? `${id}-ajuda` : undefined}
        onChange={(event) => props.onChange(mask ? mask(event.target.value) : event.target.value)}
        className={controlClass(props.error)}
      />
    </FieldShell>
  );
}

export function SelectField({ options, placeholder = "Selecione...", ...props }: BaseProps & { options: { value: string; label: string; disabled?: boolean }[]; placeholder?: string }) {
  const id = useId();
  return (
    <FieldShell id={id} label={props.label} required={props.required} error={props.error} help={props.help} className={props.className}>
      <div className="relative">
        <select
          id={id}
          name={props.name}
          value={props.value}
          aria-required={props.required || undefined}
          aria-invalid={props.error ? true : undefined}
          aria-describedby={props.error ? `${id}-erro` : props.help ? `${id}-ajuda` : undefined}
          onChange={(event) => props.onChange(event.target.value)}
          className={`${controlClass(props.error)} appearance-none pr-10`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-2.5 text-text-muted text-[20px] pointer-events-none">expand_more</span>
      </div>
    </FieldShell>
  );
}

export function TextAreaField({ placeholder, rows = 4, maxLength, ...props }: BaseProps & { placeholder?: string; rows?: number; maxLength?: number }) {
  const id = useId();
  return (
    <FieldShell
      id={id}
      label={props.label}
      required={props.required}
      error={props.error}
      help={props.help ?? (maxLength ? `${props.value.length}/${maxLength} caracteres` : undefined)}
      className={props.className}
    >
      <textarea
        id={id}
        name={props.name}
        value={props.value}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-required={props.required || undefined}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={props.error ? `${id}-erro` : `${id}-ajuda`}
        onChange={(event) => props.onChange(event.target.value)}
        className={`${controlClass(props.error)} h-auto py-2.5 resize-y`}
      />
    </FieldShell>
  );
}

export function CheckboxField({ label, checked, onChange, error, name }: { label: ReactNode; checked: boolean; onChange: (checked: boolean) => void; error?: string; name: string }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex items-start gap-2 font-body-md text-body-md text-on-surface cursor-pointer">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          aria-invalid={error ? true : undefined}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 w-4 h-4 accent-brand-purple-base"
        />
        <span>{label}</span>
      </label>
      {error && (
        <p role="alert" className="flex items-center gap-1 font-label-sm text-label-sm text-error">
          <span className="material-symbols-outlined text-[16px]">error</span>
          {error}
        </p>
      )}
    </div>
  );
}

/** Mensagem de status no topo de um formulário (sucesso/erro) */
export function FormAlert({ tone, children }: { tone: "success" | "error" | "info"; children: ReactNode }) {
  const styles = {
    success: "bg-status-success-bg text-status-success border-status-success/20",
    error: "bg-error-container/50 text-error border-error/20",
    info: "bg-brand-purple-soft text-brand-purple-deep border-border-subtle",
  }[tone];
  const icon = { success: "check_circle", error: "error", info: "info" }[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`flex items-start gap-2 rounded-lg border p-3 font-label-md text-label-md ${styles}`}>
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}
