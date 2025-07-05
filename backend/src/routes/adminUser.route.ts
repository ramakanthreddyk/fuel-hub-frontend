import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createAdminUserHandlers } from '../controllers/adminUser.controller';

export function createAdminUserRouter(db: Pool) {
  const router = Router();
  const handlers = createAdminUserHandlers(db);

  router.post('/', authenticateJWT, requireRole([UserRole.SuperAdmin]), handlers.create);
  router.get('/', authenticateJWT, requireRole([UserRole.SuperAdmin]), handlers.list);

  return router;
}
