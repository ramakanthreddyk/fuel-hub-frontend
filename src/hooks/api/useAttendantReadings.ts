/**
 * @file hooks/api/useAttendantReadings.ts
 * @description React Query hooks for attendant nozzle readings
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, extractData } from '@/api/core/apiClient';
import { useToast } from '@/hooks/use-toast';

// Types
export interface CreateReadingRequest {
  nozzleId: string;
  reading: number;
  recordedAt: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
}

export interface CanCreateReadingResponse {
  canCreate: boolean;
  reason?: string;
  previousReading?: number;
}

export interface NozzleReading {
  id: string;
  nozzleId: string;
  reading: number;
  recordedAt: string;
  paymentMethod: string;
  creditorId?: string;
  createdAt: string;
}

/**
 * Hook to check if a reading can be created for a nozzle
 * Uses the correct endpoint: /nozzle-readings/can-create/{nozzleId}
 */
export const useCanCreateReading = (nozzleId?: string) => {
  return useQuery({
    queryKey: ['can-create-reading', nozzleId],
    queryFn: async () => {
      const response = await apiClient.get(`/nozzle-readings/can-create/${nozzleId}`);
      return extractData<CanCreateReadingResponse>(response);
    },
    enabled: !!nozzleId,
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Hook to create a new reading
 * Uses the correct endpoint: /nozzle-readings
 */
export const useCreateAttendantReading = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: CreateReadingRequest) => {
      const response = await apiClient.post('/nozzle-readings', data);
      return extractData<NozzleReading>(response);
    },
    onSuccess: (newReading) => {
      queryClient.invalidateQueries({ queryKey: ['can-create-reading'] });
      queryClient.invalidateQueries({ queryKey: ['latest-reading'] });
      toast({
        title: "Success",
        description: `Reading recorded successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to create reading:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to record reading. Please try again.",
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook to get the latest reading for a nozzle
 * Uses the nozzle-readings endpoint with nozzleId parameter
 */
export const useLatestNozzleReading = (nozzleId?: string) => {
  return useQuery({
    queryKey: ['latest-reading', nozzleId],
    queryFn: async () => {
      const response = await apiClient.get(`/nozzle-readings?nozzleId=${nozzleId}&limit=1`);
      const readings = extractData<NozzleReading[]>(response);
      return readings && readings.length > 0 ? readings[0] : null;
    },
    enabled: !!nozzleId,
    staleTime: 30000, // 30 seconds
  });
};