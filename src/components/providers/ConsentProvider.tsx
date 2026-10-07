"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { localStore } from "@/services/core";

export type Consent = { essential: true; analytics: boolean; marketing: boolean; decidedAt: string | null };

const DEFAULT: Consent = { essential: true, analytics: false, marketing: false, decidedAt: null };
const KEY = "vf:consent";

type Ctx = {
  consent: Consent;
  ready: boolean;
  save: (c: Pick<Consent, "analytics" | "marketing">) => void;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
};

const ConsentContext = createContext<Ctx>({
  consent: DEFAULT, ready: false, save: () => {}, settingsOpen: false, openSettings: () => {}, closeSettings: () => {},
});

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<Consent>(DEFAULT);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setConsent(localStore.get<Consent>(KEY, DEFAULT));
    setReady(true);
  }, []);

  const save = useCallback((c: Pick<Consent, "analytics" | "marketing">) => {
    const next: Consent = { essential: true, ...c, decidedAt: new Date().toISOString() };
    setConsent(next);
    localStore.set(KEY, next);
  }, []);

  return (
    <ConsentContext.Provider
      value={{ consent, ready, save, settingsOpen, openSettings: () => setSettingsOpen(true), closeSettings: () => setSettingsOpen(false) }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export const useConsent = () => useContext(ConsentContext);
