'use client';

import { useInvoiceStore } from '@/lib/store';
import { Invoice } from '@/types/invoice';
import { formatDate, formatMoney, getRetardBadge, isDateExpired } from '@/lib/utils';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import { IconClock, IconPlus, IconSend, IconTrash } from '@/components/Icons';

const DESTINATIONS: Record<string, Invoice['status']> = {
  'TIKE RESTEAUX': 'TIKE_RESTEAUX',
  'DEROGATION COMERCIAL': 'DEROGATION_COMERCIAL',
  AVOIR: 'AVOIR',
  'FAUTTE CHAUFFEUR': 'FAUTTE_CHAUFFEUR',
  ANNOMALI: 'ANNOMALI',
  ALERTE: 'ALERTE',
};

export default function TableauAttentePage() {
  const invoices = useInvoiceStore((state) => state.getInvoicesByStatus('WAITING'));
  const deleteInvoice = useInvoiceStore((state) => state.deleteInvoice);
  const transferInvoice = useInvoiceStore((state) => state.transferInvoice);

  const handleTransfer = (invoice: Invoice) => {
    if (!invoice.natureDerogation) return;
    const destination = DESTINATIONS[invoice.natureDerogation];
    if (destination) transferInvoice(invoice.id, destination);
  };

  const totalSolde = invoices.reduce((sum, i) => sum + i.solde, 0);
  const ready = invoices.filter((i) => i.natureDerogation).length;

  return (
    <>
      <PageHeader
        title="Tableau d'attente"
        subtitle="Factures prêtes à être transférées vers leur tableau de destination"
        icon={<IconClock className="h-5 w-5" />}
        accent="sky"
        actions={
          invoices.length > 0 ? (
            <>
              <span className="badge-indigo">{ready} prête(s)</span>
              <span className="text-sm text-slate-500">
                Solde{' '}
                <span className="num font-bold text-slate-900">{formatMoney(totalSolde)}</span>
                <span className="ml-1 text-[11px] text-slate-400">TND</span>
              </span>
            </>
          ) : undefined
        }
      />

      {invoices.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<IconClock className="h-6 w-6" />}
            title="Aucune facture en attente"
            description="Ajoutez une dérogation depuis Ajout DR pour voir apparaître les factures ici."
          >
            <a href="/ajout-dr" className="btn-primary">
              <IconPlus className="h-4 w-4" />
              Aller à Ajout DR
            </a>
          </EmptyState>
        </div>
      ) : (
        <>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                {invoices.length} facture{invoices.length > 1 ? 's' : ''} en attente
              </h2>
              <p className="hidden text-xs text-slate-500 sm:block">
                Le transfert suit la nature de dérogation de chaque ligne
              </p>
            </div>

            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>N° Facture</th>
                    <th>Client</th>
                    <th className="!text-right">Solde</th>
                    <th className="!text-center">Retard</th>
                    <th>Nature dérogation</th>
                    <th className="!text-center">Délai</th>
                    <th className="!text-center">Date règl. prévu</th>
                    <th className="!text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => {
                    const expired = isDateExpired(invoice.dateRegPrevu);

                    return (
                      <tr key={invoice.id} className={expired ? 'row-expired' : ''}>
                        <td>
                          <div className="flex items-center gap-2">
                            {expired && (
                              <span
                                className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500"
                                title="Date de règlement dépassée"
                              />
                            )}
                            <span
                              className={`num font-semibold ${
                                expired ? 'text-rose-700' : 'text-slate-900'
                              }`}
                            >
                              {invoice.numFacture}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="max-w-[220px] truncate font-medium text-slate-900">
                            {invoice.nomClient}
                          </div>
                          <div className="text-xs text-slate-400">{invoice.client}</div>
                        </td>
                        <td className="num text-right font-bold text-slate-900">
                          {formatMoney(invoice.solde)}
                        </td>
                        <td className="text-center">
                          <span className={getRetardBadge(invoice.retardPaiement)}>
                            {invoice.retardPaiement} j
                          </span>
                        </td>
                        <td>
                          {invoice.natureDerogation ? (
                            <span className="badge-indigo">{invoice.natureDerogation}</span>
                          ) : (
                            <span className="badge-amber">Non définie</span>
                          )}
                        </td>
                        <td className="text-center text-slate-500">
                          {invoice.delaiDerogation ? `${invoice.delaiDerogation} j` : '—'}
                        </td>
                        <td className="text-center">
                          {invoice.dateRegPrevu ? (
                            <span
                              className={expired ? 'font-semibold text-rose-600' : 'text-slate-600'}
                            >
                              {formatDate(invoice.dateRegPrevu)}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleTransfer(invoice)}
                              disabled={!invoice.natureDerogation}
                              className="btn-success btn-sm"
                              title={
                                invoice.natureDerogation
                                  ? `Transférer vers ${invoice.natureDerogation}`
                                  : 'Nature de dérogation non définie'
                              }
                            >
                              <IconSend className="h-3.5 w-3.5" />
                              Transférer
                            </button>
                            <button
                              onClick={() => deleteInvoice(invoice.id)}
                              className="btn-icon"
                              title="Supprimer"
                            >
                              <IconTrash className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="callout-info mt-6">
            <h3 className="mb-2 text-sm font-semibold text-indigo-900">Fonctionnement</h3>
            <p className="text-sm leading-relaxed text-indigo-800/90">
              Chaque ligne se transfère individuellement. Le bouton{' '}
              <strong>Transférer</strong> envoie la facture vers le tableau correspondant à sa{' '}
              <strong>nature de dérogation</strong> (Tike Resteaux, Dérogation Comercial, Avoir,
              Fautte Chauffeur, Annomali ou Alerte).
            </p>
          </div>
        </>
      )}
    </>
  );
}
