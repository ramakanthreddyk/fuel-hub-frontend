
import { useQuery } from '@tanstack/react-query';
import { fuelPriceValidationApi } from '@/api/fuel-price-validation';

export const useStationPriceValidation = (stationId: string) => {
  return useQuery({
    queryKey: ['fuel-price-validation', stationId],
    queryFn: () => fuelPriceValidationApi.validateStationPrices(stationId),
    enabled: !!stationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMissingFuelPrices = () => {
  return useQuery({
    queryKey: ['fuel-price-validation', 'missing'],
    queryFn: fuelPriceValidationApi.getMissingPrices,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCanCreateReading = (nozzleId: string) => {
  return useQuery({
    queryKey: ['reading-validation', nozzleId],
    queryFn: () => fuelPriceValidationApi.canCreateReading(nozzleId),
    enabled: !!nozzleId,
    staleTime: 30 * 1000, // 30 seconds - this changes when fuel prices are updated
  });
};
