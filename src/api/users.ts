
import { apiClient, extractApiData, extractApiArray } from './client';
import type { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest,
  ChangePasswordRequest,
  ResetPasswordRequest,
  CreateSuperAdminRequest,
  ApiResponse 
} from './api-contract';

export const usersApi = {
  // Get users for current tenant
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get('/users');
      return extractApiArray<User>(response, 'users');
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },
  
  // Get specific user
  getUser: async (userId: string): Promise<User> => {
    const response = await apiClient.get(`/users/${userId}`);
    return extractApiData<User>(response);
  },
  
  // Create new user for current tenant (owner only)
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post('/users', userData);
    return extractApiData<User>(response);
  },
  
  // Update user (owner only)
  updateUser: async (userId: string, userData: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return extractApiData<User>(response);
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
    try {
      const response = await apiClient.get('/admin/users');
      return extractApiArray<User>(response, 'users');
    } catch (error) {
      console.error('Error fetching super admin users:', error);
      return [];
    }
  },
  
  // Create new SuperAdmin user
  createSuperAdminUser: async (userData: CreateSuperAdminRequest): Promise<User> => {
    const response = await apiClient.post('/admin/users', userData);
    return extractApiData<User>(response);
  }
};
