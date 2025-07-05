import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createAdminApiHandlers } from '../controllers/admin.controller';
import { createAdminSettingsHandlers } from '../controllers/adminSettings.controller';

export function createAdminApiRouter(db: Pool) {
  const router = Router();
  const handlers = createAdminApiHandlers(db);
  const settingsHandlers = createAdminSettingsHandlers(db);
  
  // Middleware to ensure SuperAdmin role
  const requireSuperAdmin = requireRole([UserRole.SuperAdmin]);
  
  // Dashboard
  router.get('/dashboard', authenticateJWT, requireSuperAdmin, handlers.getDashboardMetrics);
  
  // Tenant Management
  router.post('/tenants', authenticateJWT, requireSuperAdmin, handlers.createTenant);
  router.get('/tenants', authenticateJWT, requireSuperAdmin, handlers.listTenants);
  router.get('/tenants/:id', authenticateJWT, requireSuperAdmin, handlers.getTenant);
  router.patch('/tenants/:id/status', authenticateJWT, requireSuperAdmin, handlers.updateTenantStatus);
  router.delete('/tenants/:id', authenticateJWT, requireSuperAdmin, handlers.deleteTenant);
  
  // Plan Management
  router.post('/plans', authenticateJWT, requireSuperAdmin, handlers.createPlan);
  router.get('/plans', authenticateJWT, requireSuperAdmin, handlers.listPlans);
  router.get('/plans/:id', authenticateJWT, requireSuperAdmin, handlers.getPlan);
  router.put('/plans/:id', authenticateJWT, requireSuperAdmin, handlers.updatePlan);
  router.delete('/plans/:id', authenticateJWT, requireSuperAdmin, handlers.deletePlan);
  
  // Admin User Management
  router.post('/users', authenticateJWT, requireSuperAdmin, handlers.createAdminUser);
  router.get('/users', authenticateJWT, requireSuperAdmin, handlers.listAdminUsers);
  router.get('/users/:id', authenticateJWT, requireSuperAdmin, handlers.getAdminUser);
  router.put('/users/:id', authenticateJWT, requireSuperAdmin, handlers.updateAdminUser);
  router.delete('/users/:id', authenticateJWT, requireSuperAdmin, handlers.deleteAdminUser);
  router.post('/users/:id/reset-password', authenticateJWT, requireSuperAdmin, handlers.resetAdminPassword);

  // Tenant Settings
  router.get('/tenants/:tenantId/settings', authenticateJWT, requireSuperAdmin, settingsHandlers.list);
  router.get('/tenants/:tenantId/settings/:key', authenticateJWT, requireSuperAdmin, settingsHandlers.get);
  router.put('/tenants/:tenantId/settings/:key', authenticateJWT, requireSuperAdmin, settingsHandlers.update);

  return router;
}