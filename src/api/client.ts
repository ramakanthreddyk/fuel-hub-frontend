
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
  timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API-CLIENT] Making request to: ${config.baseURL}${config.url}`);
    
    const token = localStorage.getItem('fuelsync_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add tenant ID header if available
    const user = localStorage.getItem('fuelsync_user');
    if (user) {
      const userData = JSON.parse(user);
      
      // For superadmin users, only send tenant header if explicitly set or for non-admin routes
      if (userData.role === 'superadmin') {
        // Don't send tenant header for admin routes or login
        if (!config.url?.includes('/admin/') && !config.url?.includes('/auth/login')) {
          // For non-admin routes, superadmin needs a tenant context - use stored tenantId or default
          config.headers['x-tenant-id'] = userData.tenantId || 'production_tenant';
        }
      } else {
        // For regular tenant users, always send their tenant ID (except login)
        if (userData.tenantId && !config.url?.includes('/auth/login')) {
          config.headers['x-tenant-id'] = userData.tenantId;
        }
      }
    } else if (!config.url?.includes('/auth/login')) {
      // Default to production_tenant for non-login requests if no user is found
      config.headers['x-tenant-id'] = 'production_tenant';
    }
    
    return config;
  },
  (error) => {
    console.error('[API-CLIENT] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('[API-CLIENT] Response received:', { 
      url: response.config.url,
      status: response.status,
      hasData: !!response.data
    });
    return response;
  },
  (error) => {
    console.error('[API-CLIENT] Request failed:', { 
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    // Don't redirect on login page
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    
    if (error.response?.status === 401 && !isLoginRequest) {
      console.log('[API-CLIENT] 401 error detected, redirecting to login');
      localStorage.removeItem('fuelsync_token');
      localStorage.removeItem('fuelsync_user');
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
