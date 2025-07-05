import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createFuelPriceHandlers } from '../controllers/fuelPrice.controller';

export function createFuelPriceRouter(db: Pool) {
  const router = Router();
  const handlers = createFuelPriceHandlers(db);

  router.post('/', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.create);
  router.get('/', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.list);
  router.get('/validate/:stationId', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.validate);
  router.get('/missing', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.missing);
  router.put('/:id', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.update);
  router.delete('/:id', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.remove);

  return router;
}
