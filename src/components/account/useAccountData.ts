"use client";

import { useEffect, useState } from "react";
import type { Invoice } from "@/data/customers";
import type { Ticket } from "@/data/account";
import { getMyInvoices, listTickets } from "@/services/customerService";

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  useEffect(() => {
    getMyInvoices().then(setInvoices).catch(() => setInvoices([]));
  }, []);
  return invoices;
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const reload = () => listTickets().then(setTickets);
  useEffect(() => {
    reload();
  }, []);
  return { tickets, reload, setTickets };
}
