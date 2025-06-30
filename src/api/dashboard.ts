
import { apiClient, extractApiData, extractApiArray } from './client';

export interface DashboardMetrics {
  totalStations: number;
  activePumps: number;
  todaysSales: number;
  totalRevenue: number;
  fuelInventory: number;
  activeAlerts: number;
  averagePrice: number;
  salesGrowth: number;
}

export interface SalesTrend {
  date: string;
  sales: number;
  revenue: number;
}

export interface FuelBreakdown {
  fuelType: string;
  volume: number;
  revenue: number;
  percentage: number;
}

export interface TopCreditor {
  id: string;
  name: string;
  outstandingAmount: number;
  creditLimit: number;
  utilizationPercentage: number;
}

export interface RecentSale {
  id: string;
  stationName: string;
  fuelType: string;
  quantity: number;
  amount: number;
  timestamp: string;
  attendant: string;
}

export interface StationMetric {
  id: string;
  name: string;
  location?: string;
  todaySales: number;
  monthlySales: number;
  salesGrowth: number;
  activePumps: number;
  totalPumps: number;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface SalesSummary {
  totalRevenue: number;
  totalVolume: number;
  salesCount: number;
  averageTicketSize: number;
  cashSales: number;
  creditSales: number;
  growthPercentage: number;
}

export interface PaymentMethodBreakdown {
  method: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface FuelTypeBreakdown {
  fuelType: string;
  volume: number;
  revenue: number;
  percentage: number;
}

export interface DailySalesTrend {
  date: string;
  revenue: number;
  volume: number;
  salesCount: number;
}

export class DashboardApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'DashboardApiError';
  }
}

const handleApiError = (error: any, defaultMessage: string) => {
  const errorMessage = error.response?.data?.message || defaultMessage;
  console.error('Dashboard API Error:', errorMessage);
  throw new DashboardApiError(errorMessage, error.response?.status);
};

export const dashboardApi = {
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    try {
      const response = await apiClient.get('/dashboard/metrics');
      return extractApiData<DashboardMetrics>(response);
    } catch (error: any) {
      handleApiError(error, 'Failed to fetch dashboard metrics');
    }
  },

  getSalesTrend: async (days: number = 7): Promise<SalesTrend[]> => {
    try {
      const response = await apiClient.get(`/dashboard/sales-trend?days=${days}`);
      return extractApiArray<SalesTrend>(response);
    } catch (error: any) {
      handleApiError(error, 'Failed to fetch sales trend');
    }
  },

  getFuelBreakdown: async (): Promise<FuelBreakdown[]> => {
    try {
      const response = await apiClient.get('/dashboard/fuel-breakdown');
      return extractApiArray<FuelBreakdown>(response);
    } catch (error: any) {
      handleApiError(error, 'Failed to fetch fuel breakdown');
    }
  },

  getTopCreditors: async (limit: number = 5): Promise<TopCreditor[]> => {
    try {
      const response = await apiClient.get(`/dashboard/top-creditors?limit=${limit}`);
      return extractApiArray<TopCreditor>(response);
    } catch (error: any) {
      handleApiError(error, 'Failed to fetch top creditors');
    }
  },

  getRecentSales: async (limit: number = 10): Promise<RecentSale[]> => {
    try {
      const response = await apiClient.get(`/dashboard/recent-sales?limit=${limit}`);
      return extractApiArray<RecentSale>(response);
    } catch (error: any) {
      handleApiError(error, 'Failed to fetch recent sales');
    }
  },

  getStationMetrics: async (): Promise<StationMetric[]> => {
    try {
      const response = await apiClient.get('/dashboard/station-metrics');
      return extractApiArray<StationMetric>(response);
    } catch (error: any) {
      handleApiError(error, 'Failed to fetch station metrics');
    }
  },

  getSalesSummary: async (range: string = 'monthly', filters: any = {}): Promise<SalesSummary> => {
    try {
      const params = new URLSearchParams({ range, ...filters });
      const response = await apiClient.get(`/dashboard/sales-summary?${params}`);
      return extractApiData<SalesSummary>(response);
    } catch (error: any) {
      handleApiError(error, 'Failed to fetch sales summary');
    }
  },

  getPaymentMethodBreakdown: async (filters: any = {}): Promise<PaymentMethodBreakdown[]> => {
    try {
      const params = new URLSearchParams(filters);
      const response = await apiClient.get(`/dashboard/payment-methods?${params}`);
      return extractApiArray<PaymentMethodBreakdown>(response);
    } catch (error: any) {
      handleApiError(error, 'Failed to fetch payment method breakdown');
    }
  },

  getFuelTypeBreakdown: async (filters: any = {}): Promise<FuelTypeBreakdown[]> => {
    try {
      const params = new URLSearchParams(filters);
      const response = await apiClient.get(`/dashboard/fuel-types?${params}`);
      return extractApiArray<FuelTypeBreakdown>(response);
    } catch (error: any) {
      handleApiError(error, 'Failed to fetch fuel type breakdown');
    }
  },

  getDailySalesTrend: async (days: number = 7, filters: any = {}): Promise<DailySalesTrend[]> => {
    try {
      const params = new URLSearchParams({ days: days.toString(), ...filters });
      const response = await apiClient.get(`/dashboard/daily-trend?${params}`);
      return extractApiArray<DailySalesTrend>(response);
    } catch (error: any) {
      handleApiError(error, 'Failed to fetch daily sales trend');
    }
  },
};

// Legacy exports for backward compatibility
export const getDashboardMetrics = dashboardApi.getDashboardMetrics;
export const getSalesTrend = dashboardApi.getSalesTrend;
export const getFuelBreakdown = dashboardApi.getFuelBreakdown;
export const getTopCreditors = dashboardApi.getTopCreditors;
export const getRecentSales = dashboardApi.getRecentSales;
