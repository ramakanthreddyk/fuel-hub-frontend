
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelDeliveriesApi } from '@/api/fuel-deliveries';
import { CreateFuelDeliveryRequest } from '@/api/fuel-delivery-types';
import { useToast } from '@/hooks/use-toast';

export const useFuelDeliveries = (stationId?: string) => {
  return useQuery({
    queryKey: ['fuel-deliveries', stationId],
    queryFn: async () => {
      try {
        const response = await fuelDeliveriesApi.getFuelDeliveries(stationId);
        // Ensure we always return an array
        return Array.isArray(response) ? response : [];
      } catch (error) {
        console.error('Error fetching fuel deliveries:', error);
        throw error;
      }
    }
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
