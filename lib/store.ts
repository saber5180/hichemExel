import { create } from 'zustand';
import { Invoice } from '@/types/invoice';

interface InvoiceStore {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  transferInvoice: (id: string, newStatus: Invoice['status']) => void;
  importInvoices: (invoices: Invoice[]) => void;
  getInvoicesByStatus: (status: Invoice['status']) => Invoice[];
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: [],
  
  addInvoice: (invoice) => set((state) => ({
    invoices: [...state.invoices, invoice]
  })),
  
  updateInvoice: (id, updates) => set((state) => ({
    invoices: state.invoices.map(inv => 
      inv.id === id ? { ...inv, ...updates } : inv
    )
  })),
  
  deleteInvoice: (id) => set((state) => ({
    invoices: state.invoices.filter(inv => inv.id !== id)
  })),
  
  transferInvoice: (id, newStatus) => set((state) => ({
    invoices: state.invoices.map(inv =>
      inv.id === id ? { ...inv, status: newStatus } : inv
    )
  })),
  
  importInvoices: (invoices) => set({ invoices }),
  
  getInvoicesByStatus: (status) => {
    return get().invoices.filter(inv => inv.status === status);
  }
}));
