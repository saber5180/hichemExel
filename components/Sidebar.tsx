'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useInvoiceStore } from '@/lib/store';
import { Invoice } from '@/types/invoice';
import {
  IconAlert,
  IconBolt,
  IconClock,
  IconDashboard,
  IconDoc,
  IconMoney,
  IconPlus,
  IconSheet,
  IconTicket,
  IconTruck,
  IconUpload,
} from './Icons';

type NavItem = {
  href: string;
  label: string;
  icon: (p: { className?: string }) => JSX.Element;
  status?: Invoice['status'];
  accent?: string;
};

const workspace: NavItem[] = [
  { href: '/', label: 'Tableau de bord', icon: IconDashboard },
  { href: '/upload', label: 'Importer Excel', icon: IconUpload },
  { href: '/ajout-dr', label: 'Ajout DR', icon: IconPlus },
];

const pipeline: NavItem[] = [
  { href: '/sheet1', label: 'Sheet1', icon: IconSheet, status: 'SHEET1' },
  { href: '/tableau-attente', label: "Tableau d'attente", icon: IconClock, status: 'WAITING' },
];

const tables: NavItem[] = [
  { href: '/alerte', label: 'Alerte', icon: IconAlert, status: 'ALERTE', accent: 'text-rose-500' },
  { href: '/tike-resteaux', label: 'Tike Resteaux', icon: IconTicket, status: 'TIKE_RESTEAUX', accent: 'text-sky-500' },
  { href: '/derogation', label: 'Dérogation Comercial', icon: IconDoc, status: 'DEROGATION_COMERCIAL', accent: 'text-amber-500' },
  { href: '/avoir', label: 'Avoir', icon: IconMoney, status: 'AVOIR', accent: 'text-emerald-500' },
  { href: '/fautte-chauffeur', label: 'Fautte Chauffeur', icon: IconTruck, status: 'FAUTTE_CHAUFFEUR', accent: 'text-orange-500' },
  { href: '/annomali', label: 'Annomali', icon: IconBolt, status: 'ANNOMALI', accent: 'text-violet-500' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const invoices = useInvoiceStore((state) => state.invoices);

  const countFor = (status?: Invoice['status']) =>
    status ? invoices.filter((inv) => inv.status === status).length : 0;

  const renderLink = ({ href, label, icon: Icon, status, accent }: NavItem) => {
    const active = pathname === href;
    const count = countFor(status);

    return (
      <li key={href}>
        <Link href={href} className={`group nav-link ${active ? 'nav-link-active' : ''}`}>
          {active && (
            <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-indigo-600" />
          )}
          <Icon
            className={`h-[18px] w-[18px] shrink-0 transition-colors ${
              active ? 'text-indigo-600' : accent ?? 'text-slate-400 group-hover:text-slate-600'
            }`}
          />
          <span className="flex-1 truncate">{label}</span>
          {status && count > 0 && (
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                active ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200/70 text-slate-600'
              }`}
            >
              {count}
            </span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[17rem] flex-col border-r border-slate-200 bg-slate-100/70 lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-sm shadow-indigo-600/30">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M4 19V9m5 10V5m5 14v-7m5 7V8" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight text-slate-900">Recouvrement</p>
          <p className="truncate text-[11px] text-slate-500">Gestion des factures</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        <p className="nav-section">Espace de travail</p>
        <ul className="space-y-0.5">{workspace.map(renderLink)}</ul>

        <p className="nav-section">Circuit</p>
        <ul className="space-y-0.5">{pipeline.map(renderLink)}</ul>

        <p className="nav-section">Tableaux</p>
        <ul className="space-y-0.5">{tables.map(renderLink)}</ul>
      </nav>

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
