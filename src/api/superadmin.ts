import { apiClient, extractApiData, extractApiArray } from './client';
import type { 
  Tenant, 
  Plan, 
  CreateTenantRequest, 
  UpdateTenantStatusRequest,
  CreatePlanRequest,
  AdminUser,
  CreateSuperAdminRequest,
  SuperAdminSummary
} from './api-contract';

const devLog = (message: string, ...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log(`[SUPERADMIN-API] ${message}`, ...args);
  }
};

export const superadminApi = {
  // Dashboard Summary
  getSummary: async (): Promise<SuperAdminSummary> => {
    devLog('Fetching superadmin dashboard summary');
    const response = await apiClient.get('/admin/dashboard');
    const rawData = extractApiData<any>(response);
    
    // Map the actual backend response to our expected format
    return {
      tenantCount: rawData.tenantCount || 0,
      activeTenantCount: rawData.activeTenantCount || 0,
      planCount: rawData.planCount || 0,
      adminCount: rawData.adminCount || 0,
      totalUsers: rawData.totalUsers || 0,
      totalStations: rawData.totalStations || 0,
      signupsThisMonth: rawData.signupsThisMonth || 0,
      recentTenants: rawData.recentTenants || [],
      tenantsByPlan: rawData.tenantsByPlan || []
    };
  },

  // Tenant Management
  getTenants: async (): Promise<Tenant[]> => {
    devLog('Fetching all tenants');
    const response = await apiClient.get('/admin/tenants');
    return extractApiArray<Tenant>(response, 'tenants');
  },

  createTenant: async (data: CreateTenantRequest): Promise<Tenant> => {
    devLog('Creating new tenant:', data.name);
    const response = await apiClient.post('/admin/tenants', data);
    return extractApiData<Tenant>(response);
  },

  getTenant: async (id: string): Promise<Tenant> => {
    devLog('Fetching tenant details:', id);
    const response = await apiClient.get(`/admin/tenants/${id}`);
    return extractApiData<Tenant>(response);
  },

  updateTenantStatus: async (id: string, statusData: UpdateTenantStatusRequest): Promise<void> => {
    devLog('Updating tenant status:', id, statusData.status);
    await apiClient.patch(`/admin/tenants/${id}/status`, statusData);
  },

  deleteTenant: async (id: string): Promise<void> => {
    devLog('Deleting tenant:', id);
    await apiClient.delete(`/admin/tenants/${id}`);
  },

  // Plan Management
  getPlans: async (): Promise<Plan[]> => {
    devLog('Fetching all subscription plans');
    try {
      const response = await apiClient.get('/admin/plans');
      console.log('Plans API response:', response.data);
      
      // Handle different response structures
      let plans;
      if (response.data && Array.isArray(response.data.plans)) {
        plans = response.data.plans;
      } else if (response.data && Array.isArray(response.data.data)) {
        plans = response.data.data;
      } else if (Array.isArray(response.data)) {
        plans = response.data;
      } else {
        devLog('Unexpected plans response structure:', response.data);
        return [];
      }
      
      // Ensure each plan has features array and normalize data
      const normalizedPlans = plans.map((plan: any) => ({
        ...plan,
        features: Array.isArray(plan.features) ? plan.features : []
      }));
      
      devLog('Normalized plans:', normalizedPlans);
      return normalizedPlans;
    } catch (error) {
      devLog('Error fetching plans:', error);
      return []; // Return empty array on error
    }
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

  // SuperAdmin User Management
  getAdminUsers: async (): Promise<AdminUser[]> => {
    devLog('Fetching all admin users');
    const response = await apiClient.get('/admin/users');
    return extractApiArray<AdminUser>(response, 'users');
  },

  createAdminUser: async (data: CreateSuperAdminRequest): Promise<AdminUser> => {
    devLog('Creating new admin user:', data.email);
    const response = await apiClient.post('/admin/users', data);
    return extractApiData<AdminUser>(response);
  },

  updateAdminUser: async (id: string, data: Partial<CreateSuperAdminRequest>): Promise<AdminUser> => {
    devLog('Updating admin user:', id);
    const response = await apiClient.put(`/admin/users/${id}`, data);
    return extractApiData<AdminUser>(response);
  },

  deleteAdminUser: async (id: string): Promise<void> => {
    devLog('Deleting admin user:', id);
    await apiClient.delete(`/admin/users/${id}`);
  },

  resetAdminPassword: async (id: string, passwordData: { password: string }): Promise<void> => {
    devLog('Resetting admin user password:', id);
    await apiClient.post(`/admin/users/${id}/reset-password`, passwordData);
  }
};

// Export with both names for compatibility
export const superAdminApi = superadminApi;

// Export types that are used in components
export type { 
  Tenant, 
  Plan, 
  CreateTenantRequest, 
  UpdateTenantStatusRequest, 
  CreatePlanRequest, 
  AdminUser, 
  CreateSuperAdminRequest,
  SuperAdminSummary
};
