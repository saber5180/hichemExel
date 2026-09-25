'use client';

import type { ReactNode } from 'react';
import { useInvoiceStore } from '@/lib/store';
import { Invoice } from '@/types/invoice';
import { exportToExcel } from '@/lib/excel';
import { formatMoney, isDateExpired } from '@/lib/utils';
import PageHeader from './PageHeader';
import InvoiceTable from './InvoiceTable';
import { IconAlert, IconDownload } from './Icons';

type Accent = 'indigo' | 'rose' | 'sky' | 'amber' | 'emerald' | 'orange' | 'violet' | 'slate';

interface StatusPageProps {
  status: Invoice['status'];
  title: string;
  subtitle?: string;
  icon: ReactNode;
  accent?: Accent;
  exportName: string;
}

export default function StatusPage({
  status,
  title,
  subtitle,
  icon,
  accent = 'indigo',
  exportName,
}: StatusPageProps) {
  const invoices = useInvoiceStore((state) => state.getInvoicesByStatus(status));
  const deleteInvoice = useInvoiceStore((state) => state.deleteInvoice);
  const transferInvoice = useInvoiceStore((state) => state.transferInvoice);

  const totalSolde = invoices.reduce((sum, i) => sum + i.solde, 0);
  const expired = invoices.filter((i) => isDateExpired(i.dateRegPrevu)).length;

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        accent={accent}
        actions={
          <button
            onClick={() => exportToExcel(invoices, exportName)}
            className="btn-ghost"
            disabled={invoices.length === 0}
          >
            <IconDownload className="h-4 w-4" />
            Exporter Excel
          </button>
        }
      />

      {expired > 0 && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/70 px-5 py-3.5 text-sm text-rose-800">
          <IconAlert className="h-4 w-4 shrink-0" />
          <p>
            <strong className="font-semibold">{expired}</strong> facture
            {expired > 1 ? 's ont' : ' a'} une date de règlement prévu dépassée.
          </p>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            {invoices.length} facture{invoices.length > 1 ? 's' : ''}
          </h2>
          {invoices.length > 0 && (
            <span className="text-sm text-slate-500">
              Solde cumulé{' '}
              <span className="num font-bold text-slate-900">{formatMoney(totalSolde)}</span>
              <span className="ml-1 text-[11px] text-slate-400">TND</span>
            </span>
          )}
        </div>

        <InvoiceTable
          invoices={invoices}
          onDelete={deleteInvoice}
          onTransfer={transferInvoice}
          showActions
        />
      </div>
    </>
  );
}
