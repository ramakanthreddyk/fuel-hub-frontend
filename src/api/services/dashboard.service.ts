
/**
 * Dashboard Service
 * 
 * API service for dashboard metrics and analytics
 */

import { apiClient } from '../client';
import type { 
  DashboardMetrics,
  PaymentMethodBreakdown,
  FuelTypeAnalytics,
  StationPerformance,
  ApiResponse 
} from '../api-contract';

export const dashboardService = {
  // Get sales summary
  getSalesSummary: async (params: {
    range: 'daily' | 'weekly' | 'monthly' | 'yearly';
    stationId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<DashboardMetrics> => {
    const response = await apiClient.get<ApiResponse<DashboardMetrics>>('/dashboard/sales-summary', { params });
    return response.data.data;
  },

  // Get payment methods breakdown
  getPaymentMethods: async (stationId?: string): Promise<PaymentMethodBreakdown[]> => {
    const params = stationId ? { stationId } : {};
    const response = await apiClient.get<ApiResponse<{ paymentMethods: PaymentMethodBreakdown[] }>>('/dashboard/payment-methods', { params });
    return response.data.data.paymentMethods;
  },

  // Get fuel type analytics
  getFuelTypeAnalytics: async (params?: {
    stationId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<FuelTypeAnalytics[]> => {
    const response = await apiClient.get<ApiResponse<{ fuelTypes: FuelTypeAnalytics[] }>>('/dashboard/fuel-types', { params });
    return response.data.data.fuelTypes;
  },

  // Get station performance
  getStationPerformance: async (params?: {
    dateFrom?: string;
    dateTo?: string;
  }): Promise<StationPerformance[]> => {
    const response = await apiClient.get<ApiResponse<{ stations: StationPerformance[] }>>('/dashboard/station-performance', { params });
    return response.data.data.stations;
  },

  // Get top performing stations
  getTopStations: async (limit: number = 10): Promise<StationPerformance[]> => {
    const response = await apiClient.get<ApiResponse<{ stations: StationPerformance[] }>>('/dashboard/top-stations', { 
      params: { limit } 
    });
    return response.data.data.stations;
  },

  // Get recent activities
  getRecentActivities: async (limit: number = 20): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<{ activities: any[] }>>('/dashboard/recent-activities', { 
      params: { limit } 
    });
    return response.data.data.activities;
  },

  // Get alerts summary
  getAlertsSummary: async (): Promise<{ total: number; critical: number; unread: number }> => {
    const response = await apiClient.get<ApiResponse<{ total: number; critical: number; unread: number }>>('/dashboard/alerts-summary');
    return response.data.data;
  }
};
