'use client';

import { Invoice } from '@/types/invoice';
import { formatDate, formatMoney, getRetardBadge, isDateExpired } from '@/lib/utils';
import { IconInbox, IconTrash } from './Icons';
import EmptyState from './EmptyState';

interface InvoiceTableProps {
  invoices: Invoice[];
  onDelete?: (id: string) => void;
  onTransfer?: (id: string, newStatus: Invoice['status']) => void;
  showActions?: boolean;
}

export default function InvoiceTable({
  invoices,
  onDelete,
  onTransfer,
  showActions = true,
}: InvoiceTableProps) {
  if (invoices.length === 0) {
    return (
      <EmptyState
        icon={<IconInbox className="h-6 w-6" />}
        title="Aucune facture"
        description="Ce tableau est vide pour le moment."
      />
    );
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>N° Facture</th>
            <th>Client</th>
            <th className="!text-right">Solde</th>
            <th className="!text-center">Retard</th>
            <th className="!text-center">Date émission</th>
            <th className="!text-center">Date règl. prévu</th>
            {showActions && <th className="!text-right">Actions</th>}
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
                    <span className={`num font-semibold ${expired ? 'text-rose-700' : 'text-slate-900'}`}>
                      {invoice.numFacture}
                    </span>
                  </div>
                </td>

                <td>
                  <div className="max-w-[240px] truncate font-medium text-slate-900">
                    {invoice.nomClient}
                  </div>
                  <div className="text-xs text-slate-400">{invoice.client}</div>
                </td>

                <td className="text-right">
                  <span className="num font-bold text-slate-900">{formatMoney(invoice.solde)}</span>
                  <span className="ml-1 text-[11px] text-slate-400">TND</span>
                </td>

                <td className="text-center">
                  <span className={getRetardBadge(invoice.retardPaiement)}>
                    {invoice.retardPaiement} j
                  </span>
                </td>

                <td className="text-center text-slate-500">{formatDate(invoice.dateEmission)}</td>

                <td className="text-center">
                  {invoice.dateRegPrevu ? (
                    <span className={expired ? 'font-semibold text-rose-600' : 'text-slate-600'}>
                      {formatDate(invoice.dateRegPrevu)}
                    </span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>

                {showActions && (
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      {onTransfer && (
                        <select
                          onChange={(e) =>
                            onTransfer(invoice.id, e.target.value as Invoice['status'])
                          }
                          className="select !w-auto !py-1.5 !pl-3 !pr-8 !text-xs"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Transférer vers…
                          </option>
                          <option value="ALERTE">Alerte</option>
                          <option value="TIKE_RESTEAUX">Tike Resteaux</option>
                          <option value="DEROGATION_COMERCIAL">Dérogation Comercial</option>
                          <option value="AVOIR">Avoir</option>
                          <option value="FAUTTE_CHAUFFEUR">Fautte Chauffeur</option>
                          <option value="ANNOMALI">Annomali</option>
                        </select>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(invoice.id)}
                          className="btn-icon"
                          title="Supprimer"
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
