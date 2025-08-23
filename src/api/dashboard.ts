
import { apiClient, extractApiData, extractApiArray } from './client';
import { secureLog, sanitizeUrlParam } from '@/utils/security';
import type { 
  SalesSummary, 
  PaymentMethodBreakdown, 
  FuelTypeBreakdown, 
  TopCreditor, 
  DailySalesTrend, 
  StationMetric 
} from './api-contract';

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const dashboardApi = {
  getSalesSummary: async (range: string = 'monthly', filters: DashboardFilters = {}): Promise<SalesSummary> => {
    try {
      const sanitizedFilters = {
        range: sanitizeUrlParam(range),
        ...(filters.stationId && { stationId: sanitizeUrlParam(filters.stationId) }),
        ...(filters.dateFrom && { dateFrom: sanitizeUrlParam(filters.dateFrom) }),
        ...(filters.dateTo && { dateTo: sanitizeUrlParam(filters.dateTo) })
      };
      const response = await apiClient.get('/dashboard/sales-summary', {
        params: sanitizedFilters
      });
      return extractApiData<SalesSummary>(response);
    } catch (error) {
      secureLog.error('Error fetching sales summary:', error);
      throw error;
    }
  },

  getPaymentMethodBreakdown: async (filters: DashboardFilters = {}): Promise<PaymentMethodBreakdown[]> => {
    try {
      const sanitizedFilters = {
        ...(filters.stationId && { stationId: sanitizeUrlParam(filters.stationId) }),
        ...(filters.dateFrom && { dateFrom: sanitizeUrlParam(filters.dateFrom) }),
        ...(filters.dateTo && { dateTo: sanitizeUrlParam(filters.dateTo) })
      };
      const response = await apiClient.get('/dashboard/payment-methods', {
        params: sanitizedFilters
      });
      return extractApiArray<PaymentMethodBreakdown>(response, 'paymentMethods');
    } catch (error) {
      secureLog.error('Error fetching payment method breakdown:', error);
      return [];
    }
  },

  getFuelTypeBreakdown: async (filters: DashboardFilters = {}): Promise<FuelTypeBreakdown[]> => {
    try {
      const sanitizedFilters = {
        ...(filters.stationId && { stationId: sanitizeUrlParam(filters.stationId) }),
        ...(filters.dateFrom && { dateFrom: sanitizeUrlParam(filters.dateFrom) }),
        ...(filters.dateTo && { dateTo: sanitizeUrlParam(filters.dateTo) })
      };
      const response = await apiClient.get('/dashboard/fuel-breakdown', {
        params: sanitizedFilters
      });
      return extractApiArray<FuelTypeBreakdown>(response, 'fuelTypes');
    } catch (error) {
      secureLog.error('Error fetching fuel type breakdown:', error);
      return [];
    }
  },

  getTopCreditors: async (limit: number = 5): Promise<TopCreditor[]> => {
    try {
      const response = await apiClient.get('/dashboard/top-creditors', {
        params: { limit }
      });
      return extractApiArray<TopCreditor>(response, 'creditors');
    } catch (error) {
      secureLog.error('Error fetching top creditors:', error);
      return [];
    }
  },

  getDailySalesTrend: async (days: number = 7, filters: DashboardFilters = {}): Promise<DailySalesTrend[]> => {
    try {
      const sanitizedParams = {
        days,
        ...(filters.stationId && { stationId: sanitizeUrlParam(filters.stationId) }),
        ...(filters.dateFrom && { dateFrom: sanitizeUrlParam(filters.dateFrom) }),
        ...(filters.dateTo && { dateTo: sanitizeUrlParam(filters.dateTo) })
      };
      const response = await apiClient.get('/dashboard/sales-trend', {
        params: sanitizedParams
      });
      return extractApiArray<DailySalesTrend>(response, 'trends');
    } catch (error) {
      secureLog.error('Error fetching daily sales trend:', error);
      return [];
    }
  },

  getStationMetrics: async (): Promise<StationMetric[]> => {
    try {
      const response = await apiClient.get('/dashboard/station-metrics');
      if (response.data?.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return extractApiArray<StationMetric>(response, 'stations');
    } catch (error) {
      secureLog.error('Error fetching station metrics:', error);
      return [];
    }
  },
};
