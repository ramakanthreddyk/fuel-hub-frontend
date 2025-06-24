
import { apiClient } from './client';
import { UserRole } from '@/contexts/AuthContext';

export interface LoginRequest {
  email: string;
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

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    console.log('[AUTH-API] Sending login request:', { email: credentials.email });
    
    try {
      // Log the API URL being used
      console.log('[AUTH-API] API base URL:', apiClient.defaults.baseURL);
      
      const response = await apiClient.post('/auth/login', credentials);
      
      console.log('[AUTH-API] Raw response:', response);
      console.log('[AUTH-API] Login response received:', {
        status: response.status,
        hasToken: !!response.data.token,
        hasUser: !!response.data.user
      });
      
      // Validate response structure
      if (!response.data.token) {
        console.error('[AUTH-API] Missing token in response');
        alert('Login failed: Missing token in response');
        throw new Error('Missing token in response');
      }
      
      if (!response.data.user) {
        console.error('[AUTH-API] Missing user data in response');
        alert('Login failed: Missing user data in response');
        throw new Error('Missing user data in response');
      }
      
      // Ensure tenant ID is set for non-superadmin users
      if (response.data.user.role !== 'superadmin' && !response.data.user.tenantId) {
        console.log('[AUTH-API] Setting default tenant ID for non-superadmin user');
        response.data.user.tenantId = 'production_tenant';
      }
      
      return response.data;
    } catch (error) {
      console.error('[AUTH-API] Login request failed:', error.message);
      console.log('[AUTH-API] Error details:', error.response?.data || 'No response data');
      alert('API error: ' + (error.message || 'Unknown error'));
      throw error;
    }
  },
  
  logout: async (): Promise<void> => {
    console.log('[AUTH-API] Logging out user');
    await apiClient.post('/auth/logout');
  },
  
  refreshToken: async (): Promise<LoginResponse> => {
    console.log('[AUTH-API] Refreshing token');
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  }
};
