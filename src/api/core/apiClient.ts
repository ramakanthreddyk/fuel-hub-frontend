/**
 * @file api/core/apiClient.ts
 * @description Centralized API client for core layer
 */
import axios from 'axios';
import { convertKeysToCamelCase } from '@/utils/caseConversion';

// Get the backend URL from environment variables or use the default API URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://fuelsync-api-demo-bvadbhg8bdbmg0ff.germanywestcentral-01.azurewebsites.net';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Default tenant ID for demo purposes
const DEFAULT_TENANT_ID = "df9347c2-9f6c-4d32-942f-1208b91fbb2b";

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

    // Add tenant context - important for attendant role
    const storedUser = localStorage.getItem('fuelsync_user');
    let tenantId = DEFAULT_TENANT_ID; // Default tenant ID
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.tenantId && user.role !== 'superadmin') {
          tenantId = user.tenantId;
        }
        // For superadmin, don't add tenant header for admin endpoints
        if (user.role === 'superadmin' && config.url?.startsWith('/admin')) {
          // Don't add tenant header for superadmin admin endpoints
        } else if (user.role !== 'superadmin') {
          config.headers['x-tenant-id'] = tenantId;
        }
      } catch (error) {
        console.error('[API-CLIENT] Error parsing stored user:', error);
        if (!config.url?.startsWith('/admin')) {
          config.headers['x-tenant-id'] = tenantId;
        }
      }
    } else if (!config.url?.startsWith('/admin')) {
      // Always include tenant ID header for non-admin requests
      config.headers['x-tenant-id'] = tenantId;
    }
    
    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[API-CLIENT] Request:', {
        url: config.url,
        method: config.method,
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
    // Convert snake_case keys to camelCase in the response data
    if (response.data) {
      response.data = convertKeysToCamelCase(response.data);
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
          refreshPromise = axios.post(`${API_BASE_URL}/api/v1/auth/refresh-token`);
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
          // If refresh fails, redirect to login
          window.location.href = '/login';
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
    
    console.error(`[API-CLIENT] Request failed:`, {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      tenantId: error.config?.headers?.['x-tenant-id'] || 'Not provided'
    });
    
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
  const data = extractData(response);
  
  // If arrayKey is provided, try to get the array from that property
  if (arrayKey && data && typeof data === 'object' && arrayKey in data) {
    const arrayData = data[arrayKey as keyof typeof data];
    return Array.isArray(arrayData) ? arrayData : [];
  }
  
  // Otherwise, assume the data itself is the array
  return Array.isArray(data) ? data : [];
}

// For backward compatibility
export const extractApiData = extractData;
export const extractApiArray = extractArray;

export default apiClient;
