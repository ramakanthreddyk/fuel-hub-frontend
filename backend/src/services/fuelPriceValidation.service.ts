import { Pool } from 'pg';

export interface PriceValidationResult {
  missing: string[];
  outdated: { fuelType: string; validFrom: Date }[];
}

export async function validateStationPrices(
  db: Pool,
  tenantId: string,
  stationId: string,
  staleDays = 30
): Promise<PriceValidationResult> {
  const res = await db.query(
    `SELECT ft.fuel_type, fp.valid_from
       FROM (
         SELECT DISTINCT n.fuel_type
           FROM public.nozzles n
           JOIN public.pumps p ON p.id = n.pump_id
          WHERE p.station_id = $1 AND n.tenant_id = $2
       ) ft
       LEFT JOIN LATERAL (
         SELECT valid_from
           FROM public.fuel_prices fp
          WHERE fp.station_id = $1
            AND fp.fuel_type = ft.fuel_type
            AND fp.tenant_id = $2
            AND fp.valid_from <= NOW()
            AND (fp.effective_to IS NULL OR fp.effective_to > NOW())
          ORDER BY fp.valid_from DESC
          LIMIT 1
       ) fp ON TRUE`,
    [stationId, tenantId]
  );

  const missing: string[] = [];
  const outdated: { fuelType: string; validFrom: Date }[] = [];
  const threshold = new Date(Date.now() - staleDays * 24 * 60 * 60 * 1000);

  for (const row of res.rows) {
    if (!row.valid_from) {
      missing.push(row.fuel_type);
    } else {
      const validFrom = new Date(row.valid_from as any);
      if (validFrom < threshold) {
        outdated.push({ fuelType: row.fuel_type, validFrom });
      }
    }
  }

  return { missing, outdated };
}

export async function listStationsMissingPrices(
  db: Pool,
  tenantId: string
) {
  const stationsRes = await db.query<{ id: string; name: string }>(
    'SELECT id, name FROM public.stations WHERE tenant_id = $1 ORDER BY name',
    [tenantId]
  );

  const result: { id: string; name: string; missing: string[] }[] = [];
  for (const st of stationsRes.rows) {
    const validation = await validateStationPrices(db, tenantId, st.id);
    if (validation.missing.length) {
      result.push({ id: st.id, name: st.name, missing: validation.missing });
    }
  }
  return result;
}
