"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Customer } from "@/data/customers";
import type { Notification } from "@/data/account";
import { currentSession, getCustomer, getNotifications, logout as doLogout } from "@/services/customerService";

type Ctx = {
  customer: Customer | null;
  notifications: Notification[];
  markAllRead: () => void;
  refresh: () => Promise<void>;
  logout: () => void;
};

const CustomerContext = createContext<Ctx>({ customer: null, notifications: [], markAllRead: () => {}, refresh: async () => {}, logout: () => {} });

/** Sessão do assinante (demo). Sem sessão, redireciona para o login. */
export function CustomerProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refresh = useCallback(async () => {
    try {
      const c = await getCustomer();
      setCustomer(c);
      setNotifications(await getNotifications());
    } catch {
      router.replace("/area-do-cliente");
    }
  }, [router]);

  useEffect(() => {
    if (!currentSession()) {
      router.replace("/area-do-cliente?expirou=1");
      return;
    }
    refresh();
  }, [refresh, router]);

  return (
    <CustomerContext.Provider
      value={{
        customer,
        notifications,
        refresh,
        markAllRead: () => setNotifications((n) => n.map((x) => ({ ...x, unread: false }))),
        logout: () => {
          doLogout();
          router.push("/area-do-cliente?saiu=1");
        },
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export const useCustomer = () => useContext(CustomerContext);
