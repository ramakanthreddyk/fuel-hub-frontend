
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelPricesApi, CreateFuelPriceRequest } from '@/api/fuel-prices';
import { useToast } from '@/hooks/use-toast';

export const useFuelPrices = () => {
  return useQuery({
    queryKey: ['fuel-prices'],
    queryFn: fuelPricesApi.getFuelPrices,
  });
};

export const useCreateFuelPrice = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateFuelPriceRequest) => fuelPricesApi.createFuelPrice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-prices'] });
      toast({
        title: "Success",
        description: "Fuel price updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update fuel price",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateFuelPrice = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateFuelPriceRequest> }) => 
      fuelPricesApi.updateFuelPrice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-prices'] });
      toast({
        title: "Success",
        description: "Fuel price updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update fuel price",
        variant: "destructive",
      });
    },
  });
};
