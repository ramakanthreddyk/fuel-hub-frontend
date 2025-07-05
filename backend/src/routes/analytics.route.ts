import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createAnalyticsHandlers } from '../controllers/analytics.controller';

export function createAnalyticsRouter() {
  const router = Router();
  const handlers = createAnalyticsHandlers();
  
  // Middleware to ensure SuperAdmin role
  const requireSuperAdmin = requireRole([UserRole.SuperAdmin]);
  
  // Dashboard metrics
  router.get(
    '/dashboard',
    authenticateJWT,
    requireRole([UserRole.Owner, UserRole.Manager]),
    handlers.tenantDashboard
  );
  router.get('/superadmin', authenticateJWT, requireSuperAdmin, handlers.getDashboardMetrics);
  
  // Tenant analytics
  router.get('/tenant/:id', authenticateJWT, requireSuperAdmin, handlers.getTenantAnalytics);

  // Station comparison for owners
  router.get('/station-comparison', authenticateJWT, requireRole([UserRole.Owner]), handlers.stationComparison);

  router.get('/hourly-sales', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.hourlySales);
  router.get('/peak-hours', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.peakHours);
  router.get('/fuel-performance', authenticateJWT, requireRole([UserRole.Owner, UserRole.Manager]), handlers.fuelPerformance);
  
  return router;
}