
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

export interface UpdateUserRequest {
  name?: string;
  role?: 'manager' | 'attendant';
  stationId?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
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
    return response.data.users || response.data;
  },
  
  // Get specific user
  getUser: async (userId: string): Promise<User> => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },
  
  // Create new user for current tenant (owner only)
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },
  
  // Update user (owner only)
  updateUser: async (userId: string, userData: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  },
  
  // Change own password
  changePassword: async (userId: string, passwordData: ChangePasswordRequest): Promise<void> => {
    await apiClient.post(`/users/${userId}/change-password`, passwordData);
  },
  
  // Reset user password (owner only)
  resetPassword: async (userId: string, passwordData: ResetPasswordRequest): Promise<void> => {
    await apiClient.post(`/users/${userId}/reset-password`, passwordData);
  },
  
  // Delete user (owner only)
  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/users/${userId}`);
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
  }
};
