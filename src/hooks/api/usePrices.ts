
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

// Since we don't have pricesService yet, I'll create a basic structure
const pricesService = {
  getPrices: async () => {
    // This would be implemented when the service is created
    return [];
  },
  createPrice: async (data: any) => {
    // This would be implemented when the service is created
    return data;
  },
  updatePrice: async (id: string, data: any) => {
    // This would be implemented when the service is created
    return data;
  },
  deletePrice: async (id: string) => {
    // This would be implemented when the service is created
  }
};

export const usePrices = () => {
  return useQuery({
    queryKey: ['prices'],
    queryFn: pricesService.getPrices,
    staleTime: 60000,
    retry: 2,
  });
};

export const useCreatePrice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => pricesService.createPrice(data),
    onSuccess: (newPrice) => {
      queryClient.invalidateQueries({ queryKey: ['prices'] });
      toast({
        title: "Success",
        description: `Price for ${newPrice.fuelType} updated successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to create price:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to set fuel price. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePrice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => pricesService.updatePrice(id, data),
    onSuccess: (updatedPrice) => {
      queryClient.invalidateQueries({ queryKey: ['prices'] });
      toast({
        title: "Success",
        description: `Price for ${updatedPrice.fuelType} updated successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to update price:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update fuel price. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeletePrice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => pricesService.deletePrice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prices'] });
      toast({
        title: "Success",
        description: "Fuel price removed successfully",
      });
    },
    onError: (error: any) => {
      console.error('Failed to delete price:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove fuel price. Please try again.",
        variant: "destructive",
      });
    },
  });
};
