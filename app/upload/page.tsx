'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { readExcelFile } from '@/lib/excel';
import { useInvoiceStore } from '@/lib/store';
import PageHeader from '@/components/PageHeader';
import { IconAlert, IconCheck, IconFile, IconUpload } from '@/components/Icons';

const COLUMNS = [
  'Num Facture',
  'Code',
  'Client',
  'Montant Fact',
  'Mont.Reg',
  'Date Fact',
  'Retard',
];

export default function UploadPage() {
  const router = useRouter();
  const importInvoices = useInvoiceStore((state) => state.importInvoices);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const processFile = async (file: File) => {
    if (!/\.(xlsx|xlsm|xls)$/i.test(file.name)) {
      setError('Format invalide. Utilisez un fichier Excel (.xlsx, .xlsm ou .xls).');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const invoices = await readExcelFile(file);
      await importInvoices(invoices);
      router.push('/sheet1');
    } catch (err) {
      setError('Erreur lors de la lecture du fichier : ' + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Importer un fichier Excel"
        subtitle="Les factures seront chargées dans Sheet1"
        icon={<IconUpload className="h-5 w-5" />}
      />

      <div className="card p-6">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) processFile(file);
          }}
          className={`rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-all ${
            dragging
              ? 'border-indigo-400 bg-indigo-50/60'
              : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
          }`}
        >
          <input
            type="file"
            accept=".xlsx,.xlsm,.xls"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) processFile(file);
            }}
            disabled={uploading}
            className="hidden"
            id="file-upload"
          />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-indigo-500 shadow-card ring-1 ring-slate-100">
            {uploading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            ) : (
              <IconFile className="h-6 w-6" />
            )}
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-900">
            {uploading ? 'Enregistrement dans Neon…' : 'Glissez-déposez votre fichier ici'}
          </p>
          <p className="mt-1 text-xs text-slate-500">Formats acceptés : .xlsx, .xlsm, .xls</p>

          <label
            htmlFor="file-upload"
            className={`btn-primary mt-6 ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
          >
            <IconUpload className="h-4 w-4" />
            Choisir un fichier
          </label>
        </div>

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50/70 p-4 text-sm text-rose-800">
            <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Colonnes attendues */}
      <div className="card mt-6">
        <div className="card-header">
          <h2 className="card-title">Colonnes attendues</h2>
          <span className="badge-slate">Première feuille</span>
        </div>
        <div className="flex flex-wrap gap-2 p-6">
          {COLUMNS.map((c) => (
            <span
              key={c}
              className="num rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600 ring-1 ring-inset ring-slate-200"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="callout-info mt-6">
        <div className="flex items-start gap-3">
          <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
          <p className="text-sm leading-relaxed text-indigo-900/90">
            Le <strong>solde</strong> est recalculé automatiquement à l&apos;import selon la formule{' '}
            <code className="rounded bg-white px-1.5 py-0.5 text-[12px] font-semibold text-indigo-700 ring-1 ring-indigo-100">
              Montant Fact − Mont.Reg
            </code>
            . Les factures importées atterrissent dans <strong>Sheet1</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
