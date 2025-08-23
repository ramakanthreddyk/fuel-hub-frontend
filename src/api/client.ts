/**
 * @file client.ts
 * @description Centralized API client
 */
import axios from 'axios';
import { secureLog, sanitizeForLogging } from '@/utils/security';

/**
 * Backend selection is controlled ONLY by VITE_API_BASE_URL.
 * Set this in your .env for production, and .env.development for local.
 * Example:
 *   Production: VITE_API_BASE_URL=https://your-production-backend/api/v1
 *   Development: VITE_API_BASE_URL=http://localhost:3003/api/v1
 */
function getApiBaseUrl() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is not set. Please set it in your .env file.');
  }
  secureLog.info('[API-CLIENT] Using API base URL:', sanitizeForLogging(apiBaseUrl));
  return apiBaseUrl;
}

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL.replace(/\/?$/, '/api/v1'),
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
    let tenantId = undefined;
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.tenantId) {
          tenantId = user.tenantId;
          config.headers['x-tenant-id'] = user.tenantId;
        }
      } catch (error) {
        secureLog.error('[API-CLIENT] Error parsing stored user:', sanitizeForLogging(String(error)));
      }
    }
    // Debug log outgoing request headers
    secureLog.debug('[API-CLIENT] Outgoing request:', {
      url: sanitizeForLogging(config.url),
      method: sanitizeForLogging(config.method),
      hasAuth: !!token,
      tenantId: sanitizeForLogging(tenantId)
    });

    return config;
  },
  (error) => {
    return Promise.reject(new Error(error));
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    secureLog.error(`[API-CLIENT] Request failed:`, {
      url: sanitizeForLogging(error.config?.url),
      method: sanitizeForLogging(error.config?.method),
      status: error.response?.status,
      message: sanitizeForLogging(error.response?.data?.message || error.message)
    });
    
    // Handle authentication errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      secureLog.warn('[API-CLIENT] Authentication error detected:', {
        url: sanitizeForLogging(error.config?.url),
        status: error.response?.status,
        message: sanitizeForLogging(error.response?.data?.message)
      });
      
      // Only clear auth data and redirect if this wasn't a login attempt
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      const isCurrentUserLoggedIn = !!localStorage.getItem('fuelsync_token') && !!localStorage.getItem('fuelsync_user');
      
      if (!isLoginRequest && isCurrentUserLoggedIn) {
        secureLog.error('[API-CLIENT] Authenticated request failed with auth error, this suggests token is invalid');
        
        // Clear stored auth data
        localStorage.removeItem('fuelsync_token');
        localStorage.removeItem('fuelsync_user');
        
        // Dispatch custom event for AuthContext to handle
        window.dispatchEvent(new Event('auth-expired'));
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          secureLog.info('[API-CLIENT] Redirecting to login due to auth failure');
          window.location.href = '/login';
        }
      } else if (isLoginRequest) {
        secureLog.info('[API-CLIENT] Login request failed, not clearing session');
      } else {
        secureLog.info('[API-CLIENT] Auth error but no current session, ignoring');
      }
  return Promise.reject(new Error(error));
    }
    
  return Promise.reject(new Error(error));
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
  } else {
    data = response.data;
  }

  if (schema) {
    const result = schema.safeParse(data);
    if (!result.success) {
      secureLog.error('[API-CLIENT] Response validation error:', sanitizeForLogging(String(result.error)));
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
  secureLog.error('[API-CLIENT] Response validation error:', sanitizeForLogging(String(result.error).replace(/\n|\r/g, ' ')));
    } else {
      acc.push(result.data);
    }
    return acc;
  }, []);
}
