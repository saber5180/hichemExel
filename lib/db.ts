import { Pool } from 'pg';

const globalForPg = globalThis as unknown as { pgPool?: Pool };

function connectionString() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set');
  }
  return url.replace(/&?channel_binding=require/g, '');
}

export function getPool(): Pool {
  if (!globalForPg.pgPool) {
    globalForPg.pgPool = new Pool({
      connectionString: connectionString(),
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  return globalForPg.pgPool;
}
