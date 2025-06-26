
import { apiClient, extractApiData } from './client';
import type { LoginRequest, LoginResponse, ApiResponse } from './api-contract';

const devLog = (message: string, ...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log(`[AUTH-API] ${message}`, ...args);
  }
};

const devError = (message: string, ...args: any[]) => {
  if (import.meta.env.DEV) {
    console.error(`[AUTH-API] ${message}`, ...args);
  }
};

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    devLog('Sending login request:', { email: credentials.email });
    
    try {
      devLog('API base URL:', apiClient.defaults.baseURL);
      
      const response = await apiClient.post('/auth/login', credentials);
      const loginData = extractApiData<LoginResponse>(response);
      
      devLog('Login response received:', {
        hasToken: !!loginData.token,
        hasUser: !!loginData.user
      });
      
      // Validate response structure
      if (!loginData.token) {
        devError('Missing token in response');
        throw new Error('Missing token in response');
      }
      
      if (!loginData.user) {
        devError('Missing user data in response');
        throw new Error('Missing user data in response');
      }
      
      devLog('Using backend-provided tenant context:', {
        tenantId: loginData.user.tenantId,
        tenantName: loginData.user.tenantName
      });
      
      return loginData;
    } catch (error: any) {
      devError('Login request failed:', error.message);
      devLog('Error details:', error.response?.data || 'No response data');
      throw error;
    }
  },
  
  logout: async (): Promise<void> => {
    devLog('Logging out user');
    await apiClient.post('/auth/logout');
  },
  
  refreshToken: async (): Promise<LoginResponse> => {
    devLog('Refreshing token');
    const response = await apiClient.post('/auth/refresh');
    return extractApiData<LoginResponse>(response);
  }
};

// Export types for backward compatibility
export type { LoginRequest, LoginResponse };
export type { UserRole } from './api-contract';
