
/**
 * Alerts Service
 * 
 * API service for managing system alerts and notifications
 */

import { apiClient } from '../client';
import type { Alert, ApiResponse } from '../api-contract';

export const alertsService = {
  // Get all alerts
  getAlerts: async (params?: {
    type?: string;
    priority?: string;
    stationId?: string;
    acknowledged?: boolean;
    isActive?: boolean;
  }): Promise<Alert[]> => {
    try {
      const response = await apiClient.get<ApiResponse<{ alerts: Alert[] }>>('/alerts', { params });
      return response.data?.data?.alerts || [];
    } catch (error) {
      console.error('[ALERTS-SERVICE] Error fetching alerts:', error);
      return [];
    }
  },

  // Get alert by ID
  getAlert: async (id: string): Promise<Alert> => {
    const response = await apiClient.get<ApiResponse<Alert>>(`/alerts/${id}`);
    return response.data.data;
  },

  // Acknowledge alert
  acknowledgeAlert: async (id: string): Promise<Alert> => {
    const response = await apiClient.put<ApiResponse<Alert>>(`/alerts/${id}/acknowledge`);
    return response.data.data;
  },

  // Bulk acknowledge alerts
  bulkAcknowledgeAlerts: async (ids: string[]): Promise<{ acknowledged: string[]; failed: string[] }> => {
    const response = await apiClient.post<ApiResponse<{ acknowledged: string[]; failed: string[] }>>('/alerts/bulk-acknowledge', { ids });
    return response.data.data;
  },

  // Dismiss alert
  dismissAlert: async (id: string): Promise<void> => {
    await apiClient.put(`/alerts/${id}/dismiss`);
  },

  // Get unread count
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<ApiResponse<{ count: number }>>('/alerts/unread-count');
    return response.data.data.count;
  }
};
