import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { beforeCreateStation, beforeCreatePump, beforeCreateNozzle } from './planEnforcement';

export function checkStationLimit() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ status: 'error', message: 'Missing tenant context' });
    }
    try {
      await beforeCreateStation(prisma, tenantId);
      next();
    } catch (err: any) {
      res.status(400).json({ status: 'error', message: err.message });
    }
  };
}

export function checkPumpLimit() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.tenantId;
    const stationId = req.body.stationId;
    if (!tenantId || !stationId) {
      return res.status(400).json({ status: 'error', message: 'Missing context' });
    }
    try {
      await beforeCreatePump(prisma, tenantId, stationId);
      next();
    } catch (err: any) {
      res.status(400).json({ status: 'error', message: err.message });
    }
  };
}

export function checkNozzleLimit() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.tenantId;
    const pumpId = req.body.pumpId;
    if (!tenantId || !pumpId) {
      return res.status(400).json({ status: 'error', message: 'Missing context' });
    }
    try {
      await beforeCreateNozzle(prisma, tenantId, pumpId);
      next();
    } catch (err: any) {
      res.status(400).json({ status: 'error', message: err.message });
    }
  };
}
