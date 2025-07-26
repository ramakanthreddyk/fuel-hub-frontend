import { apiClient } from '../client';

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AlertSummary {
  total: number;
  unread: number;
  bySeverity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export const alertsService = {
  getAlerts: async (): Promise<Alert[]> => {
    const response = await apiClient.get('/alerts');
    return response.data.data || response.data;
  },

  getAlertSummary: async (): Promise<AlertSummary> => {
    const response = await apiClient.get('/alerts/summary');
    return response.data.data || response.data;
  },

  markAsRead: async (alertId: string): Promise<void> => {
    await apiClient.patch(`/alerts/${alertId}/read`);
  },

  dismissAlert: async (alertId: string): Promise<void> => {
    await apiClient.delete(`/alerts/${alertId}`);
  },

  createAlert: async (alert: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>): Promise<Alert> => {
    const response = await apiClient.post('/alerts', alert);
    return response.data.data || response.data;
  },
};