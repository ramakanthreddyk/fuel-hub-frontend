/**
 * @file ApiContext.tsx
 * @description Global API context for FuelSync application
 */
import React, { createContext, useContext, ReactNode } from 'react';

// API configuration
export const API_CONFIG = {
  baseUrl: 'https://fuelsync-api-demo-bvadbhg8bdbmg0ff.germanywestcentral-01.azurewebsites.net',
  endpoints: {
    nozzles: '/api/v1/nozzles',
    pumps: '/api/v1/pumps',
    stations: '/api/v1/stations',
    readings: '/api/v1/nozzle-readings',
    fuelPrices: '/api/v1/fuel-prices',
    users: '/api/v1/users'
  }
};

interface ApiContextType {
  getAuthHeaders: () => Record<string, string>;
  fetchApi: <T>(endpoint: string, options?: RequestInit) => Promise<T>;
  getFullUrl: (endpoint: string) => string;
}

const ApiContext = createContext<ApiContextType | null>(null);

/**
 * Provider component for API context
 */
export function ApiProvider({ children }: { children: ReactNode }) {
  // Get authentication headers for API requests
  const getAuthHeaders = () => {
    const token = localStorage.getItem('fuelsync_token');
    const user = JSON.parse(localStorage.getItem('fuelsync_user') || '{}');
    const tenantId = user.tenantId || '';
    
    return {
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': tenantId,
      'Accept': 'application/json'
    };
  };

  // Helper to get full URL for an endpoint
  const getFullUrl = (endpoint: string) => {
    return `${API_CONFIG.baseUrl}${endpoint}`;
  };

  // Fetch API with standard error handling
  const fetchApi = async <T,>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = getFullUrl(endpoint);
    const response = await fetch(url, {
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {})
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle different response formats
    if (data.success && data.data) {
      return data.data as T;
    }
    
    return data as T;
  };

  const value = {
    getAuthHeaders,
    fetchApi,
    getFullUrl
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

/**
 * Hook to use the API context
 */
export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}