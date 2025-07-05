import { Request, Response } from 'express';
import { Pool } from 'pg';
import { createFuelDelivery, listFuelDeliveries } from '../services/delivery.service';
import { validateCreateDelivery, parseDeliveryQuery } from '../validators/delivery.validator';
import { errorResponse } from '../utils/errorResponse';
import { successResponse } from '../utils/successResponse';

export function createDeliveryHandlers(db: Pool) {
  return {
    create: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
          return errorResponse(res, 400, 'Missing tenant context');
        }
        const data = validateCreateDelivery(req.body);
        const id = await createFuelDelivery(db, tenantId, data);
        successResponse(res, { id }, undefined, 201);
      } catch (err: any) {
        return errorResponse(res, 400, err.message);
      }
    },
    list: async (req: Request, res: Response) => {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        return errorResponse(res, 400, 'Missing tenant context');
      }
      const query = parseDeliveryQuery(req.query);
      const deliveries = await listFuelDeliveries(db, tenantId, query);
      if (deliveries.length === 0) {
        return successResponse(res, []);
      }
      successResponse(res, { deliveries });
    },
    inventory: async (req: Request, res: Response) => {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        return errorResponse(res, 400, 'Missing tenant context');
      }
      try {
        const { stationId, fuelType } = req.query;
        const client = await db.connect();
        let query = 'SELECT station_id, fuel_type, current_volume, updated_at FROM public.fuel_inventory WHERE tenant_id = $1';
        const params: any[] = [tenantId];
        let idx = 2;

        if (stationId) {
          params.push(stationId);
          query += ` AND station_id = $${idx++}`;
        }
        if (fuelType) {
          params.push(fuelType);
          query += ` AND fuel_type = $${idx++}`;
        }

        const { rows } = await client.query(query, params);
        client.release();
        successResponse(res, { inventory: rows });
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    },
  };
}
