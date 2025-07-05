import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { setTenantContext } from '../middlewares/setTenantContext';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createNozzleReadingHandlers } from '../controllers/nozzleReading.controller';

export function createNozzleReadingRouter(db: Pool) {
  const router = Router();
  const handlers = createNozzleReadingHandlers(db);

  router.post('/', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager, UserRole.Attendant]), handlers.create);
  router.get('/', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.list);
  router.get('/can-create/:nozzleId', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager, UserRole.Attendant]), handlers.canCreate);
  router.get('/:id', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.get);
  router.put('/:id', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.update);

  return router;
}
