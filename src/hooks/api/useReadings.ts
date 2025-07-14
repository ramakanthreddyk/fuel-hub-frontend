
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { readingsService } from '@/api/services/readingsService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['readings'] });
      queryClient.invalidateQueries({ queryKey: ['nozzles'] });
      queryClient.invalidateQueries({ queryKey: ['latest-reading'] });
      
      // Also invalidate specific nozzle's latest reading
      if (newReading?.nozzleId) {
        queryClient.invalidateQueries({ queryKey: ['latest-reading', newReading.nozzleId] });
      }
      
      // Toast is handled in the component for better context
    },
    onError: (error: any) => {
      console.error('Failed to create reading:', error);
      
      // Extract error message
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to create reading. Please try again.';
      
      // Log detailed error for debugging
      console.error('Reading creation error details:', {
        message: errorMessage,
        status: error?.response?.status,
        data: error?.response?.data
      });
      
      // Toast is handled in the component for better error context
    },
  });
};

export const useUpdateReading = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      // Only allow managers and owners to update readings
      if (user?.role !== 'manager' && user?.role !== 'owner') {
        throw new Error('Only managers and owners can update readings');
      }
      return readingsService.updateReading(id, data);
    },
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

export const useVoidReading = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => readingsService.voidReading(id, reason),
    onSuccess: (result, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['reading', id] });
      queryClient.invalidateQueries({ queryKey: ['readings'] });
      toast({
        title: "Reading Voided",
        description: "The reading has been marked as void and will require manager approval.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      console.error('Failed to void reading:', error);
      toast({
        title: "Void Failed",
        description: error.message || "Failed to void reading. Please try again.",
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
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });
};

export const useCanCreateReading = (nozzleId: string) => {
  return useQuery({
    queryKey: ['can-create-reading', nozzleId],
    queryFn: () => readingsService.canCreateReading(nozzleId),
    enabled: !!nozzleId,
    staleTime: 60000,
    retry: 1,
    refetchOnWindowFocus: false,
    select: (data) => {
      // Ensure consistent property access
      return {
        canCreate: data?.canCreate ?? false,
        reason: data?.reason || 'Unknown error',
        missingPrice: data?.missingPrice ?? false
      };
    }
  });
};
