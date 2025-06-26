
import { apiClient, extractApiData, extractApiArray } from './client';
import type { 
  SalesSummary, 
  PaymentMethodBreakdown, 
  FuelTypeBreakdown, 
  TopCreditor,
  DailySalesTrend,
  StationMetric,
  ApiResponse 
} from './api-contract';

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const dashboardApi = {
  // Get monthly sales summary
  getSalesSummary: async (range: string = 'monthly', filters: DashboardFilters = {}): Promise<SalesSummary> => {
    const params = new URLSearchParams({ range });
    if (filters.stationId) params.append('stationId', filters.stationId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    
    const response = await apiClient.get(`/dashboard/sales-summary?${params}`);
    return extractApiData<SalesSummary>(response);
  },

  // Get payment method breakdown
  getPaymentMethodBreakdown: async (filters: DashboardFilters = {}): Promise<PaymentMethodBreakdown[]> => {
    try {
      const params = new URLSearchParams();
      if (filters.stationId) params.append('stationId', filters.stationId);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      
      const response = await apiClient.get(`/dashboard/payment-methods?${params}`);
      return extractApiArray<PaymentMethodBreakdown>(response);
    } catch (error) {
      console.error('Error fetching payment method breakdown:', error);
      return [];
    }
  },

  // Get fuel type breakdown
  getFuelTypeBreakdown: async (filters: DashboardFilters = {}): Promise<FuelTypeBreakdown[]> => {
    try {
      const params = new URLSearchParams();
      if (filters.stationId) params.append('stationId', filters.stationId);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      
      const response = await apiClient.get(`/dashboard/fuel-breakdown?${params}`);
      return extractApiArray<FuelTypeBreakdown>(response);
    } catch (error) {
      console.error('Error fetching fuel type breakdown:', error);
      return [];
    }
  },

  // Get top creditors by outstanding amount
  getTopCreditors: async (limit: number = 5, filters: DashboardFilters = {}): Promise<TopCreditor[]> => {
    try {
      const params = new URLSearchParams({ limit: limit.toString() });
      if (filters.stationId) params.append('stationId', filters.stationId);
      
      const response = await apiClient.get(`/dashboard/top-creditors?${params}`);
      return extractApiArray<TopCreditor>(response);
    } catch (error) {
      console.error('Error fetching top creditors:', error);
      return [];
    }
  },

  // Get daily sales trend
  getDailySalesTrend: async (days: number = 7, filters: DashboardFilters = {}): Promise<DailySalesTrend[]> => {
    try {
      const params = new URLSearchParams({ days: days.toString() });
      if (filters.stationId) params.append('stationId', filters.stationId);
      
      const response = await apiClient.get(`/dashboard/sales-trend?${params}`);
      return extractApiArray<DailySalesTrend>(response);
    } catch (error) {
      console.error('Error fetching daily sales trend:', error);
      return [];
    }
  },

  // Get station metrics
  getStationMetrics: async (): Promise<StationMetric[]> => {
    try {
      const response = await apiClient.get('/stations?includeMetrics=true');
      const stations = extractApiArray(response);
      
      // Transform backend response to match StationMetric interface
      return stations.map((station: any) => ({
        id: station.id,
        name: station.name,
        todaySales: station.metrics?.totalSales || 0,
        monthlySales: station.metrics?.totalSales || 0, // Backend doesn't separate today/monthly yet
        salesGrowth: 0, // Backend doesn't provide growth calculation yet
        activePumps: station.pumpCount || 0,
        totalPumps: station.pumpCount || 0,
        status: station.status || 'active'
      }));
    } catch (error) {
      console.error('Error fetching station metrics:', error);
      return [];
    }
  }
};

// Export types for backward compatibility
export type { DashboardFilters };
