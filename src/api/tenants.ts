
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
  // Get all organizations (SuperAdmin only)
  getTenants: async (): Promise<Tenant[]> => {
    try {
      console.log('Fetching organizations from /admin/organizations');
      const response = await apiClient.get('/admin/organizations');
      const organizations = extractApiArray<Organization>(response, 'organizations');
      
      // Map the organization structure to the expected Tenant structure
      return organizations.map(org => ({
        id: org.id,
        name: org.name,
        status: org.status,
        planId: org.planId,
        planName: org.planName,
        createdAt: org.createdAt,
        userCount: org.userCount || 0,
        stationCount: org.stationCount || 0,
        users: [],
        stations: []
      }));
    } catch (error) {
      console.error('Error fetching organizations:', error);
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      return [];
    }
  },
  
  // Get organization details with hierarchy
  getTenantDetails: async (orgId: string): Promise<Tenant> => {
    try {
      console.log(`Fetching organization details for ${orgId}`);
      const response = await apiClient.get(`/admin/organizations/${orgId}`);
      const orgData = extractApiData<any>(response);
      
      // Get users for this organization
      const usersResponse = await apiClient.get(`/admin/organizations/${orgId}/users`);
      const users = extractApiArray<User>(usersResponse, 'users');
      
      // Get stations for this organization
      const stationsResponse = await apiClient.get(`/admin/organizations/${orgId}/stations`);
      const stations = extractApiArray<Station>(stationsResponse, 'stations');
      
      // Map to expected Tenant structure (no schema references)
      return {
        id: orgData.id,
        name: orgData.name,
        status: orgData.status,
        planId: orgData.planId,
        planName: orgData.planName,
        createdAt: orgData.createdAt,
        users,
        stations,
        userCount: users.length,
        stationCount: stations.length
      };
    } catch (error) {
      console.error(`Error fetching organization details for ${orgId}:`, error);
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  },
  
  // Create new organization
  createTenant: async (orgData: CreateTenantRequest): Promise<Tenant> => {
    try {
      console.log('Creating new organization with data:', orgData);
      const response = await apiClient.post('/admin/organizations', orgData);
      const newOrg = extractApiData<Organization>(response);
      
      // Map to expected Tenant structure
      return {
        id: newOrg.id,
        name: newOrg.name,
        status: newOrg.status,
        planId: newOrg.planId,
        planName: newOrg.planName,
        createdAt: newOrg.createdAt,
        users: [],
        stations: [],
        userCount: 0,
        stationCount: 0
      };
    } catch (error) {
      console.error('Error creating organization:', error);
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  },
  
  // Update organization status
  updateTenantStatus: async (orgId: string, status: 'active' | 'suspended' | 'cancelled'): Promise<Tenant> => {
    try {
      console.log(`Updating organization ${orgId} status to ${status}`);
      const response = await apiClient.patch(`/admin/organizations/${orgId}/status`, { status });
      const updatedOrg = extractApiData<Organization>(response);
      
      // Map to expected Tenant structure
      return {
        id: updatedOrg.id,
        name: updatedOrg.name,
        status: updatedOrg.status,
        planId: updatedOrg.planId,
        planName: updatedOrg.planName,
        createdAt: updatedOrg.createdAt,
        users: [],
        stations: [],
        userCount: updatedOrg.userCount || 0,
        stationCount: updatedOrg.stationCount || 0
      };
    } catch (error) {
      console.error(`Error updating organization ${orgId} status:`, error);
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  },
  
  // Delete organization
  deleteTenant: async (orgId: string): Promise<void> => {
    try {
      console.log(`Deleting organization ${orgId}`);
      await apiClient.delete(`/admin/organizations/${orgId}`);
    } catch (error) {
      console.error(`Error deleting organization ${orgId}:`, error);
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  }
};
