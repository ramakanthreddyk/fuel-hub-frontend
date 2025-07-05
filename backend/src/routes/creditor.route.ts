import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { setTenantContext } from '../middlewares/setTenantContext';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createCreditorHandlers } from '../controllers/creditor.controller';

export function createCreditorRouter(db: Pool) {
  const router = Router();
  const handlers = createCreditorHandlers(db);

  router.post('/', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.create);
  router.get('/', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.list);
  router.get('/:id', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.get);
  router.put('/:id', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.update);
  router.delete('/:id', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.remove);


  return router;
}
