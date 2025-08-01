/**
 * @file api/core/apiClient.ts
 * @description Centralized API client for core layer
 */
import axios from 'axios';
import { normalizePropertyNames, ensurePropertyAccess } from '@/utils/apiTransform';
import { API_URL } from '../config';

// API base URL is configured from the centralized config

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000, // 30 seconds
});

// Get tenant ID from environment or user context - no hardcoded defaults
const getTenantId = () => {
  const storedUser = localStorage.getItem('fuelsync_user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      return user.tenantId;
    } catch (error) {
      console.error('[API-CLIENT] Error parsing stored user:', error);
    }
  }
  return import.meta.env.VITE_DEFAULT_TENANT || null;
};

// Track if a token refresh is in progress
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

// Request interceptor to add auth token and tenant context
apiClient.interceptors.request.use(
  (config) => {
    // Skip auth for login and refresh token endpoints
    const isAuthEndpoint = config.url?.includes('auth/login') || config.url?.includes('auth/refresh-token');
    
    // Add auth token if available and not an auth endpoint
    if (!isAuthEndpoint) {
      const token = localStorage.getItem('fuelsync_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Add tenant context - check user role and endpoint type
    const storedUser = localStorage.getItem('fuelsync_user');
    let userRole = null;
    let tenantId = null;
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        userRole = user.role;
        tenantId = user.tenantId;
      } catch (error) {
        console.error('[API-CLIENT] Error parsing stored user:', error);
      }
    }
    
    // Don't add tenant ID for:
    // 1. Auth endpoints (login, refresh)
    // 2. Admin endpoints
    // 3. Superadmin users
    const isAdminEndpoint = config.url?.startsWith('/admin');
    const isSuperAdmin = userRole === 'superadmin';
    
    if (!isAuthEndpoint && !isAdminEndpoint && !isSuperAdmin) {
      if (tenantId) {
        config.headers['x-tenant-id'] = tenantId;
      } else {
        // Only warn for non-auth endpoints that actually need tenant context
        console.warn('[API-CLIENT] No tenant ID available - request may fail');
      }
    }
    
    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[API-CLIENT] Request:', {
        url: config.url,
        method: config.method,
        userRole: userRole || 'None',
        headers: {
          'x-tenant-id': config.headers['x-tenant-id'] || 'None',
          'Authorization': config.headers.Authorization ? 'Bearer [TOKEN]' : 'None'
        }
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and case conversion
apiClient.interceptors.response.use(
  (response) => {
    // Normalize property names and ensure consistent property access
    if (response.data) {
      response.data = ensurePropertyAccess(normalizePropertyNames(response.data));
    }
    
    // Handle standard API response format: {success: true, data: {...}}
    if (response.data?.success && response.data?.data) {
      // Preserve the original response structure but normalize the data inside
      const originalData = response.data;
      const dataObj = response.data.data;
      
      // Don't modify the response structure, just ensure the data is normalized
      if (dataObj.readings && Array.isArray(dataObj.readings)) {
        // Keep the original structure with normalized readings
        response.data = originalData;
      } else if (dataObj.prices && Array.isArray(dataObj.prices)) {
        // Keep the original structure with normalized prices
        response.data = originalData;
      } else if (Array.isArray(dataObj)) {
        // Keep the original structure with normalized array
        response.data = originalData;
      } else {
        // Keep the original structure with normalized object
        response.data = originalData;
      }
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is due to an expired token (401) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('auth/refresh-token')) {
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          // Try to refresh the token
          refreshPromise = axios.post(`${API_URL}/auth/refresh-token`);
          const response = await refreshPromise;
          
          // If successful, update the token
          const newToken = response.data.token;
          if (newToken) {
            localStorage.setItem('fuelsync_token', newToken);
            
            // Update user if returned
            if (response.data.user) {
              localStorage.setItem('fuelsync_user', JSON.stringify(response.data.user));
            }
            
            // Update the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            originalRequest._retry = true;
            
            // Retry the original request
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error('[API-CLIENT] Token refresh failed:', refreshError);
          // Clear auth data instead of hard redirect
          localStorage.removeItem('fuelsync_token');
          localStorage.removeItem('fuelsync_user');

          // Dispatch a custom event to notify AuthContext
          window.dispatchEvent(new CustomEvent('auth-expired'));
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      } else if (refreshPromise) {
        // If a refresh is already in progress, wait for it to complete
        try {
          await refreshPromise;
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('fuelsync_token')}`;
          originalRequest._retry = true;
          return apiClient(originalRequest);
        } catch (error) {
          return Promise.reject(error);
        }
      }
    }
    
    // Check if this is a network error (server not reachable)
    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.error('[API-CLIENT] Network error - server not reachable:', error);
      
      // Just log the error, don't redirect or store in localStorage
      // This prevents infinite redirect loops
      error.message = 'Network error: Unable to connect to server. Please check your internet connection.';
    } else {
      // Extract the error message from the response
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.status === 'error' && error.response?.data?.data) || 
                          error.message || 
                          'An unexpected error occurred';
      
      // Enhance the error object with the extracted message
      error.message = errorMessage;
      
      console.error(`[API-CLIENT] Request failed:`, {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: errorMessage,
        tenantId: error.config?.headers?.['x-tenant-id'] || 'Not provided',
        responseData: error.response?.data
      });
    }
    
    return Promise.reject(error);
  }
);

/**
 * Extract data from API response
 * @param response Axios response object
 * @returns Extracted data
 */
export function extractData<T>(response: any): T {
  // Handle different response formats
  if (response.data?.data) {
    return response.data.data as T;
  }
  
  if (response.data?.success && response.data?.data) {
    return response.data.data as T;
  }
  
  return response.data as T;
}

/**
 * Extract array data from API response
 * @param response Axios response object
 * @param arrayKey Optional key to extract array from
 * @returns Extracted array
 */
export function extractArray<T>(response: any, arrayKey?: string): T[] {
  // First check if response.data is directly an array
  if (Array.isArray(response.data)) {
    return response.data;
  }
  
  // Check if response.data.data is directly an array
  if (Array.isArray(response.data?.data)) {
    return response.data.data;
  }
  
  // Try to extract data using extractData
  const data = extractData(response);
  
  // If arrayKey is provided, try to get the array from that property
  if (arrayKey && data && typeof data === 'object') {
    // Check if the property exists
    if (arrayKey in data) {
      const arrayData = data[arrayKey as keyof typeof data];
      return Array.isArray(arrayData) ? arrayData : [];
    }
    
    // Check common array properties if the specified key doesn't exist
    for (const key of ['readings', 'items', 'results', 'data']) {
      if (key in data && Array.isArray(data[key as keyof typeof data])) {
        console.log(`[API-CLIENT] Found array in '${key}' property instead of '${arrayKey}'`);
        return data[key as keyof typeof data];
      }
    }
  }
  
  // Otherwise, assume the data itself is the array
  return Array.isArray(data) ? data : [];
}

// For backward compatibility
export const extractApiData = extractData;
export const extractApiArray = extractArray;

export default apiClient;
