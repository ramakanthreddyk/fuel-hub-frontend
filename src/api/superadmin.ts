
import { apiClient, extractApiData } from './client';
import type { 
  Tenant, 
  Plan, 
  CreateTenantRequest, 
  UpdateTenantStatusRequest,
  CreatePlanRequest,
  AdminUser,
  CreateSuperAdminRequest
} from './api-contract';

const devLog = (message: string, ...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log(`[SUPERADMIN-API] ${message}`, ...args);
  }
};

export interface SuperAdminSummary {
  totalTenants: number;
  activeTenants: number;
  totalUsers: number;
  totalStations: number;
  signupsThisMonth: number;
  recentTenants?: Array<{
    id: string;
    name: string;
    status: string;
    createdAt: string;
  }>;
  tenantsByPlan?: Array<{
    planName: string;
    count: number;
    percentage: number;
  }>;
}

export const superadminApi = {
  // Dashboard Summary
  getSummary: async (): Promise<SuperAdminSummary> => {
    devLog('Fetching superadmin dashboard summary');
    const response = await apiClient.get('/admin/dashboard');
    return extractApiData<SuperAdminSummary>(response);
  },

  // Tenant Management (using correct tenant routes)
  getTenants: async (): Promise<Tenant[]> => {
    devLog('Fetching all tenants');
    const response = await apiClient.get('/admin/tenants');
    return extractApiData<Tenant[]>(response);
  },

  createTenantWithAdmin: async (data: CreateTenantRequest): Promise<Tenant> => {
    devLog('Creating new tenant with admin:', data.name);
    const response = await apiClient.post('/admin/tenants', data);
    return extractApiData<Tenant>(response);
  },

  updateTenantStatus: async (id: string, status: 'active' | 'suspended' | 'cancelled'): Promise<void> => {
    devLog('Updating tenant status:', id, status);
    await apiClient.patch(`/admin/tenants/${id}/status`, { status });
  },

  deleteTenant: async (id: string): Promise<void> => {
    devLog('Deleting tenant:', id);
    await apiClient.delete(`/admin/tenants/${id}`);
  },

  // Plan Management
  getPlans: async (): Promise<Plan[]> => {
    devLog('Fetching all subscription plans');
    const response = await apiClient.get('/admin/plans');
    return extractApiData<Plan[]>(response);
  },

  createPlan: async (data: CreatePlanRequest): Promise<Plan> => {
    devLog('Creating new plan:', data.name);
    const response = await apiClient.post('/admin/plans', data);
    return extractApiData<Plan>(response);
  },

  updatePlan: async (id: string, data: Partial<CreatePlanRequest>): Promise<Plan> => {
    devLog('Updating plan:', id);
    const response = await apiClient.put(`/admin/plans/${id}`, data);
    return extractApiData<Plan>(response);
  },

  deletePlan: async (id: string): Promise<void> => {
    devLog('Deleting plan:', id);
    await apiClient.delete(`/admin/plans/${id}`);
  },

  // SuperAdmin User Management - using correct /admin/users routes
  getAdminUsers: async (): Promise<AdminUser[]> => {
    devLog('Fetching all admin users via /admin/users');
    const response = await apiClient.get('/admin/users');
    return extractApiData<AdminUser[]>(response);
  },

  createAdminUser: async (data: CreateSuperAdminRequest): Promise<AdminUser> => {
    devLog('Creating new admin user via /admin/users:', data.email);
    const response = await apiClient.post('/admin/users', data);
    return extractApiData<AdminUser>(response);
  },

  updateAdminUser: async (id: string, data: Partial<CreateSuperAdminRequest>): Promise<AdminUser> => {
    devLog('Updating admin user via /admin/users:', id);
    const response = await apiClient.put(`/admin/users/${id}`, data);
    return extractApiData<AdminUser>(response);
  },

  deleteAdminUser: async (id: string): Promise<void> => {
    devLog('Deleting admin user via /admin/users:', id);
    await apiClient.delete(`/admin/users/${id}`);
  },

  resetAdminPassword: async (id: string, passwordData: { password: string }): Promise<void> => {
    devLog('Resetting admin user password:', id);
    await apiClient.post(`/admin/users/${id}/reset-password`, passwordData);
  },

  // Platform Analytics
  getPlatformStats: async () => {
    devLog('Fetching platform statistics');
    const response = await apiClient.get('/admin/analytics/platform-stats');
    return extractApiData(response);
  },

  getTenantUsage: async (tenantId?: string) => {
    devLog('Fetching tenant usage analytics');
    const url = tenantId ? `/admin/analytics/tenant-usage/${tenantId}` : '/admin/analytics/tenant-usage';
    const response = await apiClient.get(url);
    return extractApiData(response);
  }
};

// Export the correct name that other files expect
export const superAdminApi = superadminApi;

export type { Tenant, Plan, CreateTenantRequest, UpdateTenantStatusRequest, CreatePlanRequest, AdminUser, CreateSuperAdminRequest };
