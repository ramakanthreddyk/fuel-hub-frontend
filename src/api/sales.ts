
import { apiClient, extractApiData, extractApiArray } from './client';
import type { Sale, SalesFilters, ApiResponse } from './api-contract';

export const salesApi = {
  // Get sales with filters
  getSales: async (filters: SalesFilters = {}): Promise<Sale[]> => {
    try {
      const params = new URLSearchParams();
      
      // Only add non-empty filter values
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
      
      const queryString = params.toString();
      const url = `/sales${queryString ? `?${queryString}` : ''}`;
      
      console.log('[SALES-API] Fetching sales with URL:', url);
      console.log('[SALES-API] Applied filters:', filters);
      
      const response = await apiClient.get(url);
      console.log('[SALES-API] Raw response:', response.data);
      
      const sales = extractApiArray<Sale>(response, 'sales');
      console.log(`[SALES-API] Extracted ${sales.length} sales from response`);
      
      // If no sales found, try different extraction methods
      if (sales.length === 0 && response.data) {
        console.log('[SALES-API] No sales found with standard extraction, trying alternatives');
        
        // Try direct array access
        if (Array.isArray(response.data)) {
          console.log('[SALES-API] Response data is direct array');
          return response.data as Sale[];
        }
        
        // Try other common response patterns
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log('[SALES-API] Using response.data.data array');
          return response.data.data as Sale[];
        }
        
        if (response.data.results && Array.isArray(response.data.results)) {
          console.log('[SALES-API] Using response.data.results array');
          return response.data.results as Sale[];
        }
      }
      
      return sales;
    } catch (error: any) {
      console.error('[SALES-API] Error fetching sales:', error);
      console.error('[SALES-API] Error response:', error.response?.data);
      console.error('[SALES-API] Error status:', error.response?.status);
      console.error('[SALES-API] Error config:', error.config);
      
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }
  }
};

// Export types for backward compatibility
export type { Sale, SalesFilters };
