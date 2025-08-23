import { apiClient } from './client';
import { secureLog, sanitizeUrlParam } from '@/utils/security';
import { 
  Tenant, 
  TenantDetailsResponse, 
  CreateTenantRequest, 
  UpdateTenantRequest,
  UpdateTenantStatusRequest
} from './api-contract';

export const tenantsApi = {
  getTenants: async (): Promise<Tenant[]> => {
    try {
      const response = await apiClient.get('/tenants');
      const data = response.data;
      if (Array.isArray(data)) {
        return data.map(tenant => ({
          ...tenant,
          users: tenant.users || [],
          stations: tenant.stations || []
        }));
      }
      return [];
    } catch (error) {
      secureLog.error('Error fetching tenants:', error);
      return [];
    }
  },

  getTenantDetails: async (tenantId: string): Promise<Tenant> => {
    try {
      const response = await apiClient.get(`/tenants/${sanitizeUrlParam(tenantId)}`);
      const data = response.data;
      return {
        ...data,
        users: data.users || [],
        stations: data.stations || []
      };
    } catch (error) {
      secureLog.error('Error fetching tenant details:', error);
      throw error;
    }
  },

  createTenant: async (tenantData: CreateTenantRequest): Promise<Tenant> => {
    try {
      const response = await apiClient.post('/tenants', tenantData);
      const data = response.data;
      return {
        ...data,
        users: data.users || [],
        stations: data.stations || []
      };
    } catch (error) {
      secureLog.error('Error creating tenant:', error);
      throw error;
    }
  },

  updateTenant: async (tenantId: string, updates: UpdateTenantRequest): Promise<Tenant> => {
    try {
      const response = await apiClient.put(`/tenants/${sanitizeUrlParam(tenantId)}`, updates);
      return response.data;
    } catch (error) {
      secureLog.error('Error updating tenant:', error);
      throw error;
    }
  },

  updateTenantStatus: async (tenantId: string, status: 'active' | 'suspended' | 'cancelled' | 'trial'): Promise<Tenant> => {
    try {
      const response = await apiClient.put(`/tenants/${sanitizeUrlParam(tenantId)}/status`, { status });
      return response.data;
    } catch (error) {
      secureLog.error('Error updating tenant status:', error);
      throw error;
    }
  },

  updateTenantPlan: async (tenantId: string, planId: string): Promise<Tenant> => {
    try {
      secureLog.debug('Making plan update request');
      const response = await apiClient.patch(`/superadmin/tenants/${sanitizeUrlParam(tenantId)}/plan`, { planId: sanitizeUrlParam(planId) });
      secureLog.debug('Plan update success');
      return response.data;
    } catch (error) {
      secureLog.error('Plan update error:', error);
      throw error;
    }
  },

  deleteTenant: async (tenantId: string): Promise<void> => {
    try {
      await apiClient.delete(`/tenants/${sanitizeUrlParam(tenantId)}`);
    } catch (error) {
      secureLog.error('Error deleting tenant:', error);
      throw error;
    }
  }
};