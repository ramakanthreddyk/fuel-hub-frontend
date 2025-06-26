
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsApi } from '@/api/alerts';
import { AlertsParams } from '@/api/api-contract';

export const useAlerts = (params?: AlertsParams) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['alerts', params],
    queryFn: () => alertsApi.getAlerts(params),
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
    isMarkingAsRead: markAsReadMutation.isPending,
    isDismissing: dismissAlertMutation.isPending,
  };
};

export const useMarkAlertRead = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => alertsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};
