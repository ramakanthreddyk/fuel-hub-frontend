
/**
 * @file useFuelPrices.ts
 * @description React Query hooks for fuel prices API
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/core/apiClient';

export interface FuelPrice {
  id: string;
  stationId: string;
  fuelType: string;
  price: number;
  validFrom: string;
  isActive: boolean;
}

export interface FuelPriceValidation {
  stationId: string;
  missingPrices: Array<{
    fuelType: string;
    message: string;
  }>;
  hasValidPrices: boolean;
  lastUpdated?: string;
}

export const useFuelPrices = (stationId?: string) => {
  return useQuery({
    queryKey: ['fuel-prices', stationId],
    queryFn: async () => {
      const params = stationId ? `?stationId=${stationId}` : '';
      const response = await apiClient.get(`/fuel-prices${params}`);
      return response.data;
    },
    enabled: !!stationId,
  });
};

export const useFuelPriceValidation = (stationId?: string) => {
  return useQuery({
    queryKey: ['fuel-price-validation', stationId],
    queryFn: async (): Promise<FuelPriceValidation> => {
      if (!stationId) {
        return {
          stationId: '',
          missingPrices: [],
          hasValidPrices: false
        };
      }
      
      const response = await apiClient.get(`/fuel-prices/validation/${stationId}`);
      return response.data;
    },
    enabled: !!stationId,
  });
};
