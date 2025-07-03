/**
 * @file api/core/apiClient.ts
 * @description Centralized API client for core layer
 */
import axios from 'axios';
import { convertKeysToCamelCase } from '@/utils/caseConversion';

// Get the backend URL from environment variables or use the correct API URL
const API_BASE_URL = 'https://fuelsync-api-demo-bvadbhg8bdbmg0ff.germanywestcentral-01.azurewebsites.net';

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

// Request interceptor to add auth token and tenant context
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('fuelsync_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add tenant context
    const storedUser = localStorage.getItem('fuelsync_user');
    let tenantId = DEFAULT_TENANT_ID; // Default tenant ID
    let role = 'attendant'; // Default role
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.tenantId) {
          tenantId = user.tenantId;
        }
        if (user.role) {
          role = user.role;
        }
      } catch (error) {
        console.error('[API-CLIENT] Error parsing stored user:', error);
      }
    }
    
    // Always include tenant ID header
    config.headers['x-tenant-id'] = tenantId;
    
    // Add role for debugging
    config.headers['x-user-role'] = role;
    
    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[API-CLIENT] Request:', {
        url: config.url,
        method: config.method,
        headers: {
          'x-tenant-id': config.headers['x-tenant-id'],
          'x-user-role': config.headers['x-user-role'],
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
  (error) => {
    console.error(`[API-CLIENT] Request failed:`, {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      tenantId: error.config?.headers?.['x-tenant-id'] || 'Not provided',
      role: error.config?.headers?.['x-user-role'] || 'Not provided'
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