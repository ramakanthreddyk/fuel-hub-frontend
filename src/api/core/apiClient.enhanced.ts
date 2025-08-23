/**
 * Enhanced API Client
 * 
 * This file extends the base apiClient with enhanced data extraction and transformation
 * to handle inconsistencies between frontend and backend API contracts.
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { sanitizeUrlParam, secureLog } from '@/utils/security';
import { normalizePropertyNames, ensurePropertyAccess } from '../../utils/apiTransform';

// Create base axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://fuelsync-api-demo-bvadbhg8bdbmg0ff.germanywestcentral-01.azurewebsites.net',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for data normalization
apiClient.interceptors.response.use(
  (response) => {
    // Normalize response data to ensure consistent property access
    if (response.data) {
      response.data = ensurePropertyAccess(response.data);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Extract data from API response with enhanced error handling and data normalization
 */
export function extractData<T>(response: AxiosResponse): T {
  if (!response.data) {
    secureLog.warn('API response missing data property:', response);
    return {} as T;
  }

  let data: any;
  
  // Handle different response formats
  if (response.data.data) {
    data = response.data.data;
  } else if (response.data.success !== undefined && response.data.data) {
    data = response.data.data;
  } else {
    data = response.data;
  }
  
  return normalizePropertyNames<T>(data);
}

/**
 * Extract array from API response with enhanced error handling and data normalization
 */
export function extractArray<T>(response: AxiosResponse, arrayKey?: string): T[] {
  if (!response.data) {
    secureLog.warn('API response missing data property:', response);
    return [];
  }

  let items: any[] = [];
  
  // Handle different response formats
  if (arrayKey && response.data.data && Array.isArray(response.data.data[arrayKey])) {
    items = response.data.data[arrayKey];
  } else if (arrayKey && response.data[arrayKey] && Array.isArray(response.data[arrayKey])) {
    items = response.data[arrayKey];
  } else if (response.data.data && Array.isArray(response.data.data)) {
    items = response.data.data;
  } else if (Array.isArray(response.data)) {
    items = response.data;
  } else {
    secureLog.warn(`Could not extract array from response${arrayKey ? ` with key ${arrayKey}` : ''}:`, response.data);
    return [];
  }
  
  return items.map(item => normalizePropertyNames<T>(item));
}

export default apiClient;