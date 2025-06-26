
import { apiClient, extractApiData, extractApiArray } from './client';
import type { FuelPrice, CreateFuelPriceRequest, ApiResponse } from './api-contract';

export const fuelPricesApi = {
  // Get all fuel prices
  getFuelPrices: async (): Promise<FuelPrice[]> => {
    try {
      const response = await apiClient.get('/fuel-prices');
      return extractApiArray<FuelPrice>(response, 'fuelPrices');
    } catch (error) {
      console.error('Error fetching fuel prices:', error);
      return [];
    }
  },

  // Create new fuel price
  createFuelPrice: async (data: CreateFuelPriceRequest): Promise<FuelPrice> => {
    const response = await apiClient.post('/fuel-prices', data);
    return extractApiData<FuelPrice>(response);
  },

  // Update fuel price using PUT - OpenAPI spec shows request body as object (no specific fields defined)
  updateFuelPrice: async (id: string, data: object): Promise<FuelPrice> => {
    const response = await apiClient.put(`/fuel-prices/${id}`, data);
    return extractApiData<FuelPrice>(response);
  }
};

// Export types for backward compatibility
export type { FuelPrice, CreateFuelPriceRequest };
