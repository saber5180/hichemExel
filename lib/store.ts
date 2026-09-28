import { create } from 'zustand';
import { Invoice } from '@/types/invoice';

function revive(invoice: Invoice): Invoice {
  return {
    ...invoice,
    dateEmission: new Date(invoice.dateEmission),
    dateRegPrevu: invoice.dateRegPrevu ? new Date(invoice.dateRegPrevu) : undefined,
  };
}

interface InvoiceStore {
  invoices: Invoice[];
  hydrated: boolean;
  persistError: string;
  hydrate: () => Promise<void>;
  addInvoice: (invoice: Invoice) => Promise<void>;
  updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  transferInvoice: (id: string, newStatus: Invoice['status']) => Promise<void>;
  transferMany: (ids: string[], newStatus: Invoice['status']) => Promise<void>;
  importInvoices: (invoices: Invoice[]) => Promise<void>;
  getInvoicesByStatus: (status: Invoice['status']) => Invoice[];
}

async function readError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data.error || res.statusText;
  } catch {
    return res.statusText || 'Erreur serveur';
  }
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: [],
  hydrated: false,
  persistError: '',

  hydrate: async () => {
    try {
      const res = await fetch('/api/invoices');
      if (!res.ok) throw new Error(await readError(res));
      const data = await res.json();
      set({
        invoices: (data.invoices as Invoice[]).map(revive),
        hydrated: true,
        persistError: '',
      });
    } catch (error) {
      set({
        hydrated: true,
        persistError: (error as Error).message || 'Impossible de charger Neon',
      });
    }
  },

  addInvoice: async (invoice) => {
    set((state) => ({ invoices: [...state.invoices, invoice] }));
    await get().importInvoices([invoice]);
  },

  updateInvoice: async (id, updates) => {
    set((state) => ({
      invoices: state.invoices.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv)),
    }));
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(await readError(res));
    } catch (error) {
      set({ persistError: (error as Error).message });
    }
  },

  deleteInvoice: async (id) => {
    set((state) => ({ invoices: state.invoices.filter((inv) => inv.id !== id) }));
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await readError(res));
    } catch (error) {
      set({ persistError: (error as Error).message });
    }
  },

  transferInvoice: async (id, newStatus) => {
    await get().transferMany([id], newStatus);
  },

  transferMany: async (ids, newStatus) => {
    const idSet = new Set(ids);
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        idSet.has(inv.id) ? { ...inv, status: newStatus } : inv
      ),
    }));
    try {
      const res = await fetch('/api/invoices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status: newStatus }),
      });
      if (!res.ok) throw new Error(await readError(res));
      const data = await res.json();
      if (data.invoices) {
        set({ invoices: (data.invoices as Invoice[]).map(revive), persistError: '' });
      }
    } catch (error) {
      set({ persistError: (error as Error).message });
    }
  },

  importInvoices: async (invoices) => {
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoices }),
    });
    if (!res.ok) {
      const message = await readError(res);
      set({ persistError: message });
      throw new Error(message);
    }
    const data = await res.json();
    set({
      invoices: (data.invoices as Invoice[]).map(revive),
      persistError: '',
    });
  },

  getInvoicesByStatus: (status) => {
    return get().invoices.filter((inv) => inv.status === status);
  },
}));
