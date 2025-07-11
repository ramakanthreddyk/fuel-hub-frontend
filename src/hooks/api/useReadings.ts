
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { readingsService } from '@/api/services/readingsService';
import { useToast } from '@/hooks/use-toast';

export const useReadings = () => {
  return useQuery({
    queryKey: ['readings'],
    queryFn: readingsService.getReadings,
    staleTime: 30000,
    retry: 2,
  });
};

export const useReading = (id: string) => {
  return useQuery({
    queryKey: ['reading', id],
    queryFn: () => readingsService.getReading(id),
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useCreateReading = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: any) => readingsService.createReading(data),
    onSuccess: (newReading) => {
      queryClient.invalidateQueries({ queryKey: ['readings'] });
      queryClient.invalidateQueries({ queryKey: ['nozzles'] });
      queryClient.invalidateQueries({ queryKey: ['latest-reading'] });
      // Toast is handled in the component for better context
    },
    onError: (error: any) => {
      console.error('Failed to create reading:', error);
      // Toast is handled in the component for better error context
    },
  });
};

export const useUpdateReading = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => readingsService.updateReading(id, data),
    onSuccess: (updatedReading, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['reading', id] });
      queryClient.invalidateQueries({ queryKey: ['readings'] });
      toast({
        title: "Reading Updated",
        description: `Successfully updated reading for nozzle #${updatedReading.nozzleNumber || 'N/A'}`,
        variant: "success",
      });
    },
    onError: (error: any) => {
      console.error('Failed to update reading:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update reading. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useLatestReading = (nozzleId: string) => {
  return useQuery({
    queryKey: ['latest-reading', nozzleId],
    queryFn: () => readingsService.getLatestReading(nozzleId),
    enabled: !!nozzleId,
    staleTime: 30000,
  });
};

export const useCanCreateReading = (nozzleId: string) => {
  return useQuery({
    queryKey: ['can-create-reading', nozzleId],
    queryFn: () => readingsService.canCreateReading(nozzleId),
    enabled: !!nozzleId,
    staleTime: 60000,
  });
};
