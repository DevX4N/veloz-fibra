"use client";

import { useCallback, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";

/** Copia para a área de transferência com fallback e feedback (toast + estado do botão). */
export function useCopy() {
  const toast = useToast();
  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback(
    async (text: string, key: string, message = "Código copiado!") => {
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        try {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          ok = document.execCommand("copy");
          ta.remove();
        } catch {
          ok = false;
        }
      }
      if (ok) {
        setCopied(key);
        toast(message, "success");
        setTimeout(() => setCopied((c) => (c === key ? null : c)), 2200);
      } else {
        toast("Não foi possível copiar. Selecione o código manualmente.", "error");
      }
      return ok;
    },
    [toast],
  );

  return { copy, copied };
}
