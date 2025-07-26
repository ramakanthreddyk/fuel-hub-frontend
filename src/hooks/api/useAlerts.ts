import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsService } from '@/api/services/alertsService';
import { useToastNotifications } from '@/hooks/useToastNotifications';

export const useAlerts = () => {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: alertsService.getAlerts,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useAlertSummary = () => {
  return useQuery({
    queryKey: ['alerts', 'summary'],
    queryFn: alertsService.getAlertSummary,
    refetchInterval: 30000,
  });
};

export const useMarkAlertAsRead = () => {
  const queryClient = useQueryClient();
  const { showSuccess, handleApiError } = useToastNotifications();

  return useMutation({
    mutationFn: alertsService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      showSuccess('Alert marked as read');
    },
    onError: (error) => handleApiError(error, 'Mark as read'),
  });
};

export const useDismissAlert = () => {
  const queryClient = useQueryClient();
  const { showSuccess, handleApiError } = useToastNotifications();

  return useMutation({
    mutationFn: alertsService.dismissAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      showSuccess('Alert dismissed');
    },
    onError: (error) => handleApiError(error, 'Dismiss alert'),
  });
};