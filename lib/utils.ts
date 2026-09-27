import { Invoice } from '@/types/invoice';
import { differenceInDays, isPast } from 'date-fns';

// Calculer le SOLDE: Montant Fact - Mont.Reg
export function calculateSolde(montantFact: number, montantReg: number): number {
  return montantFact - montantReg;
}

// Vérifier si la date de règlement est dépassée
export function isDateExpired(date: Date | undefined): boolean {
  if (!date) return false;
  return isPast(date) && !isSameDay(date, new Date());
}

// Vérifier si c'est le même jour
function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}

// Calculer le retard en jours
export function calculateRetard(dateEmission: Date): number {
  return Math.max(0, differenceInDays(new Date(), dateEmission));
}

// Formater la date
export function formatDate(date: Date | undefined): string {
  if (!date) return '';
  return new Intl.DateTimeFormat('fr-FR').format(new Date(date));
}

// Date pour un input type="date" (YYYY-MM-DD, fuseau local)
export function toInputDate(date: Date | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function fromInputDate(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

// Formater un montant en dinars
export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount);
}

// Classe du badge de retard selon la gravité
export function getRetardBadge(jours: number): string {
  if (jours > 90) return 'badge-solid-rose';
  if (jours > 30) return 'badge-orange';
  if (jours > 0) return 'badge-amber';
  return 'badge-emerald';
}

// Générer un ID unique
export function generateId(): string {
  return `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Obtenir la couleur selon le statut
export function getStatusColor(status: Invoice['status']): string {
  const colors = {
    SHEET1: 'bg-gray-100 text-gray-800',
    WAITING: 'bg-blue-100 text-blue-800',
    ALERTE: 'bg-red-100 text-red-800',
    TIKE_RESTEAUX: 'bg-blue-100 text-blue-800',
    DEROGATION_COMERCIAL: 'bg-yellow-100 text-yellow-800',
    AVOIR: 'bg-green-100 text-green-800',
    FAUTTE_CHAUFFEUR: 'bg-orange-100 text-orange-800',
    ANNOMALI: 'bg-purple-100 text-purple-800'
  };
  return colors[status] || colors.SHEET1;
}

// Obtenir le label du statut
export function getStatusLabel(status: Invoice['status']): string {
  const labels = {
    SHEET1: 'Sheet1 (Import)',
    WAITING: 'En attente',
    ALERTE: 'Alerte',
    TIKE_RESTEAUX: 'Tike Resteaux',
    DEROGATION_COMERCIAL: 'Dérogation Comercial',
    AVOIR: 'Avoir',
    FAUTTE_CHAUFFEUR: 'Fautte Chauffeur',
    ANNOMALI: 'Annomali'
  };
  return labels[status] || 'Inconnu';
}
