"use client";

import { Plus } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

export type AccordionItem = { id?: string; title: ReactNode; content: ReactNode };

export function Accordion({ items, defaultOpen = null, onToggle }: {
  items: AccordionItem[];
  defaultOpen?: number | null;
  onToggle?: (index: number, open: boolean) => void;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const base = useId();
  return (
    <div className="accordion">
      {items.map((item, i) => {
        const isOpen = open === i;
        const tid = `${base}-t${i}`;
        const pid = `${base}-p${i}`;
        return (
          <div className="accordion__item" key={item.id ?? i}>
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                id={tid}
                className="accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={pid}
                onClick={() => {
                  setOpen(isOpen ? null : i);
                  onToggle?.(i, !isOpen);
                }}
              >
                <span>{item.title}</span>
                <span className="accordion__icon" aria-hidden="true">
                  <Plus size={16} strokeWidth={2} />
                </span>
              </button>
            </h3>
            <div className="accordion__panel" id={pid} role="region" aria-labelledby={tid} data-open={isOpen} inert={!isOpen}>
              <div>
                <div className="accordion__body">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
