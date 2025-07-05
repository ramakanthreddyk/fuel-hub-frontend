/**
 * @file api/auth.ts
 * @description Authentication API functions
 */
import apiClient from './core/apiClient';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    tenantId?: string;
    tenantName?: string;
  };
  token: string;
}

interface RefreshTokenResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    tenantId?: string;
    tenantName?: string;
  };
}

export const authApi = {
  /**
   * Login user
   * @param credentials User credentials
   * @param isAdminLogin Whether this is an admin login
   * @returns Login response with user and token
   */
  login: async (credentials: LoginCredentials, isAdminLogin = false): Promise<LoginResponse> => {
    try {
      const endpoint = isAdminLogin ? 'admin/auth/login' : 'auth/login';
      const response = await apiClient.post(endpoint, credentials);
      
      // Handle nested response structure
      const responseData = response.data.data || response.data;
      return responseData;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('auth/logout');
    } catch (error) {
      throw error;
    }
  },

  /**
   * Refresh authentication token
   * @returns New token and possibly updated user info
   */
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    try {
      const response = await apiClient.post('auth/refresh-token');
      
      // Handle nested response structure
      const responseData = response.data.data || response.data;
      return responseData;
    } catch (error) {
      throw error;
    }
  }
};
