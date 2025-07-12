
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { readingsService, CreateReadingRequest, UpdateReadingRequest } from '@/api/services/readingsService';
import { toast } from '@/hooks/use-toast';
import { invalidateReadingQueries } from '@/utils/queryInvalidation';

export const useReadings = (filters?: any) => {
  return useQuery({
    queryKey: ['readings', filters],
    queryFn: () => readingsService.getReadings(filters),
    retry: 1,
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
};

export const useReading = (id: string) => {
  return useQuery({
    queryKey: ['readings', id],
    queryFn: () => readingsService.getReading(id),
    enabled: !!id,
    retry: 1,
    staleTime: 30000,
  });
};

export const useLatestReading = (nozzleId: string) => {
  return useQuery({
    queryKey: ['readings', 'latest', nozzleId],
    queryFn: () => readingsService.getLatestReading(nozzleId),
    enabled: !!nozzleId,
    retry: 1,
    staleTime: 30000,
  });
};

export const useCanCreateReading = (nozzleId: string) => {
  return useQuery({
    queryKey: ['readings', 'can-create', nozzleId],
    queryFn: () => readingsService.canCreateReading(nozzleId),
    enabled: !!nozzleId,
    retry: 1,
    staleTime: 30000,
  });
};

export const useCreateReading = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateReadingRequest) => readingsService.createReading(data),
    onSuccess: (data) => {
      invalidateReadingQueries(queryClient);
      
      toast({
        title: 'Reading Recorded',
        description: 'Fuel reading has been successfully recorded.',
        variant: 'default',
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
      invalidateReadingQueries(queryClient);
      
      toast({
        title: 'Reading Updated',
        description: 'Fuel reading has been successfully updated.',
        variant: 'default',
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
      invalidateReadingQueries(queryClient);
      
      toast({
        title: 'Reading Deleted',
        description: 'Fuel reading has been successfully deleted.',
        variant: 'default',
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
