import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsService } from '@/api/services';

/**
 * Hook to fetch pending reading alerts (no_readings_24h)
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/MANAGER.md - Manager journey for recording readings
 * @returns Query result with pending reading alerts
 */
export const usePendingReadings = () => {
  const queryClient = useQueryClient();

  const alertsQuery = useQuery({
    queryKey: ['pending-readings'],
    queryFn: () =>
      alertsService.getAlerts({
        type: 'no_readings_24h',
        acknowledged: false,
        isActive: true,
      }),
    staleTime: 60_000,
  });

  const acknowledge = useMutation({
    mutationFn: alertsService.acknowledgeAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-readings'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  const dismiss = useMutation({
    mutationFn: alertsService.dismissAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-readings'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  return {
    ...alertsQuery,
    acknowledge: acknowledge.mutateAsync,
    dismiss: dismiss.mutateAsync,
  };
};
