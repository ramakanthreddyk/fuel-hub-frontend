
import { apiClient } from './client';

export interface SalesSummary {
  totalSales: number;
  totalVolume: number;
  transactionCount: number;
  totalProfit: number;
  profitMargin: number;
  period: string;
}

export interface PaymentMethodBreakdown {
  paymentMethod: string;
  amount: number;
  percentage: number;
}

export interface FuelTypeBreakdown {
  fuelType: string;
  volume: number;
  amount: number;
}

export interface TopCreditor {
  id: string;
  partyName: string;
  outstandingAmount: number;
  creditLimit?: number;
}

export interface DailySalesTrend {
  date: string;
  amount: number;
  volume: number;
}

export interface StationMetric {
  id: string;
  name: string;
  todaySales: number;
  monthlySales: number;
  salesGrowth: number;
  activePumps: number;
  totalPumps: number;
  status: 'active' | 'maintenance' | 'inactive';
}

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
    return response.data;
  },

  // Get payment method breakdown
  getPaymentMethodBreakdown: async (filters: DashboardFilters = {}): Promise<PaymentMethodBreakdown[]> => {
    const params = new URLSearchParams();
    if (filters.stationId) params.append('stationId', filters.stationId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    
    const response = await apiClient.get(`/dashboard/payment-methods?${params}`);
    return response.data;
  },

  // Get fuel type breakdown
  getFuelTypeBreakdown: async (filters: DashboardFilters = {}): Promise<FuelTypeBreakdown[]> => {
    const params = new URLSearchParams();
    if (filters.stationId) params.append('stationId', filters.stationId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    
    const response = await apiClient.get(`/dashboard/fuel-breakdown?${params}`);
    return response.data;
  },

  // Get top creditors by outstanding amount
  getTopCreditors: async (limit: number = 5, filters: DashboardFilters = {}): Promise<TopCreditor[]> => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (filters.stationId) params.append('stationId', filters.stationId);
    
    const response = await apiClient.get(`/dashboard/top-creditors?${params}`);
    return response.data;
  },

  // Get daily sales trend
  getDailySalesTrend: async (days: number = 7, filters: DashboardFilters = {}): Promise<DailySalesTrend[]> => {
    const params = new URLSearchParams({ days: days.toString() });
    if (filters.stationId) params.append('stationId', filters.stationId);
    
    const response = await apiClient.get(`/dashboard/sales-trend?${params}`);
    return response.data;
  },

  // Get station metrics
  getStationMetrics: async (): Promise<StationMetric[]> => {
    const response = await apiClient.get('/stations?includeMetrics=true');
    // Transform backend response to match StationMetric interface
    return response.data.map((station: any) => ({
      id: station.id,
      name: station.name,
      todaySales: station.metrics?.totalSales || 0,
      monthlySales: station.metrics?.totalSales || 0, // Backend doesn't separate today/monthly yet
      salesGrowth: 0, // Backend doesn't provide growth calculation yet
      activePumps: station.pumpCount || 0,
      totalPumps: station.pumpCount || 0,
      status: station.status || 'active'
    }));
  }
};
