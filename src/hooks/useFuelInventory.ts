
import { useQuery } from '@tanstack/react-query';
import { fuelInventoryApi } from '@/api/fuel-inventory';
import { FuelInventoryParams } from '@/api/api-contract';

export const useFuelInventory = (params?: FuelInventoryParams) => {
  return useQuery({
    queryKey: ['fuel-inventory', params],
    queryFn: () => fuelInventoryApi.getFuelInventory(params)
  });
};
