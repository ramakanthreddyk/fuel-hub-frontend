
import { apiClient } from './client';

export interface FuelInventory {
  id: string;
  stationId: string;
  fuelType: 'petrol' | 'diesel';
  availableVolume: number;
  lastUpdated: string;
  station?: {
    name: string;
  };
}

export const fuelInventoryApi = {
  // Get fuel inventory data
  getFuelInventory: async (stationId?: string, fuelType?: string): Promise<FuelInventory[]> => {
    const params: any = {};
    if (stationId) params.stationId = stationId;
    if (fuelType) params.fuelType = fuelType;
    
    const response = await apiClient.get('/fuel-inventory', { params });
    return response.data;
  }
};
