import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { readingsApi, CreateReadingRequest } from '@/api/readings';
import { useFuelStore } from '@/store/fuelStore';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { invalidateReadingQueries } from '@/utils/queryInvalidation';

// Brief overview for reconciliation differences summary UI
// This hook and UI section help users understand discrepancies between expected and actual readings for each nozzle on a given station and date.
// The summary table highlights differences, making it easy to spot reconciliation issues and take corrective action.
// Use this feature to audit daily operations and ensure accurate reporting.

// Hook to get readings for a nozzle, using Zustand cache first, then API fallback
export const useNozzleReadings = (nozzleId: string) => {
  const readings = useFuelStore((s) => s.readings[nozzleId] || []);
  const setReadings = useFuelStore((s) => s.setReadings);

  useEffect(() => {
    if (!nozzleId) return;
    // If readings not in store, fetch from API
    if (readings.length === 0) {
      readingsApi.getLatestReading(nozzleId).then((latest) => {
        if (latest) {
          // Map NozzleReading to Reading type
          setReadings(nozzleId, [{
            id: latest.id,
            nozzleId: latest.nozzleId,
            value: latest.reading,
            timestamp: latest.recordedAt,
          }]);
        }
      });
    }
  }, [nozzleId, readings.length, setReadings]);

  return readings;
};

export const useCreateReading = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: readingsApi.createReading,
    onSuccess: (data) => {
      console.log('[READINGS] Reading created successfully:', data);
      // Use comprehensive invalidation for dashboard updates
      invalidateReadingQueries(queryClient);
      // Toast notification is handled by the main reading hook to avoid duplicates
    },
    onError: (error: any) => {
      console.error('[READINGS] Error creating reading:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to record reading",
        variant: "destructive",
      });
    },
  });
};

export const useLatestReading = (nozzleId: string) => {
  return useQuery({
    queryKey: ['readings', 'latest', nozzleId],
    queryFn: () => readingsApi.getLatestReading(nozzleId),
    enabled: !!nozzleId,
  });
};
