
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
      const data = extractApiArray<any>(response);
      
      // Normalize the data to ensure it has all required fields
      return data.map(item => ({
        id: item.id || item.stationId || '',
        stationId: item.id || item.stationId || '',
        stationName: item.name || item.stationName || 'Unknown Station',
        sales: typeof item.sales === 'number' ? item.sales : (item.totalSales || 0),
        volume: typeof item.volume === 'number' ? item.volume : (item.totalVolume || 0),
        transactions: typeof item.transactions === 'number' ? item.transactions : (item.transactionCount || 0),
        growth: typeof item.growth === 'number' ? item.growth : 0
      }));
    } catch (error) {
      console.error('Error fetching station comparison:', error);
      return [];
    }
  },

  getHourlySales: async (stationId?: string, dateRange?: { from: Date; to: Date }): Promise<HourlySales[]> => {
    try {
      if (!stationId) {
        console.error('Error: stationId is required for hourly sales');
        return [];
      }
      
      // If dateRange is not provided, use today as default
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      
      const params = new URLSearchParams();
      params.append('stationId', stationId); // stationId is required
      params.append('dateFrom', (dateRange?.from || startOfDay).toISOString());
      params.append('dateTo', (dateRange?.to || endOfDay).toISOString());
      
      const response = await apiClient.get(`/analytics/hourly-sales?${params}`);
      const data = extractApiArray<any>(response);
      
      // Normalize the data to ensure it has all required fields
      return data.map(item => ({
        hour: typeof item.hour === 'number' ? item.hour.toString() : (item.hour || '0'),
        sales: item.sales || item.revenue || 0,
        volume: item.volume || 0,
        transactions: item.transactions || 0,
        date: item.date || new Date().toISOString().split('T')[0]
      }));
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
      const data = extractApiArray<PeakHour>(response);
      
      // Normalize the data to ensure it has all required fields
      return data.map(item => ({
        ...item,
        hour: typeof item.hour === 'string' ? parseInt(item.hour, 10) : (item.hour || 0),
        averageRevenue: item.averageRevenue || item.avgSales || 0,
        averageVolume: item.averageVolume || item.avgVolume || 0,
        averageSalesCount: item.averageSalesCount || 0,
        timeRange: item.timeRange || 'Unknown',
        avgSales: item.avgSales || item.averageRevenue || 0
      }));
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
      const data = extractApiArray<any>(response);
      
      // Normalize the data to ensure it has all required fields
      return data.map(item => ({
        fuelType: item.fuelType || 'Unknown',
        revenue: item.revenue || item.sales || 0,
        volume: item.volume || 0,
        salesCount: item.salesCount || 0,
        averagePrice: item.averagePrice || 0,
        growth: item.growth || 0,
        margin: item.margin || 0,
        sales: item.sales || item.revenue || 0
      }));
    } catch (error) {
      console.error('Error fetching fuel performance:', error);
      return [];
    }
  },

  getStationRanking: async (period: string): Promise<StationRanking[]> => {
    try {
      const response = await apiClient.get(`/analytics/station-ranking?period=${period}`);
      const data = extractApiArray<any>(response);
      
      // Normalize the data to ensure it has all required fields
      return data.map(item => ({
        id: item.id || '',
        stationId: item.id || '',
        stationName: item.name || 'Unknown Station',
        name: item.name || 'Unknown Station',
        rank: item.rank || 0,
        revenue: typeof item.totalSales === 'number' ? item.totalSales : 0,
        sales: typeof item.totalSales === 'number' ? item.totalSales : 0,
        volume: typeof item.totalVolume === 'number' ? item.totalVolume : 0,
        efficiency: typeof item.efficiency === 'number' ? item.efficiency : 0,
        score: 0,
        growth: 0
      }));
    } catch (error) {
      console.error('Error fetching station ranking:', error);
      return [];
    }
  },

  getSuperAdminAnalytics: async (): Promise<SuperAdminAnalytics> => {
    try {
      // Use the correct endpoint from the OpenAPI spec
      const response = await apiClient.get('/admin/analytics');
      return extractApiData<SuperAdminAnalytics>(response);
    } catch (error) {
      console.error('Error fetching super admin analytics:', error);
      // Return a default object with empty values to prevent UI errors
      return {
        overview: {
          totalTenants: 0,
          totalRevenue: 0,
          totalStations: 0,
          growth: 0
        },
        tenantMetrics: {
          activeTenants: 0,
          trialTenants: 0,
          suspendedTenants: 0,
          monthlyGrowth: 0
        },
        revenueMetrics: {
          mrr: 0,
          arr: 0,
          churnRate: 0,
          averageRevenuePerTenant: 0
        },
        usageMetrics: {
          totalUsers: 0,
          totalStations: 0,
          totalTransactions: 0,
          averageStationsPerTenant: 0
        },
        totalTenants: 0,
        activeTenants: 0,
        totalRevenue: 0,
        tenantCount: 0,
        activeTenantCount: 0,
        totalUsers: 0,
        signupsThisMonth: 0,
        tenantsByPlan: [],
        recentTenants: []
      };
    }
  },
};
