import { Request, Response } from 'express';
import { Pool } from 'pg';
import { getSetupStatus } from '../services/setupStatus.service';
import { errorResponse } from '../utils/errorResponse';
import { successResponse } from '../utils/successResponse';

export function createSetupStatusHandlers(db: Pool) {
  return {
    status: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
          return errorResponse(res, 400, 'Missing tenant context');
        }
        const result = await getSetupStatus(db, tenantId);
        return successResponse(res, result);
      } catch (err: any) {
        return errorResponse(res, 400, err.message);
      }
    }
  };
}
