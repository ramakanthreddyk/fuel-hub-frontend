
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { readingsService } from '@/api/services/readingsService';
import { toast } from '@/hooks/use-toast';

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
  
  return useMutation({
    mutationFn: (data: any) => readingsService.createReading(data),
    onSuccess: (newReading) => {
      queryClient.invalidateQueries({ queryKey: ['readings'] });
      queryClient.invalidateQueries({ queryKey: ['nozzles'] });
      toast({
        title: "Success",
        description: `Reading for nozzle #${newReading.nozzleNumber || 'N/A'} saved successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to create reading:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save reading. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateReading = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => readingsService.updateReading(id, data),
    onSuccess: (updatedReading, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['reading', id] });
      queryClient.invalidateQueries({ queryKey: ['readings'] });
      toast({
        title: "Success",
        description: `Reading for nozzle #${updatedReading.nozzleNumber || 'N/A'} updated successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to update reading:', error);
      toast({
        title: "Error",
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
