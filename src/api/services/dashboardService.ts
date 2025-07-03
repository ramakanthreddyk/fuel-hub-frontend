/**
 * @file dashboardService.ts
 * @description Service for dashboard API endpoints
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/OWNER.md - Owner journey for dashboard
 */
import apiClient, { extractData } from '../core/apiClient';

// Types
export interface SalesSummary {
  totalRevenue: number;
  totalVolume: number;
  salesCount: number;
  averageTicketSize: number;
  cashSales: number;
  creditSales: number;
  growthPercentage: number;
  totalProfit?: number;
  profitMargin?: number;
  period?: string;
  previousPeriodRevenue?: number;
  revenue?: number; // Alias for totalRevenue
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
  averagePrice?: number;
}

export interface DailySalesTrend {
  date: string;
  revenue: number;
  volume: number;
  salesCount: number;
  dayOfWeek?: string;
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

/**
 * Service for dashboard API
 */
export const dashboardService = {
  /**
   * Get sales summary for the dashboard
   * @param period Optional period (today, week, month, year)
   * @returns Sales summary data
   */
  getSalesSummary: async (period: string = 'today'): Promise<SalesSummary> => {
    const response = await apiClient.get('/dashboard/sales-summary', { params: { period } });
    return extractData<SalesSummary>(response);
  },
  
  /**
   * Get payment method breakdown
   * @param period Optional period (today, week, month, year)
   * @returns Payment method breakdown data
   */
  getPaymentMethodBreakdown: async (period: string = 'today'): Promise<PaymentMethodBreakdown[]> => {
    const response = await apiClient.get('/dashboard/payment-methods', { params: { period } });
    return extractData<PaymentMethodBreakdown[]>(response);
  },
  
  /**
   * Get fuel type breakdown
   * @param period Optional period (today, week, month, year)
   * @returns Fuel type breakdown data
   */
  getFuelTypeBreakdown: async (period: string = 'today'): Promise<FuelTypeBreakdown[]> => {
    const response = await apiClient.get('/dashboard/fuel-types', { params: { period } });
    return extractData<FuelTypeBreakdown[]>(response);
  },
  
  /**
   * Get daily sales trend
   * @param days Number of days to include
   * @returns Daily sales trend data
   */
  getDailySalesTrend: async (days: number = 7): Promise<DailySalesTrend[]> => {
    const response = await apiClient.get('/dashboard/daily-trend', { params: { days } });
    return extractData<DailySalesTrend[]>(response);
  },
  
  /**
   * Get station metrics
   * @returns Station metrics data
   */
  getStationMetrics: async (): Promise<StationMetric[]> => {
    const response = await apiClient.get('/dashboard/station-metrics');
    return extractData<StationMetric[]>(response);
  }
};

export default dashboardService;