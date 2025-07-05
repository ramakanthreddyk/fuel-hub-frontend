import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { setTenantContext } from '../middlewares/setTenantContext';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createSetupStatusHandlers } from '../controllers/setupStatus.controller';

export function createSetupStatusRouter(db: Pool) {
  const router = Router();
  const handlers = createSetupStatusHandlers(db);

  router.get('/setup-status', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.status);

  return router;
}
