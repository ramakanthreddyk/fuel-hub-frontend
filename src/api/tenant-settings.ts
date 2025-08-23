
import { apiClient, extractApiData, extractApiArray } from './client';
import { secureLog, sanitizeUrlParam } from '@/utils/security';

export interface TenantSetting {
  key: string;
  value: string;
  updatedAt: string;
}

export const tenantSettingsApi = {
  // Get all settings for a tenant
  getTenantSettings: async (tenantId: string): Promise<TenantSetting[]> => {
    try {
      secureLog.debug('Fetching settings for tenant', tenantId);
      const response = await apiClient.get(`/admin/tenants/${sanitizeUrlParam(tenantId)}/settings`);
      return extractApiArray<TenantSetting>(response, 'settings');
    } catch (error) {
      secureLog.error('Error fetching tenant settings for tenant', tenantId, error);
      if (error.response?.data?.message) {
        secureLog.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  },

  // Update a specific setting
  updateTenantSetting: async (tenantId: string, key: string, value: string): Promise<TenantSetting> => {
    try {
      secureLog.debug('Updating setting for tenant', key, tenantId, value);
      const response = await apiClient.put(`/admin/tenants/${sanitizeUrlParam(tenantId)}/settings/${encodeURIComponent(sanitizeUrlParam(key))}`, {
        value
      });
      return extractApiData<TenantSetting>(response);
    } catch (error) {
      secureLog.error('Error updating setting for tenant', key, tenantId, error);
      if (error.response?.data?.message) {
        secureLog.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  },

  // Bulk update settings
  bulkUpdateTenantSettings: async (tenantId: string, settings: Record<string, string>): Promise<TenantSetting[]> => {
    try {
      secureLog.debug('Bulk updating settings for tenant', tenantId, settings);
      const response = await apiClient.put(`/admin/tenants/${sanitizeUrlParam(tenantId)}/settings`, {
        settings
      });
      return extractApiArray<TenantSetting>(response, 'settings');
    } catch (error) {
      secureLog.error('Error bulk updating settings for tenant', tenantId, error);
      if (error.response?.data?.message) {
        secureLog.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  }
};
