import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createAlertsHandlers } from '../controllers/alerts.controller';

export function createAlertsRouter(db: Pool) {
  const router = Router();
  const handlers = createAlertsHandlers(db);

  router.get('/', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.list);
  router.post('/', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.create);
  router.get('/summary', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.summary);
  router.patch('/:id/read', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.markRead);
  router.delete('/:id', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.delete);

  return router;
}
