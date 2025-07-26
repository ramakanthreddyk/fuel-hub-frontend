
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { readingsService } from '@/api/services/readingsService';
import { useToastNotifications } from '@/hooks/useToastNotifications';
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
  const { showSuccess, handleApiError } = useToastNotifications();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      if (user?.role !== 'manager' && user?.role !== 'owner') {
        throw new Error('Only managers and owners can update readings');
      }
      return readingsService.updateReading(id, data);
    },
    onSuccess: (updatedReading, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['reading', id] });
      queryClient.invalidateQueries({ queryKey: ['readings'] });
      showSuccess('Reading Updated', `Successfully updated reading for nozzle #${updatedReading.nozzleNumber || 'N/A'}`);
    },
    onError: (error: any) => {
      handleApiError(error, 'Update Reading');
    },
  });
};

export const useVoidReading = () => {
  const queryClient = useQueryClient();
  const { showSuccess, handleApiError } = useToastNotifications();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => readingsService.voidReading(id, reason),
    onSuccess: (result, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['reading', id] });
      queryClient.invalidateQueries({ queryKey: ['readings'] });
      showSuccess('Reading Voided', 'The reading has been marked as void and will require manager approval.');
    },
    onError: (error: any) => {
      handleApiError(error, 'Void Reading');
    },
  });
};

export const useLatestReading = (nozzleId: string) => {
  const { latestReadings, setLatestReading } = useDataStore();
  const { handleError } = useErrorHandler();
  
  return useQuery({
    queryKey: ['latest-reading', nozzleId],
    queryFn: async () => {
      console.log('[READINGS-HOOK] Fetching latest reading for nozzle:', nozzleId);
      
      // Check if we have cached data for this nozzle
      if (nozzleId && latestReadings[nozzleId]) {
        console.log('[READINGS-HOOK] Using cached latest reading for nozzle:', nozzleId);
        return latestReadings[nozzleId];
      }
      
      try {
        const reading = await readingsService.getLatestReading(nozzleId);
        console.log('[READINGS-HOOK] Latest reading API result:', reading);
        
        // Store in cache if we have a reading
        if (reading && nozzleId) {
          setLatestReading(nozzleId, reading);
        }
        
        return reading;
      } catch (error) {
        console.error('[READINGS-HOOK] Error fetching latest reading:', error);
        return null;
      }
    },
    enabled: !!nozzleId,
    staleTime: 30000, // 30 seconds - reduced to ensure fresh data
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    onError: (error) => {
      handleError(error, 'Failed to fetch latest reading.');
    }
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
