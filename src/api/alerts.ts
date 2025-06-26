
import { apiClient, extractApiData, extractApiArray } from './client';
import type { Alert, ApiResponse } from './api-contract';

export interface AlertsParams {
  stationId?: string;
  unreadOnly?: boolean;
}

export const alertsApi = {
  getAlerts: async (params?: AlertsParams): Promise<Alert[]> => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.stationId) searchParams.append('stationId', params.stationId);
      if (params?.unreadOnly) searchParams.append('unreadOnly', 'true');
      
      const response = await apiClient.get(`/alerts?${searchParams.toString()}`);
      return extractApiArray<Alert>(response, 'alerts');
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
  },

  markAsRead: async (alertId: string): Promise<void> => {
    await apiClient.patch(`/alerts/${alertId}/read`);
  },

  dismissAlert: async (alertId: string): Promise<void> => {
    await apiClient.delete(`/alerts/${alertId}`);
  },
};

// Export types for backward compatibility
export type { Alert, AlertsParams };
