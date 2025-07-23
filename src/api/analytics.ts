
/**
 * @file analytics.ts
 * @description Analytics API functions
 */
import { contractClient } from './contract-client';
import { apiClient } from './client';
import { StationComparison, HourlySales, PeakHour, FuelPerformance, StationRanking, SuperAdminAnalytics } from './api-contract';

/**
 * Get station comparison data
 */
export const getStationComparison = async (params: { stationIds: string[]; period?: string }): Promise<StationComparison[]> => {
  try {
    const response = await contractClient.get<any>('/analytics/station-comparison', params);
    
    // Handle null or undefined response
    if (!response || !Array.isArray(response)) {
      console.warn('Station comparison API returned invalid data:', response);
      return [];
    }
    
    // Transform the response to match the StationComparison interface
    return response.map((item: any) => ({
      id: item.id || item.stationId,
      stationId: item.stationId || item.id,
      stationName: item.stationName || item.name,
      sales: item.sales || item.revenue || 0,
      volume: item.volume || 0,
      transactions: item.transactions || item.salesCount || 0,
      growth: item.growth || 0,
      currentPeriod: {
        revenue: item.currentPeriod?.revenue || item.sales || item.revenue || 0,
        volume: item.currentPeriod?.volume || item.volume || 0,
        salesCount: item.currentPeriod?.salesCount || item.transactions || item.salesCount || 0,
      },
      previousPeriod: {
        revenue: item.previousPeriod?.revenue || item.previousSales || 0,
        volume: item.previousPeriod?.volume || item.previousVolume || 0,
        salesCount: item.previousPeriod?.salesCount || item.previousTransactions || 0,
      },
    }));
  } catch (error) {
    console.error('Error fetching station comparison data:', error);
    return []; // Return empty array to prevent map errors
  }
};

/**
 * Get hourly sales data
 */
export const getHourlySales = async (params: { stationId?: string; date?: string }): Promise<HourlySales[]> => {
  return contractClient.get<HourlySales[]>('/analytics/hourly-sales', params);
};

/**
 * Get peak hours data
 */
export const getPeakHours = async (params: { stationId?: string; period?: string }): Promise<PeakHour[]> => {
  return contractClient.get<PeakHour[]>('/analytics/peak-hours', params);
};

/**
 * Get fuel performance data
 */
export const getFuelPerformance = async (params: { stationId?: string; period?: string }): Promise<FuelPerformance[]> => {
  return contractClient.get<FuelPerformance[]>('/analytics/fuel-performance', params);
};

/**
 * Get station ranking data
 */
export const getStationRanking = async (params: { period?: string; limit?: number }): Promise<StationRanking[]> => {
  try {
    const result = await contractClient.get<StationRanking[]>('/analytics/station-ranking', params);
    return result || [];
  } catch (error) {
    console.error('Error fetching station ranking data:', error);
    return []; // Return empty array to prevent map errors
  }
};

/**
 * Get super admin analytics data
 */
export const getSuperAdminAnalytics = async (): Promise<SuperAdminAnalytics> => {
  const response = await apiClient.get('/analytics/superadmin');
  return response.data;
};

/**
 * Analytics API object that combines all analytics functions
 */
export const analyticsApi = {
  getStationComparison: async (params: { stationIds: string[]; period?: string }) => {
    try {
      if (!params.stationIds || params.stationIds.length === 0) {
        return [];
      }
      return getStationComparison(params);
    } catch (error) {
      console.error('Error in getStationComparison:', error);
      return []; // Return empty array to prevent map errors
    }
  },
  getHourlySales: async (stationId?: string, dateRange?: { from: Date; to: Date }) => {
    const params: any = {};
    if (stationId) params.stationId = stationId;
    if (dateRange) {
      params.startDate = dateRange.from.toISOString().split('T')[0];
      params.endDate = dateRange.to.toISOString().split('T')[0];
    }
    return getHourlySales(params);
  },
  getPeakHours: async (stationId?: string) => {
    const params: any = {};
    if (stationId) params.stationId = stationId;
    return getPeakHours(params);
  },
  getFuelPerformance: async (stationId?: string, dateRange?: { from: Date; to: Date }) => {
    const params: any = {};
    if (stationId) params.stationId = stationId;
    if (dateRange) {
      params.startDate = dateRange.from.toISOString().split('T')[0];
      params.endDate = dateRange.to.toISOString().split('T')[0];
    }
    return getFuelPerformance(params);
  },
  getStationRanking: async (period: string) => {
    try {
      const result = await getStationRanking({ period });
      return result || [];
    } catch (error) {
      console.error('Error in getStationRanking:', error);
      return []; // Return empty array to prevent map errors
    }
  },
  getSuperAdminAnalytics
};
