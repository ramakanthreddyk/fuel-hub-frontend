
/**
 * @file analytics.ts
 * @description Analytics API functions
 */
import { contractClient } from './contract-client';
import { StationComparison, HourlySales, PeakHour, FuelPerformance, StationRanking } from './api-contract';

/**
 * Get station comparison data
 */
export const getStationComparison = async (params: { stationIds: string[]; period?: string }): Promise<StationComparison[]> => {
  const response = await contractClient.get<any>('/analytics/station-comparison', params);
  
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
  return contractClient.get<StationRanking[]>('/analytics/station-ranking', params);
};
