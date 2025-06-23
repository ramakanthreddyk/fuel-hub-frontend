
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Add CORS configuration
  withCredentials: false,
  timeout: 10000, // 10 second timeout
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
      if (userData.tenantId) {
        config.headers['x-tenant-id'] = userData.tenantId;
      }
    }
    
    // Add CORS headers
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, x-tenant-id';
    
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
    
    // Handle CORS errors specifically
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      console.error('[API-CLIENT] CORS or network error detected');
      // You could show a toast here about backend connectivity issues
    }
    
    // Don't redirect on login page
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    
    if (error.response?.status === 401 && !isLoginRequest) {
      console.log('[API-CLIENT] 401 error detected, but not redirecting on login page');
      localStorage.removeItem('fuelsync_token');
      localStorage.removeItem('fuelsync_user');
      
      if (!window.location.pathname.includes('/login')) {
        console.log('[API-CLIENT] Redirecting to login page');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
