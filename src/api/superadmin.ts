
import { apiClient, extractApiData, extractApiArray } from './client';
import type { 
  Plan, 
  CreateTenantRequest, 
  SuperAdminSummary,
  AdminUser,
  ApiResponse 
} from './api-contract';

export const superAdminApi = {
  // Get platform dashboard metrics
  getSummary: async (): Promise<SuperAdminSummary> => {
    try {
      const response = await apiClient.get('/admin/dashboard');
      return extractApiData<SuperAdminSummary>(response);
    } catch (error) {
      console.error('Error fetching admin dashboard:', error);
      // Return default empty data structure
      return {
        totalTenants: 0,
        activeTenants: 0,
        totalPlans: 0,
        totalAdminUsers: 0,
        totalUsers: 0,
        totalStations: 0,
        signupsThisMonth: 0,
        recentTenants: [],
        tenantsByPlan: []
      };
    }
  },

  // Get all plans
  getPlans: async (): Promise<Plan[]> => {
    try {
      const response = await apiClient.get('/admin/plans');
      return extractApiArray<Plan>(response, 'plans');
    } catch (error) {
      console.error('Error fetching plans:', error);
      return [];
    }
  },

  // Create plan
  createPlan: async (planData: Omit<Plan, 'id'>): Promise<Plan> => {
    const response = await apiClient.post('/admin/plans', planData);
    return extractApiData<Plan>(response);
  },

  // Update plan
  updatePlan: async (planId: string, planData: Partial<Plan>): Promise<Plan> => {
    const response = await apiClient.put(`/admin/plans/${planId}`, planData);
    return extractApiData<Plan>(response);
  },

  // Delete plan
  deletePlan: async (planId: string): Promise<void> => {
    await apiClient.delete(`/admin/plans/${planId}`);
  },

  // Create new tenant with admin user
  createTenantWithAdmin: async (tenantData: CreateTenantRequest) => {
    const response = await apiClient.post('/admin/tenants', tenantData);
    return extractApiData(response);
  },

  // Get all admin users
  getAdminUsers: async (): Promise<AdminUser[]> => {
    try {
      // Try different endpoints based on what might be available
      try {
        const response = await apiClient.get('/admin/users');
        return extractApiArray<AdminUser>(response, 'users');
      } catch (adminError) {
        // If 403 Forbidden, try the superadmin users endpoint
        if (adminError.response?.status === 403) {
          console.log('Falling back to /superadmin/users endpoint due to 403 error');
          const fallbackResponse = await apiClient.get('/superadmin/users');
          return extractApiArray<AdminUser>(fallbackResponse, 'users');
        }
        throw adminError; // Re-throw if it's not a 403 error
      }
    } catch (error) {
      console.error('Error fetching admin users:', error);
      return [];
    }
  },

  // Create admin user
  createAdminUser: async (userData: { name: string; email: string; password: string }): Promise<AdminUser> => {
    const response = await apiClient.post('/admin/users', userData);
    return extractApiData<AdminUser>(response);
  },

  // Update admin user
  updateAdminUser: async (userId: string, userData: { name?: string; email?: string }): Promise<AdminUser> => {
    const response = await apiClient.put(`/admin/users/${userId}`, userData);
    return extractApiData<AdminUser>(response);
  },

  // Reset admin user password
  resetAdminPassword: async (userId: string, newPassword: string): Promise<void> => {
    await apiClient.post(`/admin/users/${userId}/reset-password`, { newPassword });
  },

  // Delete admin user
  deleteAdminUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/admin/users/${userId}`);
  }
};
