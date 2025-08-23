/**
 * @file analytics.ts
 * @description Analytics API functions
 */
import { contractClient } from './contract-client';
import { apiClient } from './client';
import { StationComparison, HourlySales, PeakHour, FuelPerformance, StationRanking, SuperAdminAnalytics } from './api-contract';
import { secureLog, sanitizeUrlParam } from '@/utils/security';

/**
 * Get station comparison data
 */
export const getStationComparison = async (params: { stationIds: string[]; period?: string }): Promise<StationComparison[]> => {
  try {
    const sanitizedParams = {
      stationIds: params.stationIds.map(id => sanitizeUrlParam(id)),
      ...(params.period && { period: sanitizeUrlParam(params.period) })
    };
    const response = await contractClient.get<any>('/analytics/station-comparison', sanitizedParams);
    if (!response || !Array.isArray(response)) {
      secureLog.warn('Station comparison API returned invalid data');
      return [];
    }
    // Fixing type mismatch in the response mapping for StationComparison
    return response.map((item: any) => ({
      stationId: item.stationId || item.id,
      stationName: item.stationName || item.name,
      currentPeriod: {
        revenue: item.totalSales || item.sales || 0,
        volume: item.totalVolume || item.volume || 0,
        salesCount: item.transactionCount || item.transactions || 0,
      },
      previousPeriod: {
        revenue: item.previousSales || 0,
        volume: item.previousVolume || 0,
        salesCount: item.previousTransactions || 0,
      },
      growth: item.salesGrowth || item.growth || 0,
      sales: item.sales || 0, // Adding missing property
      volume: item.volume || 0 // Adding missing property
    }));
  } catch (error) {
    secureLog.error('Error fetching station comparison data:', error);
    return [];
  }
};

/**
 * Get hourly sales data
 */
export const getHourlySales = async (params: { stationId?: string; date?: string }): Promise<HourlySales[]> => {
  try {
    const sanitizedParams = {
      ...(params.stationId && { stationId: sanitizeUrlParam(params.stationId) }),
      ...(params.date && { date: sanitizeUrlParam(params.date) })
    };
    return await contractClient.get<HourlySales[]>('/analytics/hourly-sales', sanitizedParams);
  } catch (error) {
    secureLog.error('Error fetching hourly sales:', error);
    return [];
  }
};

/**
 * Get peak hours data
 */
export const getPeakHours = async (params: { stationId?: string; period?: string }): Promise<PeakHour[]> => {
  try {
    const sanitizedParams = {
      ...(params.stationId && { stationId: sanitizeUrlParam(params.stationId) }),
      ...(params.period && { period: sanitizeUrlParam(params.period) })
    };
    return await contractClient.get<PeakHour[]>('/analytics/peak-hours', sanitizedParams);
  } catch (error) {
    secureLog.error('Error fetching peak hours:', error);
    return [];
  }
};

/**
 * Get fuel performance data
 */
export const getFuelPerformance = async (params: { stationId?: string; period?: string }): Promise<FuelPerformance[]> => {
  try {
    const sanitizedParams = {
      ...(params.stationId && { stationId: sanitizeUrlParam(params.stationId) }),
      ...(params.period && { period: sanitizeUrlParam(params.period) })
    };
    return await contractClient.get<FuelPerformance[]>('/analytics/fuel-performance', sanitizedParams);
  } catch (error) {
    secureLog.error('Error fetching fuel performance:', error);
    return [];
  }
};

/**
 * Get station ranking data
 */
export const getStationRanking = async (params: { period?: string; limit?: number }): Promise<StationRanking[]> => {
  try {
    const sanitizedParams = {
      ...(params.period && { period: sanitizeUrlParam(params.period) }),
      ...(params.limit && { limit: params.limit })
    };
    const result = await contractClient.get<StationRanking[]>('/analytics/station-ranking', sanitizedParams);
    return result || [];
  } catch (error) {
    secureLog.error('Error fetching station ranking data:', error);
    return [];
  }
};

/**
 * Get super admin analytics data
 */
export const getSuperAdminAnalytics = async (): Promise<SuperAdminAnalytics> => {
  try {
    const response = await apiClient.get('/analytics/superadmin');
    return response.data;
  } catch (error) {
    secureLog.error('Error fetching super admin analytics:', error);
    throw error;
  }
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
      secureLog.error('Error in getStationComparison:', error);
      return []; // Return empty array to prevent map errors
    }
  },
  getHourlySales: async (stationId?: string, dateRange?: { from: Date; to: Date }) => {
    const params: any = {};
    if (stationId) params.stationId = sanitizeUrlParam(stationId);
    if (dateRange) {
      params.startDate = dateRange.from.toISOString().split('T')[0];
      params.endDate = dateRange.to.toISOString().split('T')[0];
    }
    return getHourlySales(params);
  },
  getPeakHours: async (stationId?: string) => {
    const params: any = {};
    if (stationId) params.stationId = sanitizeUrlParam(stationId);
    return getPeakHours(params);
  },
  getFuelPerformance: async (stationId?: string, dateRange?: { from: Date; to: Date }) => {
    const params: any = {};
    if (stationId) params.stationId = sanitizeUrlParam(stationId);
    if (dateRange) {
      params.startDate = dateRange.from.toISOString().split('T')[0];
      params.endDate = dateRange.to.toISOString().split('T')[0];
    }
    return getFuelPerformance(params);
  },
  getStationRanking: async (period: string) => {
    try {
      const result = await getStationRanking({ period: sanitizeUrlParam(period) });
      if (!result) {
        throw new Error('No result returned from getStationRanking');
      }
      return result;
    } catch (error) {
      secureLog.error('Error in getStationRanking:', error);
      return [];
    }
  },
  getSuperAdminAnalytics
};