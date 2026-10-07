"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";

/**
 * Modal acessível sobre <dialog> nativo: foco preso, Esc fecha, backdrop clicável.
 */
export function Modal({
  open, onClose, title, description, children, footer, size,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (!open && el.open) el.close();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="modal"
      style={size === "lg" ? { width: "min(720px, calc(100vw - 24px))" } : size === "sm" ? { width: "min(440px, calc(100vw - 24px))" } : undefined}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={() => {
        document.documentElement.style.overflow = "";
        onClose();
      }}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open && (
        <>
          <div className="modal__head">
            <div className="stack-sm">
              <h2 id={titleId} className="h-3">
                {title}
              </h2>
              {description && (
                <p id={descId} className="muted">
                  {description}
                </p>
              )}
            </div>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar">
              <X size={20} />
            </button>
          </div>
          {children && <div className="modal__body">{children}</div>}
          {footer && <div className="modal__foot">{footer}</div>}
        </>
      )}
    </dialog>
  );
}
