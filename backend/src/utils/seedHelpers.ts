import { Client } from 'pg';

/** Create a tenant record. Returns tenant id. */
export async function createTenant(
  client: Client,
  data: { name: string; planId: string }
): Promise<string> {
  const { rows } = await client.query<{ id: string }>(
    `INSERT INTO public.tenants (name, plan_id)
     VALUES ($1, $2)
     RETURNING id`,
    [data.name, data.planId]
  );
  return rows[0].id;
}

/** Create a station within a tenant schema. Returns station id. */
export async function createStation(
  client: Client,
  tenantId: string,
  data: { name: string }
): Promise<string> {
  const { rows } = await client.query<{ id: string }>(
    `INSERT INTO public.stations (tenant_id, name)
     VALUES ($1, $2)
     ON CONFLICT (tenant_id, name) DO UPDATE SET name=EXCLUDED.name
     RETURNING id`,
    [tenantId, data.name]
  );
  return rows[0].id;
}

/** Create a pump within a station. Returns pump id. */
export async function createPump(
  client: Client,
  stationId: string,
  tenantId: string,
  data: { name: string }
): Promise<string> {
  const { rows } = await client.query<{ id: string }>(
    `INSERT INTO public.pumps (tenant_id, station_id, name)
     VALUES ($1, $2, $3)
     ON CONFLICT (station_id, name) DO UPDATE SET name=EXCLUDED.name
     RETURNING id`,
    [tenantId, stationId, data.name]
  );
  return rows[0].id;
}

/** Create multiple nozzles for a pump. */
export async function createNozzles(
  client: Client,
  pumpId: string,
  tenantId: string,
  data: { nozzleNumber: number; fuelType: string }[]
): Promise<void> {
  for (const nozzle of data) {
    await client.query(
      `INSERT INTO public.nozzles (tenant_id, pump_id, nozzle_number, fuel_type)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (tenant_id, pump_id, nozzle_number) DO NOTHING`,
      [tenantId, pumpId, nozzle.nozzleNumber, nozzle.fuelType]
    );
  }
}

/** Fetch the latest reading for a nozzle. */
export async function getLatestReading(
  client: Client,
  nozzleId: string,
  tenantId: string
): Promise<any | null> {
  const { rows } = await client.query(
    `SELECT * FROM public.nozzle_readings
     WHERE nozzle_id = $1
       AND tenant_id = $2
     ORDER BY recorded_at DESC
     LIMIT 1`,
    [nozzleId, tenantId]
  );
  return rows[0] || null;
}

/** Get the active fuel price for a station and fuel type at a given time. */
export async function getCurrentFuelPrice(
  client: Client,
  stationId: string,
  fuelType: string,
  tenantId: string,
  atTime: Date = new Date()
): Promise<number | null> {
  const { rows } = await client.query<{ price: number }>(
    `SELECT price FROM public.fuel_prices
     WHERE station_id = $1
       AND fuel_type = $2
       AND tenant_id = $3
       AND valid_from <= $4
     ORDER BY valid_from DESC
     LIMIT 1`,
    [stationId, fuelType, tenantId, atTime]
  );
  return rows[0]?.price ?? null;
}

