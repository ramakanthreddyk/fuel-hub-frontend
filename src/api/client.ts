/**
 * @file client.ts
 * @description Centralized API client
 */
import axios from 'axios';

// Get the backend URL from environment variables or use the correct API URL
const API_BASE_URL = 'https://fuelsync-api-demo-bvadbhg8bdbmg0ff.germanywestcentral-01.azurewebsites.net';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

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
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.tenantId) {
          config.headers['x-tenant-id'] = user.tenantId;
        }
      } catch (error) {
        console.error('[API-CLIENT] Error parsing stored user:', error);
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
    console.error(`[API-CLIENT] Request failed:`, {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    return Promise.reject(error);
  }
);

/**
 * Extract data from API response
 * @param response Axios response object
 * @returns Extracted data
 */
export function extractApiData<T>(response: any): T {
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
export function extractApiArray<T>(response: any, arrayKey?: string): T[] {
  const data = extractApiData(response);
  
  // If arrayKey is provided, try to get the array from that property
  if (arrayKey && data && typeof data === 'object' && arrayKey in data) {
    const arrayData = data[arrayKey as keyof typeof data];
    return Array.isArray(arrayData) ? arrayData : [];
  }
  
  // Otherwise, assume the data itself is the array
  return Array.isArray(data) ? data : [];
}