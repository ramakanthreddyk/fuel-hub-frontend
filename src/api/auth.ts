
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
  login: async (credentials: LoginRequest, forceAdminRoute: boolean = false): Promise<LoginResponse> => {
    devLog('Sending login request:', { 
      email: credentials.email, 
      forceAdminRoute 
    });
    
    try {
      devLog('API base URL:', apiClient.defaults.baseURL);
      
      if (forceAdminRoute) {
        // Force admin route when user accessed /login/admin - use full API v1 path
        devLog('Force admin route detected - using SuperAdmin endpoint: /api/v1/admin/auth/login');
        
        const adminResponse = await apiClient.post('/admin/auth/login', credentials);
        const adminLoginData = extractApiData<LoginResponse>(adminResponse);
        
        devLog('SuperAdmin login successful:', {
          hasToken: !!adminLoginData.token,
          hasUser: !!adminLoginData.user,
          role: adminLoginData.user?.role
        });
        
        if (!adminLoginData.token || !adminLoginData.user) {
          throw new Error('Invalid SuperAdmin response structure');
        }
        
        return adminLoginData;
      } else {
        // Try SuperAdmin login first, then fallback to regular user
        devLog('Attempting SuperAdmin login first at /api/v1/admin/auth/login...');
        try {
          const adminResponse = await apiClient.post('/admin/auth/login', credentials);
          const adminLoginData = extractApiData<LoginResponse>(adminResponse);
          
          devLog('SuperAdmin login successful:', {
            hasToken: !!adminLoginData.token,
            hasUser: !!adminLoginData.user,
            role: adminLoginData.user?.role
          });
          
          if (!adminLoginData.token || !adminLoginData.user) {
            throw new Error('Invalid SuperAdmin response structure');
          }
          
          return adminLoginData;
        } catch (adminError: any) {
          devLog('SuperAdmin login failed, trying regular user login at /api/v1/auth/login...');
          
          if (adminError.response?.status === 404 || adminError.response?.status === 401) {
            const response = await apiClient.post('/auth/login', credentials);
            const loginData = extractApiData<LoginResponse>(response);
            
            devLog('Regular user login response received:', {
              hasToken: !!loginData.token,
              hasUser: !!loginData.user,
              role: loginData.user?.role
            });
            
            if (!loginData.token || !loginData.user) {
              throw new Error('Invalid login response structure');
            }
            
            return loginData;
          } else {
            throw adminError;
          }
        }
      }
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
