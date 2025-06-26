
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
      console.log('Fetching admin dashboard summary');
      const response = await apiClient.get('/admin/dashboard');
      const summaryData = extractApiData<any>(response);
      
      // Map the response to the expected SuperAdminSummary structure
      return {
        totalTenants: summaryData.totalOrganizations || 0,
        activeTenants: summaryData.activeOrganizations || 0,
        totalPlans: summaryData.totalPlans || 0,
        totalAdminUsers: summaryData.totalAdminUsers || 0,
        totalUsers: summaryData.totalUsers || 0,
        totalStations: summaryData.totalStations || 0,
        signupsThisMonth: summaryData.newOrganizationsThisMonth || 0,
        recentTenants: (summaryData.recentOrganizations || []).map((org: any) => ({
          id: org.id,
          name: org.name,
          createdAt: org.createdAt,
          status: org.status
        })),
        tenantsByPlan: (summaryData.organizationsByPlan || []).map((plan: any) => ({
          planName: plan.planName,
          count: plan.count,
          percentage: plan.percentage
        }))
      };
    } catch (error) {
      console.error('Error fetching admin dashboard:', error);
      // Log detailed error information
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
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

  // Create new organization with admin user
  createTenantWithAdmin: async (orgData: CreateTenantRequest) => {
    try {
      console.log('Creating new organization with admin user:', orgData);
      const response = await apiClient.post('/admin/organizations', orgData);
      return extractApiData(response);
    } catch (error) {
      console.error('Error creating organization with admin:', error);
      // Log detailed error information
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  },

  // Get all admin users
  getAdminUsers: async (): Promise<AdminUser[]> => {
    try {
      console.log('Fetching admin users');
      const response = await apiClient.get('/admin/users');
      return extractApiArray<AdminUser>(response, 'users');
    } catch (error) {
      console.error('Error fetching admin users:', error);
      // Log detailed error information
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      return [];
    }
  },

  // Create admin user
  createAdminUser: async (userData: { name: string; email: string; password: string }): Promise<AdminUser> => {
    try {
      console.log('Creating new admin user:', userData.email);
      const response = await apiClient.post('/admin/users', userData);
      return extractApiData<AdminUser>(response);
    } catch (error) {
      console.error('Error creating admin user:', error);
      // Log detailed error information
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  },

  // Update admin user
  updateAdminUser: async (userId: string, userData: { name?: string; email?: string }): Promise<AdminUser> => {
    try {
      console.log(`Updating admin user ${userId}:`, userData);
      const response = await apiClient.put(`/admin/users/${userId}`, userData);
      return extractApiData<AdminUser>(response);
    } catch (error) {
      console.error(`Error updating admin user ${userId}:`, error);
      // Log detailed error information
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  },

  // Reset admin user password
  resetAdminPassword: async (userId: string, newPassword: string): Promise<void> => {
    try {
      console.log(`Resetting password for admin user ${userId}`);
      await apiClient.post(`/admin/users/${userId}/reset-password`, { newPassword });
    } catch (error) {
      console.error(`Error resetting password for admin user ${userId}:`, error);
      // Log detailed error information
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  },

  // Delete admin user
  deleteAdminUser: async (userId: string): Promise<void> => {
    try {
      console.log(`Deleting admin user ${userId}`);
      await apiClient.delete(`/admin/users/${userId}`);
    } catch (error) {
      console.error(`Error deleting admin user ${userId}:`, error);
      // Log detailed error information
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  }
};
