/**
 * @file hooks/api/useFuelPrices.ts
 * @description React Query hooks for fuel prices API
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelPricesService } from '@/api/services/fuelPricesService';

/**
 * Hook to fetch fuel prices for a station
 */
export const useFuelPrices = (stationId?: string) => {
  return useQuery({
    queryKey: ['fuel-prices', stationId],
    queryFn: () => fuelPricesService.getFuelPrices(stationId || ''),
    enabled: !!stationId,
    staleTime: 300000, // 5 minutes
  });
};

/**
 * Hook to check if a station has fuel prices set
 */
export const useHasFuelPrices = (stationId?: string) => {
  const { data = [], isLoading } = useFuelPrices(stationId);
  return {
    hasFuelPrices: data.length > 0,
    isLoading,
    fuelPrices: data
  };
};

/**
 * Hook to delete a fuel price
 */
export const useDeleteFuelPrice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => fuelPricesService.deleteFuelPrice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-prices'] });
    },
  });
};