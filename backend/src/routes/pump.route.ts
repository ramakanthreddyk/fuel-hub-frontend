import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { setTenantContext } from '../middlewares/setTenantContext';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createPumpHandlers } from '../controllers/pump.controller';
import { checkPumpLimit } from '../middlewares/checkPlanLimits';

export function createPumpRouter(db: Pool) {
  const router = Router();
  const handlers = createPumpHandlers(db);

  router.post('/', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), checkPumpLimit(), handlers.create);
  router.get('/', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.list);
  router.get('/:id', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.get);
  router.put('/:id', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.update);
  router.get('/:id/settings', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.getSettings);
  router.put('/:id/settings', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.updateSettings);
  router.delete('/:id', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.remove);

  return router;
}
