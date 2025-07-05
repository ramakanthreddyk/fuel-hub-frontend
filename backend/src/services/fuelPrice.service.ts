import { Pool } from 'pg';
import { randomUUID } from 'crypto';
import { FuelPriceInput, FuelPriceQuery } from '../validators/fuelPrice.validator';
import { parseRows } from '../utils/parseDb';

export async function createFuelPrice(db: Pool, tenantId: string, input: FuelPriceInput): Promise<string> {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const res = await client.query<{ id: string }>(
      `INSERT INTO public.fuel_prices (id, tenant_id, station_id, fuel_type, price, valid_from, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING id`,
      [randomUUID(), tenantId, input.stationId, input.fuelType, input.price, input.validFrom || new Date()]
    );
    await client.query('COMMIT');
    return res.rows[0].id;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function updateFuelPrice(db: Pool, tenantId: string, id: string, input: FuelPriceInput): Promise<void> {
  await db.query(
    'UPDATE public.fuel_prices SET station_id = $2, fuel_type = $3, price = $4, valid_from = $5 WHERE id = $1 AND tenant_id = $6',
    [id, input.stationId, input.fuelType, input.price, input.validFrom, tenantId]
  );
}

export async function deleteFuelPrice(db: Pool, tenantId: string, id: string): Promise<void> {
  await db.query('DELETE FROM public.fuel_prices WHERE id = $1 AND tenant_id = $2', [id, tenantId]);
}

export async function listFuelPrices(db: Pool, tenantId: string, query: FuelPriceQuery) {
  const params: any[] = [];
  let idx = 1;
  const conds: string[] = [];
  if (query.stationId) {
    conds.push(`station_id = $${idx++}`);
    params.push(query.stationId);
  }
  if (query.fuelType) {
    conds.push(`fuel_type = $${idx++}`);
    params.push(query.fuelType);
  }
  conds.push(`tenant_id = $${idx++}`);
  params.push(tenantId);
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const sql = `SELECT id, station_id, fuel_type, price, valid_from, created_at
               FROM public.fuel_prices
               ${where}
               ORDER BY valid_from DESC`;
  const res = await db.query(sql, params);
  return parseRows(res.rows);
}

export async function getPriceAt(db: Pool, tenantId: string, stationId: string, fuelType: string, at: Date): Promise<number | null> {
  const res = await db.query<{ price: number }>(
    `SELECT price FROM public.fuel_prices
     WHERE station_id = $1 AND fuel_type = $2
       AND valid_from <= $3
       AND (effective_to IS NULL OR effective_to >= $3)
      AND tenant_id = $4
     ORDER BY valid_from DESC
     LIMIT 1`,
    [stationId, fuelType, at, tenantId]
  );
  return res.rows[0]?.price ?? null;
}
