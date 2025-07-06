
import { apiClient, extractApiData } from './client';
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
  getTenants: (): Promise<Tenant[]> => apiClient.get('/admin/tenants').then(response => response.data || []),
  createTenant: (data: CreateTenantRequest): Promise<Tenant> =>
    apiClient.post('/admin/tenants', data).then(response => response.data),
  getTenant: (id: string): Promise<Tenant> =>
    apiClient.get(`/admin/tenants/${id}`).then(response => response.data),
  updateTenant: (id: string, data: Partial<Tenant>): Promise<Tenant> =>
    apiClient.put(`/admin/tenants/${id}`, data).then(response => response.data),
  updateTenantStatus: (id: string, status: string): Promise<Tenant> =>
    apiClient.put(`/admin/tenants/${id}/status`, { status }).then(response => response.data),
  deleteTenant: (id: string): Promise<void> =>
    apiClient.delete(`/admin/tenants/${id}`),

  // Plan Management
  getPlans: (): Promise<Plan[]> => apiClient.get('/admin/plans').then(response => response.data || []),
  createPlan: (data: CreatePlanRequest): Promise<Plan> =>
    apiClient.post('/admin/plans', data).then(response => response.data),
  updatePlan: (id: string, data: Partial<Plan>): Promise<Plan> =>
    apiClient.put(`/admin/plans/${id}`, data).then(response => response.data),
  deletePlan: (id: string): Promise<void> =>
    apiClient.delete(`/admin/plans/${id}`),

  // Admin User Management
  getAdminUsers: (): Promise<AdminUser[]> => apiClient.get('/admin/users').then(response => response.data || []),
  createAdminUser: (data: CreateSuperAdminRequest): Promise<AdminUser> =>
    apiClient.post('/admin/users', data).then(response => response.data),
  updateAdminUser: (id: string, data: Partial<AdminUser>): Promise<AdminUser> =>
    apiClient.put(`/admin/users/${id}`, data).then(response => response.data),
  deleteAdminUser: (id: string): Promise<void> =>
    apiClient.delete(`/admin/users/${id}`),
  resetAdminPassword: (id: string, passwordData: any): Promise<void> =>
    apiClient.post(`/admin/users/${id}/reset-password`, passwordData),

  // Analytics and Summary
  getSummary: (): Promise<SuperAdminSummary> => {
    return apiClient.get('/admin/dashboard').then(response => {
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
    });
  },
  getAnalytics: (): Promise<SuperAdminAnalytics> => {
    return apiClient.get('/analytics/superadmin').then(response => {
      const data = extractApiData<any>(response);
      return {
        // Core metrics
        tenantCount: data.totalTenants || data.tenantCount || 0,
        activeTenantCount: data.activeTenants || data.activeTenantCount || 0,
        totalUsers: data.totalUsers || 0,
        totalStations: data.totalStations || 0,
        signupsThisMonth: data.signupsThisMonth || 0,
        tenantsByPlan: data.tenantsByPlan || [],
        recentTenants: data.recentTenants || [],
        
        // Overview section
        overview: {
          totalTenants: data.totalTenants || data.tenantCount || 0,
          totalRevenue: data.totalRevenue || 0,
          totalStations: data.totalStations || 0,
          growth: typeof data.monthlyGrowth === 'number' ? data.monthlyGrowth : 0
        },
        
        // Tenant metrics
        tenantMetrics: {
          activeTenants: data.activeTenants || data.activeTenantCount || 0,
          trialTenants: data.trialTenants || 0,
          suspendedTenants: data.suspendedTenants || 0,
          monthlyGrowth: typeof data.monthlyGrowth === 'number' ? data.monthlyGrowth : 0
        },
        
        // Revenue metrics
        revenueMetrics: {
          mrr: data.mrr || 0,
          arr: data.arr || 0,
          churnRate: data.churnRate || 0,
          averageRevenuePerTenant: data.averageRevenuePerTenant || 0
        },
        
        // Usage metrics
        usageMetrics: {
          totalUsers: data.totalUsers || 0,
          totalStations: data.totalStations || 0,
          totalTransactions: data.totalTransactions || 0,
          averageStationsPerTenant: data.averageStationsPerTenant || 0
        },
        
        // Additional properties for backward compatibility
        totalTenants: data.totalTenants || data.tenantCount || 0,
        activeTenants: data.activeTenants || data.activeTenantCount || 0,
        totalRevenue: data.totalRevenue || 0,
        salesVolume: data.salesVolume,
        monthlyGrowth: Array.isArray(data.monthlyGrowth) ? data.monthlyGrowth : [],
        topTenants: data.topTenants || []
      };
    });
  }
};

// Backward compatibility exports
export const superadminApi = superAdminApi;

// Fix the export type issue
export type { SuperAdminSummary };
