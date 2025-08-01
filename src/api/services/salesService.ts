/**
 * @file api/services/salesService.ts
 * @description Service for sales API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';

// Default tenant ID for demo purposes
const DEFAULT_TENANT_ID = "df9347c2-9f6c-4d32-942f-1208b91fbb2b";

export interface Sale {
  id: string;
  nozzleId: string;
  stationId: string;
  stationName: string;
  pumpId: string;
  pumpName: string;
  nozzleNumber: number;
  fuelType: string;
  volume: number;
  fuelPrice: number;
  amount: number;
  paymentMethod: string;
  status?: string;
  recordedAt: string;
}

export interface SalesFilters {
  stationId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}

export const salesService = {
  /**
   * Get sales list
   */
  getSales: async (filters: SalesFilters = {}): Promise<Sale[]> => {
    try {
      console.log('[SALES-API] Fetching sales with filters:', filters);
      
      const params = new URLSearchParams();
      if (filters.stationId) params.append('stationId', filters.stationId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.page) params.append('page', filters.page.toString());

      console.log('[SALES-API] Request URL:', `/sales?${params.toString()}`);
      
      // Check if user is logged in
      const storedUser = localStorage.getItem('fuelsync_user');
      console.log('[SALES-API] Stored user:', storedUser ? JSON.parse(storedUser) : 'None');
      
      // Get tenant ID from stored user or use default
      let tenantId = DEFAULT_TENANT_ID;
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user.tenantId) {
            tenantId = user.tenantId;
          }
        } catch (error) {
          console.error('[SALES-API] Error parsing user data:', error);
        }
      }
      
      // Explicitly add tenant ID header to ensure it's sent
      const response = await apiClient.get(`/sales?${params.toString()}`, {
        headers: {
          'x-tenant-id': tenantId
        }
      });
      console.log('[SALES-API] Response received:', response.data);
      
      // Handle different response structures
      let salesArray: Sale[] = [];
      
      if (response.data?.data?.sales) {
        salesArray = response.data.data.sales;
      } else if (response.data?.sales) {
        salesArray = response.data.sales;
      } else if (Array.isArray(response.data)) {
        salesArray = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        salesArray = response.data.data;
      } else {
        salesArray = extractArray<Sale>(response, 'sales');
      }
      
      console.log(`[SALES-API] Successfully fetched ${salesArray.length} sales`);
      return salesArray;
    } catch (error: any) {
      console.error('[SALES-API] Error fetching sales:', error);

      // If it's an auth error, re-throw it
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        throw error;
      }

      // For other errors (like 404 - no data), return empty array
      if (error?.response?.status === 404) {
        console.log('[SALES-API] No sales data found, returning empty array');
        return [];
      }

      // For network errors or server errors, still throw
      if (!error?.response || error?.response?.status >= 500) {
        throw error;
      }

      // For other client errors, return empty array
      console.log('[SALES-API] Client error, returning empty array:', error?.response?.status);
      return [];
    }
  }
};