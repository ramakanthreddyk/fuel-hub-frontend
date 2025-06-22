
import { apiClient } from './client';

export interface FuelInventory {
  id: string;
  stationId: string;
  stationName: string;
  fuelType: 'petrol' | 'diesel';
  currentVolume: number;
  lastUpdated: string;
}

export const fuelInventoryApi = {
  // Get fuel inventory status
  getFuelInventory: async (stationId?: string, fuelType?: 'petrol' | 'diesel'): Promise<FuelInventory[]> => {
    const params: any = {};
    if (stationId) params.stationId = stationId;
    if (fuelType) params.fuelType = fuelType;
    
    const response = await apiClient.get('/fuel-inventory', { params });
    return response.data;
  }
};
