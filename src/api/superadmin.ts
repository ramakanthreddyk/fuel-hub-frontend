
import { apiClient } from './client';

export interface SuperAdminSummary {
  totalTenants: number;
  activeTenants: number;
  totalStations: number;
  totalUsers: number;
  signupsThisMonth: number;
}

export interface Plan {
  id: string;
  name: string;
  maxStations: number;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
}

export interface CreateTenantRequest {
  name: string;
  plan: string;
  email: string;
  password: string;
  schema: string;
}

export const superAdminApi = {
  // Get platform summary
  getSummary: async (): Promise<SuperAdminSummary> => {
    const response = await apiClient.get('/admin/tenants/summary');
    return response.data;
  },

  // Get all plans
  getPlans: async (): Promise<Plan[]> => {
    const response = await apiClient.get('/admin/plans');
    return response.data;
  },

  // Update plan
  updatePlan: async (planId: string, planData: Partial<Plan>): Promise<Plan> => {
    const response = await apiClient.put(`/admin/plans/${planId}`, planData);
    return response.data;
  },

  // Create new tenant with admin user
  createTenantWithAdmin: async (tenantData: CreateTenantRequest) => {
    const response = await apiClient.post('/admin/tenants', tenantData);
    return response.data;
  }
};
