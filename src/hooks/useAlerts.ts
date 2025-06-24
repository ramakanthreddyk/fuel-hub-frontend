
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsApi } from '@/api/alerts';

export const useAlerts = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: alertsApi.getAlerts,
  });

  const markAsReadMutation = useMutation({
    mutationFn: alertsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  const dismissAlertMutation = useMutation({
    mutationFn: alertsApi.dismissAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  return {
    data,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    dismissAlert: dismissAlertMutation.mutate,
  };
};
