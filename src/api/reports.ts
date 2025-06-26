
import { apiClient, extractApiData, extractApiArray } from './client';
import type { SalesReportFilters, SalesReportData, SalesReportSummary, ApiResponse } from './api-contract';

export interface ExportReportRequest {
  type: string;
  format: string;
  stationId?: string;
  dateRange?: { from: Date; to: Date };
}

export interface ScheduleReportRequest {
  type: string;
  stationId?: string;
  frequency: string;
}

export interface SalesReportExportFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
  format?: 'csv' | 'json';
}

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

// Export types for backward compatibility
export type { 
  SalesReportFilters, 
  SalesReportData, 
  SalesReportSummary,
  ExportReportRequest,
  ScheduleReportRequest,
  SalesReportExportFilters
};
