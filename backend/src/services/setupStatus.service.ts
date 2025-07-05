import { Pool } from 'pg';

export interface SetupStatusDTO {
  hasStation: boolean;
  hasPump: boolean;
  hasNozzle: boolean;
  hasFuelPrice: boolean;
  completed: boolean;
}

export async function getSetupStatus(db: Pool, tenantId: string): Promise<SetupStatusDTO> {
  const [stations, pumps, nozzles, prices] = await Promise.all([
    db.query('SELECT COUNT(*) FROM public.stations WHERE tenant_id = $1', [tenantId]),
    db.query('SELECT COUNT(*) FROM public.pumps WHERE tenant_id = $1', [tenantId]),
    db.query('SELECT COUNT(*) FROM public.nozzles WHERE tenant_id = $1', [tenantId]),
    db.query('SELECT COUNT(*) FROM public.fuel_prices WHERE tenant_id = $1', [tenantId])
  ]);

  const hasStation = Number(stations.rows[0].count) > 0;
  const hasPump = Number(pumps.rows[0].count) > 0;
  const hasNozzle = Number(nozzles.rows[0].count) > 0;
  const hasFuelPrice = Number(prices.rows[0].count) > 0;

  return {
    hasStation,
    hasPump,
    hasNozzle,
    hasFuelPrice,
    completed: hasStation && hasPump && hasNozzle && hasFuelPrice
  };
}
