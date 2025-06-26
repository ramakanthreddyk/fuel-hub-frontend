import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { camelCase, isObject, isArray } from 'lodash';
import type { ApiResponse, ApiError } from './api-contract';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// Helper function to convert snake_case keys to camelCase recursively
const toCamelCase = (obj: any): any => {
  if (isArray(obj)) {
    return obj.map((item) => toCamelCase(item));
  } else if (isObject(obj) && obj !== null && !(obj instanceof Date)) {
    const camelCaseObj: any = {};
    Object.keys(obj).forEach((key) => {
      const camelKey = camelCase(key);
      camelCaseObj[camelKey] = toCamelCase(obj[key]);
    });
    return camelCaseObj;
  }
  return obj;
};

// Helper function for conditional development logging
const devLog = (message: string, ...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log(`[API-CLIENT] ${message}`, ...args);
  }
};

const devError = (message: string, ...args: any[]) => {
  if (import.meta.env.DEV) {
    console.error(`[API-CLIENT] ${message}`, ...args);
  }
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
  timeout: 10000,
});

// Request interceptor to add auth token and conditional tenant_id header
apiClient.interceptors.request.use(
  (config) => {
    devLog(`Making request to: ${config.baseURL}${config.url}`);
    
    const token = localStorage.getItem('fuelsync_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      devLog('Added authorization token to request');
      
      // Only add tenant-id header for non-admin routes
      const isAdminRoute = config.url?.startsWith('/admin/');
      const isAuthRoute = config.url?.startsWith('/auth/');
      
      if (!isAdminRoute && !isAuthRoute) {
        // Extract tenant_id from JWT token for regular tenant-scoped routes
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.tenantId) {
            config.headers['x-tenant-id'] = payload.tenantId;
            devLog('Added tenant-id header from JWT:', payload.tenantId);
          } else {
            devLog('No tenantId found in JWT payload (likely superadmin)');
          }
        } catch (error) {
          devLog('Error parsing JWT token for tenant_id:', error);
        }
      } else {
        devLog(`Skipping tenant-id header for ${isAdminRoute ? 'admin' : 'auth'} route`);
      }
    } else {
      devLog('No token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    devError('Request interceptor error:', error);
    toast({
      title: "Request Error",
      description: "Failed to prepare request. Please try again.",
      variant: "destructive",
    });
    return Promise.reject(error);
  }
);

// Response interceptor with standardized response handling and snake_case to camelCase conversion
apiClient.interceptors.response.use(
  (response) => {
    devLog('Response received:', { 
      url: response.config.url,
      status: response.status,
      hasData: !!response.data
    });
    
    // Convert snake_case to camelCase for all response data
    if (response.data) {
      response.data = toCamelCase(response.data);
    }
    
    // Standardize response data access - always ensure data is accessible at response.data
    // Handle both wrapped ({ data: ... }) and direct responses
    if (response.data && typeof response.data === 'object') {
      // If response has a 'data' property, keep it as is (already standardized)
      // If response doesn't have 'data' property, it's the actual data
      if (!response.data.hasOwnProperty('data')) {
        // Wrap direct responses in standardized format
        const originalData = response.data;
        response.data = {
          data: originalData,
          success: true
        };
      }
    }
    
    return response;
  },
  (error) => {
    devError('Request failed:', { 
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    // Don't show toasts for login requests to avoid double error messages
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    
    // Handle different types of errors with user-friendly messages
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          if (!isLoginRequest) {
            devLog('401 error detected, redirecting to login');
            localStorage.removeItem('fuelsync_token');
            localStorage.removeItem('fuelsync_user');
            
            toast({
              title: "Session Expired",
              description: "Your session has expired. Please log in again.",
              variant: "destructive",
            });
            
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
          }
          break;
          
        case 403:
          toast({
            title: "Access Denied",
            description: "You don't have permission to perform this action.",
            variant: "destructive",
          });
          break;
          
        case 404:
          toast({
            title: "Not Found",
            description: data?.error?.message || data?.message || "The requested resource was not found.",
            variant: "destructive",
          });
          break;
          
        case 422:
          // Validation errors - use standardized error format
          const validationMessage = data?.error?.message || data?.message || "Please check your input and try again.";
          toast({
            title: "Validation Error",
            description: validationMessage,
            variant: "destructive",
          });
          break;
          
        case 429:
          toast({
            title: "Too Many Requests",
            description: "Please wait a moment before trying again.",
            variant: "destructive",
          });
          break;
          
        case 500:
        case 502:
        case 503:
        case 504:
          toast({
            title: "Server Error",
            description: "Something went wrong on our end. Please try again later.",
            variant: "destructive",
          });
          break;
          
        default:
          if (!isLoginRequest) {
            toast({
              title: "Request Failed",
              description: data?.error?.message || data?.message || `Request failed with status ${status}`,
              variant: "destructive",
            });
          }
      }
    } else if (error.request) {
      // Network error
      toast({
        title: "Network Error",
        description: "Unable to connect to the server. Please check your internet connection.",
        variant: "destructive",
      });
    } else {
      // Other errors
      if (!isLoginRequest) {
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function for handling API success messages
export const showSuccessToast = (title: string, description?: string) => {
  toast({
    title,
    description,
    variant: "default",
  });
};

// Helper function for handling API error messages
export const showErrorToast = (title: string, description?: string) => {
  toast({
    title,
    description,
    variant: "destructive",
  });
};

/**
 * Standardized data extraction helper
 * Always extracts data from response.data.data (standardized format)
 */
export const extractApiData = <T>(response: any): T => {
  return response.data?.data || response.data;
};

/**
 * Standardized array data extraction helper
 * Ensures we always return an array, even if the response format varies
 */
export const extractApiArray = <T>(response: any, fallbackKey?: string): T[] => {
  const data = response.data?.data || response.data;
  
  // If data is already an array, return it
  if (Array.isArray(data)) {
    return data;
  }
  
  // If data is an object with a fallback key (e.g., 'users', 'stations'), try that
  if (fallbackKey && data && Array.isArray(data[fallbackKey])) {
    return data[fallbackKey];
  }
  
  // If data is an object, check for common array keys
  if (data && typeof data === 'object') {
    const commonArrayKeys = ['items', 'results', 'list', 'records'];
    for (const key of commonArrayKeys) {
      if (Array.isArray(data[key])) {
        return data[key];
      }
    }
  }
  
  // Last resort: return empty array
  devError('Unable to extract array from response:', data);
  return [];
};
