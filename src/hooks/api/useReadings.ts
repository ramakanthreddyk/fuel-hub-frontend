
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { readingsService } from '@/api/services/readingsService';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { useReadingsStore } from '@/store/readingsStore';
import { useDataStore } from '@/store/dataStore';
import { useStoreSync } from '@/hooks/useStoreSync';
import { useNavigate } from 'react-router-dom';


export const useReadings = () => {
  const { handleApiError, showLoader, hideLoader } = useToastNotifications();
  
  return useQuery({
    queryKey: ['readings'],
    queryFn: async () => {
      showLoader('Loading readings...');
      const data = await readingsService.getReadings();
      hideLoader();
      return data;
    },
    onError: (error: any) => {
      handleApiError(error, 'Readings');
    },
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

export const useCreateReading = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  navigateAfterSuccess?: boolean;
  navigateTo?: string;
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setLastCreatedReading } = useReadingsStore();
  const { showSuccess, handleApiError } = useToastNotifications();
  const { syncAfterReadingCreate } = useStoreSync();

  return useMutation({
    mutationFn: (data: any) => readingsService.createReading(data),
    onSuccess: async (newReading) => {
      console.log('[CREATE-READING] Success:', newReading);

      // Sync stores and invalidate queries
      await syncAfterReadingCreate(newReading);

      // Store the reading in the readings store
      if (newReading) {
        setLastCreatedReading({
          id: newReading.id,
          nozzleId: newReading.nozzleId,
          nozzleNumber: newReading.nozzleNumber,
          reading: newReading.reading,
          fuelType: newReading.fuelType,
          timestamp: newReading.recordedAt || newReading.createdAt
        });
      }

      // Call custom onSuccess if provided
      if (options?.onSuccess) {
        options.onSuccess(newReading);
      }

      // Navigate after success if requested
      if (options?.navigateAfterSuccess !== false) {
        const destination = options?.navigateTo || '/dashboard';
        setTimeout(() => {
          navigate(destination);
        }, 1500);
      }
    },
    onError: (error: any) => {
      console.error('[CREATE-READING] Error:', error);
      handleApiError(error, 'Create Reading');

      // Call custom onError if provided
      if (options?.onError) {
        options.onError(error);
      }
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
  const { handleApiError } = useToastNotifications();

  return useQuery({
    queryKey: ['latest-reading', nozzleId],
    queryFn: async () => {
      console.log('[READINGS-HOOK] Fetching latest reading for nozzle:', nozzleId);

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

        // Fallback to cached data if API fails
        if (nozzleId && latestReadings[nozzleId]) {
          console.log('[READINGS-HOOK] Using cached latest reading as fallback for nozzle:', nozzleId);
          return latestReadings[nozzleId];
        }

        return null;
      }
    },
    enabled: !!nozzleId,
    staleTime: 30000, // 30 seconds - reduced to ensure fresh data
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    onError: (error: any) => {
      handleApiError(error, 'Latest Reading');
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
