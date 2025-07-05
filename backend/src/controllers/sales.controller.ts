import { Request, Response } from 'express';
import { Pool } from 'pg';
import { parseSalesQuery } from '../validators/sales.validator';
import { listSales, salesAnalytics } from '../services/sales.service';
import { errorResponse } from '../utils/errorResponse';
import { successResponse } from '../utils/successResponse';
import { normalizeStationId } from '../utils/normalizeStationId';

export function createSalesHandlers(db: Pool) {
  return {
    list: async (req: Request, res: Response) => {
      try {
        const user = req.user;
        if (!user?.tenantId) {
          return errorResponse(res, 400, 'Missing tenant context');
        }
        const query = parseSalesQuery(req.query);
        if (query.stationId) {
          const access = await db.query(
            `SELECT 1 FROM public.user_stations WHERE user_id = $1 AND station_id = $2 AND tenant_id = $3`,
            [user.userId, query.stationId, user.tenantId]
          );
          if (!access.rowCount) {
            return errorResponse(res, 403, 'Station access denied');
          }
        }
        const sales = await listSales(db, user.tenantId, query);
        if (sales.length === 0) {
          return successResponse(res, []);
        }
        successResponse(res, { sales });
      } catch (err: any) {
        return errorResponse(res, 400, err.message);
      }
    },

    analytics: async (req: Request, res: Response) => {
      try {
        const user = req.user;
        if (!user?.tenantId) {
          return errorResponse(res, 400, 'Missing tenant context');
        }
        const stationId = normalizeStationId(req.query.stationId as string | undefined);
        const groupBy = (req.query.groupBy as string) || 'station';
        if (stationId) {
          const access = await db.query(
            `SELECT 1 FROM public.user_stations WHERE user_id = $1 AND station_id = $2 AND tenant_id = $3`,
            [user.userId, stationId, user.tenantId]
          );
          if (!access.rowCount) {
            return errorResponse(res, 403, 'Station access denied');
          }
        }
        const data = await salesAnalytics(db, user.tenantId, stationId, groupBy);
        successResponse(res, { analytics: data });
      } catch (err: any) {
        return errorResponse(res, 400, err.message);
      }
    }
  };
}
