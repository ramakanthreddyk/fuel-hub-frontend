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

    // Add tenant context - ALWAYS required for API calls
    const storedUser = localStorage.getItem('fuelsync_user');
    
    // Always add tenant ID header for non-admin endpoints
    if (!config.url?.startsWith('/admin') && !isAuthEndpoint) {
      // Default to demo tenant ID
      config.headers['x-tenant-id'] = DEFAULT_TENANT_ID;
    }
    
    // Override with user's tenant ID if available
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.tenantId && user.role !== 'superadmin') {
          config.headers['x-tenant-id'] = user.tenantId;
        }
        // For superadmin, don't add tenant header for admin endpoints
        if (user.role === 'superadmin' && config.url?.startsWith('/admin')) {
          // Don't add tenant header for superadmin admin endpoints
          delete config.headers['x-tenant-id'];
        }
      } catch (error) {
        console.error('[API-CLIENT] Error parsing stored user:', error);
      }
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
    // Normalize property names and ensure consistent property access
    if (response.data) {
      response.data = ensurePropertyAccess(normalizePropertyNames(response.data));
    }
    
    // Handle standard API response format: {success: true, data: {...}}
    if (response.data?.success && response.data?.data) {
      const dataObj = response.data.data;
      // Check for common array properties and extract them
      if (dataObj.readings && Array.isArray(dataObj.readings)) {
        response.data = dataObj.readings;
      } else if (dataObj.prices && Array.isArray(dataObj.prices)) {
        response.data = dataObj.prices;
      } else if (Array.isArray(dataObj)) {
        response.data = dataObj;
      } else {
        response.data = dataObj;
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
    
    // Check if this is a network error (server not reachable)
    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.error('[API-CLIENT] Network error - server not reachable:', error);
      
      // Store the error state in localStorage so we can show a proper error page
      localStorage.setItem('fuelsync_api_error', JSON.stringify({
        type: 'network',
        message: 'Unable to connect to the backend server',
        timestamp: new Date().toISOString()
      }));
      
      // If we're not already on the error page, redirect to it
      if (!window.location.pathname.includes('/error')) {
        window.location.href = '/error';
      }
    } else {
      console.error(`[API-CLIENT] Request failed:`, {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        tenantId: error.config?.headers?.['x-tenant-id'] || 'Not provided'
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
