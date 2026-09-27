'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInvoiceStore } from '@/lib/store';
import { calculateRetard, formatDate, formatMoney, fromInputDate, getRetardBadge, toInputDate } from '@/lib/utils';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import {
  IconCalendar,
  IconClose,
  IconPlus,
  IconSheet,
  IconSync,
  IconTrash,
  IconUpload,
} from '@/components/Icons';

export default function Sheet1Page() {
  const router = useRouter();
  const invoices = useInvoiceStore((state) => state.getInvoicesByStatus('SHEET1'));
  const deleteInvoice = useInvoiceStore((state) => state.deleteInvoice);
  const updateInvoice = useInvoiceStore((state) => state.updateInvoice);

  const handleDateEmissionChange = (id: string, value: string) => {
    if (!value) return;
    const dateEmission = fromInputDate(value);
    updateInvoice(id, {
      dateEmission,
      retardPaiement: calculateRetard(dateEmission),
    });
  };

  const [dateFilter, setDateFilter] = useState('');
  const [search, setSearch] = useState('');

  const handleSynchronize = () => {
    const store = useInvoiceStore.getState();
    store.invoices
      .filter((inv) => inv.status === 'SHEET1')
      .forEach((inv) => store.transferInvoice(inv.id, 'ALERTE'));
    router.push('/alerte');
  };

  const filtered = invoices.filter((inv) => {
    const matchDate = dateFilter
      ? formatDate(inv.dateEmission) === formatDate(new Date(dateFilter))
      : true;
    const q = search.trim().toLowerCase();
    const matchSearch = q
      ? inv.numFacture.toLowerCase().includes(q) ||
        inv.nomClient.toLowerCase().includes(q) ||
        inv.client.toLowerCase().includes(q)
      : true;
    return matchDate && matchSearch;
  });

  const totalSolde = filtered.reduce((sum, i) => sum + i.solde, 0);
  const hasFilter = Boolean(dateFilter || search);

  return (
    <>
      <PageHeader
        title="Sheet1"
        subtitle="Données brutes importées depuis Excel"
        icon={<IconSheet className="h-5 w-5" />}
        accent="slate"
        actions={
          <>
            <button
              onClick={() => router.push('/ajout-dr')}
              className="btn-ghost min-h-11 justify-center"
              disabled={invoices.length === 0}
            >
              <IconPlus className="h-4 w-4" />
              Ajout DR
            </button>
            <button
              onClick={handleSynchronize}
              className="btn-primary min-h-11 justify-center"
              disabled={invoices.length === 0}
            >
              <IconSync className="h-4 w-4" />
              Synchroniser vers Alerte
            </button>
          </>
        }
      />

      {invoices.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<IconSheet className="h-6 w-6" />}
            title="Sheet1 est vide"
            description="Importez un fichier Excel pour charger les factures dans cette zone de travail."
          >
            <button onClick={() => router.push('/upload')} className="btn-primary">
              <IconUpload className="h-4 w-4" />
              Importer un fichier Excel
            </button>
          </EmptyState>
        </div>
      ) : (
        <>
          {/* Filtres */}
          <div className="card mb-6 p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
              <div>
                <label className="label">Recherche</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="N° facture, client, code…"
                  className="input"
                />
              </div>

              <div>
                <label className="label flex items-center gap-1.5">
                  <IconCalendar className="h-3.5 w-3.5" />
                  Date émission
                </label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="input md:w-48"
                />
              </div>

              <button
                onClick={() => {
                  setDateFilter('');
                  setSearch('');
                }}
                className="btn-ghost"
                disabled={!hasFilter}
              >
                <IconClose className="h-4 w-4" />
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Tableau */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                {filtered.length} facture{filtered.length > 1 ? 's' : ''}
                {hasFilter && (
                  <span className="ml-2 font-normal text-slate-400">sur {invoices.length}</span>
                )}
              </h2>
              <span className="text-sm text-slate-500">
                Solde cumulé{' '}
                <span className="num font-bold text-slate-900">{formatMoney(totalSolde)}</span>
                <span className="ml-1 text-[11px] text-slate-400">TND</span>
              </span>
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon={<IconCalendar className="h-6 w-6" />}
                title="Aucun résultat"
                description="Aucune facture ne correspond à ces filtres."
              />
            ) : (
              <>
              <div className="divide-y divide-slate-100 md:hidden">
                {filtered.map((invoice) => (
                  <div key={invoice.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="num truncate font-semibold text-slate-900">{invoice.numFacture}</p>
                        <p className="truncate font-medium text-slate-800">{invoice.nomClient}</p>
                        <p className="text-xs text-slate-400">{invoice.client}</p>
                      </div>
                      <span className={getRetardBadge(invoice.retardPaiement)}>
                        {invoice.retardPaiement} j
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="label !mb-0.5">Montant</p>
                        <p className="num text-slate-600">{formatMoney(invoice.montantFact)}</p>
                      </div>
                      <div>
                        <p className="label !mb-0.5">Réglé</p>
                        <p className="num text-slate-600">{formatMoney(invoice.montantReg)}</p>
                      </div>
                      <div>
                        <p className="label !mb-0.5">Solde</p>
                        <p className="num font-bold text-slate-900">{formatMoney(invoice.solde)}</p>
                      </div>
                      <div>
                        <p className="label !mb-0.5">Date émission</p>
                        <input
                          type="date"
                          value={toInputDate(invoice.dateEmission)}
                          onChange={(e) => handleDateEmissionChange(invoice.id, e.target.value)}
                          className="input !min-h-10 !py-1.5 !text-sm"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => deleteInvoice(invoice.id)}
                      className="btn-ghost min-h-11 w-full"
                    >
                      <IconTrash className="h-4 w-4" />
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
              <div className="table-wrap hidden md:block">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>N° Facture</th>
                      <th>Client</th>
                      <th className="!text-right">Montant Fact</th>
                      <th className="!text-right">Mont. Reg</th>
                      <th className="!text-right">Solde</th>
                      <th className="!text-center">Retard</th>
                      <th className="!text-center">Date émission</th>
                      <th className="!text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="num font-semibold text-slate-900">{invoice.numFacture}</td>
                        <td>
                          <div className="max-w-[220px] truncate font-medium text-slate-900">
                            {invoice.nomClient}
                          </div>
                          <div className="text-xs text-slate-400">{invoice.client}</div>
                        </td>
                        <td className="num text-right text-slate-600">
                          {formatMoney(invoice.montantFact)}
                        </td>
                        <td className="num text-right text-slate-600">
                          {formatMoney(invoice.montantReg)}
                        </td>
                        <td className="num text-right font-bold text-slate-900">
                          {formatMoney(invoice.solde)}
                        </td>
                        <td className="text-center">
                          <span className={getRetardBadge(invoice.retardPaiement)}>
                            {invoice.retardPaiement} j
                          </span>
                        </td>
                        <td className="text-center">
                          <input
                            type="date"
                            value={toInputDate(invoice.dateEmission)}
                            onChange={(e) => handleDateEmissionChange(invoice.id, e.target.value)}
                            className="input !min-h-9 !w-[10.5rem] !px-2 !py-1 !text-xs"
                          />
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => deleteInvoice(invoice.id)}
                            className="btn-icon"
                            title="Supprimer"
                          >
                            <IconTrash className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </>
            )}
          </div>

          <div className="callout-amber mt-6">
            <h3 className="mb-2 text-sm font-semibold text-amber-900">Circuit de traitement</h3>
            <ol className="space-y-1 text-sm text-amber-800/90">
              <li>1. Les factures importées arrivent ici, dans Sheet1.</li>
              <li>
                2. <strong>Synchroniser vers Alerte</strong> transfère toutes les lignes d&apos;un coup.
              </li>
              <li>
                3. Ou passez par <strong>Ajout DR</strong> pour ajouter une dérogation à une facture précise.
              </li>
            </ol>
          </div>
        </>
      )}
    </>
  );
}
