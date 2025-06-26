
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
    const response = await apiClient.get('/analytics/dashboard');
    return extractApiData<SuperAdminSummary>(response);
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
      const response = await apiClient.get('/admin/users');
      return extractApiArray<AdminUser>(response, 'users');
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
