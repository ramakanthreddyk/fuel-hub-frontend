import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createTenantHandlers } from '../controllers/tenant.controller';

export function createTenantRouter(db: Pool) {
  const router = Router();
  const handlers = createTenantHandlers(db);

  router.get('/', authenticateJWT, requireRole([UserRole.SuperAdmin]), handlers.list);
  router.post('/', authenticateJWT, requireRole([UserRole.SuperAdmin]), handlers.create);

  return router;
}
