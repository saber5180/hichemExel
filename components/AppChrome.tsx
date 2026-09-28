'use client';

import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import NavLinks from './NavLinks';
import { IconClose } from './Icons';
import { useInvoiceStore } from '@/lib/store';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const total = useInvoiceStore((state) => state.invoices.length);
  const persistError = useInvoiceStore((state) => state.persistError);
  const hydrate = useInvoiceStore((state) => state.hydrate);
  const hydrated = useInvoiceStore((state) => state.hydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <Sidebar />

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Fermer le menu"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(20rem,86vw)] flex-col bg-slate-50 shadow-card-lg">
            <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
              <div>
                <p className="text-sm font-bold text-slate-900">Recouvrement</p>
                <p className="text-[11px] text-slate-500">Gestion des factures</p>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="btn-icon h-11 w-11"
                aria-label="Fermer"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </div>
            <NavLinks onNavigate={() => setMenuOpen(false)} />
            <div className="border-t border-slate-200 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-slate-600">Total factures</span>
                <span className="rounded-full bg-white px-2 py-0.5 font-bold tabular-nums text-slate-700 shadow-sm">
                  {total}
                </span>
              </div>
            </div>
          </aside>
        </div>
      )}

      <div className="lg:pl-[17rem]">
        <Topbar onOpenMenu={() => setMenuOpen(true)} />
        <main className="mx-auto w-full max-w-[1400px] px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-5 sm:py-7 lg:px-8 lg:py-9">
          {!hydrated && (
            <p className="mb-4 text-sm text-slate-500">Chargement des factures depuis Neon…</p>
          )}
          {persistError && (
            <div className="mb-5 rounded-2xl border border-rose-100 bg-rose-50/80 px-4 py-3 text-sm text-rose-800">
              Les factures n&apos;ont pas pu être enregistrées dans Neon : {persistError}.
              Vérifiez la variable <strong>DATABASE_URL</strong> sur Vercel.
            </div>
          )}
          <div className="animate-fade-in-up">{children}</div>
        </main>
      </div>
    </>
  );
}
