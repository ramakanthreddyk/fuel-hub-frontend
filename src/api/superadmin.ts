
import { apiClient } from './client';

export interface SuperAdminSummary {
  totalTenants: number;
  activeTenants: number;
  totalPlans: number;
  totalAdminUsers: number;
  totalUsers: number;
  totalStations: number;
  signupsThisMonth: number;
  recentTenants: Array<{
    id: string;
    name: string;
    createdAt: string;
    status: "active" | "suspended" | "cancelled";
  }>;
  tenantsByPlan: Array<{
    planName: string;
    count: number;
    percentage: number;
  }>;
}

export interface Plan {
  id: string;
  name: string;
  maxStations: number;
  maxPumpsPerStation: number;
  maxNozzlesPerPump: number;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
}

export interface CreateTenantRequest {
  name: string;
  planId: string;
  schemaName?: string;
  adminEmail?: string;
  adminPassword?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin';
  createdAt: string;
  lastLogin?: string;
}

export const superAdminApi = {
  // Get platform dashboard metrics
  getSummary: async (): Promise<SuperAdminSummary> => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },

  // Get all plans
  getPlans: async (): Promise<Plan[]> => {
    const response = await apiClient.get('/admin/plans');
    return response.data;
  },

  // Create plan
  createPlan: async (planData: Omit<Plan, 'id'>): Promise<Plan> => {
    const response = await apiClient.post('/admin/plans', planData);
    return response.data;
  },

  // Update plan
  updatePlan: async (planId: string, planData: Partial<Plan>): Promise<Plan> => {
    const response = await apiClient.put(`/admin/plans/${planId}`, planData);
    return response.data;
  },

  // Delete plan
  deletePlan: async (planId: string): Promise<void> => {
    await apiClient.delete(`/admin/plans/${planId}`);
  },

  // Create new tenant with admin user
  createTenantWithAdmin: async (tenantData: CreateTenantRequest) => {
    const response = await apiClient.post('/admin/tenants', tenantData);
    return response.data;
  },

  // Get all admin users
  getAdminUsers: async (): Promise<AdminUser[]> => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  // Create admin user
  createAdminUser: async (userData: { name: string; email: string; password: string }): Promise<AdminUser> => {
    const response = await apiClient.post('/admin/users', userData);
    return response.data;
  },

  // Update admin user
  updateAdminUser: async (userId: string, userData: { name?: string; email?: string }): Promise<AdminUser> => {
    const response = await apiClient.put(`/admin/users/${userId}`, userData);
    return response.data;
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
