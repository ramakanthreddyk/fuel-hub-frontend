
import { apiClient } from './client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'manager' | 'attendant';
  createdAt: string;
}

export interface Nozzle {
  id: string;
  nozzleNumber: number;
  fuelType: string;
  status: string;
}

export interface Pump {
  id: string;
  label: string;
  serialNumber?: string;
  status: string;
  nozzleCount: number;
  nozzles?: Nozzle[];
}

export interface Station {
  id: string;
  name: string;
  address?: string;
  status: string;
  pumpCount: number;
  pumps?: Pump[];
}

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
  users?: User[];
  stations?: Station[];
}

// New interface for the API response structure
export interface TenantDetailsResponse {
  tenant: Tenant;
  users: User[];
  stations: Station[];
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
  
  // Get tenant details with hierarchy
  getTenantDetails: async (tenantId: string): Promise<Tenant> => {
    const response = await apiClient.get(`/admin/tenants/${tenantId}`);
    const data: TenantDetailsResponse = response.data;
    
    // Merge the separate arrays into the tenant object for backward compatibility
    return {
      ...data.tenant,
      users: data.users,
      stations: data.stations,
      userCount: data.users?.length || 0,
      stationCount: data.stations?.length || 0
    };
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
