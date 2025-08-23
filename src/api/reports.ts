
import { apiClient, extractApiData, extractApiArray } from './client';
import { sanitizeUrlParam, secureLog } from '@/utils/security';
import type { 
  SalesReportFilters, 
  SalesReportData, 
  SalesReportSummary, 
  ExportRequest,
  ScheduleReportRequest,
  SalesReportExportFilters,
  ApiResponse 
} from './api-contract';

export const reportsApi = {
  getSalesReport: async (filters: SalesReportFilters): Promise<{
    data: SalesReportData[];
    summary: SalesReportSummary;
  }> => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          params.append(key, sanitizeUrlParam(value));
        }
      });
      
      const response = await apiClient.get(`/reports/sales?${params.toString()}`);
      return extractApiData<{
        data: SalesReportData[];
        summary: SalesReportSummary;
      }>(response);
    } catch (error) {
      secureLog.error('Error fetching sales report:', error);
      throw error;
    }
  },

  exportSalesCSV: async (filters: SalesReportFilters): Promise<Blob> => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          params.append(key, sanitizeUrlParam(value));
        }
      });
      
      const response = await apiClient.get(`/reports/sales/export?${params.toString()}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      secureLog.error('Error exporting sales CSV:', error);
      throw error;
    }
  },

  // New POST endpoint for sales report export
  exportSalesReport: async (filters: SalesReportExportFilters): Promise<Blob> => {
    try {
      const response = await apiClient.post('/reports/sales', filters, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      secureLog.error('Error exporting sales report:', error);
      throw error;
    }
  },

  exportReport: async (request: ExportRequest): Promise<Blob> => {
    try {
      const response = await apiClient.post('/reports/export', request, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      secureLog.error('Error exporting report:', error);
      throw error;
    }
  },

  scheduleReport: async (request: ScheduleReportRequest): Promise<void> => {
    try {
      await apiClient.post('/reports/schedule', request);
    } catch (error) {
      secureLog.error('Error scheduling report:', error);
      throw error;
    }
  },
};
