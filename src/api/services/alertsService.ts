import { apiClient } from '../client';
import { sanitizeUrlParam, secureLog } from '@/utils/security';

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
    try {
      const response = await apiClient.get('/alerts');
      return response.data.data || response.data;
    } catch (error) {
      secureLog.error('[ALERTS-SERVICE] Error fetching alerts:', error);
      return [];
    }
  },

  getAlertSummary: async (): Promise<AlertSummary> => {
    try {
      const response = await apiClient.get('/alerts/summary');
      return response.data.data || response.data;
    } catch (error) {
      secureLog.error('[ALERTS-SERVICE] Error fetching alert summary:', error);
      return {
        total: 0,
        unread: 0,
        bySeverity: { low: 0, medium: 0, high: 0, critical: 0 }
      };
    }
  },

  markAsRead: async (alertId: string): Promise<void> => {
    try {
      await apiClient.patch(`/alerts/${sanitizeUrlParam(alertId)}/read`);
    } catch (error) {
      secureLog.error(`[ALERTS-SERVICE] Error marking alert as read: ${sanitizeUrlParam(alertId)}`, error);
      throw error;
    }
  },

  dismissAlert: async (alertId: string): Promise<void> => {
    try {
      await apiClient.delete(`/alerts/${sanitizeUrlParam(alertId)}`);
    } catch (error) {
      secureLog.error(`[ALERTS-SERVICE] Error dismissing alert: ${sanitizeUrlParam(alertId)}`, error);
      throw error;
    }
  },

  createAlert: async (alert: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>): Promise<Alert> => {
    try {
      const response = await apiClient.post('/alerts', alert);
      return response.data.data || response.data;
    } catch (error) {
      secureLog.error('[ALERTS-SERVICE] Error creating alert:', error);
      throw error;
    }
  },
};