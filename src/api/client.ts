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
          
          // For regular users (owner, manager, attendant), ALWAYS add tenant header
          if (user.role !== 'superadmin' && user.tenantId) {
            config.headers['x-tenant-id'] = user.tenantId;
          }
        } catch (error) {
          console.error('[API-CLIENT] Error parsing stored user:', error);
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors more carefully - only logout for legitimate auth failures
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || '';
      const isAuthEndpoint = error.config?.url?.includes('/auth/');
      
      // Only logout for actual authentication failures, not permission issues
      const isLegitimateAuthFailure = 
        isAuthEndpoint || 
        errorMessage.toLowerCase().includes('invalid token') || 
        errorMessage.toLowerCase().includes('token expired') ||
        errorMessage.toLowerCase().includes('unauthorized access') ||
        errorMessage.toLowerCase().includes('authentication failed') ||
        errorMessage.toLowerCase().includes('jwt') ||
        errorMessage.toLowerCase().includes('token');
      
      if (isLegitimateAuthFailure) {
        localStorage.removeItem('fuelsync_token');
        localStorage.removeItem('fuelsync_user');
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
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
