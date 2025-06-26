
import { apiClient, extractApiData, extractApiArray } from './client';
import type { FuelInventory, ApiResponse } from './api-contract';

export interface FuelInventoryParams {
  stationId?: string;
  fuelType?: string;
}

export const fuelInventoryApi = {
  // Get fuel inventory status with optional filtering
  getFuelInventory: async (params?: FuelInventoryParams): Promise<FuelInventory[]> => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.stationId) searchParams.append('stationId', params.stationId);
      if (params?.fuelType) searchParams.append('fuelType', params.fuelType);
      
      const response = await apiClient.get(`/fuel-inventory?${searchParams.toString()}`);
      return extractApiArray<FuelInventory>(response, 'inventory');
    } catch (error) {
      console.error('Error fetching fuel inventory:', error);
      return [];
    }
  }
};

// Export types for backward compatibility
export type { FuelInventory, FuelInventoryParams };
