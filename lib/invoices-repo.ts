import { Invoice } from '@/types/invoice';
import { getPool } from './db';

type InvoiceRow = {
  id: string;
  num_facture: string;
  client: string;
  nom_client: string;
  solde: string | number;
  retard_paiement: number;
  date_emission: Date | string;
  montant_fact: string | number;
  montant_reg: string | number;
  date_reg_prevu: Date | string | null;
  nature_derogation: string | null;
  delai_derogation: number | null;
  status: Invoice['status'];
};

let schemaReady: Promise<void> | null = null;

export async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const pool = getPool();
      await pool.query(`
        CREATE TABLE IF NOT EXISTS invoices (
          id TEXT PRIMARY KEY,
          num_facture TEXT NOT NULL,
          client TEXT NOT NULL DEFAULT '',
          nom_client TEXT NOT NULL DEFAULT '',
          solde NUMERIC(14,3) NOT NULL DEFAULT 0,
          retard_paiement INTEGER NOT NULL DEFAULT 0,
          date_emission TIMESTAMPTZ NOT NULL,
          montant_fact NUMERIC(14,3) NOT NULL DEFAULT 0,
          montant_reg NUMERIC(14,3) NOT NULL DEFAULT 0,
          date_reg_prevu TIMESTAMPTZ,
          nature_derogation TEXT,
          delai_derogation INTEGER,
          status TEXT NOT NULL DEFAULT 'SHEET1',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS invoices_num_facture_idx
        ON invoices (num_facture)
      `);
      await pool.query(`
        CREATE INDEX IF NOT EXISTS invoices_status_idx
        ON invoices (status)
      `);
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  await schemaReady;
}

function num(value: string | number): number {
  return typeof value === 'number' ? value : parseFloat(value);
}

export function rowToInvoice(row: InvoiceRow): Invoice {
  return {
    id: row.id,
    numFacture: row.num_facture,
    client: row.client,
    nomClient: row.nom_client,
    solde: num(row.solde),
    retardPaiement: row.retard_paiement,
    dateEmission: new Date(row.date_emission),
    montantFact: num(row.montant_fact),
    montantReg: num(row.montant_reg),
    dateRegPrevu: row.date_reg_prevu ? new Date(row.date_reg_prevu) : undefined,
    natureDerogation: row.nature_derogation || undefined,
    delaiDerogation: row.delai_derogation ?? undefined,
    status: row.status,
  };
}

export async function listInvoices(): Promise<Invoice[]> {
  await ensureSchema();
  const { rows } = await getPool().query<InvoiceRow>(
    'SELECT * FROM invoices ORDER BY created_at ASC'
  );
  return rows.map(rowToInvoice);
}

export async function importInvoices(invoices: Invoice[]): Promise<Invoice[]> {
  await ensureSchema();
  const pool = getPool();

  const unique = new Map<string, Invoice>();
  for (const invoice of invoices) {
    if (invoice.numFacture) unique.set(invoice.numFacture, invoice);
  }

  const values = [...unique.values()];
  for (let i = 0; i < values.length; i += 100) {
    const chunk = values.slice(i, i + 100);
    const params: unknown[] = [];
    const tuples = chunk.map((inv, index) => {
      const o = index * 13;
      params.push(
        inv.id,
        inv.numFacture,
        inv.client,
        inv.nomClient,
        inv.solde,
        inv.retardPaiement,
        inv.dateEmission,
        inv.montantFact,
        inv.montantReg,
        inv.dateRegPrevu ?? null,
        inv.natureDerogation ?? null,
        inv.delaiDerogation ?? null,
        inv.status
      );
      return `($${o + 1}, $${o + 2}, $${o + 3}, $${o + 4}, $${o + 5}, $${o + 6}, $${o + 7}, $${o + 8}, $${o + 9}, $${o + 10}, $${o + 11}, $${o + 12}, $${o + 13})`;
    });

    await pool.query(
      `
      INSERT INTO invoices (
        id, num_facture, client, nom_client, solde, retard_paiement,
        date_emission, montant_fact, montant_reg, date_reg_prevu,
        nature_derogation, delai_derogation, status
      )
      VALUES ${tuples.join(', ')}
      ON CONFLICT (num_facture) DO UPDATE SET
        client = EXCLUDED.client,
        nom_client = EXCLUDED.nom_client,
        solde = EXCLUDED.solde,
        retard_paiement = EXCLUDED.retard_paiement,
        date_emission = EXCLUDED.date_emission,
        montant_fact = EXCLUDED.montant_fact,
        montant_reg = EXCLUDED.montant_reg,
        date_reg_prevu = EXCLUDED.date_reg_prevu,
        updated_at = NOW()
      WHERE invoices.status = 'SHEET1'
      `,
      params
    );
  }

  return listInvoices();
}

export async function updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice | null> {
  await ensureSchema();
  const map: Record<string, string> = {
    numFacture: 'num_facture',
    client: 'client',
    nomClient: 'nom_client',
    solde: 'solde',
    retardPaiement: 'retard_paiement',
    dateEmission: 'date_emission',
    montantFact: 'montant_fact',
    montantReg: 'montant_reg',
    dateRegPrevu: 'date_reg_prevu',
    natureDerogation: 'nature_derogation',
    delaiDerogation: 'delai_derogation',
    status: 'status',
  };

  const sets: string[] = ['updated_at = NOW()'];
  const params: unknown[] = [];
  let i = 1;

  for (const [key, column] of Object.entries(map)) {
    if (key in updates) {
      const value = (updates as Record<string, unknown>)[key];
      sets.push(`${column} = $${i++}`);
      params.push(value === undefined ? null : value);
    }
  }

  if (params.length === 0) {
    const { rows } = await getPool().query<InvoiceRow>('SELECT * FROM invoices WHERE id = $1', [id]);
    return rows[0] ? rowToInvoice(rows[0]) : null;
  }

  params.push(id);
  const { rows } = await getPool().query<InvoiceRow>(
    `UPDATE invoices SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
    params
  );
  return rows[0] ? rowToInvoice(rows[0]) : null;
}

export async function transferInvoices(ids: string[], status: Invoice['status']): Promise<void> {
  await ensureSchema();
  if (ids.length === 0) return;
  await getPool().query(
    `UPDATE invoices SET status = $1, updated_at = NOW() WHERE id = ANY($2::text[])`,
    [status, ids]
  );
}

export async function deleteInvoice(id: string): Promise<void> {
  await ensureSchema();
  await getPool().query('DELETE FROM invoices WHERE id = $1', [id]);
}
