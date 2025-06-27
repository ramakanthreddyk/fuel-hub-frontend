
import axios from 'axios';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: '/api/v1',
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
    // Admin auth routes should NOT have tenant headers
    const isAdminAuthRoute = config.url?.includes('/admin/auth/');
    const isGeneralAdminRoute = config.url?.startsWith('/admin/') && !isAdminAuthRoute;
    
    if (!isAdminAuthRoute) {
      // Get tenant ID from stored user data
      const storedUser = localStorage.getItem('fuelsync_user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          // For SuperAdmin accessing tenant-specific data, they can manually set tenant context
          // For regular users, always use their tenant ID
          if (user.role !== 'superadmin' && user.tenantId) {
            config.headers['x-tenant-id'] = user.tenantId;
          }
          // For SuperAdmin, only add tenant header if explicitly set (for cross-tenant operations)
          else if (user.role === 'superadmin' && isGeneralAdminRoute) {
            // Admin routes for SuperAdmin don't need tenant headers by default
            // unless they're doing tenant-specific operations
          }
        } catch (error) {
          console.error('[API-CLIENT] Error parsing stored user:', error);
        }
      }
    }

    console.log(`[API-CLIENT] ${config.method?.toUpperCase()} ${config.url}`, {
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
export const extractApiArray = <T>(response: any): T[] => {
  const data = extractApiData<T[]>(response);
  return Array.isArray(data) ? data : [];
};

export default apiClient;
