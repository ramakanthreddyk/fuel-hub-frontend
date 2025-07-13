
import { apiClient, extractApiData, extractApiArray } from './client';
import type { 
  SalesReportData, 
  SalesReportSummary, 
  SalesReportFilters,
  PaymentMethodBreakdown,
  FuelTypeBreakdown
} from './api-contract';

export const unifiedReportsApi = {
  getSalesReport: async (filters: SalesReportFilters): Promise<{
    data: SalesReportData[];
    summary: SalesReportSummary;
  }> => {
    try {
      const params = new URLSearchParams();
      if (filters.stationId) params.append('stationId', filters.stationId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
      if (filters.fuelType) params.append('fuelType', filters.fuelType);
      if (filters.attendantId) params.append('attendantId', filters.attendantId);

      const response = await apiClient.get(`/reports/sales?${params}`);
      const result = extractApiData<any>(response);

      return {
        data: result.data || [],
        summary: {
          totalRevenue: result.summary?.totalRevenue || 0,
          totalVolume: result.summary?.totalVolume || 0,
          salesCount: result.summary?.salesCount || 0,
          averageTicketSize: result.summary?.averageTicketSize || 0,
          byPaymentMethod: result.summary?.byPaymentMethod || [] as PaymentMethodBreakdown[],
          byFuelType: result.summary?.byFuelType || [] as FuelTypeBreakdown[],
          paymentMethodBreakdown: result.summary?.paymentMethodBreakdown || [] as PaymentMethodBreakdown[],
          fuelTypeBreakdown: result.summary?.fuelTypeBreakdown || [] as FuelTypeBreakdown[]
        }
      };
    } catch (error) {
      console.error('Error fetching sales report:', error);
      return {
        data: [],
        summary: {
          totalRevenue: 0,
          totalVolume: 0,
          salesCount: 0,
          averageTicketSize: 0,
          byPaymentMethod: [],
          byFuelType: [],
          paymentMethodBreakdown: [],
          fuelTypeBreakdown: []
        }
      };
    }
  }
};
