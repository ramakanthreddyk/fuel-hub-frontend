
import { apiClient, extractApiData, extractApiArray } from './client';
import type { 
  ApiResponse,
  StationComparison,
  HourlySales,
  PeakHour,
  FuelPerformance,
  StationRanking,
  SuperAdminAnalytics,
  StationComparisonParams
} from './api-contract';

export const analyticsApi = {
  getStationComparison: async ({ stationIds, period }: StationComparisonParams): Promise<StationComparison[]> => {
    try {
      const params = new URLSearchParams({
        stationIds: stationIds.join(','),
      });
      if (period) params.append('period', period);
      
      const response = await apiClient.get(`/analytics/station-comparison?${params}`);
      return extractApiArray<StationComparison>(response);
    } catch (error) {
      console.error('Error fetching station comparison:', error);
      return [];
    }
  },

  getHourlySales: async (stationId?: string, dateRange?: { from: Date; to: Date }): Promise<HourlySales[]> => {
    try {
      const params = new URLSearchParams();
      if (stationId) params.append('stationId', stationId);
      if (dateRange?.from) params.append('dateFrom', dateRange.from.toISOString());
      if (dateRange?.to) params.append('dateTo', dateRange.to.toISOString());
      
      const response = await apiClient.get(`/analytics/hourly-sales?${params}`);
      return extractApiArray<HourlySales>(response);
    } catch (error) {
      console.error('Error fetching hourly sales:', error);
      return [];
    }
  },

  getPeakHours: async (stationId?: string): Promise<PeakHour[]> => {
    try {
      const params = new URLSearchParams();
      if (stationId) params.append('stationId', stationId);
      
      const response = await apiClient.get(`/analytics/peak-hours?${params}`);
      return extractApiArray<PeakHour>(response);
    } catch (error) {
      console.error('Error fetching peak hours:', error);
      return [];
    }
  },

  getFuelPerformance: async (stationId?: string, dateRange?: { from: Date; to: Date }): Promise<FuelPerformance[]> => {
    try {
      const params = new URLSearchParams();
      if (stationId) params.append('stationId', stationId);
      if (dateRange?.from) params.append('dateFrom', dateRange.from.toISOString());
      if (dateRange?.to) params.append('dateTo', dateRange.to.toISOString());
      
      const response = await apiClient.get(`/analytics/fuel-performance?${params}`);
      return extractApiArray<FuelPerformance>(response);
    } catch (error) {
      console.error('Error fetching fuel performance:', error);
      return [];
    }
  },

  getStationRanking: async (period: string): Promise<StationRanking[]> => {
    try {
      const response = await apiClient.get(`/analytics/station-ranking?period=${period}`);
      return extractApiArray<StationRanking>(response);
    } catch (error) {
      console.error('Error fetching station ranking:', error);
      return [];
    }
  },

  getSuperAdminAnalytics: async (): Promise<SuperAdminAnalytics> => {
    const response = await apiClient.get('/analytics/superadmin');
    return extractApiData<SuperAdminAnalytics>(response);
  },
};
