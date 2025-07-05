import { Prisma, PrismaClient } from '@prisma/client';
import { getPlanRules } from '../config/planConfig';

type TxClient = PrismaClient | Prisma.TransactionClient;
// Helper to fetch tenant plan id using tenant id
async function fetchPlanId(db: TxClient, tenantId: string): Promise<string> {
  const tenant = await db.tenant.findFirst({
    where: { id: tenantId },
    select: { plan_id: true },
  });
  return tenant?.plan_id as string;
}

// NOTE: The following middleware stubs show the intended logic. Actual routing
// integration will be implemented in Phase 2.

export async function beforeCreateStation(db: TxClient, tenantId: string) {
  const planId = await fetchPlanId(db, tenantId);
  const rules = getPlanRules(planId);
  const count = await db.station.count({ where: { tenant_id: tenantId } });
  if (count >= rules.maxStations) {
    throw new Error('Plan limit exceeded: stations');
  }
}

export async function beforeCreatePump(
  db: TxClient,
  tenantId: string,
  stationId: string
) {
  const planId = await fetchPlanId(db, tenantId);
  const rules = getPlanRules(planId);
  const count = await db.pump.count({
    where: { tenant_id: tenantId, station_id: stationId },
  });
  if (count >= rules.maxPumpsPerStation) {
    throw new Error('Plan limit exceeded: pumps per station');
  }
}

export async function beforeCreateNozzle(
  db: TxClient,
  tenantId: string,
  pumpId: string
) {
  const planId = await fetchPlanId(db, tenantId);
  const rules = getPlanRules(planId);
  const count = await db.nozzle.count({
    where: { tenant_id: tenantId, pump_id: pumpId },
  });
  if (count >= rules.maxNozzlesPerPump) {
    throw new Error('Plan limit exceeded: nozzles per pump');
  }
}

export async function beforeCreateUser(db: TxClient, tenantId: string) {
  const planId = await fetchPlanId(db, tenantId);
  const rules = getPlanRules(planId);
  const count = await db.user.count({ where: { tenant_id: tenantId } });
  if (count >= rules.maxEmployees) {
    throw new Error('Plan limit exceeded: users');
  }
}
