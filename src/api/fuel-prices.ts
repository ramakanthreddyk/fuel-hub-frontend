
import { apiClient } from './client';
import { ensureArray } from '@/utils/apiHelpers';

export interface FuelPrice {
  id: string;
  stationId: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  price: number;
  validFrom: string;
  createdAt: string;
  station?: {
    name: string;
  };
}

export interface CreateFuelPriceRequest {
  stationId: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  price: number;
  validFrom?: string;
}

export const fuelPricesApi = {
  // Get all fuel prices
  getFuelPrices: async (): Promise<FuelPrice[]> => {
    try {
      const response = await apiClient.get('/fuel-prices');
      return ensureArray<FuelPrice>(response.data);
    } catch (error) {
      console.error('Error fetching fuel prices:', error);
      return [];
    }
  },

  // Create new fuel price
  createFuelPrice: async (data: CreateFuelPriceRequest): Promise<FuelPrice> => {
    const response = await apiClient.post('/fuel-prices', data);
    return response.data;
  },

  // Update fuel price
  updateFuelPrice: async (id: string, data: Partial<CreateFuelPriceRequest>): Promise<FuelPrice> => {
    const response = await apiClient.put(`/fuel-prices/${id}`, data);
    return response.data;
  }
};
