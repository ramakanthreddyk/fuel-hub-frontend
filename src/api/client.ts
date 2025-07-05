/**
 * @file client.ts
 * @description Centralized API client
 */
import axios from 'axios';

// Get the backend URL from environment variables or use the default API URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://fuelsync-api-demo-bvadbhg8bdbmg0ff.germanywestcentral-01.azurewebsites.net';

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
import type { ZodSchema } from 'zod';

export function extractApiData<T>(response: any, schema?: ZodSchema<T>): T {
  let data: any;
  if (response.data?.data) {
    data = response.data.data;
  } else if (response.data?.success && response.data?.data) {
    data = response.data.data;
  } else {
    data = response.data;
  }

  if (schema) {
    const result = schema.safeParse(data);
    if (!result.success) {
      console.error('[API-CLIENT] Response validation error:', result.error);
    } else {
      data = result.data;
    }
  }

  return data as T;
}

/**
 * Extract array data from API response
 * @param response Axios response object
 * @param arrayKey Optional key to extract array from
 * @returns Extracted array
 */
export function extractApiArray<T>(
  response: any,
  arrayKey?: string,
  schema?: ZodSchema<T>
): T[] {
  const data = extractApiData(response);
  
  // If arrayKey is provided, try to get the array from that property
  if (arrayKey && data && typeof data === 'object' && arrayKey in data) {
    const arrayData = data[arrayKey as keyof typeof data];
    const arr = Array.isArray(arrayData) ? arrayData : [];
    return schema ? validateArray(arr, schema) : arr;
  }

  // Otherwise, assume the data itself is the array
  const arr = Array.isArray(data) ? data : [];
  return schema ? validateArray(arr, schema) : arr;
}

function validateArray<T>(items: any[], schema: ZodSchema<T>): T[] {
  return items.reduce<T[]>((acc, item) => {
    const result = schema.safeParse(item);
    if (!result.success) {
      console.error('[API-CLIENT] Response validation error:', result.error);
    } else {
      acc.push(result.data);
    }
    return acc;
  }, []);
}
