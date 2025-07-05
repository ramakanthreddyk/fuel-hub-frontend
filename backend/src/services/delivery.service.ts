import { Pool, PoolClient } from 'pg';
import { randomUUID } from 'crypto';
import { DeliveryInput, DeliveryQuery } from '../validators/delivery.validator';
import { parseRows } from '../utils/parseDb';

export async function createFuelDelivery(db: Pool, tenantId: string, input: DeliveryInput): Promise<string> {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const res = await client.query<{ id: string }>(
      `INSERT INTO public.fuel_deliveries (id, tenant_id, station_id, fuel_type, volume, delivered_by, delivery_date, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,NOW()) RETURNING id`,
      [randomUUID(), tenantId, input.stationId, input.fuelType, input.volume, input.supplier || null, input.deliveryDate]
    );

    const inv = await client.query<{ id: string }>(
      `SELECT id FROM public.fuel_inventory WHERE tenant_id = $1 AND station_id = $2 AND fuel_type = $3`,
      [tenantId, input.stationId, input.fuelType]
    );
    if (inv.rowCount) {
      await client.query(
        `UPDATE public.fuel_inventory
           SET current_volume = current_volume + $4, updated_at = NOW()
         WHERE tenant_id = $1 AND station_id = $2 AND fuel_type = $3`,
        [tenantId, input.stationId, input.fuelType, input.volume]
      );
    } else {
      await client.query(
        `INSERT INTO public.fuel_inventory (id, tenant_id, station_id, fuel_type, current_volume, updated_at)
         VALUES ($1,$2,$3,$4,$5,NOW())`,
        [randomUUID(), tenantId, input.stationId, input.fuelType, input.volume]
      );
    }
    await client.query('COMMIT');
    return res.rows[0].id;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function listFuelDeliveries(db: Pool, tenantId: string, query: DeliveryQuery) {
  const params: any[] = [tenantId];
  let idx = 2;
  let where = 'WHERE tenant_id = $1';
  if (query.stationId) {
    where += ` AND station_id = $${idx++}`;
    params.push(query.stationId);
  }
  const sql = `SELECT id, station_id, fuel_type, volume, delivered_by, delivery_date, created_at
               FROM public.fuel_deliveries ${where}
               ORDER BY delivery_date DESC`;
  const res = await db.query(sql, params);
  return parseRows(res.rows);
}
