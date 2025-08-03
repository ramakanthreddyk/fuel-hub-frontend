
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
  getTenants: (): Promise<Tenant[]> => apiClient.get('/superadmin/tenants').then(response => {
    const data = extractApiData(response);
    return data?.tenants || [];
  }),
  createTenant: (data: CreateTenantRequest): Promise<Tenant> =>
    apiClient.post('/superadmin/tenants', data).then(response => extractApiData(response)),
  getTenant: (id: string): Promise<Tenant> =>
    apiClient.get(`/superadmin/tenants/${id}`).then(response => extractApiData(response)),
  updateTenant: (id: string, data: Partial<Tenant>): Promise<Tenant> =>
    apiClient.put(`/superadmin/tenants/${id}`, data).then(response => extractApiData(response)),
  updateTenantStatus: (id: string, status: string): Promise<Tenant> =>
    apiClient.patch(`/superadmin/tenants/${id}/status`, { status }).then(response => extractApiData(response)),
  deleteTenant: (id: string): Promise<void> =>
    apiClient.delete(`/superadmin/tenants/${id}`),

  // Plan Management
  getPlans: (): Promise<Plan[]> => apiClient.get('/superadmin/plans').then(response => {
    const data = extractApiData(response);
    return data?.plans || [];
  }),
  createPlan: (data: CreatePlanRequest): Promise<Plan> =>
    apiClient.post('/superadmin/plans', data).then(response => extractApiData(response)),
  updatePlan: (id: string, data: Partial<Plan>): Promise<Plan> =>
    apiClient.put(`/superadmin/plans/${id}`, data).then(response => extractApiData(response)),
  deletePlan: (id: string): Promise<void> =>
    apiClient.delete(`/superadmin/plans/${id}`),

  // Admin User Management
  getAdminUsers: (): Promise<{ tenantUsers: any[], adminUsers: AdminUser[], totalUsers: number }> =>
    apiClient.get('/superadmin/users').then(response => extractApiData(response) || { tenantUsers: [], adminUsers: [], totalUsers: 0 }),
  createAdminUser: (data: CreateSuperAdminRequest): Promise<AdminUser> =>
    apiClient.post('/superadmin/users', data).then(response => extractApiData(response)),
  updateAdminUser: (id: string, data: Partial<AdminUser>): Promise<AdminUser> =>
    apiClient.put(`/superadmin/users/${id}`, data).then(response => extractApiData(response)),
  deleteAdminUser: (id: string): Promise<void> =>
    apiClient.delete(`/superadmin/users/${id}`),
  resetAdminPassword: (id: string, passwordData: any): Promise<void> =>
    apiClient.post(`/superadmin/users/${id}/reset-password`, passwordData),

  // Analytics and Summary
  getSummary: (): Promise<SuperAdminSummary> => {
    return apiClient.get('/superadmin/analytics/usage').then(response => {
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
  getAnalytics: (): Promise<any> => {
    return apiClient.get('/superadmin/analytics/usage').then(response => {
      const data = extractApiData<any>(response);
      // Return the actual backend structure without transformation
      return data;
    });
  }
};

// Backward compatibility exports
export const superadminApi = superAdminApi;

// Fix the export type issue
export type { SuperAdminSummary } from './api-contract';
