
import { apiClient } from './client';

export interface Alert {
  id: string;
  type: 'inventory' | 'credit' | 'maintenance' | 'sales' | 'system';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  stationId: string;
  stationName: string;
  isRead: boolean;
  isActive: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface AlertsParams {
  stationId?: string;
  unreadOnly?: boolean;
}

export const alertsApi = {
  getAlerts: async (params?: AlertsParams): Promise<Alert[]> => {
    const searchParams = new URLSearchParams();
    if (params?.stationId) searchParams.append('stationId', params.stationId);
    if (params?.unreadOnly) searchParams.append('unreadOnly', 'true');
    
    const response = await apiClient.get(`/alerts?${searchParams.toString()}`);
    return response.data;
  },

  markAsRead: async (alertId: string): Promise<void> => {
    await apiClient.patch(`/alerts/${alertId}/read`);
  },

  dismissAlert: async (alertId: string): Promise<void> => {
    await apiClient.delete(`/alerts/${alertId}`);
  },
};
