
import { apiClient, extractApiData } from './client';
import { sanitizeUrlParam, secureLog } from '@/utils/security';
import { 
  Tenant, 
  CreateTenantRequest, 
  Plan, 
  CreatePlanRequest, 
  AdminUser, 
  CreateSuperAdminRequest, 
  SuperAdminAnalytics, 
  SuperAdminSummary 
} from './api-contract';

// Main SuperAdmin API object
export const superAdminApi = {
  // Tenant Management
  getTenants: async (): Promise<Tenant[]> => {
    try {
      const response = await apiClient.get('/superadmin/tenants');
      const data = extractApiData(response);
      return data?.tenants || [];
    } catch (error) {
      secureLog.error('Error fetching tenants:', error);
      return [];
    }
  },
  createTenant: async (data: CreateTenantRequest): Promise<Tenant> => {
    try {
      const response = await apiClient.post('/superadmin/tenants', data);
      return extractApiData(response);
    } catch (error) {
      secureLog.error('Error creating tenant:', error);
      throw error;
    }
  },
  getTenant: async (id: string): Promise<Tenant> => {
    try {
      const response = await apiClient.get(`/superadmin/tenants/${sanitizeUrlParam(id)}`);
      return extractApiData(response);
    } catch (error) {
      secureLog.error('Error fetching tenant:', error);
      throw error;
    }
  },
  updateTenant: async (id: string, data: Partial<Tenant>): Promise<Tenant> => {
    try {
      const response = await apiClient.put(`/superadmin/tenants/${sanitizeUrlParam(id)}`, data);
      return extractApiData(response);
    } catch (error) {
      secureLog.error('Error updating tenant:', error);
      throw error;
    }
  },
  updateTenantStatus: async (id: string, status: string): Promise<Tenant> => {
    try {
      const response = await apiClient.patch(`/superadmin/tenants/${sanitizeUrlParam(id)}/status`, { status });
      return extractApiData(response);
    } catch (error) {
      secureLog.error('Error updating tenant status:', error);
      throw error;
    }
  },
  deleteTenant: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/superadmin/tenants/${sanitizeUrlParam(id)}`);
    } catch (error) {
      secureLog.error('Error deleting tenant:', error);
      throw error;
    }
  },

  // Plan Management
  getPlans: async (): Promise<Plan[]> => {
    try {
      const response = await apiClient.get('/superadmin/plans');
      const data = extractApiData(response);
      return data?.plans || [];
    } catch (error) {
      secureLog.error('Error fetching plans:', error);
      return [];
    }
  },
  createPlan: async (data: CreatePlanRequest): Promise<Plan> => {
    try {
      const response = await apiClient.post('/superadmin/plans', data);
      return extractApiData(response);
    } catch (error) {
      secureLog.error('Error creating plan:', error);
      throw error;
    }
  },
  updatePlan: async (id: string, data: Partial<Plan>): Promise<Plan> => {
    try {
      const response = await apiClient.put(`/superadmin/plans/${sanitizeUrlParam(id)}`, data);
      return extractApiData(response);
    } catch (error) {
      secureLog.error('Error updating plan:', error);
      throw error;
    }
  },
  deletePlan: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/superadmin/plans/${sanitizeUrlParam(id)}`);
    } catch (error) {
      secureLog.error('Error deleting plan:', error);
      throw error;
    }
  },

  // Admin User Management
  getAdminUsers: async (): Promise<{ tenantUsers: any[], adminUsers: AdminUser[], totalUsers: number }> => {
    try {
      const response = await apiClient.get('/superadmin/users');
      return extractApiData(response) || { tenantUsers: [], adminUsers: [], totalUsers: 0 };
    } catch (error) {
      secureLog.error('Error fetching admin users:', error);
      return { tenantUsers: [], adminUsers: [], totalUsers: 0 };
    }
  },
  createAdminUser: async (data: CreateSuperAdminRequest): Promise<AdminUser> => {
    try {
      const response = await apiClient.post('/superadmin/users', data);
      return extractApiData(response);
    } catch (error) {
      secureLog.error('Error creating admin user:', error);
      throw error;
    }
  },
  updateAdminUser: async (id: string, data: Partial<AdminUser>): Promise<AdminUser> => {
    try {
      const response = await apiClient.put(`/superadmin/users/${sanitizeUrlParam(id)}`, data);
      return extractApiData(response);
    } catch (error) {
      secureLog.error('Error updating admin user:', error);
      throw error;
    }
  },
  deleteAdminUser: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/superadmin/users/${sanitizeUrlParam(id)}`);
    } catch (error) {
      secureLog.error('Error deleting admin user:', error);
      throw error;
    }
  },
  resetAdminPassword: async (id: string, passwordData: any): Promise<void> => {
    try {
      await apiClient.post(`/superadmin/users/${sanitizeUrlParam(id)}/reset-password`, passwordData);
    } catch (error) {
      secureLog.error('Error resetting admin password:', error);
      throw error;
    }
  },

  // Analytics and Summary
  getSummary: async (): Promise<SuperAdminSummary> => {
    try {
      const response = await apiClient.get('/superadmin/analytics/usage');
      const data = extractApiData<SuperAdminSummary>(response);
      return {
        totalTenants: data.totalTenants || 0,
        totalStations: data.totalStations || 0,
        activeTenants: data.activeTenants || 0,
        activeTenantCount: data.activeTenants || data.activeTenantCount || 0,
        tenantCount: data.totalTenants || data.tenantCount || 0,
        totalRevenue: data.totalRevenue || 0,
        monthlyGrowth: data.monthlyGrowth || 0,
        adminCount: data.adminCount || 0,
        planCount: data.planCount || 0,
        totalUsers: data.totalUsers || 0,
        signupsThisMonth: data.signupsThisMonth || 0,
        recentTenants: data.recentTenants || [],
        alerts: data.alerts || [],
        tenantsByPlan: data.tenantsByPlan || []
      };
    } catch (error) {
      secureLog.error('Error fetching summary:', error);
      throw error;
    }
  },
  getAnalytics: async (): Promise<any> => {
    try {
      const response = await apiClient.get('/superadmin/analytics/usage');
      const data = extractApiData<any>(response);
      return data;
    } catch (error) {
      secureLog.error('Error fetching analytics:', error);
      throw error;
    }
  }
};

// Backward compatibility exports
export const superadminApi = superAdminApi;

// Fix the export type issue
export type { SuperAdminSummary } from './api-contract';
