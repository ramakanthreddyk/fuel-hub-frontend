
import { apiClient, extractApiData, extractApiArray } from './client';
import type { 
  SalesReportFilters, 
  SalesReportData, 
  SalesReportSummary, 
  ExportReportRequest,
  ScheduleReportRequest,
  SalesReportExportFilters,
  ApiResponse 
} from './api-contract';

export const reportsApi = {
  getSalesReport: async (filters: SalesReportFilters): Promise<{
    data: SalesReportData[];
    summary: SalesReportSummary;
  }> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await apiClient.get(`/reports/sales?${params.toString()}`);
    return extractApiData<{
      data: SalesReportData[];
      summary: SalesReportSummary;
    }>(response);
  },

  exportSalesCSV: async (filters: SalesReportFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await apiClient.get(`/reports/sales/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // New POST endpoint for sales report export
  exportSalesReport: async (filters: SalesReportExportFilters): Promise<Blob> => {
    const response = await apiClient.post('/reports/sales', filters, {
      responseType: 'blob',
    });
    return response.data;
  },

  exportReport: async (request: ExportReportRequest): Promise<Blob> => {
    const response = await apiClient.post('/reports/export', request, {
      responseType: 'blob',
    });
    return response.data;
  },

  scheduleReport: async (request: ScheduleReportRequest): Promise<void> => {
    await apiClient.post('/reports/schedule', request);
  },
};
