
import { apiClient, extractApiData, extractApiArray } from './client';
import type { 
  Tenant, 
  CreateTenantRequest, 
  UpdateTenantRequest,
  Plan,
  CreatePlanRequest,
  AdminUser,
  CreateSuperAdminRequest,
  SuperAdminSummary,
  SuperAdminAnalytics
} from './api-contract';

export const superAdminApi = {
  // Tenant management
  getTenants: async (): Promise<Tenant[]> => {
    const response = await apiClient.get('/admin/tenants');
    return extractApiArray<Tenant>(response, 'tenants');
  },

  getTenant: async (tenantId: string): Promise<Tenant> => {
    const response = await apiClient.get(`/admin/tenants/${tenantId}`);
    return extractApiData<Tenant>(response);
  },

  createTenant: async (data: CreateTenantRequest): Promise<Tenant> => {
    const response = await apiClient.post('/admin/tenants', data);
    return extractApiData<Tenant>(response);
  },

  updateTenant: async (tenantId: string, data: UpdateTenantRequest): Promise<Tenant> => {
    const response = await apiClient.put(`/admin/tenants/${tenantId}`, data);
    return extractApiData<Tenant>(response);
  },

  updateTenantStatus: async (tenantId: string, status: 'active' | 'suspended' | 'cancelled' | 'trial'): Promise<Tenant> => {
    const response = await apiClient.put(`/admin/tenants/${tenantId}/status`, { status });
    return extractApiData<Tenant>(response);
  },

  deleteTenant: async (tenantId: string): Promise<void> => {
    await apiClient.delete(`/admin/tenants/${tenantId}`);
  },

  // Summary for SuperAdmin dashboard
  getSummary: async (): Promise<SuperAdminSummary> => {
    const response = await apiClient.get('/admin/summary');
    const data = extractApiData<any>(response);
    
    return {
      totalTenants: data.totalTenants || 0,
      totalStations: data.totalStations || 0, // Fixed: added missing property
      activeTenants: data.activeTenants || 0,
      totalRevenue: data.totalRevenue || 0,
      monthlyGrowth: data.monthlyGrowth || 0,
      recentTenants: data.recentTenants || [],
      alerts: data.alerts || []
    };
  },

  // Analytics for SuperAdmin
  getAnalytics: async (): Promise<SuperAdminAnalytics> => {
    const response = await apiClient.get('/admin/analytics');
    return extractApiData<SuperAdminAnalytics>(response);
  },

  // Plan management
  getPlans: async (): Promise<Plan[]> => {
    const response = await apiClient.get('/admin/plans');
    return extractApiArray<Plan>(response, 'plans');
  },

  createPlan: async (data: CreatePlanRequest): Promise<Plan> => {
    const response = await apiClient.post('/admin/plans', data);
    return extractApiData<Plan>(response);
  },

  updatePlan: async (planId: string, data: Partial<CreatePlanRequest>): Promise<Plan> => {
    const response = await apiClient.put(`/admin/plans/${planId}`, data);
    return extractApiData<Plan>(response);
  },

  deletePlan: async (planId: string): Promise<void> => {
    await apiClient.delete(`/admin/plans/${planId}`);
  },

  // SuperAdmin user management
  getSuperAdminUsers: async (): Promise<AdminUser[]> => {
    const response = await apiClient.get('/admin/users');
    return extractApiArray<AdminUser>(response, 'users');
  },

  createSuperAdminUser: async (data: CreateSuperAdminRequest): Promise<AdminUser> => {
    const response = await apiClient.post('/admin/users', data);
    return extractApiData<AdminUser>(response);
  }
};
