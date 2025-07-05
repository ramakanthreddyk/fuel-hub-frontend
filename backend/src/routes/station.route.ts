import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { setTenantContext } from '../middlewares/setTenantContext';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createStationHandlers } from '../controllers/station.controller';
import { checkStationLimit } from '../middlewares/checkPlanLimits';

export function createStationRouter(db: Pool) {
  const router = Router();
  const handlers = createStationHandlers(db);

  router.post('/', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), checkStationLimit(), handlers.create);
  router.get('/', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.list);
  router.get('/compare', authenticateJWT, setTenantContext, requireRole([UserRole.Owner]), handlers.compare);
  router.get('/ranking', authenticateJWT, setTenantContext, requireRole([UserRole.Owner]), handlers.ranking);
  router.get('/:stationId', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.get);
  router.get('/:stationId/metrics', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.metrics);
  router.get('/:stationId/performance', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.performance);
  router.get('/:stationId/efficiency', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.efficiency);
  router.put('/:stationId', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.update);
  router.delete('/:stationId', authenticateJWT, setTenantContext, requireRole([UserRole.Owner, UserRole.Manager]), handlers.remove);

  return router;
}