import { Request, Response } from 'express';
import { Pool } from 'pg';
import { getInventory, updateInventory, getAlerts } from '../services/inventory.service';
import { errorResponse } from '../utils/errorResponse';
import { successResponse } from '../utils/successResponse';
import { normalizeStationId } from '../utils/normalizeStationId';

export function createInventoryHandlers(db: Pool) {
  return {
    getInventory: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) return errorResponse(res, 400, 'Missing tenant context');
        
        const stationId = normalizeStationId(req.query.stationId as string | undefined);
        const inventory = await getInventory(db, tenantId, stationId);
        successResponse(res, inventory);
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    },

    updateInventory: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) return errorResponse(res, 400, 'Missing tenant context');
        
        const { stationId, fuelType, newStock } = req.body;
        if (!stationId || !fuelType || newStock === undefined) {
          return errorResponse(res, 400, 'stationId, fuelType, and newStock are required');
        }
        
        await updateInventory(db, tenantId, stationId, fuelType, newStock);
        successResponse(res, { status: 'success' });
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    },

    getAlerts: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) return errorResponse(res, 400, 'Missing tenant context');
        
        const stationId = normalizeStationId(req.query.stationId as string | undefined);
        const unreadOnly = req.query.unreadOnly === 'true';
        const alerts = await getAlerts(db, tenantId, stationId, unreadOnly);
        successResponse(res, alerts);
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    }
  };
}