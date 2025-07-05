import { Request, Response } from 'express';
import { Pool } from 'pg';
import prisma from '../utils/prisma';
import { validateCreatePump, validateUpdatePump } from '../validators/pump.validator';
import { errorResponse } from '../utils/errorResponse';
import { successResponse } from '../utils/successResponse';
import { normalizeStationId } from '../utils/normalizeStationId';
import { getPumpSettings, updatePumpSettings } from '../services/pumpSettings.service';
import { createPump } from '../services/pump.service';

export function createPumpHandlers(db: Pool) {
  return {
    create: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
          return errorResponse(res, 400, 'Missing tenant context');
        }
        const data = validateCreatePump(req.body);
        const id = await createPump(
          tenantId,
          data.stationId,
          data.name,
          data.serialNumber
        );
        const record = await prisma.pump.findUnique({
          where: { id },
          include: { _count: { select: { nozzles: true } } }
        });
        if (!record) {
          return errorResponse(res, 500, 'Pump creation failed');
        }
        const pump = {
          id: record.id,
          stationId: record.station_id,
          name: record.name,
          serialNumber: record.serial_number,
          status: record.status as 'active' | 'inactive' | 'maintenance',
          createdAt: record.created_at,
          nozzleCount: record._count.nozzles
        };
        successResponse(res, { pump }, undefined, 201);
      } catch (err: any) {
        return errorResponse(res, 400, err.message);
      }
    },
    list: async (req: Request, res: Response) => {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        return errorResponse(res, 400, 'Missing tenant context');
      }
      const stationId = normalizeStationId(req.query.stationId as string | undefined);
      const pumps = await prisma.pump.findMany({
        where: {
          tenant_id: tenantId,
          ...(stationId ? { station_id: stationId } : {})
        },
        orderBy: { name: 'asc' },
        include: { _count: { select: { nozzles: true } } }
      });
      if (pumps.length === 0) {
        return successResponse(res, []);
      }
      successResponse(res, {
        pumps: pumps.map((p: typeof pumps[number]) => ({
          ...p,
            nozzleCount: p._count.nozzles
          }))
        });
    },
    get: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
          return errorResponse(res, 400, 'Missing tenant context');
        }
        const pump = await prisma.pump.findFirst({
          where: { id: req.params.id, tenant_id: tenantId }
        });
        if (!pump) {
          return errorResponse(res, 404, 'Pump not found');
        }
        successResponse(res, { pump });
      } catch (err: any) {
        return errorResponse(res, 400, err.message);
      }
    },
    remove: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
          return errorResponse(res, 400, 'Missing tenant context');
        }
        const pumpId = req.params.id;
        const nozzleCount = await prisma.nozzle.count({ where: { pump_id: pumpId, tenant_id: tenantId } });
        if (nozzleCount > 0) {
          return errorResponse(res, 400, 'Cannot delete pump with nozzles');
        }
        const deleted = await prisma.pump.deleteMany({ where: { id: pumpId, tenant_id: tenantId } });
        if (!deleted.count) return errorResponse(res, 404, 'Pump not found');
        successResponse(res, { status: 'ok' });
      } catch (err: any) {
        return errorResponse(res, 400, err.message);
      }
    },
    update: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
          return errorResponse(res, 400, 'Missing tenant context');
        }
        const { name, serialNumber } = validateUpdatePump(req.body);
        const updated = await prisma.pump.updateMany({
          where: { id: req.params.id, tenant_id: tenantId },
          data: {
            ...(name !== undefined ? { name } : {}),
            ...(serialNumber !== undefined ? { serial_number: serialNumber } : {})
          }
        });
        if (!updated.count) return errorResponse(res, 404, 'Pump not found');
        const pump = await prisma.pump.findUnique({ where: { id: req.params.id } });
        successResponse(res, { pump });
      } catch (err: any) {
        return errorResponse(res, 400, err.message);
      }
    },
    getSettings: async (req: Request, res: Response) => {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        return errorResponse(res, 400, 'Missing tenant context');
      }
      const settings = await getPumpSettings(db, req.params.id);
      successResponse(res, { settings });
    },
    updateSettings: async (req: Request, res: Response) => {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        return errorResponse(res, 400, 'Missing tenant context');
      }
      await updatePumpSettings(db, req.params.id, req.body);
      const settings = await getPumpSettings(db, req.params.id);
      successResponse(res, { settings });
    },
  };
}
