'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useInvoiceStore } from '@/lib/store';
import { NAV_ITEMS, type NavItem } from '@/lib/nav';
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

const ICONS = {
  dashboard: IconDashboard,
  upload: IconUpload,
  plus: IconPlus,
  sheet: IconSheet,
  clock: IconClock,
  alert: IconAlert,
  ticket: IconTicket,
  doc: IconDoc,
  money: IconMoney,
  truck: IconTruck,
  bolt: IconBolt,
};

const SECTIONS = [
  { id: 'workspace', title: 'Espace de travail' },
  { id: 'pipeline', title: 'Circuit' },
  { id: 'tables', title: 'Tableaux' },
] as const;

export default function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const invoices = useInvoiceStore((state) => state.invoices);

  const renderLink = (item: NavItem) => {
    const Icon = ICONS[item.icon];
    const active = pathname === item.href;
    const count = item.status ? invoices.filter((inv) => inv.status === item.status).length : 0;

    return (
      <li key={item.href}>
        <Link
          href={item.href}
          onClick={onNavigate}
          className={`group nav-link min-h-11 ${active ? 'nav-link-active' : ''}`}
        >
          {active && (
            <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-indigo-600" />
          )}
          <Icon
            className={`h-[18px] w-[18px] shrink-0 transition-colors ${
              active ? 'text-indigo-600' : item.accent ?? 'text-slate-400 group-hover:text-slate-600'
            }`}
          />
          <span className="flex-1 truncate">{item.label}</span>
          {item.status && count > 0 && (
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
    <nav className="flex-1 overflow-y-auto px-3 pb-6">
      {SECTIONS.map((section) => (
        <div key={section.id}>
          <p className="nav-section">{section.title}</p>
          <ul className="space-y-0.5">
            {NAV_ITEMS.filter((item) => item.group === section.id).map(renderLink)}
          </ul>
        </div>
      ))}
    </nav>
  );
}
