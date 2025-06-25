
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
