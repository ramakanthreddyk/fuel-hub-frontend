
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
      const response = await apiClient.get(url);
      return extractApiArray<Sale>(response, 'sales');
    } catch (error) {
      console.error('Error fetching sales:', error);
      return [];
    }
  }
};

// Export types for backward compatibility
export type { Sale, SalesFilters };
