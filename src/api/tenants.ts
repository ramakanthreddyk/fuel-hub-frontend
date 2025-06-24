
import { apiClient } from './client';

export interface Tenant {
  id: string;
  name: string;
  schemaName: string;
  planId: string;
  planName: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  stationCount?: number;
  userCount?: number;
}

export interface CreateTenantRequest {
  name: string;
  schema: string;
  planType: 'basic' | 'premium' | 'enterprise';
}

export const tenantsApi = {
  // Get all tenants (SuperAdmin only)
  getTenants: async (): Promise<Tenant[]> => {
    const response = await apiClient.get('/tenants');
    return response.data;
  },
  
  // Create new tenant
  createTenant: async (tenantData: CreateTenantRequest): Promise<Tenant> => {
    const response = await apiClient.post('/tenants', tenantData);
    return response.data;
  },
  
  // Update tenant status
  updateTenantStatus: async (tenantId: string, status: 'active' | 'inactive' | 'suspended'): Promise<Tenant> => {
    const response = await apiClient.patch(`/tenants/${tenantId}/status`, { status });
    return response.data;
  },
  
  // Delete tenant
  deleteTenant: async (tenantId: string): Promise<void> => {
    await apiClient.delete(`/tenants/${tenantId}`);
  }
};
