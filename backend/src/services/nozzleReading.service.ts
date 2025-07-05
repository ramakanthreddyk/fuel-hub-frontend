import { randomUUID } from 'crypto';
import { Pool } from 'pg';
import { getPriceAtTimestamp } from '../utils/priceUtils';
import { createAlert } from './alert.service';
import { NozzleReadingInput, ReadingQuery } from '../validators/nozzleReading.validator';
import { getCreditorById, incrementCreditorBalance } from './creditor.service';
import { isDayFinalized } from './reconciliation.service';
import prisma from '../utils/prisma';

export async function createNozzleReading(
  db: Pool,
  tenantId: string,
  data: NozzleReadingInput,
  userId: string
): Promise<string> {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const lastRes = await client.query<{ reading: number }>(
      'SELECT reading FROM public.nozzle_readings WHERE nozzle_id = $1 AND tenant_id = $2 ORDER BY recorded_at DESC LIMIT 1',
      [data.nozzleId, tenantId]
    );
    const lastReading = lastRes.rows[0]?.reading ?? 0;
    if (data.reading < Number(lastReading)) {
      throw new Error('Reading must be >= last reading');
    }

    const nozzleInfo = await client.query<{ fuel_type: string; station_id: string }>(
      'SELECT n.fuel_type, p.station_id FROM public.nozzles n JOIN public.pumps p ON n.pump_id = p.id WHERE n.id = $1 AND n.tenant_id = $2',
      [data.nozzleId, tenantId]
    );
    if (!nozzleInfo.rowCount) {
      throw new Error('Invalid nozzle');
    }
    const { fuel_type, station_id } = nozzleInfo.rows[0];

    const finalized = await isDayFinalized(client, tenantId, station_id, new Date(data.recordedAt));
    if (finalized) {
      throw new Error('Day already finalized for this station');
    }

    const readingId = randomUUID();
    const readingRes = await client.query<{ id: string }>(
      'INSERT INTO public.nozzle_readings (id, tenant_id, nozzle_id, reading, recorded_at, payment_method, updated_at) VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING id',
      [
        readingId,
        tenantId,
        data.nozzleId,
        data.reading,
        data.recordedAt,
        data.paymentMethod || (data.creditorId ? 'credit' : 'cash'),
      ]
    );
    const volumeSold = parseFloat((data.reading - Number(lastReading)).toFixed(3));
    const priceRecord = await getPriceAtTimestamp(
      prisma,
      tenantId,
      station_id,
      fuel_type,
      data.recordedAt
    );
    if (!priceRecord) {
      throw new Error('Fuel price not found');
    }
    const { price, validFrom } = priceRecord;
    const threshold = new Date(data.recordedAt);
    threshold.setDate(threshold.getDate() - 7);
    if (validFrom < threshold) {
      throw new Error('Fuel price outdated');
    }
    const saleAmount = parseFloat((volumeSold * price).toFixed(2));
    if (data.creditorId) {
      const creditor = await getCreditorById(client, tenantId, data.creditorId);
      if (!creditor) {
        throw new Error('Invalid creditor');
      }
      const newBalance = Number(creditor.balance) + saleAmount;
      if (newBalance > Number(creditor.credit_limit)) {
        throw new Error('Credit limit exceeded');
      }
      if (newBalance >= Number(creditor.credit_limit) * 0.9) {
        await createAlert(
          tenantId,
          station_id,
          'credit_near_limit',
          'Creditor above 90% of credit limit',
          'warning'
        );
      }
      await incrementCreditorBalance(client, tenantId, data.creditorId, saleAmount);
    }
    await client.query(
      'INSERT INTO public.sales (id, tenant_id, nozzle_id, reading_id, station_id, volume, fuel_type, fuel_price, amount, payment_method, creditor_id, created_by, recorded_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW())',
      [
        randomUUID(),
        tenantId,
        data.nozzleId,
        readingId,
        station_id,
        volumeSold,
        fuel_type,
        price || 0,
        saleAmount,
        data.paymentMethod || (data.creditorId ? 'credit' : 'cash'),
        data.creditorId || null,
        userId,
        data.recordedAt,
      ]
    );
    await client.query('COMMIT');
    return readingRes.rows[0].id;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function listNozzleReadings(
  tenantId: string,
  query: ReadingQuery
) {
  const params: any[] = [tenantId];
  let idx = 2;
  const filters: string[] = [];
  if (query.nozzleId) {
    filters.push(`o.nozzle_id = $${idx++}`);
    params.push(query.nozzleId);
  }
  if (query.stationId) {
    filters.push(`o.station_id = $${idx++}`);
    params.push(query.stationId);
  }
  if (query.from) {
    filters.push(`o.recorded_at >= $${idx++}`);
    params.push(query.from);
  }
  if (query.to) {
    filters.push(`o.recorded_at <= $${idx++}`);
    params.push(query.to);
  }
  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const limitClause = query.limit ? ` LIMIT ${parseInt(String(query.limit), 10)}` : '';
  const sql = `WITH ordered AS (
      SELECT
        nr.id,
        nr.nozzle_id,
        n.nozzle_number,
        p.id AS pump_id,
        p.name AS pump_name,
        s.id AS station_id,
        s.name AS station_name,
        nr.reading,
        nr.recorded_at,
        LAG(nr.reading) OVER (PARTITION BY nr.nozzle_id ORDER BY nr.recorded_at) AS previous_reading
      FROM public.nozzle_readings nr
      JOIN public.nozzles n ON nr.nozzle_id = n.id
      JOIN public.pumps p ON n.pump_id = p.id
      JOIN public.stations s ON p.station_id = s.id
      WHERE nr.tenant_id = $1
    )
    SELECT
      o.id,
      o.nozzle_id,
      o.nozzle_number,
      o.pump_id,
      o.pump_name,
      o.station_id,
      o.station_name,
      o.reading,
      o.recorded_at,
      o.previous_reading,
      u.name AS recorded_by
    FROM ordered o
    LEFT JOIN public.sales sa ON sa.reading_id = o.id
    LEFT JOIN public.users u ON sa.created_by = u.id
    ${where}
    ORDER BY recorded_at DESC${limitClause}`;
  const rows = (await prisma.$queryRawUnsafe(sql, ...params)) as any[];
  return rows;
}

export async function canCreateNozzleReading(
  db: Pool,
  tenantId: string,
  nozzleId: string
) {
  const nozzleRes = await db.query<{ status: string; fuel_type: string; station_id: string }>(
    `SELECT n.status, n.fuel_type, p.station_id
       FROM public.nozzles n
       JOIN public.pumps p ON n.pump_id = p.id
      WHERE n.id = $1 AND n.tenant_id = $2`,
    [nozzleId, tenantId]
  );

  if (!nozzleRes.rowCount) {
    return { allowed: false, reason: 'Invalid nozzle' } as const;
  }

  const { status, fuel_type, station_id } = nozzleRes.rows[0];

  if (status !== 'active') {
    return { allowed: false, reason: 'Nozzle inactive' } as const;
  }

  const priceRes = await db.query<{ id: string }>(
    `SELECT id FROM public.fuel_prices
       WHERE station_id = $1 AND fuel_type = $2
         AND tenant_id = $3
         AND valid_from <= NOW()
         AND (effective_to IS NULL OR effective_to > NOW())
       LIMIT 1`,
    [station_id, fuel_type, tenantId]
  );

  if (!priceRes.rowCount) {
    return { allowed: false, reason: 'Active price missing', missingPrice: true } as const;
  }

  return { allowed: true } as const;
}

export async function getNozzleReading(db: Pool, tenantId: string, id: string) {
  const res = await db.query(
    `SELECT id, nozzle_id, reading, recorded_at, payment_method, creditor_id
       FROM public.nozzle_readings
      WHERE id = $1 AND tenant_id = $2`,
    [id, tenantId]
  );
  return res.rows[0] || null;
}

export async function updateNozzleReading(
  db: Pool,
  tenantId: string,
  id: string,
  data: Partial<NozzleReadingInput>
) {
  const fields: string[] = [];
  const values: any[] = [id, tenantId];
  let idx = 3;
  if (data.reading !== undefined) {
    fields.push(`reading = $${idx++}`);
    values.push(data.reading);
  }
  if (data.recordedAt !== undefined) {
    fields.push(`recorded_at = $${idx++}`);
    values.push(data.recordedAt);
  }
  if (data.paymentMethod) {
    fields.push(`payment_method = $${idx++}`);
    values.push(data.paymentMethod);
  }
  if (data.creditorId !== undefined) {
    fields.push(`creditor_id = $${idx++}`);
    values.push(data.creditorId);
  }
  if (fields.length === 0) {
    return null;
  }
  const sql = `UPDATE public.nozzle_readings SET ${fields.join(", ")}, updated_at = NOW()
               WHERE id = $1 AND tenant_id = $2 RETURNING id`;
  const res = await db.query<{ id: string }>(sql, values);
  return res.rowCount ? res.rows[0].id : null;
}
