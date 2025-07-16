
/**
 * @file api/services/dashboardService.ts
 * @description Service for dashboard API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';

export interface SalesSummary {
  totalRevenue: number;
  totalVolume: number;
  salesCount: number;
  period: string;
  cashSales: number;
  creditSales: number;
  cardSales?: number;
  upiSales?: number;
  growthPercentage: number;

  averageTicketSize?: number;
  totalProfit?: number;
  profitMargin?: number;
  previousPeriodRevenue?: number;
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
  creditLimit: number | null;
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
  status: "active" | "inactive" | "maintenance";
  lastActivity?: string;
  efficiency?: number;
}

export interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const dashboardService = {
  /**
   * Get sales summary
   */
  getSalesSummary: async (range: string = 'monthly', filters: DashboardFilters = {}): Promise<SalesSummary> => {
    try {
      const params = new URLSearchParams();
      params.append('range', range);
      if (filters.stationId) params.append('stationId', filters.stationId);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);

      const response = await apiClient.get(`/dashboard/sales-summary?${params.toString()}`);
      return extractData<SalesSummary>(response);
    } catch (error) {
      console.error('[DASHBOARD-API] Error fetching sales summary:', error);
      throw error;
    }
  },

  /**
   * Get payment method breakdown
   */
  getPaymentMethodBreakdown: async (filters: DashboardFilters = {}): Promise<PaymentMethodBreakdown[]> => {
    try {
      const params = new URLSearchParams();
      if (filters.stationId) params.append('stationId', filters.stationId);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);

      const response = await apiClient.get(`/dashboard/payment-methods?${params.toString()}`);
      return extractArray<PaymentMethodBreakdown>(response);
    } catch (error) {
      console.error('[DASHBOARD-API] Error fetching payment methods:', error);
      throw error;
    }
  },

  /**
   * Get fuel type breakdown
   */
  getFuelTypeBreakdown: async (filters: DashboardFilters = {}): Promise<FuelTypeBreakdown[]> => {
    try {
      const params = new URLSearchParams();
      if (filters.stationId) params.append('stationId', filters.stationId);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);

      const response = await apiClient.get(`/dashboard/fuel-breakdown?${params.toString()}`);
      return extractArray<FuelTypeBreakdown>(response);
    } catch (error) {
      console.error('[DASHBOARD-API] Error fetching fuel breakdown:', error);
      throw error;
    }
  },

  /**
   * Get top creditors
   */
  getTopCreditors: async (limit: number = 5): Promise<TopCreditor[]> => {
    try {
      const response = await apiClient.get(`/dashboard/top-creditors?limit=${limit}`);
      return extractArray<TopCreditor>(response);
    } catch (error) {
      console.error('[DASHBOARD-API] Error fetching top creditors:', error);
      throw error;
    }
  },

  /**
   * Get daily sales trend
   */
  getDailySalesTrend: async (days: number = 7, filters: DashboardFilters = {}): Promise<DailySalesTrend[]> => {
    try {
      const params = new URLSearchParams();
      params.append('days', days.toString());
      if (filters.stationId) params.append('stationId', filters.stationId);

      const response = await apiClient.get(`/dashboard/sales-trend?${params.toString()}`);
      return extractArray<DailySalesTrend>(response);
    } catch (error) {
      console.error('[DASHBOARD-API] Error fetching sales trend:', error);
      throw error;
    }
  },

  /**
   * Get station metrics
   */
  getStationMetrics: async (): Promise<StationMetric[]> => {
    try {
      const response = await apiClient.get('/dashboard/station-metrics');
      // Handle direct array response from API without a wrapper object
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return extractArray<StationMetric>(response);
    } catch (error) {
      console.error('[DASHBOARD-API] Error fetching station metrics:', error);
      throw error;
    }
  }
};
