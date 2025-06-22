
import { useQuery } from '@tanstack/react-query';
import { fuelInventoryApi } from '@/api/fuel-inventory';

export const useFuelInventory = (stationId?: string, fuelType?: string) => {
  return useQuery({
    queryKey: ['fuel-inventory', stationId, fuelType],
    queryFn: () => fuelInventoryApi.getFuelInventory(stationId, fuelType),
  });
};
