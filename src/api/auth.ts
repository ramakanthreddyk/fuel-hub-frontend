
import { apiClient } from './client';
import { UserRole } from '@/contexts/AuthContext';

export interface LoginRequest {
  email: string; // Supports formats: user@domain.com, user@tenant_name.com
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    tenantId?: string;
    tenantName?: string;
  };
}

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
      
      devLog('Login response received:', {
        status: response.status,
        hasToken: !!response.data.token,
        hasUser: !!response.data.user
      });
      
      // Validate response structure
      if (!response.data.token) {
        devError('Missing token in response');
        throw new Error('Missing token in response');
      }
      
      if (!response.data.user) {
        devError('Missing user data in response');
        throw new Error('Missing user data in response');
      }
      
      // Response is already converted to camelCase by the interceptor
      devLog('Using backend-provided tenant context:', {
        tenantId: response.data.user.tenantId,
        tenantName: response.data.user.tenantName
      });
      
      return response.data;
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
    return response.data;
  }
};
