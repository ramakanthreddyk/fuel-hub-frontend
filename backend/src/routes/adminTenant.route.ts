import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createAdminTenantHandlers } from '../controllers/tenant.controller';

export function createAdminTenantRouter(db: Pool) {
  const router = Router();
  const handlers = createAdminTenantHandlers(db);

  router.get('/summary', authenticateJWT, requireRole([UserRole.SuperAdmin]), handlers.summary);
  router.get('/', authenticateJWT, requireRole([UserRole.SuperAdmin]), handlers.list);
  router.post('/', authenticateJWT, requireRole([UserRole.SuperAdmin]), handlers.create);
  router.patch('/:id/status', authenticateJWT, requireRole([UserRole.SuperAdmin]), handlers.updateStatus);
  router.delete('/:id', authenticateJWT, requireRole([UserRole.SuperAdmin]), handlers.delete);

  return router;
}
