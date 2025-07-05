import { Request, Response } from 'express';
import { Pool } from 'pg';
import { errorResponse } from '../utils/errorResponse';
import { successResponse } from '../utils/successResponse';
import { getAllSettings, getSetting, updateSetting } from '../services/settingsService';

export function createAdminSettingsHandlers(db: Pool) {
  return {
    list: async (req: Request, res: Response) => {
      const tenantId = req.params.tenantId;
      const { rows } = await db.query('SELECT id FROM public.tenants WHERE id = $1', [tenantId]);
      if (rows.length === 0) {
        return errorResponse(res, 404, 'Tenant not found');
      }
      const settings = await getAllSettings(db, tenantId);
      return successResponse(res, { settings });
    },
    get: async (req: Request, res: Response) => {
      const tenantId = req.params.tenantId;
      const key = req.params.key;
      const { rows } = await db.query('SELECT id FROM public.tenants WHERE id = $1', [tenantId]);
      if (rows.length === 0) {
        return errorResponse(res, 404, 'Tenant not found');
      }
      const setting = await getSetting(db, tenantId, key);
      if (!setting) {
        return errorResponse(res, 404, 'Setting not found');
      }
      return successResponse(res, { setting });
    },
    update: async (req: Request, res: Response) => {
      const tenantId = req.params.tenantId;
      const key = req.params.key;
      const value = req.body?.value;
      if (typeof value !== 'string') {
        return errorResponse(res, 400, 'Invalid value');
      }
      const { rows } = await db.query('SELECT id FROM public.tenants WHERE id = $1', [tenantId]);
      if (rows.length === 0) {
        return errorResponse(res, 404, 'Tenant not found');
      }
      await updateSetting(db, tenantId, key, value);
      return successResponse(res, { status: 'updated' });
    }
  };
}
