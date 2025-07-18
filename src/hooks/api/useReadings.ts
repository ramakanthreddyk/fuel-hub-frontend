
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { readingsService } from '@/api/services/readingsService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useReadingsStore } from '@/store/readingsStore';
import { useDataStore } from '@/store/dataStore';
import { useErrorHandler } from '../useErrorHandler';

export const useReadings = () => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['readings'],
    queryFn: readingsService.getReadings,
    staleTime: 30000,
    retry: 2,
    onError: (error) => {
      handleError(error, 'Failed to fetch readings.');
    },
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
  const { setLastCreatedReading } = useReadingsStore();
  const { handleError } = useErrorHandler();
  
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
      
      // Store the reading in the readings store
      setLastCreatedReading({
        id: newReading.id,
        nozzleId: newReading.nozzleId,
        nozzleNumber: newReading.nozzleNumber,
        reading: newReading.reading,
        fuelType: newReading.fuelType,
        timestamp: newReading.recordedAt || newReading.createdAt
      });
      
      // Toast is now handled in the component for better user experience
    },
    onError: (error: any) => {
      handleError(error, 'Failed to create reading.');
    },
  });
};

export const useUpdateReading = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const { handleError } = useErrorHandler();
  
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
      handleError(error, 'Failed to update reading.');
    },
  });
};

export const useVoidReading = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  
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
      handleError(error, 'Failed to void reading.');
    },
  });
};

export const useLatestReading = (nozzleId: string) => {
  const { latestReadings, setLatestReading } = useDataStore();
  
  return useQuery({
    queryKey: ['latest-reading', nozzleId],
    queryFn: async () => {
      // Check if we have cached data for this nozzle
      if (nozzleId && latestReadings[nozzleId]) {
        console.log('[READINGS-HOOK] Using cached latest reading for nozzle:', nozzleId);
        return latestReadings[nozzleId];
      }
      
      const reading = await readingsService.getLatestReading(nozzleId);
      
      // Store in cache if we have a reading
      if (reading && nozzleId) {
        setLatestReading(nozzleId, reading);
      }
      
      return reading;
    },
    enabled: !!nozzleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
