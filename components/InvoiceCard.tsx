import type { ReactNode } from 'react';
import { Invoice } from '@/types/invoice';
import { formatDate, formatMoney, getRetardBadge, isDateExpired } from '@/lib/utils';

export default function InvoiceCard({
  invoice,
  extra,
  footer,
}: {
  invoice: Invoice;
  extra?: ReactNode;
  footer?: ReactNode;
}) {
  const expired = isDateExpired(invoice.dateRegPrevu);

  return (
    <article
      className={`space-y-3 p-4 ${expired ? 'bg-rose-50/70' : 'bg-white'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {expired && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />}
            <p className={`num truncate font-semibold ${expired ? 'text-rose-700' : 'text-slate-900'}`}>
              {invoice.numFacture}
            </p>
          </div>
          <p className="mt-0.5 truncate font-medium text-slate-800">{invoice.nomClient}</p>
          <p className="text-xs text-slate-400">{invoice.client}</p>
        </div>
        <span className={getRetardBadge(invoice.retardPaiement)}>{invoice.retardPaiement} j</span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="label !mb-0.5">Solde</p>
          <p className="num font-bold text-slate-900">
            {formatMoney(invoice.solde)}
            <span className="ml-1 text-[11px] font-medium text-slate-400">TND</span>
          </p>
        </div>
        <div>
          <p className="label !mb-0.5">Émission</p>
          <p className="text-slate-600">{formatDate(invoice.dateEmission)}</p>
        </div>
        {invoice.dateRegPrevu && (
          <div className="col-span-2">
            <p className="label !mb-0.5">Règl. prévu</p>
            <p className={expired ? 'font-semibold text-rose-600' : 'text-slate-600'}>
              {formatDate(invoice.dateRegPrevu)}
            </p>
          </div>
        )}
      </div>

      {extra}

      {footer && <div className="flex flex-col gap-2 pt-1 sm:flex-row">{footer}</div>}
    </article>
  );
}
