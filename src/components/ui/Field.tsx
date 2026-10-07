"use client";

import { CircleAlert, Check } from "lucide-react";
import { useId, type ComponentProps, type ReactNode } from "react";

type FieldShell = {
  label: string;
  error?: string | null;
  hint?: ReactNode;
  optional?: boolean;
  success?: boolean;
  loading?: boolean;
  className?: string;
};

function Shell({
  id, label, error, hint, optional, success, loading, className, children,
}: FieldShell & { id: string; children: ReactNode }) {
  return (
    <div className={["field", error && "field--error", success && !error && "field--success", className].filter(Boolean).join(" ")}>
      <label className="field__label" htmlFor={id}>
        <span>{label}</span>
        {optional && <span className="field__optional">Opcional</span>}
      </label>
      <div className="field__control">
        {children}
        {loading && <span className="spinner field__icon field__icon--spin" aria-hidden="true" />}
        {success && !error && !loading && <Check size={18} className="field__icon" aria-hidden="true" />}
      </div>
      {error ? (
        <p className="field__error" id={`${id}-error`} role="alert">
          <CircleAlert size={15} aria-hidden="true" /> {error}
        </p>
      ) : hint ? (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, error?: string | null, hint?: ReactNode) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

export function TextField({
  label, error, hint, optional, success, loading, className, id: idProp, ...input
}: FieldShell & ComponentProps<"input">) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <Shell {...{ id, label, error, hint, optional, success, loading, className }}>
      <input
        id={id}
        className="input"
        aria-invalid={!!error || undefined}
        aria-describedby={describedBy(id, error, hint)}
        required={!optional}
        {...input}
      />
    </Shell>
  );
}

export function SelectField({
  label, error, hint, optional, className, id: idProp, children, ...select
}: FieldShell & ComponentProps<"select">) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <Shell {...{ id, label, error, hint, optional, className }}>
      <select
        id={id}
        className="select"
        aria-invalid={!!error || undefined}
        aria-describedby={describedBy(id, error, hint)}
        required={!optional}
        {...select}
      >
        {children}
      </select>
    </Shell>
  );
}

export function TextAreaField({
  label, error, hint, optional, className, id: idProp, ...area
}: FieldShell & ComponentProps<"textarea">) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <Shell {...{ id, label, error, hint, optional, className }}>
      <textarea
        id={id}
        className="textarea"
        aria-invalid={!!error || undefined}
        aria-describedby={describedBy(id, error, hint)}
        required={!optional}
        {...area}
      />
    </Shell>
  );
}

export function FormAlert({ tone, children, icon }: { tone: "error" | "info" | "success" | "warn"; children: ReactNode; icon?: ReactNode }) {
  return (
    <div className={`form-alert form-alert--${tone}`} role={tone === "error" ? "alert" : "status"}>
      {icon ?? <CircleAlert size={18} aria-hidden="true" />}
      <div>{children}</div>
    </div>
  );
}
