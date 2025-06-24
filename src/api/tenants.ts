
import { apiClient } from './client';

export interface Tenant {
  id: string;
  name: string;
  schemaName: string;
  planId: string;
  planName: string;
  status: 'active' | 'suspended' | 'cancelled';
  createdAt: string;
  stationCount?: number;
  userCount?: number;
}

export interface CreateTenantRequest {
  name: string;
  schemaName?: string;
  planId: string;
  adminEmail?: string;
  adminPassword?: string;
}

export const tenantsApi = {
  // Get all tenants (SuperAdmin only)
  getTenants: async (): Promise<Tenant[]> => {
    const response = await apiClient.get('/admin/tenants');
    return response.data;
  },
  
  // Create new tenant
  createTenant: async (tenantData: CreateTenantRequest): Promise<Tenant> => {
    const response = await apiClient.post('/admin/tenants', tenantData);
    return response.data;
  },
  
  // Update tenant status
  updateTenantStatus: async (tenantId: string, status: 'active' | 'suspended' | 'cancelled'): Promise<Tenant> => {
    const response = await apiClient.patch(`/admin/tenants/${tenantId}/status`, { status });
    return response.data;
  },
  
  // Delete tenant
  deleteTenant: async (tenantId: string): Promise<void> => {
    await apiClient.delete(`/admin/tenants/${tenantId}`);
  }
};
