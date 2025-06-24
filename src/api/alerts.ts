
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

export const alertsApi = {
  getAlerts: async (): Promise<Alert[]> => {
    const response = await apiClient.get('/alerts');
    return response.data;
  },

  markAsRead: async (alertId: string): Promise<void> => {
    await apiClient.patch(`/alerts/${alertId}/read`);
  },

  dismissAlert: async (alertId: string): Promise<void> => {
    await apiClient.delete(`/alerts/${alertId}`);
  },
};
