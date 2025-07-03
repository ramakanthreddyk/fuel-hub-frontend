/**
 * @file api/auth.ts
 * @description Authentication API functions
 */
import axios from 'axios';

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
      const endpoint = isAdminLogin ? 'auth/admin/login' : 'auth/login';
      
      const response = await axios({
        method: 'post',
        url: `/api/v1/${endpoint}`,
        data: credentials,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
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
      const token = localStorage.getItem('fuelsync_token');
      await axios({
        method: 'post',
        url: `/api/v1/auth/logout`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
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
      const token = localStorage.getItem('fuelsync_token');
      const response = await axios({
        method: 'post',
        url: `/api/v1/auth/refresh-token`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Handle nested response structure
      const responseData = response.data.data || response.data;
      return responseData;
    } catch (error) {
      throw error;
    }
  }
};
