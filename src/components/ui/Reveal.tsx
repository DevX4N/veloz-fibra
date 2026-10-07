"use client";

import type { ElementType, ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

/** Fade-in sutil ao entrar na tela (respeita prefers-reduced-motion via CSS). */
export function Reveal({
  children, as: Tag = "div", delay = 0, className = "", ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  [key: string]: unknown;
}) {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "is-visible" : ""} ${className}`}
      style={delay ? ({ "--d": `${delay}ms` } as React.CSSProperties) : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
