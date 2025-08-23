
import { apiClient, extractApiData, extractApiArray } from './client';
import { sanitizeUrlParam, secureLog } from '@/utils/security';
import type { 
  User, 
} from './api-contract';
  

export type UpdateUserRequest = {
  name?: string;
  email?: string;
  phone?: string;
  role?: 'superadmin' | 'owner' | 'manager' | 'attendant';
  stationId?: string;
};

export type CreateUserRequest = {
  name: string;
  email: string;
  phone: string;
  role: 'superadmin' | 'owner' | 'manager' | 'attendant';
  stationId?: string;
};

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export type ResetPasswordRequest = {
  newPassword: string;
};

export type CreateSuperAdminRequest = {
  name: string;
  email: string;
  phone: string;
  role: 'superadmin';
};

export const usersApi = {
  // Get users for current tenant
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get('/users');
      return extractApiArray<User>(response, 'users');
    } catch (error) {
      secureLog.error('Error fetching users:', error);
      return [];
    }
  },
  
  // Get specific user
  getUser: async (userId: string): Promise<User> => {
    try {
      const response = await apiClient.get(`/users/${sanitizeUrlParam(userId)}`);
      return extractApiData<User>(response);
    } catch (error) {
      secureLog.error('Error fetching user:', error);
      throw error;
    }
  },
  
  // Create new user for current tenant (owner only)
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    try {
      const response = await apiClient.post('/users', userData);
      return extractApiData<User>(response);
    } catch (error) {
      secureLog.error('Error creating user:', error);
      throw error;
    }
  },
  
  // Update user (owner only)
  updateUser: async (userId: string, userData: UpdateUserRequest): Promise<User> => {
    try {
      const response = await apiClient.put(`/users/${sanitizeUrlParam(userId)}`, userData);
      return extractApiData<User>(response);
    } catch (error) {
      secureLog.error('Error updating user:', error);
      throw error;
    }
  },
  
  // Change own password
  changePassword: async (userId: string, passwordData: ChangePasswordRequest): Promise<void> => {
    try {
      await apiClient.post(`/users/${sanitizeUrlParam(userId)}/change-password`, passwordData);
    } catch (error) {
      secureLog.error('Error changing password:', error);
      throw error;
    }
  },
  
  // Reset user password (owner only)
  resetPassword: async (userId: string, passwordData: ResetPasswordRequest): Promise<void> => {
    try {
      await apiClient.post(`/users/${sanitizeUrlParam(userId)}/reset-password`, passwordData);
    } catch (error) {
      secureLog.error('Error resetting password:', error);
      throw error;
    }
  },
  
  // Delete user (owner only)
  deleteUser: async (userId: string): Promise<void> => {
    try {
      await apiClient.delete(`/users/${sanitizeUrlParam(userId)}`);
    } catch (error) {
      secureLog.error('Error deleting user:', error);
      throw error;
    }
  },
  
  // Get SuperAdmin users
  getSuperAdminUsers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get('/admin/users');
      return extractApiArray<User>(response, 'users');
    } catch (error) {
      secureLog.error('Error fetching super admin users:', error);
      return [];
    }
  },
  
  // Create new SuperAdmin user
  createSuperAdminUser: async (userData: CreateSuperAdminRequest): Promise<User> => {
    try {
      const response = await apiClient.post('/admin/users', userData);
      return extractApiData<User>(response);
    } catch (error) {
      secureLog.error('Error creating super admin user:', error);
      throw error;
    }
  }
};
