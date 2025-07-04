
import { apiClient } from './client';
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
  getTenants: (): Promise<Tenant[]> => apiClient.get('/superadmin/tenants').then(response => response.data || []),
  createTenant: (data: CreateTenantRequest): Promise<Tenant> => 
    apiClient.post('/superadmin/tenants', data).then(response => response.data),
  getTenant: (id: string): Promise<Tenant> => 
    apiClient.get(`/superadmin/tenants/${id}`).then(response => response.data),
  updateTenant: (id: string, data: Partial<Tenant>): Promise<Tenant> => 
    apiClient.put(`/superadmin/tenants/${id}`, data).then(response => response.data),
  updateTenantStatus: (id: string, status: string): Promise<Tenant> => 
    apiClient.put(`/superadmin/tenants/${id}/status`, { status }).then(response => response.data),
  deleteTenant: (id: string): Promise<void> => 
    apiClient.delete(`/superadmin/tenants/${id}`),

  // Plan Management
  getPlans: (): Promise<Plan[]> => apiClient.get('/superadmin/plans').then(response => response.data || []),
  createPlan: (data: CreatePlanRequest): Promise<Plan> => 
    apiClient.post('/superadmin/plans', data).then(response => response.data),
  updatePlan: (id: string, data: Partial<Plan>): Promise<Plan> => 
    apiClient.put(`/superadmin/plans/${id}`, data).then(response => response.data),
  deletePlan: (id: string): Promise<void> => 
    apiClient.delete(`/superadmin/plans/${id}`),

  // Admin User Management
  getAdminUsers: (): Promise<AdminUser[]> => apiClient.get('/superadmin/users').then(response => response.data || []),
  createAdminUser: (data: CreateSuperAdminRequest): Promise<AdminUser> => 
    apiClient.post('/superadmin/users', data).then(response => response.data),
  updateAdminUser: (id: string, data: Partial<AdminUser>): Promise<AdminUser> => 
    apiClient.put(`/superadmin/users/${id}`, data).then(response => response.data),
  deleteAdminUser: (id: string): Promise<void> => 
    apiClient.delete(`/superadmin/users/${id}`),
  resetAdminPassword: (id: string, passwordData: any): Promise<void> => 
    apiClient.post(`/superadmin/users/${id}/reset-password`, passwordData),

  // Analytics and Summary
  getSummary: (): Promise<SuperAdminSummary> => {
    return apiClient.get('/superadmin/summary').then(response => {
      const data = response.data;
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
    });
  },
  getAnalytics: (): Promise<SuperAdminAnalytics> => {
    return apiClient.get('/superadmin/analytics').then(response => {
      const data = response.data;
      return {
        // Ensure all required properties exist
        tenantCount: data.totalTenants || data.tenantCount || 0,
        activeTenantCount: data.activeTenants || data.activeTenantCount || 0,
        totalUsers: data.totalUsers || 0,
        totalStations: data.totalStations || 0,
        signupsThisMonth: data.signupsThisMonth || 0,
        tenantsByPlan: data.tenantsByPlan || [],
        recentTenants: data.recentTenants || [],
        overview: data.overview || {
          totalTenants: data.totalTenants || 0,
          totalRevenue: data.totalRevenue || 0,
          totalStations: data.totalStations || 0,
          growth: data.monthlyGrowth || 0
        },
        tenantMetrics: data.tenantMetrics || {
          activeTenants: data.activeTenants || 0,
          trialTenants: 0,
          suspendedTenants: 0,
          monthlyGrowth: data.monthlyGrowth || 0
        },
        revenueMetrics: data.revenueMetrics || {
          mrr: 0,
          arr: 0,
          churnRate: 0,
          averageRevenuePerTenant: 0
        },
        usageMetrics: data.usageMetrics || {
          totalUsers: data.totalUsers || 0,
          totalStations: data.totalStations || 0,
          totalTransactions: 0,
          averageStationsPerTenant: 0
        },
        totalTenants: data.totalTenants || data.tenantCount || 0,
        activeTenants: data.activeTenants || data.activeTenantCount || 0,
        totalRevenue: data.totalRevenue || 0,
        salesVolume: data.salesVolume,
        monthlyGrowth: data.monthlyGrowth,
        topTenants: data.topTenants
      };
    });
  }
};

// Backward compatibility exports
export const superadminApi = superAdminApi;

// Fix the export type issue
export type { SuperAdminSummary };
