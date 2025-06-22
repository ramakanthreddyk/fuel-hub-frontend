
import { apiClient } from './client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'owner' | 'manager' | 'attendant';
  tenantId?: string;
  tenantName?: string;
  stationId?: string;
  stationName?: string;
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'manager' | 'attendant';
  stationId?: string;
}

export interface CreateSuperAdminRequest {
  name: string;
  email: string;
  password: string;
  role: 'superadmin';
}

export const usersApi = {
  // Get users for current tenant
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return response.data;
  },
  
  // Create new user for current tenant
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },
  
  // Get SuperAdmin users
  getSuperAdminUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },
  
  // Create new SuperAdmin user
  createSuperAdminUser: async (userData: CreateSuperAdminRequest): Promise<User> => {
    const response = await apiClient.post('/admin/users', userData);
    return response.data;
  },
  
  // Delete user
  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/users/${userId}`);
  }
};
