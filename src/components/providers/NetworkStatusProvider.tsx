"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { levelCopy, type NetworkLevel } from "@/data/network";
import { localStore } from "@/services/core";

/**
 * Estado global da rede exibido no header e na página de status.
 * `setLevel` existe para a demonstração (alternar cenários ao vivo);
 * em produção o nível viria de networkService com polling/SSE.
 */
type Ctx = { level: NetworkLevel; label: string; setLevel: (l: NetworkLevel) => void };

const NetworkContext = createContext<Ctx>({ level: "operational", label: levelCopy.operational.pill, setLevel: () => {} });

const KEY = "vf:network-scenario";

export function NetworkStatusProvider({ children }: { children: ReactNode }) {
  const [level, setLevelState] = useState<NetworkLevel>("operational");

  useEffect(() => {
    const saved = localStore.get<NetworkLevel>(KEY, "operational");
    if (saved !== "operational") setLevelState(saved);
  }, []);

  const setLevel = useCallback((l: NetworkLevel) => {
    setLevelState(l);
    localStore.set(KEY, l);
  }, []);

  return (
    <NetworkContext.Provider value={{ level, label: levelCopy[level].pill, setLevel }}>{children}</NetworkContext.Provider>
  );
}

export const useNetworkStatus = () => useContext(NetworkContext);
