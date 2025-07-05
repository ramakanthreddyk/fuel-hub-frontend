import { Prisma } from '@prisma/client';
import prisma from '../utils/prisma';
import { beforeCreatePump } from '../middlewares/planEnforcement';

export async function createPump(
  tenantId: string,
  stationId: string,
  name: string,
  serialNumber?: string
): Promise<string> {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await beforeCreatePump(tx, tenantId, stationId);
    const pump = await tx.pump.create({
      data: {
        tenant_id: tenantId,
        station_id: stationId,
        name,
        serial_number: serialNumber ?? null,
      },
      select: { id: true },
    });
    return pump.id;
  });
}

export async function listPumps(
  tenantId: string,
  stationId?: string
) {
  const pumps = await prisma.pump.findMany({
    where: {
      tenant_id: tenantId,
      ...(stationId ? { station_id: stationId } : {}),
    },
    orderBy: { name: 'asc' },
    include: { _count: { select: { nozzles: true } } },
  });
  return pumps.map((p: typeof pumps[number]) => ({
    id: p.id,
    station_id: p.station_id,
    name: p.name,
    serial_number: p.serial_number,
    status: p.status,
    created_at: p.created_at,
    nozzleCount: p._count.nozzles,
  }));
}

export async function deletePump(tenantId: string, pumpId: string) {
  const nozzleCount = await prisma.nozzle.count({
    where: { pump_id: pumpId, tenant_id: tenantId },
  });
  if (nozzleCount > 0) {
    throw new Error('Cannot delete pump with nozzles');
  }
  await prisma.pump.deleteMany({ where: { id: pumpId, tenant_id: tenantId } });
}

export async function updatePump(
  tenantId: string,
  pumpId: string,
  name?: string,
  serialNumber?: string
) {
  const data: Prisma.PumpUpdateManyMutationInput = {};
  if (name !== undefined) data.name = name;
  if (serialNumber !== undefined) data.serial_number = serialNumber;
  if (Object.keys(data).length === 0) return;
  await prisma.pump.updateMany({
    where: { id: pumpId, tenant_id: tenantId },
    data,
  });
}
