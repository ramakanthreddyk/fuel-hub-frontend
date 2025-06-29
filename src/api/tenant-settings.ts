
import { apiClient, extractApiData, extractApiArray } from './client';

export interface TenantSetting {
  key: string;
  value: string;
  updatedAt: string;
}

export const tenantSettingsApi = {
  // Get all settings for a tenant
  getTenantSettings: async (tenantId: string): Promise<TenantSetting[]> => {
    try {
      console.log(`Fetching settings for tenant ${tenantId}`);
      const response = await apiClient.get(`/admin/tenants/${tenantId}/settings`);
      return extractApiArray<TenantSetting>(response, 'settings');
    } catch (error) {
      console.error(`Error fetching tenant settings for ${tenantId}:`, error);
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  },

  // Update a specific setting
  updateTenantSetting: async (tenantId: string, key: string, value: string): Promise<TenantSetting> => {
    try {
      console.log(`Updating setting ${key} for tenant ${tenantId} with value:`, value);
      const response = await apiClient.put(`/admin/tenants/${tenantId}/settings/${encodeURIComponent(key)}`, {
        value
      });
      return extractApiData<TenantSetting>(response);
    } catch (error) {
      console.error(`Error updating setting ${key} for tenant ${tenantId}:`, error);
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  },

  // Bulk update settings
  bulkUpdateTenantSettings: async (tenantId: string, settings: Record<string, string>): Promise<TenantSetting[]> => {
    try {
      console.log(`Bulk updating settings for tenant ${tenantId}:`, settings);
      const response = await apiClient.put(`/admin/tenants/${tenantId}/settings`, {
        settings
      });
      return extractApiArray<TenantSetting>(response, 'settings');
    } catch (error) {
      console.error(`Error bulk updating settings for tenant ${tenantId}:`, error);
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  }
};
