import { Pool } from 'pg';
import { randomUUID } from 'crypto';
import prisma from '../utils/prisma';
import { beforeCreateNozzle } from '../middlewares/planEnforcement';
import { parseRows } from '../utils/parseDb';

export async function createNozzle(
  _db: Pool,
  tenantId: string,
  pumpId: string,
  nozzleNumber: number,
  fuelType: string
): Promise<string> {
  return prisma.$transaction(async tx => {
    await beforeCreateNozzle(tx, tenantId, pumpId);
    const nozzle = await tx.nozzle.create({
      data: {
        id: randomUUID(),
        tenant_id: tenantId,
        pump_id: pumpId,
        nozzle_number: nozzleNumber,
        fuel_type: fuelType,
      },
      select: { id: true },
    });
    return nozzle.id;
  });
}

export async function updateNozzle(
  _db: Pool,
  tenantId: string,
  nozzleId: string,
  fuelType?: string,
  status?: string
): Promise<void> {
  const data: any = {};
  if (fuelType !== undefined) data.fuel_type = fuelType;
  if (status !== undefined) data.status = status;
  if (Object.keys(data).length === 0) return;
  await prisma.nozzle.updateMany({
    where: { id: nozzleId, tenant_id: tenantId },
    data,
  });
}

export async function listNozzles(
  _db: Pool,
  tenantId: string,
  pumpId?: string
) {
  const nozzles = await prisma.nozzle.findMany({
    where: {
      tenant_id: tenantId,
      ...(pumpId ? { pump_id: pumpId } : {}),
    },
    orderBy: { nozzle_number: 'asc' },
  });
  return parseRows(nozzles as any);
}

export async function deleteNozzle(
  _db: Pool,
  tenantId: string,
  nozzleId: string
) {
  const count = await prisma.sale.count({
    where: { nozzle_id: nozzleId, tenant_id: tenantId },
  });
  if (count > 0) {
    throw new Error('Cannot delete nozzle with sales history');
  }
  await prisma.nozzle.deleteMany({ where: { id: nozzleId, tenant_id: tenantId } });
}
