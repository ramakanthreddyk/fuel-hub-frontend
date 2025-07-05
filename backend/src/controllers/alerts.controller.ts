import { Request, Response } from 'express';
import { Pool } from 'pg';
import { getAlerts, markAlertRead } from '../services/inventory.service';
import { deleteAlert, createAlert, countBySeverity } from '../services/alert.service';

// Controller supporting alert management endpoints used by the frontend
import { errorResponse } from '../utils/errorResponse';
import { successResponse } from '../utils/successResponse';
import { normalizeStationId } from '../utils/normalizeStationId';

export function createAlertsHandlers(db: Pool) {
  return {
    list: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) return errorResponse(res, 400, 'Missing tenant context');

        const stationId = normalizeStationId(req.query.stationId as string | undefined);
        const unreadOnly = req.query.unreadOnly === 'true';
        const alerts = await getAlerts(db, tenantId, stationId, unreadOnly);
        if (alerts.length === 0) {
          return successResponse(res, []);
        }
        successResponse(res, alerts);
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    },

    markRead: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) return errorResponse(res, 400, 'Missing tenant context');

        const { id } = req.params;
        const updated = await markAlertRead(db, tenantId, id);
        if (!updated) return errorResponse(res, 404, 'Alert not found');
        successResponse(res, { status: 'read' });
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    },

    delete: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) return errorResponse(res, 400, 'Missing tenant context');

        const deleted = await deleteAlert(tenantId, req.params.id);
        if (!deleted) return errorResponse(res, 404, 'Alert not found');
        successResponse(res, true);
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    },

    create: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) return errorResponse(res, 400, 'Missing tenant context');

        const { stationId, alertType, message, severity } = req.body;
        if (!alertType || !message) {
          return errorResponse(res, 400, 'alertType and message are required');
        }

        const alert = await createAlert(
          tenantId,
          stationId ?? null,
          alertType,
          message,
          severity
        );
        successResponse(res, alert, undefined, 201);
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    },

    summary: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) return errorResponse(res, 400, 'Missing tenant context');

        const counts = await countBySeverity(tenantId);
        successResponse(res, counts);
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    }
  };
}
