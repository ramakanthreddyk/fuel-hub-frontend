
/**
 * Fuel Prices Hook
 * 
 * React Query hooks for fuel price management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelPricesApi } from '../api/fuel-prices';
import type { CreateFuelPriceRequest } from '../api/api-contract';

export const useFuelPrices = (stationId?: string) => {
  return useQuery({
    queryKey: ['fuel-prices', stationId],
    queryFn: () => fuelPricesApi.getFuelPrices(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFuelPrice = (id: string) => {
  // Not implemented in fuelPricesApi, so skip or implement if needed
  return undefined;
};

export const useCreateFuelPrice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFuelPriceRequest) => fuelPricesApi.createFuelPrice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-prices'] });
    },
  });
};

export const useUpdateFuelPrice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateFuelPriceRequest> }) => fuelPricesApi.updateFuelPrice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-prices'] });
    },
  });
};

export const useValidateStationPrices = (stationId: string) => {
  // Not implemented in fuelPricesApi, so skip or implement if needed
  return undefined;
};

export const useMissingPrices = () => {
  // Not implemented in fuelPricesApi, so skip or implement if needed
  return undefined;
};
