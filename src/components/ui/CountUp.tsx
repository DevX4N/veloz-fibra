"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

/** Contador que anima ao entrar na tela. Renderiza o valor final no SSR (sem layout shift). */
export function CountUp({ value, decimals = 0, prefix = "", suffix = "", duration = 1400 }: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const [display, setDisplay] = useState(value);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    // só anima no cliente, depois de montar
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
    setDisplay(0);
  }, []);

  useEffect(() => {
    if (!inView || !armed) return;
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, armed, value, duration]);

  const formatted = display.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span ref={ref} aria-label={`${prefix}${value.toLocaleString("pt-BR", { minimumFractionDigits: decimals })}${suffix}`}>
      <span aria-hidden="true">
        {prefix}
        {formatted}
        {suffix}
      </span>
    </span>
  );
}
