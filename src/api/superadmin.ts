
import { apiClient, extractApiData, extractApiArray } from './client';
import type { 
  Plan, 
  CreateTenantRequest, 
  SuperAdminSummary,
  AdminUser,
  ApiResponse,
  CreateSuperAdminRequest
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
        totalTenants: summaryData.tenantCount || 0,
        activeTenants: summaryData.activeTenantCount || 0,
        totalPlans: summaryData.planCount || 0,
        totalAdminUsers: summaryData.adminCount || 0,
        totalUsers: summaryData.totalUsers || 0,
        totalStations: summaryData.totalStations || 0,
        signupsThisMonth: summaryData.newTenantsThisMonth || 0,
        recentTenants: (summaryData.recentTenants || []).map((tenant: any) => ({
          id: tenant.id,
          name: tenant.name,
          createdAt: tenant.createdAt,
          status: tenant.status
        })),
        tenantsByPlan: (summaryData.tenantsByPlan || []).map((plan: any) => ({
          planName: plan.planName,
          count: plan.count,
          percentage: plan.percentage
        }))
      };
    } catch (error) {
      console.error('Error fetching admin dashboard:', error);
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  },

  // Get all subscription plans
  getPlans: async (): Promise<Plan[]> => {
    try {
      console.log('Fetching subscription plans');
      const response = await apiClient.get('/admin/plans');
      return extractApiArray<Plan>(response, 'plans');
    } catch (error) {
      console.error('Error fetching plans:', error);
      return [];
    }
  },

  // Create new subscription plan
  createPlan: async (planData: Omit<Plan, 'id'>): Promise<Plan> => {
    try {
      console.log('Creating new plan:', planData);
      const response = await apiClient.post('/admin/plans', planData);
      return extractApiData<Plan>(response);
    } catch (error) {
      console.error('Error creating plan:', error);
      throw error;
    }
  },

  // Update subscription plan
  updatePlan: async (planId: string, planData: Partial<Plan>): Promise<Plan> => {
    try {
      console.log(`Updating plan ${planId}:`, planData);
      const response = await apiClient.put(`/admin/plans/${planId}`, planData);
      return extractApiData<Plan>(response);
    } catch (error) {
      console.error(`Error updating plan ${planId}:`, error);
      throw error;
    }
  },

  // Delete subscription plan
  deletePlan: async (planId: string): Promise<void> => {
    try {
      console.log(`Deleting plan ${planId}`);
      await apiClient.delete(`/admin/plans/${planId}`);
    } catch (error) {
      console.error(`Error deleting plan ${planId}:`, error);
      throw error;
    }
  },

  // Create new tenant with admin user (SuperAdmin route)
  createTenantWithAdmin: async (tenantData: CreateTenantRequest): Promise<any> => {
    try {
      console.log('Creating tenant with admin user:', tenantData);
      const response = await apiClient.post('/admin/tenants', tenantData);
      return extractApiData<any>(response);
    } catch (error) {
      console.error('Error creating tenant with admin:', error);
      throw error;
    }
  },

  // Get admin users (SuperAdmin only) - Updated to use correct endpoint
  getAdminUsers: async (): Promise<AdminUser[]> => {
    try {
      console.log('Fetching admin users via SuperAdmin endpoint /admin/users');
      const response = await apiClient.get('/admin/users');
      return extractApiArray<AdminUser>(response, 'users');
    } catch (error) {
      console.error('Error fetching admin users:', error);
      return [];
    }
  },

  // Create admin user (SuperAdmin only)
  createAdminUser: async (userData: CreateSuperAdminRequest): Promise<AdminUser> => {
    try {
      console.log('Creating admin user via SuperAdmin endpoint:', userData);
      const response = await apiClient.post('/admin/users', userData);
      return extractApiData<AdminUser>(response);
    } catch (error) {
      console.error('Error creating admin user:', error);
      throw error;
    }
  },

  // Update admin user (SuperAdmin only)
  updateAdminUser: async (userId: string, userData: any): Promise<AdminUser> => {
    try {
      console.log(`Updating admin user ${userId} via SuperAdmin endpoint:`, userData);
      const response = await apiClient.put(`/admin/users/${userId}`, userData);
      return extractApiData<AdminUser>(response);
    } catch (error) {
      console.error(`Error updating admin user ${userId}:`, error);
      throw error;
    }
  },

  // Delete admin user (SuperAdmin only)
  deleteAdminUser: async (userId: string): Promise<void> => {
    try {
      console.log(`Deleting admin user ${userId} via SuperAdmin endpoint`);
      await apiClient.delete(`/admin/users/${userId}`);
    } catch (error) {
      console.error(`Error deleting admin user ${userId}:`, error);
      throw error;
    }
  },

  // Reset admin user password (SuperAdmin only)
  resetAdminPassword: async (userId: string, passwordData: any): Promise<void> => {
    try {
      console.log(`Resetting password for admin user ${userId} via SuperAdmin endpoint`);
      await apiClient.post(`/admin/users/${userId}/reset-password`, passwordData);
    } catch (error) {
      console.error(`Error resetting password for admin user ${userId}:`, error);
      throw error;
    }
  },
};
