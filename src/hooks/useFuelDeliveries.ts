
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelDeliveriesApi, CreateFuelDeliveryRequest } from '@/api/fuel-deliveries';
import { useToast } from '@/hooks/use-toast';

export const useFuelDeliveries = (stationId?: string) => {
  return useQuery({
    queryKey: ['fuel-deliveries', stationId],
    queryFn: () => fuelDeliveriesApi.getFuelDeliveries(stationId)
  });
};

export const useCreateFuelDelivery = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (deliveryData: CreateFuelDeliveryRequest) => 
      fuelDeliveriesApi.createFuelDelivery(deliveryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['fuel-inventory'] });
      toast({
        title: 'Success',
        description: 'Fuel delivery recorded successfully'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to record fuel delivery',
        variant: 'destructive'
      });
    }
  });
};
