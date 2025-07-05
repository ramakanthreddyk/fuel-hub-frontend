import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createReportsHandlers } from '../controllers/reports.controller';

export function createReportsRouter(db: Pool) {
  const router = Router();
  const handlers = createReportsHandlers(db);

  router.get('/sales/export', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.exportSales);
  router.get('/sales', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.getSales);
  router.post('/sales', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.exportSalesPost);
  router.post('/export', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.exportGeneric);
  router.post('/schedule', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.scheduleReport);
  router.get('/financial/export', authenticateJWT, requireRole([UserRole.Owner]), handlers.exportFinancial);

  return router;
}