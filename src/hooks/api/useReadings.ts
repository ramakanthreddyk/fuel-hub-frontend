
/**
 * @file hooks/api/useReadings.ts
 * @description React Query hooks for readings API
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { readingsService, Reading, CreateReadingRequest } from '@/api/services/readingsService';

/**
 * Hook to fetch all readings
 * @returns Query result with readings data
 */
export const useReadings = () => {
  return useQuery({
    queryKey: ['readings'],
    queryFn: () => readingsService.getReadings(),
    staleTime: 60000, // 1 minute
    retry: 2
  });
};

/**
 * Hook to fetch a reading by ID
 * @param id Reading ID
 * @returns Query result with reading data
 */
export const useReading = (id: string) => {
  return useQuery({
    queryKey: ['reading', id],
    queryFn: () => readingsService.getReading(id),
    enabled: !!id,
    staleTime: 60000, // 1 minute
    retry: 2
  });
};

/**
 * Hook to fetch the latest reading for a nozzle
 * @param nozzleId Nozzle ID
 * @returns Query result with latest reading data
 */
export const useLatestReading = (nozzleId: string) => {
  return useQuery({
    queryKey: ['latest-reading', nozzleId],
    queryFn: () => readingsService.getLatestReading(nozzleId),
    enabled: !!nozzleId,
    staleTime: 60000, // 1 minute
    retry: 2
  });
};

/**
 * Hook to check if reading can be created for nozzle
 * @param nozzleId Nozzle ID
 * @returns Query result with can create reading data
 */
export const useCanCreateReading = (nozzleId: string) => {
  return useQuery({
    queryKey: ['can-create-reading', nozzleId],
    queryFn: () => readingsService.canCreateReading(nozzleId),
    enabled: !!nozzleId,
    staleTime: 60000, // 1 minute
    retry: 2
  });
};

/**
 * Hook to create a reading
 * @returns Mutation result for creating a reading
 */
export const useCreateReading = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateReadingRequest) => readingsService.createReading(data),
    onSuccess: (_, variables) => {
      console.log('[READINGS-HOOK] Reading created successfully');
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['readings'] });
      queryClient.invalidateQueries({ queryKey: ['latest-reading', variables.nozzleId] });
    },
  });
};
