
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
   * GET /admin/dashboard
   */
  async getDashboardSummary(): Promise<SuperAdminSummary> {
    return contractClient.get<SuperAdminSummary>('/admin/dashboard');
  }

  // Tenant Management
  /**
   * List all tenants
   * GET /admin/tenants
   */
  async getTenants(): Promise<Tenant[]> {
    return contractClient.getArray<Tenant>('/admin/tenants', 'tenants');
  }

  /**
   * Get tenant details
   * GET /admin/tenants/{tenantId}
   */
  async getTenant(tenantId: string): Promise<Tenant> {
    return contractClient.get<Tenant>(`/admin/tenants/${tenantId}`);
  }

  /**
   * Create new tenant
   * POST /admin/tenants
   */
  async createTenant(data: CreateTenantRequest): Promise<Tenant> {
    return contractClient.post<Tenant>('/admin/tenants', data);
  }

  /**
   * Update tenant status
   * PATCH /admin/tenants/{tenantId}/status
   */
  async updateTenantStatus(tenantId: string, status: 'active' | 'suspended' | 'cancelled'): Promise<void> {
    return contractClient.patch<void>(`/admin/tenants/${tenantId}/status`, { status });
  }

  // Plan Management
  /**
   * List all plans
   * GET /admin/plans
   */
  async getPlans(): Promise<Plan[]> {
    return contractClient.getArray<Plan>('/admin/plans', 'plans');
  }

  /**
   * Create new plan
   * POST /admin/plans
   */
  async createPlan(data: CreatePlanRequest): Promise<Plan> {
    return contractClient.post<Plan>('/admin/plans', data);
  }

  // Admin User Management
  /**
   * List admin users
   * GET /admin/users
   */
  async getAdminUsers(): Promise<AdminUser[]> {
    return contractClient.getArray<AdminUser>('/admin/users', 'users');
  }

  /**
   * Create admin user
   * POST /admin/users
   */
  async createAdminUser(data: CreateSuperAdminRequest): Promise<AdminUser> {
    return contractClient.post<AdminUser>('/admin/users', data);
  }
}

export const superAdminService = new SuperAdminService();
