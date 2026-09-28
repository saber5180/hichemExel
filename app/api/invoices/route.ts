import { NextResponse } from 'next/server';
import { Invoice } from '@/types/invoice';
import { importInvoices, listInvoices, transferInvoices } from '@/lib/invoices-repo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parseInvoice(raw: Record<string, unknown>): Invoice {
  return {
    id: String(raw.id),
    numFacture: String(raw.numFacture ?? ''),
    client: String(raw.client ?? ''),
    nomClient: String(raw.nomClient ?? ''),
    solde: Number(raw.solde ?? 0),
    retardPaiement: Number(raw.retardPaiement ?? 0),
    dateEmission: new Date(String(raw.dateEmission)),
    montantFact: Number(raw.montantFact ?? 0),
    montantReg: Number(raw.montantReg ?? 0),
    dateRegPrevu: raw.dateRegPrevu ? new Date(String(raw.dateRegPrevu)) : undefined,
    natureDerogation: raw.natureDerogation ? String(raw.natureDerogation) : undefined,
    delaiDerogation: raw.delaiDerogation != null ? Number(raw.delaiDerogation) : undefined,
    status: (raw.status as Invoice['status']) || 'SHEET1',
  };
}

export async function GET() {
  try {
    const invoices = await listInvoices();
    return NextResponse.json({ invoices });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Impossible de lire les factures' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const incoming = Array.isArray(body.invoices) ? body.invoices : [];
    const invoices = await importInvoices(incoming.map(parseInvoice));
    return NextResponse.json({ invoices });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Impossible d’importer les factures' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const ids: string[] = Array.isArray(body.ids) ? body.ids : [];
    const status = body.status as Invoice['status'];
    if (!status || ids.length === 0) {
      return NextResponse.json({ error: 'ids et status requis' }, { status: 400 });
    }
    await transferInvoices(ids, status);
    const invoices = await listInvoices();
    return NextResponse.json({ invoices });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Impossible de transférer les factures' },
      { status: 500 }
    );
  }
}
