
import { apiClient, extractApiData, extractApiArray } from './client';
import type { Sale, SalesFilters, ApiResponse } from './api-contract';

// Transform backend sales data to frontend format
const transformSale = (backendSale: any): Sale => {
  const volume = typeof backendSale.volume === 'string' ? parseFloat(backendSale.volume) : (backendSale.volume || 0);
  const amount = typeof backendSale.amount === 'string' ? parseFloat(backendSale.amount) : (backendSale.amount || 0);
  
  return {
    id: backendSale.id,
    nozzleId: backendSale.nozzle_id,
    stationId: backendSale.station_id || '', // Backend might not send this directly
    volume: isNaN(volume) ? 0 : volume,
    fuelType: backendSale.fuel_type || 'petrol', // Default or will be mapped via nozzle
    fuelPrice: volume > 0 ? amount / volume : 0, // Calculate price per liter
    amount: isNaN(amount) ? 0 : amount,
    paymentMethod: backendSale.payment_method || 'cash',
    creditorId: backendSale.creditor_id,
    status: backendSale.status || 'posted',
    recordedAt: backendSale.recorded_at || new Date().toISOString(),
    createdAt: backendSale.created_at || new Date().toISOString(),
  };
};

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
      
      let rawSales = extractApiArray<any>(response, 'sales');
      
      // If no sales found, try different extraction methods
      if (rawSales.length === 0 && response.data) {
        console.log('[SALES-API] No sales found with standard extraction, trying alternatives');
        
        // Try direct array access
        if (Array.isArray(response.data)) {
          console.log('[SALES-API] Response data is direct array');
          rawSales = response.data;
        }
        
        // Try other common response patterns
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log('[SALES-API] Using response.data.data array');
          rawSales = response.data.data;
        }
        
        if (response.data.results && Array.isArray(response.data.results)) {
          console.log('[SALES-API] Using response.data.results array');
          rawSales = response.data.results;
        }
      }
      
      // Transform backend data to frontend format
      const transformedSales = rawSales.map(transformSale);
      console.log(`[SALES-API] Transformed ${transformedSales.length} sales from response`);
      
      return transformedSales;
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
