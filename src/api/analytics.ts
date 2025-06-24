
import { apiClient } from './client';

export interface StationComparison {
  id: string;
  stationName: string;
  sales: number;
  volume: number;
  transactions: number;
  growth: number;
}

export interface HourlySales {
  hour: string;
  sales: number;
  volume: number;
  transactions: number;
}

export interface PeakHour {
  timeRange: string;
  avgSales: number;
  avgVolume: number;
}

export interface FuelPerformance {
  fuelType: string;
  volume: number;
  sales: number;
  margin: number;
  growth: number;
}

export interface StationRanking {
  id: string;
  name: string;
  sales: number;
  volume: number;
  growth: number;
  efficiency: number;
  rank: number;
}

export interface SuperAdminAnalytics {
  totalTenants: number;
  activeTenants: number;
  totalStations: number;
  salesVolume: number;
  totalRevenue: number;
  monthlyGrowth: {
    month: string;
    tenants: number;
    revenue: number;
  }[];
  topTenants: {
    id: string;
    name: string;
    stationsCount: number;
    revenue: number;
  }[];
}

export const analyticsApi = {
  getStationComparison: async (stationIds: string[], period: string): Promise<StationComparison[]> => {
    const params = new URLSearchParams({
      period,
      stationIds: stationIds.join(','),
    });
    
    const response = await apiClient.get(`/analytics/station-comparison?${params}`);
    return response.data;
  },

  getHourlySales: async (stationId?: string, dateRange?: { from: Date; to: Date }): Promise<HourlySales[]> => {
    const params = new URLSearchParams();
    if (stationId) params.append('stationId', stationId);
    if (dateRange?.from) params.append('dateFrom', dateRange.from.toISOString());
    if (dateRange?.to) params.append('dateTo', dateRange.to.toISOString());
    
    const response = await apiClient.get(`/analytics/hourly-sales?${params}`);
    return response.data;
  },

  getPeakHours: async (stationId?: string): Promise<PeakHour[]> => {
    const params = new URLSearchParams();
    if (stationId) params.append('stationId', stationId);
    
    const response = await apiClient.get(`/analytics/peak-hours?${params}`);
    return response.data;
  },

  getFuelPerformance: async (stationId?: string, dateRange?: { from: Date; to: Date }): Promise<FuelPerformance[]> => {
    const params = new URLSearchParams();
    if (stationId) params.append('stationId', stationId);
    if (dateRange?.from) params.append('dateFrom', dateRange.from.toISOString());
    if (dateRange?.to) params.append('dateTo', dateRange.to.toISOString());
    
    const response = await apiClient.get(`/analytics/fuel-performance?${params}`);
    return response.data;
  },

  getStationRanking: async (period: string): Promise<StationRanking[]> => {
    const response = await apiClient.get(`/analytics/station-ranking?period=${period}`);
    return response.data;
  },

  getSuperAdminAnalytics: async (): Promise<SuperAdminAnalytics> => {
    const response = await apiClient.get('/analytics/superadmin');
    return response.data;
  },
};
