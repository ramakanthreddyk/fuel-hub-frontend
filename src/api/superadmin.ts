
import { apiClient } from './client';

export interface SuperAdminSummary {
  totalTenants: number;
  activeTenants: number;
  totalPlans: number;
  totalAdminUsers: number;
  totalUsers: number;
  totalStations: number;
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
  adminEmail: string;
  adminPassword: string;
  schemaName: string;
}

export const superAdminApi = {
  // Get platform dashboard metrics
  getSummary: async (): Promise<SuperAdminSummary> => {
    const response = await apiClient.get('/analytics/dashboard');
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
