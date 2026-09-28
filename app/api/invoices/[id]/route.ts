import { NextResponse } from 'next/server';
import { Invoice } from '@/types/invoice';
import { deleteInvoice, updateInvoice } from '@/lib/invoices-repo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await request.json()) as Partial<Invoice>;
    const updates: Partial<Invoice> = { ...body };
    if (body.dateEmission) updates.dateEmission = new Date(body.dateEmission);
    if (body.dateRegPrevu) updates.dateRegPrevu = new Date(body.dateRegPrevu);
    if (body.dateRegPrevu === null) updates.dateRegPrevu = undefined;

    const invoice = await updateInvoice(params.id, updates);
    if (!invoice) {
      return NextResponse.json({ error: 'Facture introuvable' }, { status: 404 });
    }
    return NextResponse.json({ invoice });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Impossible de mettre à jour la facture' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteInvoice(params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Impossible de supprimer la facture' },
      { status: 500 }
    );
  }
}
