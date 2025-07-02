
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelPricesService } from '@/api/contract/fuel-prices.service';
import { useToast } from '@/hooks/use-toast';
import type { CreateFuelPriceRequest } from '@/api/api-contract';

export const useFuelPrices = () => {
  return useQuery({
    queryKey: ['fuel-prices'],
    queryFn: async () => {
      console.log('[USE-FUEL-PRICES] Fetching fuel prices...');
      const result = await fuelPricesService.getFuelPrices();
      console.log('[USE-FUEL-PRICES] Hook result:', result);
      return result;
    },
    retry: 1,
    staleTime: 30000, // 30 seconds
  });
};

export const useCreateFuelPrice = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateFuelPriceRequest) => fuelPricesService.createFuelPrice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-prices'] });
      queryClient.invalidateQueries({ queryKey: ['stations'] }); // Refresh station data too
      toast({
        title: "Success",
        description: "Fuel price created successfully",
      });
    },
    onError: (error: any) => {
      console.error('[USE-FUEL-PRICES] Create error:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to create fuel price",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateFuelPrice = (id: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Partial<CreateFuelPriceRequest>) => fuelPricesService.updateFuelPrice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-prices'] });
      toast({
        title: "Success",
        description: "Fuel price updated successfully",
      });
    },
    onError: (error: any) => {
      console.error('[USE-FUEL-PRICES] Update error:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to update fuel price",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteFuelPrice = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => fuelPricesService.deleteFuelPrice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-prices'] });
      toast({
        title: "Success",
        description: "Fuel price deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error('[USE-FUEL-PRICES] Delete error:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to delete fuel price",
        variant: "destructive",
      });
    },
  });
};
