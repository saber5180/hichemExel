import type { Invoice } from '@/types/invoice';

export type NavItem = {
  href: string;
  label: string;
  status?: Invoice['status'];
  accent?: string;
  group: 'workspace' | 'pipeline' | 'tables';
  icon:
    | 'dashboard'
    | 'upload'
    | 'plus'
    | 'sheet'
    | 'clock'
    | 'alert'
    | 'ticket'
    | 'doc'
    | 'money'
    | 'truck'
    | 'bolt';
};

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Tableau de bord', icon: 'dashboard', group: 'workspace' },
  { href: '/upload', label: 'Importer Excel', icon: 'upload', group: 'workspace' },
  { href: '/ajout-dr', label: 'Ajout DR', icon: 'plus', group: 'workspace' },
  { href: '/sheet1', label: 'Sheet1', icon: 'sheet', status: 'SHEET1', group: 'pipeline' },
  {
    href: '/tableau-attente',
    label: "Tableau d'attente",
    icon: 'clock',
    status: 'WAITING',
    group: 'pipeline',
  },
  {
    href: '/alerte',
    label: 'Alerte',
    icon: 'alert',
    status: 'ALERTE',
    accent: 'text-rose-500',
    group: 'tables',
  },
  {
    href: '/tike-resteaux',
    label: 'Tike Resteaux',
    icon: 'ticket',
    status: 'TIKE_RESTEAUX',
    accent: 'text-sky-500',
    group: 'tables',
  },
  {
    href: '/derogation',
    label: 'Dérogation Comercial',
    icon: 'doc',
    status: 'DEROGATION_COMERCIAL',
    accent: 'text-amber-500',
    group: 'tables',
  },
  {
    href: '/avoir',
    label: 'Avoir',
    icon: 'money',
    status: 'AVOIR',
    accent: 'text-emerald-500',
    group: 'tables',
  },
  {
    href: '/fautte-chauffeur',
    label: 'Fautte Chauffeur',
    icon: 'truck',
    status: 'FAUTTE_CHAUFFEUR',
    accent: 'text-orange-500',
    group: 'tables',
  },
  {
    href: '/annomali',
    label: 'Annomali',
    icon: 'bolt',
    status: 'ANNOMALI',
    accent: 'text-violet-500',
    group: 'tables',
  },
];

export const PAGE_TITLES: Record<string, string> = {
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
