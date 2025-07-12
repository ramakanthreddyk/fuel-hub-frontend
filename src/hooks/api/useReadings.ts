
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { readingsService, CreateReadingRequest } from '@/api/services/readingsService';
import { toast } from '@/hooks/use-toast';

export const useReadings = (filters?: any) => {
  return useQuery({
    queryKey: ['readings', filters],
    queryFn: () => readingsService.getReadings(filters),
    retry: 1,
    staleTime: 30000,
  });
};

export const useCreateReading = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateReadingRequest) => readingsService.createReading(data),
    onSuccess: (data) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['readings'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['sales-summary'] });
      queryClient.invalidateQueries({ queryKey: ['station-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['payment-method-breakdown'] });
      queryClient.invalidateQueries({ queryKey: ['fuel-type-breakdown'] });
      queryClient.invalidateQueries({ queryKey: ['daily-sales-trend'] });
      
      toast({
        title: 'Reading Recorded',
        description: 'Fuel reading has been successfully recorded.',
        variant: 'success',
      });
    },
    onError: (error: any) => {
      console.error('Failed to create reading:', error);
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to record reading. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateReading = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateReadingRequest> }) => 
      readingsService.updateReading(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readings'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['sales-summary'] });
      queryClient.invalidateQueries({ queryKey: ['station-metrics'] });
      
      toast({
        title: 'Reading Updated',
        description: 'Fuel reading has been successfully updated.',
        variant: 'success',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to update reading.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteReading = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => readingsService.deleteReading(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readings'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['sales-summary'] });
      queryClient.invalidateQueries({ queryKey: ['station-metrics'] });
      
      toast({
        title: 'Reading Deleted',
        description: 'Fuel reading has been successfully deleted.',
        variant: 'success',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to delete reading.',
        variant: 'destructive',
      });
    },
  });
};
