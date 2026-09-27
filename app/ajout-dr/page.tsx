'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useInvoiceStore } from '@/lib/store';
import { Invoice } from '@/types/invoice';
import { calculateRetard, formatMoney, fromInputDate, getRetardBadge, getStatusLabel, toInputDate } from '@/lib/utils';
import PageHeader from '@/components/PageHeader';
import {
  IconAlert,
  IconCheck,
  IconClock,
  IconClose,
  IconPlus,
  IconSearch,
} from '@/components/Icons';

const NATURES = [
  'TIKE RESTEAUX',
  'DEROGATION COMERCIAL',
  'AVOIR',
  'FAUTTE CHAUFFEUR',
  'ANNOMALI',
  'ALERTE',
];

type Feedback = { type: 'success' | 'error'; text: string } | null;

export default function AjoutDRPage() {
  const invoices = useInvoiceStore((state) => state.invoices);
  const updateInvoice = useInvoiceStore((state) => state.updateInvoice);

  const [searchNum, setSearchNum] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [formData, setFormData] = useState({
    dateEmission: '',
    natureDerogation: '',
    delaiDerogation: '',
    dateRegPrevu: '',
  });

  const computeDatePrevu = (dateEmissionValue: string, delaiValue: string) => {
    const delai = parseInt(delaiValue, 10);
    if (!dateEmissionValue || isNaN(delai) || delai <= 0) return '';
    const datePrevu = fromInputDate(dateEmissionValue);
    datePrevu.setDate(datePrevu.getDate() + delai);
    return toInputDate(datePrevu);
  };

  const handleSearch = () => {
    const query = searchNum.trim().toUpperCase();
    if (!query) {
      setFeedback({ type: 'error', text: 'Entrez un numéro de facture.' });
      return;
    }

    const found =
      invoices.find((inv) => inv.numFacture.toUpperCase() === query && inv.status === 'SHEET1') ??
      invoices.find((inv) => inv.numFacture.toUpperCase() === query);

    if (!found) {
      setSelectedInvoice(null);
      setFeedback({
        type: 'error',
        text: `Facture « ${searchNum} » introuvable dans Sheet1 ni dans les autres tableaux.`,
      });
      return;
    }

    setSelectedInvoice(found);
    setFeedback(null);
    setFormData({
      dateEmission: toInputDate(found.dateEmission),
      natureDerogation: found.natureDerogation ?? '',
      delaiDerogation: found.delaiDerogation?.toString() ?? '',
      dateRegPrevu: found.dateRegPrevu ? toInputDate(found.dateRegPrevu) : '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      if (name === 'dateEmission' && value) {
        next.dateRegPrevu = computeDatePrevu(value, prev.delaiDerogation) || prev.dateRegPrevu;
      }

      if (name === 'delaiDerogation') {
        const dateEmission = next.dateEmission || toInputDate(selectedInvoice?.dateEmission);
        next.dateRegPrevu = computeDatePrevu(dateEmission, value) || next.dateRegPrevu;
      }

      return next;
    });

    if (name === 'dateEmission' && selectedInvoice && value) {
      const dateEmission = fromInputDate(value);
      setSelectedInvoice({
        ...selectedInvoice,
        dateEmission,
        retardPaiement: calculateRetard(dateEmission),
      });
    }
  };

  const handleClear = () => {
    setSearchNum('');
    setSelectedInvoice(null);
    setFormData({ dateEmission: '', natureDerogation: '', delaiDerogation: '', dateRegPrevu: '' });
  };

  const handleAddToWaiting = () => {
    if (!selectedInvoice) return;

    if (!formData.natureDerogation) {
      setFeedback({ type: 'error', text: 'Sélectionnez une nature de dérogation.' });
      return;
    }

    const dateEmission = formData.dateEmission
      ? fromInputDate(formData.dateEmission)
      : selectedInvoice.dateEmission;

    updateInvoice(selectedInvoice.id, {
      dateEmission,
      retardPaiement: calculateRetard(dateEmission),
      natureDerogation: formData.natureDerogation,
      delaiDerogation: parseInt(formData.delaiDerogation, 10) || undefined,
      dateRegPrevu: formData.dateRegPrevu ? fromInputDate(formData.dateRegPrevu) : undefined,
      status: 'WAITING',
    });

    setFeedback({
      type: 'success',
      text: `Facture ${selectedInvoice.numFacture} ajoutée au tableau d'attente.`,
    });
    setSearchNum('');
    setSelectedInvoice(null);
    setFormData({ dateEmission: '', natureDerogation: '', delaiDerogation: '', dateRegPrevu: '' });
  };

  const sheet1Count = invoices.filter((i) => i.status === 'SHEET1').length;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Ajout DR"
        subtitle="Ajouter une dérogation à une facture existante"
        icon={<IconPlus className="h-5 w-5" />}
        actions={
          <Link href="/tableau-attente" className="btn-ghost">
            <IconClock className="h-4 w-4" />
            Tableau d&apos;attente
          </Link>
        }
      />

      {/* Recherche */}
      <div className="card p-4 sm:p-6">
        <label className="label">Numéro de facture</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchNum}
              onChange={(e) => setSearchNum(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="FC26SOP219879"
              className="input num !pl-10 uppercase"
            />
          </div>
          <button onClick={handleSearch} className="btn-primary min-h-11 sm:w-36">
            <IconSearch className="h-4 w-4" />
            Chercher
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          La recherche vise d&apos;abord <strong className="font-semibold text-slate-600">Sheet1</strong>{' '}
          ({sheet1Count} facture{sheet1Count > 1 ? 's' : ''}), puis les autres tableaux.
        </p>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`mt-4 flex items-start gap-3 rounded-2xl border p-4 text-sm ${
            feedback.type === 'success'
              ? 'border-emerald-100 bg-emerald-50/70 text-emerald-800'
              : 'border-rose-100 bg-rose-50/70 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <IconCheck className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <p className="flex-1">{feedback.text}</p>
          {feedback.type === 'success' && (
            <Link href="/tableau-attente" className="shrink-0 font-semibold underline">
              Voir
            </Link>
          )}
        </div>
      )}

      {/* Facture trouvée */}
      {selectedInvoice && (
        <div className="card mt-6 animate-fade-in-up">
          <div className="card-header">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <IconCheck className="h-4 w-4" />
              </span>
              <h2 className="card-title">Facture trouvée</h2>
            </div>
            <span className="badge-slate">{getStatusLabel(selectedInvoice.status)}</span>
          </div>

          {/* Détails */}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-slate-100 bg-slate-50/60 p-6 md:grid-cols-3">
            <div>
              <dt className="label !mb-1">N° Facture</dt>
              <dd className="num font-bold text-slate-900">{selectedInvoice.numFacture}</dd>
            </div>
            <div>
              <dt className="label !mb-1">Client</dt>
              <dd className="truncate font-semibold text-slate-900">{selectedInvoice.nomClient}</dd>
            </div>
            <div>
              <dt className="label !mb-1">Code</dt>
              <dd className="text-slate-700">{selectedInvoice.client}</dd>
            </div>
            <div>
              <dt className="label !mb-1">Solde</dt>
              <dd className="num text-base font-bold text-indigo-600">
                {formatMoney(selectedInvoice.solde)}
                <span className="ml-1 text-[11px] font-medium text-slate-400">TND</span>
              </dd>
            </div>
            <div>
              <dt className="label !mb-1">Retard</dt>
              <dd>
                <span className={getRetardBadge(selectedInvoice.retardPaiement)}>
                  {selectedInvoice.retardPaiement} jours
                </span>
              </dd>
            </div>
            <div>
              <dt className="label !mb-1">Date émission</dt>
              <dd>
                <input
                  type="date"
                  name="dateEmission"
                  value={formData.dateEmission}
                  onChange={handleChange}
                  className="input"
                />
              </dd>
            </div>
          </dl>

          {/* Formulaire dérogation */}
          <div className="p-6">
            <h3 className="mb-4 text-sm font-semibold tracking-tight text-slate-900">
              Dérogation
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="label">Nature dérogation</label>
                <select
                  name="natureDerogation"
                  value={formData.natureDerogation}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="">Sélectionner…</option>
                  {NATURES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Délai dérogation (jours)</label>
                <input
                  type="number"
                  name="delaiDerogation"
                  value={formData.delaiDerogation}
                  onChange={handleChange}
                  min={0}
                  placeholder="0"
                  className="input"
                />
              </div>

              <div>
                <label className="label">Date règlement prévu</label>
                <input
                  type="date"
                  name="dateRegPrevu"
                  value={formData.dateRegPrevu}
                  onChange={handleChange}
                  className="input"
                />
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Calculée automatiquement : date émission + délai
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row">
            <button onClick={handleAddToWaiting} className="btn-primary flex-1">
              <IconPlus className="h-4 w-4" />
              Ajouter au tableau d&apos;attente
            </button>
            <button onClick={handleClear} className="btn-ghost sm:w-32">
              <IconClose className="h-4 w-4" />
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Aide */}
      <div className="callout-amber mt-6">
        <h3 className="mb-2 text-sm font-semibold text-amber-900">Comment ça marche</h3>
        <ol className="space-y-1 text-sm text-amber-800/90">
          <li>1. Saisissez le numéro de facture et lancez la recherche.</li>
          <li>2. Choisissez la nature de dérogation et le délai en jours.</li>
          <li>3. La date de règlement prévu se calcule automatiquement.</li>
          <li>
            4. <strong>Ajouter au tableau d&apos;attente</strong> — le transfert final se fait
            ensuite depuis le tableau d&apos;attente.
          </li>
        </ol>
      </div>
    </div>
  );
}
