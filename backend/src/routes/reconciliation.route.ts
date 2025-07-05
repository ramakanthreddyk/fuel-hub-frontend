import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createReconciliationHandlers } from '../controllers/reconciliation.controller';

export function createReconciliationRouter(db: Pool) {
  const router = Router();
  const handlers = createReconciliationHandlers(db);

  router.post('/', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.create);
  router.get('/', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.list);
  router.get('/daily-summary', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.getDailySummary);
  router.get('/:stationId', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.get);
  router.post('/:id/approve', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.approve);

  return router;
}
