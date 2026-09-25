'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconPlus, IconUpload } from './Icons';

const titles: Record<string, string> = {
  '/': 'Tableau de bord',
  '/upload': 'Importer Excel',
  '/ajout-dr': 'Ajout DR',
  '/sheet1': 'Sheet1',
  '/tableau-attente': "Tableau d'attente",
  '/alerte': 'Alerte',
  '/tike-resteaux': 'Tike Resteaux',
  '/derogation': 'Dérogation Comercial',
  '/avoir': 'Avoir',
  '/fautte-chauffeur': 'Fautte Chauffeur',
  '/annomali': 'Annomali',
};

export default function Topbar() {
  const pathname = usePathname();
  const title = titles[pathname] ?? 'Recouvrement';

  const today = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-5 backdrop-blur-md lg:px-8">
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <span className="hidden text-slate-400 sm:inline">Recouvrement</span>
        <span className="hidden text-slate-300 sm:inline">/</span>
        <span className="truncate font-semibold text-slate-900">{title}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200 md:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {today}
        </span>

        <Link href="/upload" className="btn-ghost btn-sm">
          <IconUpload className="h-4 w-4" />
          <span className="hidden sm:inline">Importer</span>
        </Link>

        <Link href="/ajout-dr" className="btn-primary btn-sm">
          <IconPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Ajout DR</span>
        </Link>
      </div>
    </header>
  );
}
