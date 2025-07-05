import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { setTenantContext } from '../middlewares/setTenantContext';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createSalesHandlers } from '../controllers/sales.controller';

export function createSalesRouter(db: Pool) {
  const router = Router();
  const handlers = createSalesHandlers(db);

  router.get('/', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.list);
  router.get('/analytics', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.analytics);

  return router;
}
