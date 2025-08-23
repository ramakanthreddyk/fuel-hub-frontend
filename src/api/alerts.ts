
import { apiClient, extractApiArray } from './client';
import { sanitizeUrlParam, secureLog } from '@/utils/security';
import type { Alert, AlertsParams } from './api-contract';

export const alertsApi = {
  // Ensure AlertsParams includes stationId property
  getAlerts: async (params?: AlertsParams & { stationId?: string }): Promise<Alert[]> => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.stationId) searchParams.append('stationId', sanitizeUrlParam(params.stationId));
      if (params?.unreadOnly) searchParams.append('unreadOnly', 'true');
      const response = await apiClient.get(`/alerts?${searchParams.toString()}`);
      return extractApiArray<Alert>(response, 'alerts');
    } catch (error) {
      secureLog.error('Error fetching alerts:', error);
      return [];
    }
  },

  markAsRead: async (alertId: string): Promise<void> => {
    try {
      await apiClient.patch(`/alerts/${sanitizeUrlParam(alertId)}/read`);
    } catch (error) {
      secureLog.error('Error marking alert as read:', error);
    }
  },

  dismissAlert: async (alertId: string): Promise<void> => {
    try {
      await apiClient.delete(`/alerts/${sanitizeUrlParam(alertId)}`);
    } catch (error) {
      secureLog.error('Error dismissing alert:', error);
    }
  },
};
