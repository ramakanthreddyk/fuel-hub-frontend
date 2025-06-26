
import { apiClient, extractApiData, extractApiArray } from './client';
import type { 
  Tenant, 
  CreateTenantRequest, 
  User, 
  Station, 
  TenantDetailsResponse,
  ApiResponse 
} from './api-contract';

// Define the actual structure returned by the backend
interface Organization {
  id: string;
  name: string;
  status: 'active' | 'suspended' | 'cancelled';
  planId: string;
  planName: string;
  createdAt: string;
  userCount?: number;
  stationCount?: number;
}

export const tenantsApi = {
  // Get all tenants (SuperAdmin only) - using SuperAdmin route
  getTenants: async (): Promise<Tenant[]> => {
    try {
      console.log('Fetching tenants from SuperAdmin endpoint /admin/tenants');
      const response = await apiClient.get('/admin/tenants');
      const tenants = extractApiArray<Organization>(response, 'tenants');
      
      // Map the tenant structure to the expected Tenant structure
      return tenants.map(tenant => ({
        id: tenant.id,
        name: tenant.name,
        status: tenant.status,
        planId: tenant.planId,
        planName: tenant.planName,
        createdAt: tenant.createdAt,
        userCount: tenant.userCount || 0,
        stationCount: tenant.stationCount || 0,
        users: [],
        stations: []
      }));
    } catch (error) {
      console.error('Error fetching tenants:', error);
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      return [];
    }
  },
  
  // Get tenant details with hierarchy (SuperAdmin route)
  getTenantDetails: async (tenantId: string): Promise<Tenant> => {
    try {
      console.log(`Fetching tenant details for ${tenantId} via SuperAdmin endpoint`);
      const response = await apiClient.get(`/admin/tenants/${tenantId}`);
      const tenantData = extractApiData<any>(response);
      
      // For SuperAdmin, we get tenant details but users and stations might need separate calls
      // Based on the console logs, it seems like the detailed tenant response includes this data
      const users = tenantData.users || [];
      const stations = tenantData.stations || [];
      
      // Map to expected Tenant structure
      return {
        id: tenantData.id,
        name: tenantData.name,
        status: tenantData.status,
        planId: tenantData.planId,
        planName: tenantData.planName,
        createdAt: tenantData.createdAt,
        users,
        stations,
        userCount: users.length,
        stationCount: stations.length
      };
    } catch (error) {
      console.error(`Error fetching tenant details for ${tenantId}:`, error);
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  },
  
  // Create new tenant (SuperAdmin route)
  createTenant: async (tenantData: CreateTenantRequest): Promise<Tenant> => {
    try {
      console.log('Creating new tenant with data:', tenantData);
      const response = await apiClient.post('/admin/tenants', tenantData);
      const newTenant = extractApiData<Organization>(response);
      
      // Map to expected Tenant structure
      return {
        id: newTenant.id,
        name: newTenant.name,
        status: newTenant.status,
        planId: newTenant.planId,
        planName: newTenant.planName,
        createdAt: newTenant.createdAt,
        users: [],
        stations: [],
        userCount: 0,
        stationCount: 0
      };
    } catch (error) {
      console.error('Error creating tenant:', error);
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  },
  
  // Update tenant status (SuperAdmin route)
  updateTenantStatus: async (tenantId: string, status: 'active' | 'suspended' | 'cancelled'): Promise<Tenant> => {
    try {
      console.log(`Updating tenant ${tenantId} status to ${status}`);
      const response = await apiClient.patch(`/admin/tenants/${tenantId}/status`, { status });
      const updatedTenant = extractApiData<Organization>(response);
      
      // Map to expected Tenant structure
      return {
        id: updatedTenant.id,
        name: updatedTenant.name,
        status: updatedTenant.status,
        planId: updatedTenant.planId,
        planName: updatedTenant.planName,
        createdAt: updatedTenant.createdAt,
        users: [],
        stations: [],
        userCount: updatedTenant.userCount || 0,
        stationCount: updatedTenant.stationCount || 0
      };
    } catch (error) {
      console.error(`Error updating tenant ${tenantId} status:`, error);
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  },
  
  // Delete tenant (SuperAdmin route)
  deleteTenant: async (tenantId: string): Promise<void> => {
    try {
      console.log(`Deleting tenant ${tenantId}`);
      await apiClient.delete(`/admin/tenants/${tenantId}`);
    } catch (error) {
      console.error(`Error deleting tenant ${tenantId}:`, error);
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  }
};
