
import { apiClient, extractApiData, extractApiArray } from './client';
import type { Tenant, CreateTenantRequest, User, Station, ApiResponse } from './api-contract';

// New interface for the API response structure
export interface TenantDetailsResponse {
  tenant: Tenant;
  users: User[];
  stations: Station[];
}

export const tenantsApi = {
  // Get all tenants (SuperAdmin only)
  getTenants: async (): Promise<Tenant[]> => {
    try {
      const response = await apiClient.get('/admin/tenants');
      return extractApiArray<Tenant>(response, 'tenants');
    } catch (error) {
      console.error('Error fetching tenants:', error);
      return [];
    }
  },
  
  // Get tenant details with hierarchy
  getTenantDetails: async (tenantId: string): Promise<Tenant> => {
    const response = await apiClient.get(`/admin/tenants/${tenantId}`);
    const data: TenantDetailsResponse = extractApiData<TenantDetailsResponse>(response);
    
    // Merge the separate arrays into the tenant object for backward compatibility
    return {
      ...data.tenant,
      users: data.users,
      stations: data.stations,
      userCount: data.users?.length || 0,
      stationCount: data.stations?.length || 0
    };
  },
  
  // Create new tenant
  createTenant: async (tenantData: CreateTenantRequest): Promise<Tenant> => {
    const response = await apiClient.post('/admin/tenants', tenantData);
    return extractApiData<Tenant>(response);
  },
  
  // Update tenant status
  updateTenantStatus: async (tenantId: string, status: 'active' | 'suspended' | 'cancelled'): Promise<Tenant> => {
    const response = await apiClient.patch(`/admin/tenants/${tenantId}/status`, { status });
    return extractApiData<Tenant>(response);
  },
  
  // Delete tenant
  deleteTenant: async (tenantId: string): Promise<void> => {
    await apiClient.delete(`/admin/tenants/${tenantId}`);
  }
};

// Export types for backward compatibility
export type { Tenant, CreateTenantRequest, TenantDetailsResponse };
