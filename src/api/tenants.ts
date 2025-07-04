
import { apiClient } from './client';
import { 
  Tenant, 
  TenantDetailsResponse, 
  CreateTenantRequest, 
  UpdateTenantRequest,
  UpdateTenantStatusRequest
} from './api-contract';

export const tenantsApi = {
  getTenants: (): Promise<Tenant[]> => {
    return apiClient.get('/tenants').then(data => {
      if (Array.isArray(data)) {
        return data.map(tenant => ({
          ...tenant,
          users: tenant.users || [],
          stations: tenant.stations || []
        }));
      }
      return [];
    });
  },

  getTenantDetails: (tenantId: string): Promise<Tenant> => {
    return apiClient.get(`/tenants/${tenantId}`).then(data => ({
      ...data,
      users: data.users || [],
      stations: data.stations || []
    }));
  },

  createTenant: (tenantData: CreateTenantRequest): Promise<Tenant> => {
    return apiClient.post('/tenants', tenantData).then(data => ({
      ...data,
      users: data.users || [],
      stations: data.stations || []
    }));
  },

  updateTenant: (tenantId: string, updates: UpdateTenantRequest): Promise<Tenant> => {
    return apiClient.put(`/tenants/${tenantId}`, updates);
  },

  updateTenantStatus: (tenantId: string, status: 'active' | 'suspended' | 'cancelled' | 'trial'): Promise<Tenant> => {
    return apiClient.put(`/tenants/${tenantId}/status`, { status });
  },

  deleteTenant: (tenantId: string): Promise<void> => {
    return apiClient.delete(`/tenants/${tenantId}`);
  }
};
