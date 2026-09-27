'use client';

import { usePathname } from 'next/navigation';
import { PAGE_TITLES } from '@/lib/nav';
import { IconMenu } from './Icons';

export default function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? 'Recouvrement';

  const today = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-3 pt-[env(safe-area-inset-top)] backdrop-blur-md sm:h-16 sm:px-5 lg:px-8">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onOpenMenu}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <IconMenu className="h-5 w-5" />
        </button>

        <div className="min-w-0 text-sm">
          <span className="hidden text-slate-400 sm:inline">Recouvrement</span>
          <span className="hidden text-slate-300 sm:inline"> / </span>
          <span className="block truncate font-semibold text-slate-900">{title}</span>
        </div>
      </div>

      <span className="hidden items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200 md:inline-flex">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        {today}
      </span>
    </header>
  );
}
