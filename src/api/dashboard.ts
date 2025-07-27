
import { apiClient, extractApiData, extractApiArray } from './client';
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
    const response = await apiClient.get('/dashboard/sales-summary', {
      params: { range, ...filters }
    });
    return extractApiData<SalesSummary>(response);
  },

  getPaymentMethodBreakdown: async (filters: DashboardFilters = {}): Promise<PaymentMethodBreakdown[]> => {
    const response = await apiClient.get('/dashboard/payment-methods', {
      params: filters
    });
    return extractApiArray<PaymentMethodBreakdown>(response, 'paymentMethods');
  },

  getFuelTypeBreakdown: async (filters: DashboardFilters = {}): Promise<FuelTypeBreakdown[]> => {
    const response = await apiClient.get('/dashboard/fuel-breakdown', {
      params: filters
    });
    return extractApiArray<FuelTypeBreakdown>(response, 'fuelTypes');
  },

  getTopCreditors: async (limit: number = 5): Promise<TopCreditor[]> => {
    const response = await apiClient.get('/dashboard/top-creditors', {
      params: { limit }
    });
    return extractApiArray<TopCreditor>(response, 'creditors');
  },

  getDailySalesTrend: async (days: number = 7, filters: DashboardFilters = {}): Promise<DailySalesTrend[]> => {
    const response = await apiClient.get('/dashboard/sales-trend', {
      params: { days, ...filters }
    });
    return extractApiArray<DailySalesTrend>(response, 'trends');
  },

  getStationMetrics: async (): Promise<StationMetric[]> => {
    const response = await apiClient.get('/dashboard/station-metrics');
    console.log('Station metrics API response:', response.data); // Debug log
    
    // Handle nested data structure: { success: true, data: [...] }
    if (response.data?.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    // Handle direct array response from API
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return extractApiArray<StationMetric>(response, 'stations');
  },
};
