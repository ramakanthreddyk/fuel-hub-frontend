import prisma from '../utils/prisma';

/** Supports frontend alert deletion */
export async function deleteAlert(tenantId: string, alertId: string): Promise<boolean> {
  const result = await prisma.alert.deleteMany({
    where: { id: alertId, tenant_id: tenantId }
  });
  return result.count > 0;
}

/** Create a new alert record */
export async function createAlert(
  tenantId: string,
  stationId: string | null,
  alertType: string,
  message: string,
  severity: 'info' | 'warning' | 'critical' = 'info'
) {
  return prisma.alert.create({
    data: {
      tenant_id: tenantId,
      station_id: stationId ?? null,
      alert_type: alertType,
      message,
      severity
    }
  });
}

/** Count unread alerts grouped by severity */
export async function countBySeverity(tenantId: string) {
  const results = await prisma.alert.groupBy({
    by: ['severity'],
    where: { tenant_id: tenantId, is_read: false },
    _count: { _all: true }
  });

  return results.reduce<Record<string, number>>((acc, r) => {
    acc[r.severity] = r._count._all;
    return acc;
  }, {});
}
