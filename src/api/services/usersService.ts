/**
 * @file usersService.ts
 * @description Service for users API endpoints
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/OWNER.md - Owner journey for user management
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';
import API_CONFIG from '../core/config';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'attendant';
  tenantId?: string;
  tenantName?: string;
  stationId?: string;
  stationName?: string;
  createdAt: string;
  isActive?: boolean;
  permissions?: string[];
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
  email?: string;
  role?: 'manager' | 'attendant';
  stationId?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

/**
 * Service for users API
 */
export const usersService = {
  /**
   * Get all users for the current tenant
   * @returns List of users
   */
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get(API_CONFIG.endpoints.users.base);
    return extractArray<User>(response, 'users');
  },
  
  /**
   * Get a user by ID
   * @param userId User ID
   * @returns User details
   */
  getUser: async (userId: string): Promise<User> => {
    const response = await apiClient.get(API_CONFIG.endpoints.users.byId(userId));
    return extractData<User>(response);
  },
  
  /**
   * Create a new user
   * @param data User data
   * @returns Created user
   */
  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post(API_CONFIG.endpoints.users.base, data);
    return extractData<User>(response);
  },
  
  /**
   * Update a user
   * @param userId User ID
   * @param data User data to update
   * @returns Updated user
   */
  updateUser: async (userId: string, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put(API_CONFIG.endpoints.users.byId(userId), data);
    return extractData<User>(response);
  },
  
  /**
   * Delete a user
   * @param userId User ID
   */
  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete(API_CONFIG.endpoints.users.byId(userId));
  },
  
  /**
   * Change user password
   * @param userId User ID
   * @param data Password data
   */
  changePassword: async (userId: string, data: ChangePasswordRequest): Promise<void> => {
    await apiClient.post(API_CONFIG.endpoints.users.changePassword(userId), data);
  },
  
  /**
   * Reset user password
   * @param userId User ID
   * @param data Password data
   */
  resetPassword: async (userId: string, data: ResetPasswordRequest): Promise<void> => {
    await apiClient.post(API_CONFIG.endpoints.users.resetPassword(userId), data);
  }
};

export default usersService;