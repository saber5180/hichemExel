'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Bord' },
  { href: '/sheet1', label: 'Sheet1' },
  { href: '/tableau-attente', label: 'Attente' },
  { href: '/alerte', label: 'Alerte' },
  { href: '/tike-resteaux', label: 'Tike' },
  { href: '/derogation', label: 'Dérogation' },
  { href: '/avoir', label: 'Avoir' },
  { href: '/fautte-chauffeur', label: 'Chauffeur' },
  { href: '/annomali', label: 'Annomali' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1.5 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2.5 lg:hidden">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            pathname === href
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
