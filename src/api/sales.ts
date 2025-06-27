
import { apiClient, extractApiData, extractApiArray } from './client';
import type { Sale, SalesFilters, ApiResponse } from './api-contract';

export const salesApi = {
  // Get sales with filters
  getSales: async (filters: SalesFilters = {}): Promise<Sale[]> => {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      
      const queryString = params.toString();
      const url = `/sales${queryString ? `?${queryString}` : ''}`;
      console.log('[SALES-API] Fetching sales with filters:', filters);
      const response = await apiClient.get(url);
      const sales = extractApiArray<Sale>(response, 'sales');
      console.log(`[SALES-API] Fetched ${sales.length} sales`);
      return sales;
    } catch (error: any) {
      console.error('[SALES-API] Error fetching sales:', error);
      console.error('[SALES-API] Error details:', error.response?.data);
      // Don't let 401 errors cause logout - just return empty array
      return [];
    }
  }
};

// Export types for backward compatibility
export type { Sale, SalesFilters };
