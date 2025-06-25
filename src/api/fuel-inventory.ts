
import { apiClient } from './client';

export interface FuelInventory {
  id: string;
  stationId: string;
  stationName: string;
  fuelType: 'petrol' | 'diesel';
  currentVolume: number;
  lastUpdated: string;
}

export interface FuelInventoryParams {
  stationId?: string;
  fuelType?: string;
}

export const fuelInventoryApi = {
  // Get fuel inventory status with optional filtering
  getFuelInventory: async (params?: FuelInventoryParams): Promise<FuelInventory[]> => {
    const searchParams = new URLSearchParams();
    if (params?.stationId) searchParams.append('stationId', params.stationId);
    if (params?.fuelType) searchParams.append('fuelType', params.fuelType);
    
    const response = await apiClient.get(`/fuel-inventory?${searchParams.toString()}`);
    return response.data;
  }
};
