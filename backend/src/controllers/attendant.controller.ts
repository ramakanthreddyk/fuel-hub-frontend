import { Request, Response } from 'express';
import { Pool } from 'pg';
import {
  listUserStations,
  listUserPumps,
  listUserNozzles,
  listUserCreditors,
  createCashReport,
  listCashReports,
  listAlerts,
  acknowledgeAlert,
} from '../services/attendant.service';
import { successResponse } from '../utils/successResponse';
import { errorResponse } from '../utils/errorResponse';
import { normalizeStationId } from '../utils/normalizeStationId';

export function createAttendantHandlers(db: Pool) {
  return {
    stations: async (req: Request, res: Response) => {
      const user = req.user;
      if (!user?.tenantId || !user.userId) {
        return errorResponse(res, 400, 'Missing tenant context');
      }
      const stations = await listUserStations(db, user.tenantId, user.userId);
      successResponse(res, { stations });
    },
    pumps: async (req: Request, res: Response) => {
      const user = req.user;
      const stationId = normalizeStationId(req.query.stationId as string | undefined);
      if (!user?.tenantId || !user.userId || !stationId) {
        return errorResponse(res, 400, 'stationId required');
      }
      const pumps = await listUserPumps(db, user.tenantId, user.userId, stationId);
      successResponse(res, { pumps });
    },
    nozzles: async (req: Request, res: Response) => {
      const user = req.user;
      const pumpId = req.query.pumpId as string;
      if (!user?.tenantId || !user.userId || !pumpId) {
        return errorResponse(res, 400, 'pumpId required');
      }
      const nozzles = await listUserNozzles(db, user.tenantId, user.userId, pumpId);
      successResponse(res, { nozzles });
    },
    creditors: async (req: Request, res: Response) => {
      const user = req.user;
      if (!user?.tenantId) {
        return errorResponse(res, 400, 'Missing tenant context');
      }
      const creditors = await listUserCreditors(db, user.tenantId);
      successResponse(res, { creditors });
    },
    cashReport: async (req: Request, res: Response) => {
      try {
        const user = req.user;
        const { stationId, date, cashAmount, creditEntries } = req.body || {};
        if (!user?.tenantId || !user.userId || !stationId || !date) {
          return errorResponse(res, 400, 'stationId and date required');
        }
        const dt = new Date(date);
        if (isNaN(dt.getTime())) {
          return errorResponse(res, 400, 'Invalid date');
        }
        const id = await createCashReport(
          db,
          user.tenantId,
          user.userId,
          stationId,
          dt,
          Number(cashAmount || 0),
          Array.isArray(creditEntries) ? creditEntries : []
        );
        successResponse(res, { id }, undefined, 201);
      } catch (err: any) {
        return errorResponse(res, 400, err.message);
      }
    },
    cashReports: async (req: Request, res: Response) => {
      const user = req.user;
      if (!user?.tenantId || !user.userId) {
        return errorResponse(res, 400, 'Missing tenant context');
      }
      const reports = await listCashReports(db, user.tenantId, user.userId);
      successResponse(res, { reports });
    },
    alerts: async (req: Request, res: Response) => {
      const user = req.user;
      if (!user?.tenantId) {
        return errorResponse(res, 400, 'Missing tenant context');
      }
      const stationId = normalizeStationId(req.query.stationId as string | undefined);
      const unreadOnly = req.query.unreadOnly === 'true';
      const alerts = await listAlerts(db, user.tenantId, stationId, unreadOnly);
      successResponse(res, { alerts });
    },
    acknowledgeAlert: async (req: Request, res: Response) => {
      const user = req.user;
      if (!user?.tenantId) {
        return errorResponse(res, 400, 'Missing tenant context');
      }
      const { id } = req.params;
      const ok = await acknowledgeAlert(db, user.tenantId, id);
      if (!ok) return errorResponse(res, 404, 'Alert not found');
      successResponse(res, { status: 'acknowledged' });
    },
  };
}
