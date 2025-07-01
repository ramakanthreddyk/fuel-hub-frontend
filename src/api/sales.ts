import { apiClient, extractApiData, extractApiArray } from './client';
import type { Sale, SalesFilters, ApiResponse } from './api-contract';

// Transform backend sales data to frontend format
const transformSale = (backendSale: any): Sale => {
  const volume = typeof backendSale.volume === 'string' ? parseFloat(backendSale.volume) : (backendSale.volume || 0);
  const amount = typeof backendSale.amount === 'string' ? parseFloat(backendSale.amount) : (backendSale.amount || 0);
  
  return {
    id: backendSale.id,
    nozzleId: backendSale.nozzle_id || backendSale.nozzleId,
    stationId: backendSale.station_id || backendSale.stationId || '',
    volume: isNaN(volume) ? 0 : volume,
    fuelType: backendSale.fuel_type || backendSale.fuelType || 'petrol',
    fuelPrice: volume > 0 ? amount / volume : 0,
    amount: isNaN(amount) ? 0 : amount,
    paymentMethod: backendSale.payment_method || backendSale.paymentMethod || 'cash',
    creditorId: backendSale.creditor_id || backendSale.creditorId,
    status: backendSale.status || 'posted',
    recordedAt: backendSale.recorded_at || backendSale.recordedAt || new Date().toISOString(),
    createdAt: backendSale.created_at || backendSale.createdAt || new Date().toISOString(),
    // Include nested objects if present
    nozzle: backendSale.nozzle,
  };
};

export const salesApi = {
  // Get sales with filters - using correct endpoint from API spec
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
      
      // If no sales found with standard extraction, try alternatives
      if (rawSales.length === 0 && response.data) {
        console.log('[SALES-API] Trying alternative extraction methods');
        
        if (Array.isArray(response.data)) {
          rawSales = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          rawSales = response.data.data;
        } else if (response.data.results && Array.isArray(response.data.results)) {
          rawSales = response.data.results;
        }
      }
      
      // Transform backend data to frontend format
      const transformedSales = rawSales.map(transformSale);
      console.log(`[SALES-API] Transformed ${transformedSales.length} sales`);
      
      return transformedSales;
    } catch (error: any) {
      console.error('[SALES-API] Error fetching sales:', error);
      console.error('[SALES-API] Error response:', error.response?.data);
      
      // Return empty array instead of throwing
      return [];
    }
  }
};

// Export types for backward compatibility
export type { Sale, SalesFilters };
