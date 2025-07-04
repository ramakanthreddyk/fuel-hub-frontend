
import { apiClient, extractApiData, extractApiArray } from './client';
import type { 
  Tenant, 
  CreateTenantRequest, 
  User, 
  Station, 
  ApiResponse 
} from './api-contract';

// Define the actual structure returned by the backend
interface TenantResponse {
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
  // Get all tenants (SuperAdmin only)
  getTenants: async (): Promise<Tenant[]> => {
    try {
      console.log('Fetching tenants from SuperAdmin endpoint /admin/tenants');
      const response = await apiClient.get('/admin/tenants');
      const tenants = extractApiArray<TenantResponse>(response, 'tenants');
      
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
        users: [], // Will be populated by getTenantDetails if needed
        stations: [] // Will be populated by getTenantDetails if needed
      }));
    } catch (error) {
      console.error('Error fetching tenants:', error);
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      return [];
    }
  },
  
  // Get tenant details (SuperAdmin route)
  getTenantDetails: async (tenantId: string): Promise<Tenant> => {
    try {
      console.log(`Fetching tenant details for ${tenantId} via SuperAdmin endpoint`);
      const response = await apiClient.get(`/admin/tenants/${tenantId}`);
      const tenantData = extractApiData<any>(response);
      
      // Map to expected Tenant structure
      return {
        id: tenantData.id,
        name: tenantData.name,
        status: tenantData.status,
        planId: tenantData.planId,
        planName: tenantData.planName,
        createdAt: tenantData.createdAt,
        userCount: tenantData.userCount || 0,
        stationCount: tenantData.stationCount || 0,
        users: tenantData.users || [],
        stations: tenantData.stations || []
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
      const newTenant = extractApiData<TenantResponse>(response);
      
      // Map to expected Tenant structure
      return {
        id: newTenant.id,
        name: newTenant.name,
        status: newTenant.status,
        planId: newTenant.planId,
        planName: newTenant.planName,
        createdAt: newTenant.createdAt,
        userCount: newTenant.userCount || 0,
        stationCount: newTenant.stationCount || 0,
        users: [],
        stations: []
      };
    } catch (error) {
      console.error('Error creating tenant:', error);
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  }
};
