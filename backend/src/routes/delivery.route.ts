import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createDeliveryHandlers } from '../controllers/delivery.controller';

export function createDeliveryRouter(db: Pool) {
  const router = Router();
  const handlers = createDeliveryHandlers(db);

  router.post('/', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.create);
  router.get('/', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.list);
  router.get('/inventory', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.inventory);

  return router;
}
