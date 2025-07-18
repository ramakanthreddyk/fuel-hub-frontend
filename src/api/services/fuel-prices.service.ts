
/**
 * Fuel Prices Service
 * 
 * API service for managing fuel prices
 */

import { apiClient } from '../client';
import type { 
  FuelPrice, 
  CreateFuelPriceRequest, 
  UpdateFuelPriceRequest,
  FuelPriceValidation,
  ApiResponse 
} from '../api-contract';

export const fuelPricesService = {
  // Get all fuel prices
  getFuelPrices: async (stationId?: string): Promise<FuelPrice[]> => {
    const params = stationId ? { stationId } : {};
    const response = await apiClient.get<ApiResponse<{ prices: FuelPrice[] }>>('/fuel-prices', { params });
    return response.data.data.prices;
  },

  // Get fuel price by ID
  getFuelPrice: async (id: string): Promise<FuelPrice> => {
    const response = await apiClient.get<ApiResponse<FuelPrice>>(`/fuel-prices/${id}`);
    return response.data.data;
  },

  // Create fuel price
  createFuelPrice: async (data: CreateFuelPriceRequest): Promise<FuelPrice> => {
    const response = await apiClient.post<ApiResponse<FuelPrice>>('/fuel-prices', data);
    return response.data.data;
  },

  // Update fuel price
  updateFuelPrice: async (id: string, data: UpdateFuelPriceRequest): Promise<FuelPrice> => {
    const response = await apiClient.put<ApiResponse<FuelPrice>>(`/fuel-prices/${id}`, data);
    return response.data.data;
  },

  // Delete fuel price
  deleteFuelPrice: async (id: string): Promise<void> => {
    await apiClient.delete(`/fuel-prices/${id}`);
  },

  // Validate fuel prices for a station
  validateStationPrices: async (stationId: string): Promise<FuelPriceValidation> => {
    const response = await apiClient.get<ApiResponse<FuelPriceValidation>>(`/fuel-prices/validate/${stationId}`);
    return response.data.data;
  },

  // Get missing fuel prices
  getMissingPrices: async (): Promise<FuelPriceValidation[]> => {
    const response = await apiClient.get<ApiResponse<{ validations: FuelPriceValidation[] }>>('/fuel-prices/missing');
    return response.data.data.validations;
  },

  // Bulk update fuel prices
  bulkUpdatePrices: async (prices: Array<{ stationId: string; fuelType: string; price: number }>): Promise<FuelPrice[]> => {
    const response = await apiClient.post<ApiResponse<{ prices: FuelPrice[] }>>('/fuel-prices/bulk', { prices });
    return response.data.data.prices;
  },

  // Create a new fuel price
  createFuelPrice: async (data: CreateFuelPriceRequest): Promise<FuelPrice> => {
    const response = await apiClient.post<ApiResponse<FuelPrice>>('/fuel-prices', data);
    return response.data.data;
  },

  // Update a fuel price
  updateFuelPrice: async (id: string, data: UpdateFuelPriceRequest): Promise<FuelPrice> => {
    const response = await apiClient.put<ApiResponse<FuelPrice>>(`/fuel-prices/${id}`, data);
    return response.data.data;
  },

  // Delete a fuel price
  deleteFuelPrice: async (id: string): Promise<void> => {
    await apiClient.delete(`/fuel-prices/${id}`);
  },

  // Validate fuel prices for a station
  validateFuelPrices: async (stationId: string): Promise<FuelPriceValidation> => {
    const response = await apiClient.get<ApiResponse<FuelPriceValidation>>(`/fuel-prices/validate/${stationId}`);
    return response.data.data;
  },

  // Get stations missing active prices
  getMissingPrices: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/fuel-prices/missing');
    return response.data.data;
  },
};
