import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createAdminAnalyticsHandlers } from '../controllers/adminAnalytics.controller';

export function createAdminAnalyticsRouter(db: Pool) {
  const router = Router();
  const handlers = createAdminAnalyticsHandlers(db);

  router.get('/', authenticateJWT, requireRole([UserRole.SuperAdmin]), handlers.getAnalytics);

  return router;
}
