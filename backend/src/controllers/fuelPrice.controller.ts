import { Request, Response } from 'express';
import { Pool } from 'pg';
import prisma from '../utils/prisma';
import { validateCreateFuelPrice, parseFuelPriceQuery } from '../validators/fuelPrice.validator';
import {
  validateStationPrices,
  listStationsMissingPrices,
} from '../services/fuelPriceValidation.service';
import { errorResponse } from '../utils/errorResponse';
import { successResponse } from '../utils/successResponse';

export function createFuelPriceHandlers(db: Pool) {
  return {
    create: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
          return errorResponse(res, 400, 'Missing tenant context');
        }
        const data = validateCreateFuelPrice(req.body);
        const price = await prisma.fuelPrice.create({
          data: {
            tenant_id: tenantId,
            station_id: data.stationId,
            fuel_type: data.fuelType,
            price: data.price,
            cost_price: data.costPrice || null,
            valid_from: data.validFrom || new Date()
          },
          select: { id: true }
        });
        successResponse(res, { id: price.id }, undefined, 201);
      } catch (err: any) {
        return errorResponse(res, 400, err.message);
      }
    },
    list: async (req: Request, res: Response) => {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        return errorResponse(res, 400, 'Missing tenant context');
      }
      const query = parseFuelPriceQuery(req.query);
      const filters: any = { tenant_id: tenantId };
      if (query.stationId) filters.station_id = query.stationId;
      if (query.fuelType) filters.fuel_type = query.fuelType;
      const pricesRaw = await prisma.fuelPrice.findMany({
        where: filters,
        orderBy: { valid_from: 'desc' },
        include: { station: { select: { id: true, name: true } } }
      });
      const prices = pricesRaw.map((p: typeof pricesRaw[number]) => ({
        id: p.id,
        stationId: p.station_id,
        stationName: p.station?.name || '',
        fuelType: p.fuel_type,
        price: p.price,
        costPrice: p.cost_price,
        validFrom: p.valid_from,
        createdAt: p.created_at,
      }));
      successResponse(res, { prices });
    },

    update: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
          return errorResponse(res, 400, 'Missing tenant context');
        }
        const data = validateCreateFuelPrice(req.body);
        const updated = await prisma.fuelPrice.updateMany({
          where: { id: req.params.id, tenant_id: tenantId },
          data: {
            station_id: data.stationId,
            fuel_type: data.fuelType,
            price: data.price,
            cost_price: data.costPrice || null,
            valid_from: data.validFrom || new Date()
          }
        });
        if (!updated.count) return errorResponse(res, 404, 'Price not found');
        successResponse(res, { status: 'updated' });
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
        const deleted = await prisma.fuelPrice.deleteMany({
          where: { id: req.params.id, tenant_id: tenantId }
        });
        if (!deleted.count) return errorResponse(res, 404, 'Price not found');
        successResponse(res, { status: 'deleted' });
      } catch (err: any) {
        return errorResponse(res, 400, err.message);
      }
    },

    validate: async (req: Request, res: Response) => {
      const tenantId = req.user?.tenantId;
      const { stationId } = req.params as { stationId: string };
      if (!tenantId || !stationId) {
        return errorResponse(res, 400, 'stationId required');
      }
      const result = await validateStationPrices(db, tenantId, stationId);
      successResponse(res, { validation: result });
    },

    missing: async (req: Request, res: Response) => {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        return errorResponse(res, 400, 'Missing tenant context');
      }
      const stations = await listStationsMissingPrices(db, tenantId);
      successResponse(res, { stations });
    }
  };
}
