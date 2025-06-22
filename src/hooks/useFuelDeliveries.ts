
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelDeliveriesApi, CreateFuelDeliveryRequest } from '@/api/fuel-deliveries';
import { useToast } from '@/hooks/use-toast';

export const useFuelDeliveries = (stationId?: string) => {
  return useQuery({
    queryKey: ['fuel-deliveries', stationId],
    queryFn: () => fuelDeliveriesApi.getFuelDeliveries(stationId),
  });
};

export const useCreateFuelDelivery = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateFuelDeliveryRequest) => fuelDeliveriesApi.createFuelDelivery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['fuel-inventory'] });
      toast({
        title: "Success",
        description: "Fuel delivery logged successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log fuel delivery",
        variant: "destructive",
      });
    },
  });
};
