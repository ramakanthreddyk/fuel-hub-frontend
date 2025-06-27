
import { apiClient, extractApiData } from './client';
import type { 
  Organization, 
  Plan, 
  CreateOrganizationRequest, 
  UpdateOrganizationStatusRequest,
  CreatePlanRequest,
  SuperAdminUser,
  CreateSuperAdminRequest
} from './api-contract';

const devLog = (message: string, ...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log(`[SUPERADMIN-API] ${message}`, ...args);
  }
};

export const superadminApi = {
  // Organization Management
  getOrganizations: async (): Promise<Organization[]> => {
    devLog('Fetching all organizations');
    const response = await apiClient.get('/admin/organizations');
    return extractApiData<Organization[]>(response);
  },

  createOrganization: async (data: CreateOrganizationRequest): Promise<Organization> => {
    devLog('Creating new organization:', data.name);
    const response = await apiClient.post('/admin/organizations', data);
    return extractApiData<Organization>(response);
  },

  updateOrganizationStatus: async (id: string, data: UpdateOrganizationStatusRequest): Promise<void> => {
    devLog('Updating organization status:', id, data.status);
    await apiClient.put(`/admin/organizations/${id}/status`, data);
  },

  deleteOrganization: async (id: string): Promise<void> => {
    devLog('Deleting organization:', id);
    await apiClient.delete(`/admin/organizations/${id}`);
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
  getAdminUsers: async (): Promise<SuperAdminUser[]> => {
    devLog('Fetching all admin users via /admin/users');
    const response = await apiClient.get('/admin/users');
    return extractApiData<SuperAdminUser[]>(response);
  },

  createAdminUser: async (data: CreateSuperAdminRequest): Promise<SuperAdminUser> => {
    devLog('Creating new admin user via /admin/users:', data.email);
    const response = await apiClient.post('/admin/users', data);
    return extractApiData<SuperAdminUser>(response);
  },

  updateAdminUser: async (id: string, data: Partial<CreateSuperAdminRequest>): Promise<SuperAdminUser> => {
    devLog('Updating admin user via /admin/users:', id);
    const response = await apiClient.put(`/admin/users/${id}`, data);
    return extractApiData<SuperAdminUser>(response);
  },

  deleteAdminUser: async (id: string): Promise<void> => {
    devLog('Deleting admin user via /admin/users:', id);
    await apiClient.delete(`/admin/users/${id}`);
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

export type { Organization, Plan, CreateOrganizationRequest, UpdateOrganizationStatusRequest, CreatePlanRequest, SuperAdminUser, CreateSuperAdminRequest };
