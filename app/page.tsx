'use client';

import Link from 'next/link';
import { useInvoiceStore } from '@/lib/store';
import { formatMoney, getRetardBadge, getStatusLabel, isDateExpired } from '@/lib/utils';
import StatCard from '@/components/StatCard';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import {
  IconAlert,
  IconClock,
  IconDashboard,
  IconFile,
  IconInbox,
  IconMoney,
  IconPlus,
  IconSheet,
  IconTrend,
  IconUpload,
} from '@/components/Icons';

const distribution = [
  { status: 'ALERTE', label: 'Alerte', href: '/alerte', bar: 'bg-rose-500' },
  { status: 'TIKE_RESTEAUX', label: 'Tike Resteaux', href: '/tike-resteaux', bar: 'bg-sky-500' },
  { status: 'DEROGATION_COMERCIAL', label: 'Dérogation', href: '/derogation', bar: 'bg-amber-500' },
  { status: 'AVOIR', label: 'Avoir', href: '/avoir', bar: 'bg-emerald-500' },
  { status: 'FAUTTE_CHAUFFEUR', label: 'Fautte Chauffeur', href: '/fautte-chauffeur', bar: 'bg-orange-500' },
  { status: 'ANNOMALI', label: 'Annomali', href: '/annomali', bar: 'bg-violet-500' },
] as const;

export default function HomePage() {
  const invoices = useInvoiceStore((state) => state.invoices);

  const count = (status: string) => invoices.filter((i) => i.status === status).length;
  const totalSolde = invoices.reduce((sum, i) => sum + i.solde, 0);
  const expired = invoices.filter((i) => isDateExpired(i.dateRegPrevu)).length;
  const maxDistribution = Math.max(1, ...distribution.map((d) => count(d.status)));

  const recent = [...invoices].slice(-8).reverse();

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble du recouvrement et suivi des paiements"
        icon={<IconDashboard className="h-5 w-5" />}
        actions={
          <>
            <Link href="/upload" className="btn-ghost">
              <IconUpload className="h-4 w-4" />
              Importer Excel
            </Link>
            <Link href="/ajout-dr" className="btn-primary">
              <IconPlus className="h-4 w-4" />
              Ajout DR
            </Link>
          </>
        }
      />

      {/* Indicateurs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total factures"
          value={invoices.length}
          icon={<IconFile className="h-[18px] w-[18px]" />}
          accent="indigo"
          hint={`${count('SHEET1')} dans Sheet1 · ${count('WAITING')} en attente`}
        />
        <StatCard
          label="Alertes"
          value={count('ALERTE')}
          icon={<IconAlert className="h-[18px] w-[18px]" />}
          accent="rose"
          hint="Factures à traiter en priorité"
        />
        <StatCard
          label="Dates dépassées"
          value={expired}
          icon={<IconClock className="h-[18px] w-[18px]" />}
          accent="amber"
          hint="Date de règlement prévu échue"
        />
        <StatCard
          label="Solde total"
          value={formatMoney(totalSolde)}
          unit="TND"
          icon={<IconMoney className="h-[18px] w-[18px]" />}
          accent="emerald"
          hint="Montant Fact − Mont. Reg"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Répartition */}
        <div className="card xl:col-span-1">
          <div className="card-header">
            <h2 className="card-title">Répartition par tableau</h2>
            <IconTrend className="h-4 w-4 text-slate-400" />
          </div>
          <div className="space-y-4 p-6">
            {distribution.map((d) => {
              const n = count(d.status);
              return (
                <Link key={d.status} href={d.href} className="block group">
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600 group-hover:text-slate-900">
                      {d.label}
                    </span>
                    <span className="font-bold tabular-nums text-slate-900">{n}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${d.bar}`}
                      style={{ width: `${(n / maxDistribution) * 100}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Circuit */}
        <div className="card xl:col-span-2">
          <div className="card-header">
            <h2 className="card-title">Circuit de traitement</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-3">
            {[
              {
                step: '01',
                href: '/upload',
                icon: <IconUpload className="h-[18px] w-[18px]" />,
                title: 'Importer Excel',
                desc: 'Les factures arrivent dans Sheet1',
                chip: 'bg-indigo-50 text-indigo-600',
              },
              {
                step: '02',
                href: '/ajout-dr',
                icon: <IconPlus className="h-[18px] w-[18px]" />,
                title: 'Ajout DR',
                desc: 'Nature + délai de dérogation',
                chip: 'bg-sky-50 text-sky-600',
              },
              {
                step: '03',
                href: '/tableau-attente',
                icon: <IconClock className="h-[18px] w-[18px]" />,
                title: "Tableau d'attente",
                desc: 'Transfert vers le bon tableau',
                chip: 'bg-emerald-50 text-emerald-600',
              },
            ].map((s) => (
              <Link
                key={s.step}
                href={s.href}
                className="group rounded-xl border border-slate-200 p-4 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-card-lg"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.chip}`}>
                    {s.icon}
                  </div>
                  <span className="text-[11px] font-bold tabular-nums text-slate-300">{s.step}</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-900">{s.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{s.desc}</p>
              </Link>
            ))}

            <div className="sm:col-span-3">
              <div className="callout-info flex flex-wrap items-center gap-x-6 gap-y-2 !py-4">
                <div className="flex items-center gap-2 text-sm">
                  <IconSheet className="h-4 w-4 text-indigo-500" />
                  <span className="text-slate-600">Sheet1</span>
                  <span className="badge-slate">{count('SHEET1')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <IconClock className="h-4 w-4 text-indigo-500" />
                  <span className="text-slate-600">En attente</span>
                  <span className="badge-indigo">{count('WAITING')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <IconAlert className="h-4 w-4 text-indigo-500" />
                  <span className="text-slate-600">Alerte</span>
                  <span className="badge-rose">{count('ALERTE')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dernières factures */}
      <div className="card mt-6">
        <div className="card-header">
          <h2 className="card-title">Dernières factures</h2>
          {invoices.length > 0 && (
            <span className="badge-slate">{invoices.length} au total</span>
          )}
        </div>

        {recent.length === 0 ? (
          <EmptyState
            icon={<IconInbox className="h-6 w-6" />}
            title="Aucune facture pour le moment"
            description="Importez un fichier Excel pour commencer à travailler."
          >
            <Link href="/upload" className="btn-primary">
              <IconUpload className="h-4 w-4" />
              Importer un fichier Excel
            </Link>
          </EmptyState>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>N° Facture</th>
                  <th>Client</th>
                  <th className="!text-right">Solde</th>
                  <th className="!text-center">Retard</th>
                  <th className="!text-center">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="num font-semibold text-slate-900">{invoice.numFacture}</td>
                    <td>
                      <div className="max-w-[240px] truncate font-medium text-slate-900">
                        {invoice.nomClient}
                      </div>
                      <div className="text-xs text-slate-400">{invoice.client}</div>
                    </td>
                    <td className="text-right">
                      <span className="num font-bold text-slate-900">
                        {formatMoney(invoice.solde)}
                      </span>
                      <span className="ml-1 text-[11px] text-slate-400">TND</span>
                    </td>
                    <td className="text-center">
                      <span className={getRetardBadge(invoice.retardPaiement)}>
                        {invoice.retardPaiement} j
                      </span>
                    </td>
                    <td className="text-center">
                      <span className="badge-slate">{getStatusLabel(invoice.status)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
