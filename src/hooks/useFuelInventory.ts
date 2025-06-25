
import { useQuery } from '@tanstack/react-query';
import { fuelInventoryApi, FuelInventoryParams } from '@/api/fuel-inventory';

export const useFuelInventory = (params?: FuelInventoryParams) => {
  return useQuery({
    queryKey: ['fuel-inventory', params],
    queryFn: () => fuelInventoryApi.getFuelInventory(params)
  });
};
