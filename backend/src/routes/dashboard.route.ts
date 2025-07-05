import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createDashboardHandlers } from '../controllers/dashboard.controller';

export function createDashboardRouter(db: Pool) {
  const router = Router();
  const handlers = createDashboardHandlers(db);

  router.get('/sales-summary', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.getSalesSummary);
  router.get('/payment-methods', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.getPaymentMethodBreakdown);
  router.get('/fuel-breakdown', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.getFuelTypeBreakdown);
  // deprecated: use /fuel-breakdown
  router.get('/fuel-types', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.getFuelTypeBreakdown);
  router.get('/top-creditors', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.getTopCreditors);
  router.get('/station-metrics', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.getStationMetrics);
  router.get('/sales-trend', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.getDailySalesTrend);
  // deprecated: use /sales-trend
  router.get('/daily-trend', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.getDailySalesTrend);
  router.get('/system-health', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.getSystemHealth);

  return router;
}
