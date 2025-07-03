/**
 * @file useFuelPrices.ts
 * @description React Query hooks for fuel prices API
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/MANAGER.md - Manager journey for setting fuel prices
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelPricesService, FuelPrice, CreateFuelPriceRequest, UpdateFuelPriceRequest, FuelPriceValidation } from '@/api/services/fuelPricesService';

/**
 * Hook to fetch fuel prices
 * @param stationId Optional station ID to filter by
 * @returns Query result with fuel prices data
 */
export const useFuelPrices = (stationId?: string) => {
  return useQuery({
    queryKey: ['fuel-prices', stationId],
    queryFn: () => fuelPricesService.getFuelPrices(stationId),
    staleTime: 60000, // 1 minute
    retry: 2,
    onError: (error) => {
      console.error('[FUEL-PRICES-HOOK] Error fetching fuel prices:', error);
    }
  });
};

/**
 * Hook to validate fuel prices for a station
 * @param stationId Station ID
 * @returns Query result with validation data
 */
export const useFuelPriceValidation = (stationId: string) => {
  return useQuery({
    queryKey: ['fuel-price-validation', stationId],
    queryFn: () => {
      // Skip API call if stationId is empty or undefined
      if (!stationId) {
        return Promise.resolve({
          stationId: '',
          hasValidPrices: true,
          missingPrices: []
        } as FuelPriceValidation);
      }
      return fuelPricesService.validateFuelPrices(stationId);
    },
    enabled: !!stationId,
    staleTime: 60000, // 1 minute
    retry: 2,
    onError: (error) => {
      console.error(`[FUEL-PRICES-HOOK] Error validating fuel prices for station ${stationId}:`, error);
    }
  });
};

/**
 * Hook to get stations missing active prices
 * @returns Query result with missing prices data
 */
export const useMissingPrices = () => {
  return useQuery({
    queryKey: ['missing-prices'],
    queryFn: () => fuelPricesService.getMissingPrices(),
    staleTime: 300000, // 5 minutes
    retry: 2,
    onError: (error) => {
      console.error('[FUEL-PRICES-HOOK] Error fetching missing prices:', error);
    }
  });
};

/**
 * Hook to create a fuel price
 * @returns Mutation result for creating a fuel price
 */
export const useCreateFuelPrice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateFuelPriceRequest) => fuelPricesService.createFuelPrice(data),
    onSuccess: (_, variables) => {
      console.log('[FUEL-PRICES-HOOK] Fuel price created successfully');
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['fuel-prices'] });
      queryClient.invalidateQueries({ queryKey: ['fuel-prices', variables.stationId] });
      queryClient.invalidateQueries({ queryKey: ['fuel-price-validation', variables.stationId] });
      queryClient.invalidateQueries({ queryKey: ['missing-prices'] });
    },
    onError: (error) => {
      console.error('[FUEL-PRICES-HOOK] Error creating fuel price:', error);
    }
  });
};

/**
 * Hook to update a fuel price
 * @returns Mutation result for updating a fuel price
 */
export const useUpdateFuelPrice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data, stationId }: { id: string; data: UpdateFuelPriceRequest; stationId: string }) => 
      fuelPricesService.updateFuelPrice(id, data),
    onSuccess: (_, variables) => {
      console.log(`[FUEL-PRICES-HOOK] Fuel price ${variables.id} updated successfully`);
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['fuel-prices'] });
      queryClient.invalidateQueries({ queryKey: ['fuel-prices', variables.stationId] });
      queryClient.invalidateQueries({ queryKey: ['fuel-price-validation', variables.stationId] });
      queryClient.invalidateQueries({ queryKey: ['missing-prices'] });
    },
    onError: (error, variables) => {
      console.error(`[FUEL-PRICES-HOOK] Error updating fuel price ${variables.id}:`, error);
    }
  });
};

/**
 * Hook to delete a fuel price
 * @returns Mutation result for deleting a fuel price
 */
export const useDeleteFuelPrice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, stationId }: { id: string; stationId: string }) => 
      fuelPricesService.deleteFuelPrice(id),
    onSuccess: (_, variables) => {
      console.log(`[FUEL-PRICES-HOOK] Fuel price ${variables.id} deleted successfully`);
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['fuel-prices'] });
      queryClient.invalidateQueries({ queryKey: ['fuel-prices', variables.stationId] });
      queryClient.invalidateQueries({ queryKey: ['fuel-price-validation', variables.stationId] });
      queryClient.invalidateQueries({ queryKey: ['missing-prices'] });
    },
    onError: (error, variables) => {
      console.error(`[FUEL-PRICES-HOOK] Error deleting fuel price ${variables.id}:`, error);
    }
  });
};