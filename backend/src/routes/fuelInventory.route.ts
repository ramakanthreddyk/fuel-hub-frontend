import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createFuelInventoryHandlers } from '../controllers/fuelInventory.controller';

export function createFuelInventoryRouter(db: Pool) {
  const router = Router();
  const handlers = createFuelInventoryHandlers(db);

  router.get('/', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager, UserRole.Attendant]), handlers.list);
  router.get('/summary', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager, UserRole.Attendant]), handlers.summary);

  return router;
}