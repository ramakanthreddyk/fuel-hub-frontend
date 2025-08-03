
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
    return apiClient.get('/tenants').then(response => {
      const data = response.data;
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
    return apiClient.get(`/tenants/${tenantId}`).then(response => {
      const data = response.data;
      return {
        ...data,
        users: data.users || [],
        stations: data.stations || []
      };
    });
  },

  createTenant: (tenantData: CreateTenantRequest): Promise<Tenant> => {
    return apiClient.post('/tenants', tenantData).then(response => {
      const data = response.data;
      return {
        ...data,
        users: data.users || [],
        stations: data.stations || []
      };
    });
  },

  updateTenant: (tenantId: string, updates: UpdateTenantRequest): Promise<Tenant> => {
    return apiClient.put(`/tenants/${tenantId}`, updates).then(response => response.data);
  },

  updateTenantStatus: (tenantId: string, status: 'active' | 'suspended' | 'cancelled' | 'trial'): Promise<Tenant> => {
    return apiClient.put(`/tenants/${tenantId}/status`, { status }).then(response => response.data);
  },

  updateTenantPlan: (tenantId: string, planId: string): Promise<Tenant> => {
    console.log('[FRONTEND-API] Making plan update request:', { tenantId, planId });
    console.log('[FRONTEND-API] Request URL:', `/superadmin/tenants/${tenantId}/plan`);
    return apiClient.patch(`/superadmin/tenants/${tenantId}/plan`, { planId })
      .then(response => {
        console.log('[FRONTEND-API] Plan update success:', response.data);
        return response.data;
      })
      .catch(error => {
        console.error('[FRONTEND-API] Plan update error:', error);
        throw error;
      });
  },

  deleteTenant: (tenantId: string): Promise<void> => {
    return apiClient.delete(`/tenants/${tenantId}`);
  }
};
