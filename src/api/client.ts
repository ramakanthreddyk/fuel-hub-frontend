
import axios from 'axios';

// Get the backend URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and tenant context
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('fuelsync_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add tenant context for non-admin routes
    const isAdminAuthRoute = config.url?.includes('/admin/auth/');
    const isGeneralAdminRoute = config.url?.startsWith('/admin/') && !isAdminAuthRoute;
    
    if (!isAdminAuthRoute) {
      // Get tenant ID from stored user data
      const storedUser = localStorage.getItem('fuelsync_user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          
          // For regular users (owner, manager, attendant), always add tenant header
          if (user.role !== 'superadmin' && user.tenantId) {
            config.headers['x-tenant-id'] = user.tenantId;
            console.log(`[API-CLIENT] Adding tenant header for ${user.role}:`, user.tenantId);
          }
          // For SuperAdmin accessing general admin routes, don't add tenant header
          else if (user.role === 'superadmin' && isGeneralAdminRoute) {
            console.log(`[API-CLIENT] SuperAdmin accessing admin route - no tenant header needed`);
          }
          // For SuperAdmin accessing non-admin routes, they might need tenant context for specific operations
          else if (user.role === 'superadmin' && !isGeneralAdminRoute) {
            console.log(`[API-CLIENT] SuperAdmin accessing tenant route - no tenant header by default`);
          }
        } catch (error) {
          console.error('[API-CLIENT] Error parsing stored user:', error);
        }
      }
    }

    console.log(`[API-CLIENT] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      hasAuth: !!config.headers.Authorization,
      hasTenant: !!config.headers['x-tenant-id'],
      isAdminAuth: isAdminAuthRoute,
      isGeneralAdmin: isGeneralAdminRoute
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API-CLIENT] Response ${response.status} for ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`[API-CLIENT] Error ${error.response?.status} for ${error.config?.url}:`, error.response?.data);
    
    // Handle 401 errors by clearing auth and redirecting to login
    if (error.response?.status === 401) {
      console.log('[API-CLIENT] 401 Unauthorized - clearing auth and redirecting');
      localStorage.removeItem('fuelsync_token');
      localStorage.removeItem('fuelsync_user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Helper function to extract data from API responses
export const extractApiData = <T>(response: any): T => {
  // Handle direct data responses (common pattern)
  if (response.data && typeof response.data === 'object') {
    // If response has a 'data' property, use that
    if ('data' in response.data) {
      return response.data.data;
    }
    // Otherwise use the entire response.data
    return response.data;
  }
  
  // Fallback to response.data
  return response.data;
};

// Helper function to extract array data from API responses
export const extractApiArray = <T>(response: any, arrayKey?: string): T[] => {
  const data = extractApiData(response);
  
  // If arrayKey is provided, try to get the array from that property
  if (arrayKey && data && typeof data === 'object' && arrayKey in data) {
    const arrayData = data[arrayKey];
    return Array.isArray(arrayData) ? arrayData : [];
  }
  
  // Otherwise, assume the data itself is the array
  return Array.isArray(data) ? data : [];
};

export default apiClient;
