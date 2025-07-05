import { Request, Response } from 'express';
import { Pool } from 'pg';
import { getTenantSettings, upsertTenantSettings } from '../services/settings.service';
import { getAllSettings, updateSetting } from '../services/settingsService';
import { validateUpdateSettings } from '../validators/settings.validator';
import { errorResponse } from '../utils/errorResponse';
import { successResponse } from '../utils/successResponse';

export function createSettingsHandlers(db: Pool) {
  return {
    get: async (req: Request, res: Response) => {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        return errorResponse(res, 400, 'Missing tenant context');
      }
      const base = await getTenantSettings(db, tenantId);
      const list = await getAllSettings(db, tenantId);
      const flags: Record<string, string> = {};
      for (const row of list) {
        flags[row.key] = row.value;
      }
      successResponse(res, { settings: base, flags });
    },
    update: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
          return errorResponse(res, 400, 'Missing tenant context');
        }
        if (req.body && req.body.key) {
          const { key, value } = req.body;
          if (typeof key !== 'string' || typeof value !== 'string') {
            return errorResponse(res, 400, 'key and value required');
          }
          await updateSetting(db, tenantId, key, value);
        } else {
          const input = validateUpdateSettings(req.body);
          await upsertTenantSettings(db, tenantId, input);
        }
        successResponse(res, { status: 'ok' });
      } catch (err: any) {
        return errorResponse(res, 400, err.message);
      }
    },
  };
}
