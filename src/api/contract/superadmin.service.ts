
/**
 * SuperAdmin Service - Contract Aligned
 * 
 * Implements SuperAdmin endpoints exactly as defined in OpenAPI spec
 */

import { contractClient } from '../contract-client';
import type { 
  Tenant,
  CreateTenantRequest,
  Plan,
  CreatePlanRequest,
  AdminUser,
  CreateSuperAdminRequest,
  SuperAdminSummary
} from '../api-contract';

export class SuperAdminService {
  /**
   * Get dashboard summary
   * GET /superadmin/analytics/usage
   */
  async getDashboardSummary(): Promise<SuperAdminSummary> {
    return contractClient.get<SuperAdminSummary>('/superadmin/analytics/usage');
  }

  // Tenant Management
  /**
   * List all tenants
   * GET /superadmin/tenants
   */
  async getTenants(): Promise<Tenant[]> {
    return contractClient.getArray<Tenant>('/superadmin/tenants', 'tenants');
  }

  /**
   * Get tenant details
   * GET /superadmin/tenants/{tenantId}
   */
  async getTenant(tenantId: string): Promise<Tenant> {
    return contractClient.get<Tenant>(`/superadmin/tenants/${tenantId}`);
  }

  /**
   * Create new tenant
   * POST /superadmin/tenants
   */
  async createTenant(data: CreateTenantRequest): Promise<Tenant> {
    return contractClient.post<Tenant>('/superadmin/tenants', data);
  }

  /**
   * Update tenant status
   * PATCH /superadmin/tenants/{tenantId}/status
   */
  async updateTenantStatus(tenantId: string, status: 'active' | 'suspended' | 'cancelled'): Promise<void> {
    return contractClient.patch<void>(`/superadmin/tenants/${tenantId}/status`, { status });
  }

  // Plan Management
  /**
   * List all plans
   * GET /superadmin/plans
   */
  async getPlans(): Promise<Plan[]> {
    return contractClient.getArray<Plan>('/superadmin/plans', 'plans');
  }

  /**
   * Create new plan
   * POST /superadmin/plans
   */
  async createPlan(data: CreatePlanRequest): Promise<Plan> {
    return contractClient.post<Plan>('/superadmin/plans', data);
  }

  // Admin User Management
  /**
   * List admin users
   * GET /superadmin/users
   */
  async getAdminUsers(): Promise<AdminUser[]> {
    return contractClient.getArray<AdminUser>('/superadmin/users', 'users');
  }

  /**
   * Create admin user
   * POST /superadmin/users
   */
  async createAdminUser(data: CreateSuperAdminRequest): Promise<AdminUser> {
    return contractClient.post<AdminUser>('/superadmin/users', data);
  }
}

export const superAdminService = new SuperAdminService();
