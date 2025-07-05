import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createInventoryHandlers } from '../controllers/inventory.controller';

export function createInventoryRouter(db: Pool) {
  const router = Router();
  const handlers = createInventoryHandlers(db);

  router.get('/', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.getInventory);
  router.post('/update', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.updateInventory);
  router.get('/alerts', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.getAlerts);

  return router;
}