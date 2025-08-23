
/**
 * @file api/services/dashboardService.ts
 * @description Service for dashboard API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';
import { sanitizeUrlParam, secureLog } from '@/utils/security';
import API_CONFIG from '../core/config';

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

      // Try using the apiClient first
      try {
        const response = await apiClient.get(`/dashboard/sales-summary?${params.toString()}`);
        
        // Handle different response formats
        let data;
        if (response.data?.data) {
          data = response.data.data;
        } else {
          data = response.data;
        }
        
        // Map the response to the expected format
        return {
          totalRevenue: data.totalRevenue || 0,
          totalVolume: data.totalVolume || 0,
          salesCount: data.salesCount || 0,
          period: data.period || range,
          cashSales: data.cashSales || 0,
          creditSales: data.creditSales || 0,
          cardSales: data.cardSales || 0,
          upiSales: data.upiSales || 0,
          growthPercentage: data.growthPercentage || 0,
          averageTicketSize: data.averageTicketSize || (data.salesCount ? data.totalRevenue / data.salesCount : 0),
          totalProfit: data.totalProfit || 0,
          profitMargin: data.profitMargin || 0,
          previousPeriodRevenue: data.previousPeriodRevenue || 0
        };
      } catch (innerError) {
        secureLog.error('[DASHBOARD-API] Inner error fetching sales summary:', innerError);
        // If that fails, try a direct axios call with the full URL
        const axios = (await import('axios')).default;
        const directResponse = await axios.get(`${API_CONFIG.BASE_URL}/dashboard/sales-summary?${params.toString()}`);
        const data = directResponse.data;
        
        // Map the response to the expected format
        return {
          totalRevenue: data.totalRevenue || 0,
          totalVolume: data.totalVolume || 0,
          salesCount: data.salesCount || 0,
          period: data.period || range,
          cashSales: data.cashSales || 0,
          creditSales: data.creditSales || 0,
          cardSales: data.cardSales || 0,
          upiSales: data.upiSales || 0,
          growthPercentage: data.growthPercentage || 0,
          averageTicketSize: data.averageTicketSize || (data.salesCount ? data.totalRevenue / data.salesCount : 0),
          totalProfit: data.totalProfit || 0,
          profitMargin: data.profitMargin || 0,
          previousPeriodRevenue: data.previousPeriodRevenue || 0
        };
      }
    } catch (error) {
      secureLog.error('[DASHBOARD-API] Error fetching sales summary:', error);
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
      secureLog.error('[DASHBOARD-API] Error fetching payment methods:', error);
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
      secureLog.error('[DASHBOARD-API] Error fetching fuel breakdown:', error);
      throw error;
    }
  },

  /**
   * Get top creditors
   */
  getTopCreditors: async (limit: number = 5): Promise<TopCreditor[]> => {
    try {
      const response = await apiClient.get(`/dashboard/top-creditors?limit=${sanitizeUrlParam(limit)}`);
      return extractArray<TopCreditor>(response);
    } catch (error) {
      secureLog.error('[DASHBOARD-API] Error fetching top creditors:', error);
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
      secureLog.error('[DASHBOARD-API] Error fetching sales trend:', error);
      throw error;
    }
  },

  /**
   * Get station metrics
   */
  getStationMetrics: async (): Promise<StationMetric[]> => {
    try {
      // Try using the apiClient first
      try {
        const response = await apiClient.get('/dashboard/station-metrics');
        // Handle direct array response from API without a wrapper object
        if (Array.isArray(response.data)) {
          return response.data;
        }
        return extractArray<StationMetric>(response);
      } catch (innerError) {
        // If that fails, try a direct axios call with the full URL
        const axios = (await import('axios')).default;
        const directResponse = await axios.get(`${API_CONFIG.BASE_URL}/dashboard/station-metrics`);
        return Array.isArray(directResponse.data) ? directResponse.data : [];
      }
    } catch (error) {
      secureLog.error('[DASHBOARD-API] Error fetching station metrics:', error);
      // Return empty array instead of throwing to prevent dashboard from breaking
      return [];
    }
  },

  getTopStations: async (limit: number = 10): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/dashboard/top-stations?limit=${sanitizeUrlParam(limit)}`);
      return extractArray<any>(response, 'stations');
    } catch (error) {
      secureLog.error('[DASHBOARD-API] Error fetching top stations:', error);
      throw error;
    }
  },

  getRecentActivities: async (limit: number = 20): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/dashboard/recent-activities?limit=${sanitizeUrlParam(limit)}`);
      return extractArray<any>(response, 'activities');
    } catch (error) {
      secureLog.error('[DASHBOARD-API] Error fetching recent activities:', error);
      throw error;
    }
  },

  getAlertsSummary: async (): Promise<{ total: number; critical: number; unread: number }> => {
    try {
      const response = await apiClient.get('/dashboard/alerts-summary');
      return extractData<{ total: number; critical: number; unread: number }>(response);
    } catch (error) {
      secureLog.error('[DASHBOARD-API] Error fetching alerts summary:', error);
      throw error;
    }
  }
};
