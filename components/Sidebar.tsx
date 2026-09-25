'use client';

import NavLinks from './NavLinks';
import { useInvoiceStore } from '@/lib/store';

export default function Sidebar() {
  const invoices = useInvoiceStore((state) => state.invoices);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[17rem] flex-col border-r border-slate-200 bg-slate-100/70 lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-sm shadow-indigo-600/30">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <path d="M4 19V9m5 10V5m5 14v-7m5 7V8" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight text-slate-900">Recouvrement</p>
          <p className="truncate text-[11px] text-slate-500">Gestion des factures</p>
        </div>
      </div>

      <NavLinks />

      <div className="border-t border-slate-200 px-5 py-4">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-semibold text-slate-600">Total factures</span>
          <span className="rounded-full bg-white px-2 py-0.5 font-bold tabular-nums text-slate-700 shadow-sm">
            {invoices.length}
          </span>
        </div>
      </div>
    </aside>
  );
}
